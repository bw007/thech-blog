import { inject } from "@angular/core";
import { ActivatedRouteSnapshot, ResolveFn, RouterStateSnapshot } from "@angular/router";
import { EditorService } from "@core/services/editor.service";
import type { Article } from "@core/models/article.model";

export const editorResolver: ResolveFn<Article | null> = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const editor = inject(EditorService);
  
  const articleId = route.paramMap.get('id');
  if (!articleId) return null;

  return editor.getDraftArticle(articleId);
}