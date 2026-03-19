import { Routes } from '@angular/router';
import { guestGuard } from '@features/auth/guards/guest.guard';

export const routes: Routes = [
  {
    path: 'auth',
    loadComponent: () => import('@layout/auth-layout/auth-layout.component').then(m => m.AuthLayoutComponent),
    loadChildren: () => import('@features/auth/auth.routes').then(m => m.authRoutes),
    canActivate: [guestGuard]
  },
  {
    path: '',
    loadComponent: () => import('@layout/main-layout/main-layout.component').then(m => m.MainLayoutComponent),
    loadChildren: () => import('@layout/main-layout/main.routes').then(m => m.mainRoutes)
  }
];
