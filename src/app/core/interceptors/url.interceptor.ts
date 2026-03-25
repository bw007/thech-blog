import { HttpHandlerFn, HttpInterceptorFn, HttpRequest } from "@angular/common/http";
import { environment } from "@env/environment";

export const urlInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
) => {
  if (!req.url.startsWith('http')) {
    const url = `${environment.supabase.api_url.replace(/\/$/, '')}/rest/v1/${req.url.replace(/^\//, '')}`
    const reqClone = req.clone({ url });

    return next(reqClone);
  }
  return next(req);
}