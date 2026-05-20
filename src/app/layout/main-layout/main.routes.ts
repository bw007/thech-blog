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
    loadComponent: () => import('@features/profile/profile.component').then(m => m.ProfileComponent),
    resolve: { selectedUser: userResolver }
  },
  {
    path: 'settings',
    loadComponent: () => import('@features/settings/settings.component').then(m => m.SettingsComponent)
  },
  {
    path: 'about',
    loadComponent: () => import('@features/about/about.component').then(m => m.AboutComponent)
  },
  {
    path: 'authors',
    loadComponent: () => import('@features/authors/authors.component').then(m => m.AuthorsComponent)
  },
  {
    path: 'help',
    loadComponent: () => import('@features/help/help.component').then(m => m.HelpComponent)
  }
];