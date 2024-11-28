import { HttpInterceptorFn } from '@angular/common/http';

/**
 * Intercepts HTTP requests by setting auth token headers.
 * @param {HttpRequest} request - HTTP request
 * @param {HttpHandlerFn} next - HTTP handler 
 */
export const AUTH_TOKEN_INTERCEPTOR: HttpInterceptorFn = (request, next) => {
  const token = localStorage.getItem('token');
  if (token) {
    request = request.clone({
      setHeaders: { Authorization: `Token ${token}` }
    });
  }
  return next(request);
}