import { Routes } from '@angular/router';
import { authGuard } from '@core/guards/auth.guard';

export const articlesRoutes: Routes = [
  // {
  //   path: '',
  //   loadComponent: () => import('./article-list/article-list.component').then(m => m.ArticleListComponent)
  // },
  {
    path: 'my-articles',
    loadComponent: () => import('./article-control/article-control.component').then((m) => m.ArticleControlComponent),
    canActivate: [authGuard]
  },
];
