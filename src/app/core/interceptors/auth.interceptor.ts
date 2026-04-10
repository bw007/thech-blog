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
      const headers: Record<string, string> = {
        'apiKey': environment.supabase.api_key,
        'Content-Type': 'application/json',
        'Prefer': 'return=representation'
      }

      if (accessToken) {
        headers['Authorization'] = `Bearer ${accessToken}`;
      }

      const reqClone = req.clone({ setHeaders: headers });
      return next(reqClone);
    })
  )
}