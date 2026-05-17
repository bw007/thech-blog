import { inject } from "@angular/core";
import { ActivatedRouteSnapshot, ResolveFn, RouterStateSnapshot } from "@angular/router";
import { EditorService } from "@core/services/editor.service";
import type { Article } from "@core/models/article.model";
import { catchError, finalize, of } from "rxjs";
import { ProgressService } from "@core/services/progress.service";

export const editorResolver: ResolveFn<Article | null> = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const progress = inject(ProgressService);
  const editor = inject(EditorService);
  
  const articleId = route.paramMap.get('id');
  if (!articleId) return null;

  progress.start();

  return editor.getDraftArticle(articleId).pipe(
    catchError(() => of(null)),
    finalize(() => progress.finish())
  );
}