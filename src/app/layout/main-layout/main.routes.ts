import { Routes } from '@angular/router';
import { authGuard } from '@core/guards/auth.guard';

export const mainRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('@features/home/home.component').then(m => m.HomeComponent)
  },
  {
    path: 'article/:id',
    loadComponent: () => import('@features/article/article.component').then(m => m.ArticleComponent)
  },
  {
    path: 'profile',
    loadChildren: () => import('@features/profile/profile.routes').then(m => m.profileRoutes),
    canActivate: [authGuard]
  }
];