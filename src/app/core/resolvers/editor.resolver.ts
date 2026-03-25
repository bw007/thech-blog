import { inject } from "@angular/core";
import { ActivatedRouteSnapshot, ResolveFn, RouterStateSnapshot } from "@angular/router";
import { ArticleService } from "@core/services/article.service";
import type { Article } from "@core/models/article.model";

export const editorResolver: ResolveFn<Article | null> = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const article = inject(ArticleService);
  
  const articleId = route.paramMap.get('id');
  if (!articleId) return null;

  return article.getDraftArticle(articleId);
}