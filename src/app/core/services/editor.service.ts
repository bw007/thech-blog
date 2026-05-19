import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import type { Article } from '../models/article.model';
import { AuthService } from './auth.service';
import { firstValueFrom, map, tap } from 'rxjs';
import { Supabase } from '@core/config/supabase';

@Injectable({
  providedIn: 'root'
})
export class EditorService {
  private http = inject(HttpClient);
  private auth = inject(AuthService);
  private supabase = inject(Supabase);

  user = this.auth.authUser();

  private _myArticles = signal<Article[]>([]);
  myArticles = this._myArticles.asReadonly();

  // Get my articles
  getMyArticles() {
    if (!this.user) throw new Error('User not found');

    return this.http.get<Article[]>(
      `articles?author_id=eq.${this.user.id}&select=*,author:profiles(username,full_name,avatar_url)`
    ).pipe(
        tap((articles) => this._myArticles.set(articles))
      );
  }

  // Get article draft
  getDraftArticle(id: string) {
    return this.http.get<Article[]>(`articles?id=eq.${id}`)
      .pipe(
        map((articles) => articles[0])
      );
  }

  // Create article draft
  async createDraft(title: string, content: any): Promise<Article> {
    return await firstValueFrom(
      this.http.post<Article[]>('articles', {
        title,
        content,
        author_id: this.user?.id,
        status: 'draft'
      }).pipe(
        map((articles) => articles[0])
      )
    );
  };

  // Update article draft
  async updateArticle(id: string, title: string, content: any) {
    return await firstValueFrom(
      this.http.patch<Article[]>(`articles?id=eq.${id}`, {
        title,
        content,
        reading_time: this.calculateReadingTime(content)
      }).pipe(
        map((articles) => articles[0])
      )
    );
  };

  // Upload article image
  async uploadImage(file: File): Promise<string> {
    const user = this.auth.authUser();
    if (!user) throw new Error('User not found');

    const ext = file.name.split('.').pop();
    const fileName = `content/${user.id}/${Date.now()}.${ext}`;

    const { data, error } = await this.supabase.client.storage
      .from('articles')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false
      });

      if (error) throw error;
      const { data: urlData } = this.supabase.client.storage
        .from('articles')
        .getPublicUrl(data.path);

      return urlData.publicUrl;
  };

  // Get text from JSON content
  private getTextFromJson(content: Record<string, any>): string {
    let text = '';
    function extract(node: any) {
      if (node.type === 'text') text += node.text + ' ';
      if (node.content) node.content.forEach(extract);
    }
    extract(content);
    return text;
  }

  // Calculate reading time
  private calculateReadingTime(content: Record<string, any>): number {
    const text = this.getTextFromJson(content);
    const words = text.trim().split(/\s+/).length;
    return Math.max(1, Math.ceil(words / 250));
  }
}
