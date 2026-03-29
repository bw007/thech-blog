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

  private _myArticles = signal<Article[]>([]);
  myArticles = this._myArticles.asReadonly();

  // Get my articles
  getMyArticles() {
    return this.http.get<Article[]>(`articles?author_id=eq.${this.auth.currentUser()?.id}`)
      .pipe(
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
    const user = this.auth.currentUser();
    if (!user) throw new Error('User not found');
    
    return await firstValueFrom(
      this.http.post<Article[]>('articles', {
        title,
        content,
        author_id: user.id,
        status: 'draft'
      }).pipe(
        map((articles) => articles[0])
      )
    );
  };

  // Update article draft
  async updateArticle(id: string, title: string, content: any) {
    const user = this.auth.currentUser();
    if (!user) throw new Error('User not found');
    
    return await firstValueFrom(
      this.http.patch<Article[]>(`articles?id=eq.${id}`, {
        title,
        content
      }).pipe(
        map((articles) => articles[0])
      )
    );
  };

  // Upload article image
  async uploadImage(file: File): Promise<string> {
    const user = this.auth.currentUser();
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

}
