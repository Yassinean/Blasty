import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { TokenService } from '../services/token.service';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

export const AuthInterceptor: HttpInterceptorFn = (req, next) => {
  const tokenService = inject(TokenService);
  const router = inject(Router);

  // Skip adding token for auth endpoints to avoid circular dependencies
  if (req.url.includes('/auth/login') || req.url.includes('/auth/register')) {
    return next(req);
  }

  const token = tokenService.getToken();
  console.log('AuthInterceptor: Processing request to', req.url);
  console.log('AuthInterceptor: Token exists:', !!token);

  // Only add Authorization header if token exists
  const authReq = token
    ? req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })
    : req;

  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      console.error(`AuthInterceptor: Error ${error.status} for ${req.url}`, error);
      
      // Handle authentication errors (401 Unauthorized or 403 Forbidden)
      if (error.status === 401 || error.status === 403) {
        console.log('AuthInterceptor: Authentication error, redirecting to login');
        
        // Only clear tokens if it's truly an auth error, not just a permission issue
        if (error.error?.message?.includes('expired') || 
            error.error?.message?.includes('invalid') ||
            error.error?.message?.includes('token')) {
          console.log('AuthInterceptor: Token issue detected, clearing tokens');
          tokenService.clear();
        }
        
        router.navigate(['/auth']);
      }
      
      return throwError(() => error);
    })
  );
};