import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { TokenService } from './token.service';
import {LoginRequest, JwtResponse, User, RegisterRequest} from '../models/auth.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly API_URL = 'http://localhost:8080/api/auth';
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(
    private http: HttpClient,
    private tokenService: TokenService
  ) {
    const user = this.tokenService.getUser();
    if (user) {
      this.currentUserSubject.next(user);
    }
  }

  adminLogin(email: string, password: string): Observable<JwtResponse> {
    return this.http.post<JwtResponse>(`${this.API_URL}/login`, {
      email,
      password
    }).pipe(
      tap(response => this.handleAuthResponse(response)),
      catchError(this.handleError)
    );
  }

  clientLogin(phone: string, password: string): Observable<JwtResponse> {
    return this.http.post<JwtResponse>(`${this.API_URL}/login`, {
      phone,
      password
    }).pipe(
      tap(response => this.handleAuthResponse(response)),
      catchError(this.handleError)
    );
  }

  register(registerRequest:RegisterRequest  ): Observable<JwtResponse> {
    return this.http.post<JwtResponse>(`${this.API_URL}/register`, registerRequest).pipe(
      tap(response => this.handleAuthResponse(response)),
      catchError(this.handleError)
    );
  }

  refreshToken(): Observable<JwtResponse> {
    const refreshToken = this.tokenService.getRefreshToken();
    if (!refreshToken) {
      return throwError(() => new Error('No refresh token available'));
    }

    return this.http.post<JwtResponse>(`${this.API_URL}/refresh`, { refreshToken }).pipe(
      tap(response => {
        if (!response.error) {
          this.tokenService.setTokens(response.token, response.refreshToken);
        }
      }),
      catchError(this.handleError)
    );
  }

  logout(): void {
    this.tokenService.clear();
    this.currentUserSubject.next(null);
  }

  private handleAuthResponse(response: JwtResponse): void {
    if (!response.error) {
      this.tokenService.setTokens(response.token, response.refreshToken);

      // Décoder le token pour obtenir les informations utilisateur
      const user = this.decodeToken(response.token);
      this.tokenService.setUser(user);
      this.currentUserSubject.next(user);
    }
  }

  private decodeToken(token: string): User {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return {
        id: payload.sub,
        role: payload.role,
        email: payload.email,
        phone: payload.phone,
        name: payload.name
      };
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

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }
}
