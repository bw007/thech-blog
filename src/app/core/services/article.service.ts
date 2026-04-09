import { HttpClient } from "@angular/common/http";
import { inject, Injectable, signal } from "@angular/core";
import { Article } from "@core/models/article.model";
import { finalize, map, tap } from "rxjs";
import { AuthService } from "./auth.service";

@Injectable({
    providedIn: 'root'
})
export class ArticleService {
  private http = inject(HttpClient);
  private auth = inject(AuthService);

  private _mockArticles = signal<Article[]>([]);
  latestArticles = this._mockArticles.asReadonly();
  
  private _userArticles = signal<Article[]>([]);
  userArticles = this._userArticles.asReadonly();

  private _actionLoadingId = signal<string | null>(null);
  actionLoadingId = this._actionLoadingId.asReadonly();

  setActionLoadingId(id: string | null) {
    this._actionLoadingId.set(id);
  }

  getArticleById(id: string) {
    return this.http.get<Article[]>(`articles?id=eq.${id}`).pipe(
      map((articles) => articles[0])
    );
  };

  getUserArticles(userId: string) {
    return this.http.get<Article[]>(`articles?author_id=eq.${userId}&status=eq.published`)
      .pipe(
        tap((articles) => this._userArticles.set(articles))
      );
  };

  // Publish article
  publishArticle(id: string) {
    this._actionLoadingId.set(id);
    return this.http.patch<Article[]>(`articles?id=eq.${id}&select=*,author:profiles(username,full_name,avatar_url)`, {
      status: 'published',
      published_at: new Date().toISOString()
    }).pipe(
      map((articles) => articles[0]),
      finalize(() => this._actionLoadingId.set(null))
    )
  };

  // Unpublish article
  unpublishArticle(id: string) {
    this._actionLoadingId.set(id);
    return this.http.patch<Article[]>(`articles?id=eq.${id}&select=*,author:profiles(username,full_name,avatar_url)`, {
      status: 'draft',
      published_at: null
    }).pipe(
      map((articles) => articles[0]),
      finalize(() => this._actionLoadingId.set(null))
    )
  };

  // Delete article
  deleteArticle(id: string) {
    this._actionLoadingId.set(id);
    return this.http.delete<Article[]>(`articles?id=eq.${id}&select=*,author:profiles(username,full_name,avatar_url)`).pipe(
      map((articles) => articles[0]),
      finalize(() => this._actionLoadingId.set(null))
    )
  };
}