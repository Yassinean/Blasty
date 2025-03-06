import { createReducer, on } from '@ngrx/store';
import * as AuthActions from './auth.action';
import { AuthError, User } from "../../core/models/auth.model";

export interface AuthState {
  user: User | null;
  token: string | null;
  error: AuthError | null;
  loading: boolean;
  isAuthenticated: boolean;
}

export const initialState: AuthState = {
  user: null,
  token: null,
  error: null,
  loading: false,
  isAuthenticated: false
};

export const authReducer = createReducer(
  initialState,
  
  // Login actions
  on(AuthActions.login, (state) => ({ 
    ...state, 
    loading: true,
    error: null 
  })),
  
  on(AuthActions.loginSuccess, (state, { token, user }) => ({
    ...state,
    user,
    token,
    error: null,
    loading: false,
    isAuthenticated: true,
  })),
  
  on(AuthActions.loginFailure, (state, { error }) => ({
    ...state,
    error: {
      message: error.message || 'Authentication failed',
      status: error.status || 401
    },
    loading: false,
    isAuthenticated: false,
  })),
  
  // Register actions
  on(AuthActions.register, (state) => ({ 
    ...state, 
    loading: true,
    error: null 
  })),
  
  on(AuthActions.registerSuccess, (state, { token, user }) => ({
    ...state,
    user,
    token,
    error: null,
    loading: false,
    isAuthenticated: true,
  })),
  
  on(AuthActions.registerFailure, (state, { error }) => ({
    ...state,
    error: {
      message: error.message || 'Registration failed',
      status: error.status || 400
    },
    loading: false,
    isAuthenticated: false,
  })),
  
  // Logout action
  on(AuthActions.logout, () => ({
    ...initialState
  })),
  
  // Token refresh actions
  on(AuthActions.refreshToken, (state) => ({
    ...state,
    loading: true
  })),
  
  on(AuthActions.refreshTokenSuccess, (state, { token }) => ({
    ...state,
    token,
    loading: false,
    error: null
  })),
  
  on(AuthActions.refreshTokenFailure, (state, { error }) => ({
    ...state,
    error: {
      message: error.message || 'Token refresh failed',
      status: error.status || 401
    },
    loading: false,
    isAuthenticated: false,
    user: null,
    token: null
  })),
  
  // Initialize auth from localStorage
  on(AuthActions.initAuthSuccess, (state, { token, user }) => ({
    ...state,
    token,
    user,
    isAuthenticated: true,
    loading: false,
    error: null
  }))
);