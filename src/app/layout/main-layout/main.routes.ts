import { Routes } from '@angular/router';
import { authGuard } from '@core/guards/auth.guard';

export const mainRoutes: Routes = [
  {
    path: 'profile',
    loadChildren: () => import('@features/profile/profile.routes').then(m => m.profileRoutes),
    canActivate: [authGuard]
  }
];