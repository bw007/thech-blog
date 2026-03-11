import { inject } from '@angular/core';
import { CanActivateFn, RedirectCommand, Router } from '@angular/router';
import { routes } from '@core/constants/routes.constants';
import { storage } from '@core/constants/storage.constants';

export const verifyEmailGuard: CanActivateFn = () => {
  const router = inject(Router);

  if (!sessionStorage.getItem(storage.PENDING_EMAIL)) {
    return new RedirectCommand(router.parseUrl(routes.auth.SIGN_UP));
  }

  return true;
}