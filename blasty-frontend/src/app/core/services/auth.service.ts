import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { TokenService } from './token.service';
import {
  LoginRequest,
  JwtResponse,
  User,
  RegisterRequest,
} from '../models/auth.model';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly API_URL = 'http://localhost:8080/api/auth';
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();
  private readonly USER_KEY = 'user';
  private readonly TOKEN_KEY = 'auth_token';

  constructor(
    private http: HttpClient,
    private tokenService: TokenService,
    private router: Router
  ) {
    const user = this.tokenService.getUser();
    if (user) {
      this.currentUserSubject.next(user);
    }
  }

  adminLogin(email: string, password: string): Observable<JwtResponse> {
    return this.http
      .post<JwtResponse>(`${this.API_URL}/login`, {
        email,
        password,
      })
      .pipe(
        tap((response) => this.handleAuthResponse(response)),
        catchError(this.handleError)
      );
  }

  clientLogin(phone: string, password: string): Observable<JwtResponse> {
    return this.http
      .post<JwtResponse>(`${this.API_URL}/login`, {
        phone,
        password,
      })
      .pipe(
        tap((response) => this.handleAuthResponse(response)),
        catchError(this.handleError)
      );
  }

  register(registerRequest: RegisterRequest): Observable<JwtResponse> {
    return this.http
      .post<JwtResponse>(`${this.API_URL}/register`, registerRequest)
      .pipe(
        tap((response) => this.handleAuthResponse(response)),
        catchError(this.handleError)
      );
  }

  redirectUser(): void {
    const user = this.tokenService.getUser();
    if (user) {
      if (user.role === 'ADMIN') {
        this.router.navigate(['/admin/dashboard']);
      } else if (user.role === 'CLIENT') {
        this.router.navigate(['/client/dashboard']);
      }
    }
  }

  refreshToken(): Observable<JwtResponse> {
    const refreshToken = this.tokenService.getRefreshToken();
    if (!refreshToken) {
      return throwError(() => new Error('No refresh token available'));
    }

    return this.http
      .post<JwtResponse>(`${this.API_URL}/refresh`, { refreshToken })
      .pipe(
        tap((response) => {
          if (!response.error) {
            this.tokenService.setTokens(response.token, response.refreshToken);
          }
        }),
        catchError(this.handleError)
      );
  }

  private handleAuthResponse(response: JwtResponse): void {
    if (!response.error) {
      this.tokenService.setTokens(response.token, response.refreshToken);
      const user = this.decodeToken(response.token);
      this.tokenService.setUser(user);
      this.currentUserSubject.next(user);
      this.redirectUser();
    }
  }

  private decodeToken(token: string): User {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      if (payload.role === 'ADMIN') {
        return {
          id: payload.sub,
          role: payload.role,
          email: payload.sub,
        };
      } else {
        return {
          id: payload.sub,
          role: payload.role,
          phone: payload.phone,
          name: payload.name,
        };
      }
    } catch (error) {
      console.error('Error decoding token:', error);
      throw error;
    }
  }

  private handleError(error: any): Observable<never> {
    let errorMessage = 'An error occurred';
    if (error.error instanceof ErrorEvent) {
      errorMessage = error.error.message;
    } else {
      errorMessage = error.error?.message || 'Server error';
    }
    return throwError(() => new Error(errorMessage));
  }

  isTokenExpired(token: string): boolean {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.exp * 1000 < Date.now();
    } catch (error) {
      console.error('Error decoding token:', error);
      return true;
    }
  }

  isLoggedIn(): boolean {
    const token = this.getToken();
    return token ? !this.isTokenExpired(token) : false;
  }

  getUser(): any {
    const user = localStorage.getItem(this.USER_KEY);
    return user ? JSON.parse(user) : null;
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  logout(): void {
    this.tokenService.clear();
    this.currentUserSubject.next(null);
    this.router.navigate(['/auth/login']);
  }

  getToken(): string | null {
    return this.tokenService.getToken();
  }

  isAdmin(): boolean {
    const user = this.tokenService.getUser();
    return user && user.role === 'ADMIN';
  }
}
