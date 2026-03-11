import { inject } from "@angular/core";
import { CanDeactivateFn } from "@angular/router";
import { NewPasswordComponent } from "../new-password/new-password.component";
import { AuthService } from "@core/services/auth.service";
import { storage } from "@core/constants/storage.constants";

export const newPasswordDeactivateGuard: CanDeactivateFn<NewPasswordComponent> = () => {
  const auth = inject(AuthService);
  const isRecovery = !!sessionStorage.getItem(storage.PASSWORD_RECOVERY);

  if (isRecovery) {
    auth.signOut();
  }

  return true;
}