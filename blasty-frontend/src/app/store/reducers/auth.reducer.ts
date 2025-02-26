import { createReducer, on } from '@ngrx/store';
import * as AuthActions from '../actions/auth.action';
import {AuthError} from "../../core/models/auth.model";

export interface AuthState {
  user: any;
  token: string | null;
  error: AuthError | null;
  loading: boolean;
}

export const initialState: AuthState = {
  user: null,
  token: null,
  error: null,
  loading: false,
};

export const authReducer = createReducer(
  initialState,
  on(AuthActions.login, (state) => ({ ...state, loading: true })),
  on(AuthActions.loginSuccess, (state, { token, user }) => ({
    ...state,
    user,
    token,
    error: null,
    loading: false,
  })),
  on(AuthActions.loginFailure, (state, { error }) => ({
    ...state,
    error:{message:error.message , status:error.status},
    loading: false,
  })),
  on(AuthActions.register, (state) => ({ ...state, loading: true })),
  on(AuthActions.registerSuccess, (state, { token, user }) => ({
    ...state,
    user,
    token,
    error: null,
    loading: false,
  })),
  on(AuthActions.registerFailure, (state, { error }) => ({
    ...state,
    error:{message:error.message ,status:error.status},
    loading: false,
  }))
);
