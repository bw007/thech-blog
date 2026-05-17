import { inject } from "@angular/core";
import { catchError, finalize, of } from "rxjs";
import type { ActivatedRouteSnapshot, ResolveFn, RouterStateSnapshot } from "@angular/router";
import type { Article } from "@core/models/article.model";
import { ArticleService } from "@core/services/article.service";
import { ProgressService } from "@core/services/progress.service";

export const articleResolver: ResolveFn<Article | null> = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const progress = inject(ProgressService);
  const article = inject(ArticleService);
  
  const articleId = route.paramMap.get('id');
  if (!articleId) return null;

  progress.start();

  return article.getArticleById(articleId).pipe(
    catchError(() => of(null)),
    finalize(() => progress.finish())
  );
}