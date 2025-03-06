import { createAction, props } from '@ngrx/store';
import { AuthError, User } from '../../core/models/auth.model';

export const login = createAction(
  '[Auth] Login',
  props<{ email: string; password: string }>()
);

export const loginSuccess = createAction(
  '[Auth] Login Success',
  props<{ token: string; user: User }>()
);

export const loginFailure = createAction(
  '[Auth] Login Failure',
  props<{ error: any }>()
);

export const register = createAction(
  '[Auth] Register',
  props<{ name: string; phone: string; password: string }>()
);

export const registerSuccess = createAction(
  '[Auth] Register Success',
  props<{ token: string; user: User }>()
);

export const registerFailure = createAction(
  '[Auth] Register Failure',
  props<{ error: any }>()
);

// Add logout action
export const logout = createAction('[Auth] Logout');

// Add refresh token actions
export const refreshToken = createAction('[Auth] Refresh Token');

export const refreshTokenSuccess = createAction(
  '[Auth] Refresh Token Success',
  props<{ token: string; refreshToken: string }>()
);

export const refreshTokenFailure = createAction(
  '[Auth] Refresh Token Failure',
  props<{ error: any }>()
);

// Add action to initialize auth state from localStorage on app startup
export const initAuth = createAction('[Auth] Initialize Auth');

export const initAuthSuccess = createAction(
  '[Auth] Initialize Auth Success',
  props<{ token: string; user: User }>()
);