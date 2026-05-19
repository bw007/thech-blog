import { Routes } from '@angular/router';
import { articleResolver } from '@core/resolvers/article.resolver';
import { userResolver } from "@core/resolvers/user.resolver";

export const mainRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('@features/home/home.component').then(m => m.HomeComponent)
  },
  {
    path: 'articles',
    loadChildren: () => import('@features/articles/articles.routes').then(m => m.articlesRoutes)
  },
  {
    path: 'article/:id',
    loadComponent: () => import('@features/articles/article-detail/article-detail.component').then(m => m.ArticleComponent),
    resolve: { article: articleResolver }
  },
  {
    path: 'profile/:user_name',
    loadComponent: () => import('@features/profile-overview/profile-overview.component').then(m => m.ProfileOverviewComponent),
    resolve: { selectedUser: userResolver }
  },
  {
    path: 'profile-settings',
    loadComponent: () => import('@features/profile-settings/profile-settings.component').then(m => m.ProfileSettingsComponent)
  }
];