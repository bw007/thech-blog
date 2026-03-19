import { Routes } from "@angular/router";

export const profileRoutes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'overview'
  },
  {
    path: 'overview',
    loadComponent: () => import('./profile-overview/profile-overview.component').then(m => m.ProfileOverviewComponent)
  },
  {
    path: 'settings',
    loadComponent: () => import('./profile-settings/profile-settings.component').then(m => m.ProfileSettingsComponent)
  }
];