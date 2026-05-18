import { Routes } from "@angular/router";
import { userResolver } from "@core/resolvers/user.resolver";

export const profileRoutes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'overview'
  },
  {
    path: ':user_name',
    loadComponent: () => import('./profile-overview/profile-overview.component').then(m => m.ProfileOverviewComponent),
    resolve: { selectedUser: userResolver }
  },
  {
    path: 'settings',
    loadComponent: () => import('./profile-settings/profile-settings.component').then(m => m.ProfileSettingsComponent)
  }
];