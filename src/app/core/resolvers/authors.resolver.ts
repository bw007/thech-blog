import type { ActivatedRouteSnapshot, ResolveFn, RouterStateSnapshot } from "@angular/router";
import { inject } from "@angular/core";
import { catchError, finalize, of} from "rxjs";
import { UserService } from "../services/user.service";
import { ProgressService } from "@core/services/progress.service";

export const authorsResolver: ResolveFn<any> = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const user = inject(UserService);
  const progress = inject(ProgressService);

  progress.start();

  return user.getAuthors().pipe(
    catchError(() => of(null)),
    finalize(() => progress.finish())
  )
}