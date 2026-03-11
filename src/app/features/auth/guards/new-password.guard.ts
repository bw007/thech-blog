import { inject } from "@angular/core";
import { CanActivateFn, RedirectCommand, Router } from "@angular/router";
import { routes } from "@core/constants/routes.constants";
import { storage } from "@core/constants/storage.constants";

export const newPasswordGuard: CanActivateFn = () => {
  const router = inject(Router);

  const hasRecovery = !!sessionStorage.getItem(storage.PASSWORD_RECOVERY);
  const hasToken = window.location.hash.includes('access_token');

  if (!hasRecovery && !hasToken) {
    return new RedirectCommand(router.parseUrl(routes.auth.FORGOT_PASSWORD));
  }

  return true;
}