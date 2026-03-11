import { Routes } from '@angular/router';
import { MainLayoutComponent } from './layout/main-layout/main-layout.component';
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
    component: MainLayoutComponent
  }
];
