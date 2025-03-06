import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

export const AuthInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const token = authService.getToken();
  console.log('Token in interceptor:', token);

  const authReq = token
    ? req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })
    : req;

  console.log('Request headers:', authReq.headers);

  return next(authReq).pipe(
    catchError((error) => {
      if (error.status === 403) {
        console.error('Access Forbidden:', error);
        authService.logout();
        router.navigate(['/login']);
      }
      return throwError(() => error);
    })
  );
};
