import { inject } from "@angular/core";
import { CanActivateFn, RedirectCommand, Router } from "@angular/router";
import { toObservable } from "@angular/core/rxjs-interop";
import { filter, map, take } from "rxjs";
import { AuthService } from "@core/services/auth.service";
import { AlertService } from "@core/services/alert.service";

export const authGuard: CanActivateFn = () => {
  const router = inject(Router);
  const auth = inject(AuthService);
  const alert = inject(AlertService);

  return toObservable(auth.isLoading).pipe(
    filter(isLoading => !isLoading),
    take(1),
    map(() => {
      if (!auth.isLoggedIn()) {
        alert.showNotification('Tizimga kirish talab qilinadi', 'negative');
        return new RedirectCommand(router.parseUrl('/'));
      }
      return true;
    })
  );
}