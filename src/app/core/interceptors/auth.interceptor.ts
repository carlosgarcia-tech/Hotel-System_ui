import { inject } from '@angular/core';
import { HttpInterceptorFn, HttpRequest, HttpHandlerFn } from '@angular/common/http';
import { AuthService } from '../../features/auth/services/auth.service';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { Router } from '@angular/router';

export const authInterceptor: HttpInterceptorFn = (req: HttpRequest<any>, next: HttpHandlerFn) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const authToken = authService.getAuthToken();

  let authReq = req;
  if (authToken) {
    authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${authToken}`,
        'Content-Type': 'application/json'
      }
    });
  } else if (!req.headers.has("Content-Type")) {
    authReq = req.clone({
      setHeaders: {
        'Content-Type': 'application/json'
      }
    });
  }

  return next(authReq).pipe(
    catchError(error => {
      if (error.status === 401) {
        authService.logout();
        router.navigate(['/auth/login'], {
          queryParams: { returnUrl: router.url, expired: 'true' }
        });
      }
      return throwError(() => error);
    })
  );
};