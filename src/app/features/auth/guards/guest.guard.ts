import { inject } from "@angular/core";
import { CanActivateFn, RedirectCommand, Router } from "@angular/router";
import { storage } from "@core/constants/storage.constants";
import { AuthService } from "@core/services/auth.service";

export const guestGuard: CanActivateFn = () => {
  const router = inject(Router);
  const auth = inject(AuthService);

  const isRecovery = !!sessionStorage.getItem(storage.PASSWORD_RECOVERY)
    || window.location.hash.includes('access_token');

  if (auth.isLoggedIn() && !isRecovery) {
    return new RedirectCommand(router.parseUrl('/'));
  }

  return true;
}