import { Routes } from '@angular/router';
import { newPasswordGuard } from './guards/new-password.guard';
import { newPasswordDeactivateGuard } from './guards/new-password-deactivate.guard';
import { verifyEmailGuard } from './guards/verify-email.guard';

export const authRoutes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'sign-in',
  },
  {
    path: 'full',
    loadComponent: () => import('@layout/auth-layout/auth-full/auth-full.component').then(m => m.AuthFullComponent),
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'sign-in' },
      {
        path: 'sign-in',
        loadComponent: () => import('@features/auth/sign-in/sign-in.component').then(m => m.SignInComponent),
        data: { key: 'signin' }
      },
      {
        path: 'sign-up',
        loadComponent: () => import('@features/auth/sign-up/sign-up.component').then(m => m.SignUpComponent),
        data: { key: 'signup' }
      },
    ]
  },
  {
    path: 'verify-email',
    loadComponent: () => import('@features/auth/verify-email/verify-email.component').then(m => m.VerifyEmailComponent),
    canActivate: [verifyEmailGuard]
  },
  {
    path: 'forgot-password',
    loadComponent: () => import('@features/auth/forgot-password/forgot-password.component').then(m => m.ForgotPasswordComponent)
  },
  {
    path: 'new-password',
    loadComponent: () => import('@features/auth/new-password/new-password.component').then(m => m.NewPasswordComponent),
    canActivate: [newPasswordGuard],
    canDeactivate: [newPasswordDeactivateGuard]
  }
];