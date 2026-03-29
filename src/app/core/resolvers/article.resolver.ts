import { inject } from "@angular/core";
import { ActivatedRouteSnapshot, ResolveFn, RouterStateSnapshot } from "@angular/router";
import type { Article } from "@core/models/article.model";
import { ArticleService } from "@core/services/article.service";

export const articleResolver: ResolveFn<Article | null> = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const editor = inject(ArticleService);
  
  const articleId = route.paramMap.get('id');
  if (!articleId) return null;

  return editor.getArticleById(articleId);
}