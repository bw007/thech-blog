import type { ActivatedRouteSnapshot, ResolveFn, RouterStateSnapshot } from "@angular/router";
import { inject } from "@angular/core";
import { catchError, finalize, of} from "rxjs";
import { UserService } from "../services/user.service";
import { ProgressService } from "@core/services/progress.service";

export const userResolver: ResolveFn<any> = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const user = inject(UserService);
  const progress = inject(ProgressService);

  const userName = route.paramMap.get('user_name');
  if (!userName) return null;

  progress.start();

  return user.getSelectedUser(userName.slice(1)).pipe(
    catchError(() => of(null)),
    finalize(() => progress.finish())
  )
}