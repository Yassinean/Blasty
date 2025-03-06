import { createFeatureSelector, createSelector } from '@ngrx/store';
import { AuthState } from '../reducers/auth.reducer';

// Create feature selector for auth state
export const selectAuthState = createFeatureSelector<AuthState>('auth');

// Selectors for different parts of the auth state
export const selectUser = createSelector(
  selectAuthState,
  (state: AuthState) => state.user
);

export const selectToken = createSelector(
  selectAuthState,
  (state: AuthState) => state.token
);

export const selectAuthError = createSelector(
  selectAuthState,
  (state: AuthState) => state.error
);

export const selectAuthLoading = createSelector(
  selectAuthState,
  (state: AuthState) => state.loading
);

export const selectIsAuthenticated = createSelector(
  selectAuthState,
  (state: AuthState) => state.isAuthenticated
);

// Additional useful selectors
export const selectUserRole = createSelector(
  selectUser,
  (user) => user?.role
);

export const selectIsAdmin = createSelector(
  selectUserRole,
  (role) => role === 'ADMIN'
);

export const selectIsClient = createSelector(
  selectUserRole,
  (role) => role === 'CLIENT'
);

export const selectUserName = createSelector(
  selectUser,
  (user) => user?.name
);