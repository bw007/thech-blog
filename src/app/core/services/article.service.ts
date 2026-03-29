import { HttpClient } from "@angular/common/http";
import { inject, Injectable, signal } from "@angular/core";
import { Article } from "@core/models/article.model";
import { map, tap } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class ArticleService {
  private http = inject(HttpClient);

  private _mockArticles = signal<Article[]>([]);

  latestArticles = this._mockArticles.asReadonly();

  private _userArticles = signal<Article[]>([]);
  userArticles = this._userArticles.asReadonly();

  getArticleById(id: string) {
    return this.http.get<Article[]>(`articles?id=eq.${id}`).pipe(
      map((articles) => articles[0])
    );
  }

  getUserArticles(userId: string) {
    return this.http.get<Article[]>(`articles?author_id=eq.${userId}&status=eq.published`)
      .pipe(
        tap((articles) => this._userArticles.set(articles))
      );
  }
}