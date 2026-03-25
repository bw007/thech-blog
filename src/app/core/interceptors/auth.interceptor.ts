import { HttpHandlerFn, HttpInterceptorFn, HttpRequest } from "@angular/common/http";
import { inject } from "@angular/core";
import { AuthService } from "@core/services/auth.service";
import { environment } from "@env/environment";
import { from, switchMap } from "rxjs";

export const authInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
) => {
  const auth = inject(AuthService);
  const session = auth.getSession();
  
  return from(session).pipe(
    switchMap(data => {
      const accessToken = data?.access_token;
      
      if (accessToken) {
        const reqClone = req.clone({
          setHeaders: {
            'apiKey': environment.supabase.api_key,
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
            'Prefer': 'return=representation'
          }
        });
        return next(reqClone);
      }
      return next(req);
    })
  )
}