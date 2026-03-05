import { Routes } from '@angular/router';
import { MainLayoutComponent } from './layout/main-layout/main-layout.component';

export const routes: Routes = [
  {
    path: 'auth',
    loadComponent: () => import('@features/auth/auth.component').then(m => m.AuthComponent)
  },
  {
    path: '',
    component: MainLayoutComponent
  }
];
