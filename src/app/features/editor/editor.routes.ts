import { Routes } from "@angular/router";
import { editorResolver } from "@core/resolvers/editor.resolver";

export const editorRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./editor.component').then(m => m.EditorComponent)
  },
  {
    path: ':id/edit',
    loadComponent: () => import('./editor.component').then(m => m.EditorComponent),
    resolve: { article: editorResolver }
  }
];