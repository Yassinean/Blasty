import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, mergeMap, tap } from 'rxjs/operators';
import * as AuthActions from '../actions/auth.action';
import { AuthService } from '../../core/services/auth.service';
import { TokenService } from '../../core/services/token.service';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { AuthState } from '../reducers/auth.reducer';

@Injectable()
export class AuthEffects {
  // Login effect with token persistence
  login$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.login),
      mergeMap((action) =>
        this.authService.adminLogin(action.email, action.password).pipe(
          map((response) => {
            // Save token to local storage via token service
            this.tokenService.setTokens(response.token, response.refreshToken);
            
            return AuthActions.loginSuccess({
              token: response.token,
              user: response.user
            });
          }),
          catchError((error) => of(AuthActions.loginFailure({ error })))
        )
      )
    )
  );

  // Register effect with token persistence
  register$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.register),
      mergeMap((action) =>
        this.authService.register({
          name: action.name,
          phone: action.phone,
          password: action.password
        }).pipe(
          map((response) => {
            // Save token to local storage via token service
            this.tokenService.setTokens(response.token, response.refreshToken);
            
            return AuthActions.registerSuccess({
              token: response.token,
              user: response.user
            });
          }),
          catchError((error) => of(AuthActions.registerFailure({ error })))
        )
      )
    )
  );

  // Redirect after successful login
  loginRedirect$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.loginSuccess),
        tap(() => {
          this.authService.redirectUser();
        })
      ),
    { dispatch: false }
  );

  // Redirect after successful registration
  registerRedirect$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.registerSuccess),
        tap(() => {
          this.authService.redirectUser();
        })
      ),
    { dispatch: false }
  );

  // Add logout action and effect
  logout$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.logout),
        tap(() => {
          this.authService.logout();
          this.router.navigate(['/auth/login']);
        })
      ),
    { dispatch: false }
  );

  constructor(
    private actions$: Actions,
    private authService: AuthService,
    private tokenService: TokenService,
    private router: Router,
    private store: Store<AuthState>
  ) {}
}