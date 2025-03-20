import { ToastService } from './toast.service';
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

  constructor(
    private http: HttpClient,
    private tokenService: TokenService,
    private toastService: ToastService,
    private router: Router
  ) {
    this.initCurrentUser();
  }

  private initCurrentUser(): void {
    const token = this.tokenService.getToken();
    const user = this.tokenService.getUser();
    
    if (token && user) {
      // Merge user data with role from token
      const userWithRole = this.enhanceUserWithRoleFromToken(user, token);
      // Update the BehaviorSubject, but don't save role to localStorage
      this.currentUserSubject.next(userWithRole);
    }
  }

  private enhanceUserWithRoleFromToken(user: any, token: string): User {
    try {
      const decodedToken = this.decodeToken(token);
      // Create a new object with user data and role from token
      return {
        ...user,
        role: decodedToken.role
      };
    } catch (error) {
      console.error('Error enhancing user with role:', error);
      return user;
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
        catchError((error) => {
          this.toastService.showToast('error', error.error?.message || 'Invalid credentials');
          return throwError(error);
        })
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
        catchError((error) => {
          this.toastService.showToast('error', error.error?.message || 'Invalid credentials');
          return throwError(error);
        })
      );
  }


  register(registerRequest: RegisterRequest): Observable<JwtResponse> {
    return this.http
      .post<JwtResponse>(`${this.API_URL}/register`, registerRequest)
      .pipe(
        tap((response) => {
          this.handleAuthResponse(response);
        }),
        catchError((error) => {
          this.toastService.showToast('error', error.error?.message || 'Registration failed');
          return throwError(error);
        })
      );
  }

  redirectUser(): void {
    const token = this.tokenService.getToken();
    if (!token) {
      console.log('No token found, redirecting to login');
      this.router.navigate(['/auth/auth']);
      return;
    }
  
    try {
      const decodedToken = this.decodeToken(token);
      const role = decodedToken.role;
      console.log('Redirecting user with role:', role);
      
      if (role === 'ADMIN') {
        this.router.navigate(['/admin/dashboard']);
      } else if (role === 'CLIENT') {
        this.router.navigate(['/client/dashboard']);
      } else {
        console.error('Unknown role:', role);
        this.router.navigate(['/']);
      }
    } catch (error) {
      console.error('Error during redirect:', error);
      this.router.navigate(['/auth/auth']);
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
            // Update current user with new token info
            this.initCurrentUser();
          }
        }),
        catchError(this.handleError)
      );
  }

  private handleAuthResponse(response: JwtResponse): void {
    if (!response.error) {
      this.tokenService.setTokens(response.token, response.refreshToken);
      const decodedToken = this.decodeToken(response.token);
      
      // Create a user object without the role
      const user: Partial<User> = {
        id: decodedToken.userId
      };
      
      // Add additional fields as needed but not the role
      if (decodedToken.role === 'ADMIN') {
        user.email = decodedToken.sub;
      } else {
        user.phone = decodedToken.sub;
        // If name is available in the token
        if (decodedToken.name) {
          user.name = decodedToken.name;
        }
      }
      
      // Save user without role to local storage
      this.tokenService.setUser(user as User);
      
      // For in-memory operations, we can use the full user object with role
      const userWithRole = {
        ...user,
        role: decodedToken.role
      };
      
      // Update the BehaviorSubject with the full user (including role)
      this.currentUserSubject.next(userWithRole as User);
      
      // Redirect after successful authentication
      this.redirectUser();
    }
  }

  decodeToken(token: string): any {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload;
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

  getUser(): User | null {
    const user = this.tokenService.getUser();
    const token = this.tokenService.getToken();
    
    if (user && token) {
      // Only for in-memory operations, enhance user with role from token
      return this.enhanceUserWithRoleFromToken(user, token);
    }
    
    return user;
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  logout(): void {
    this.tokenService.clear();
    this.currentUserSubject.next(null);
    this.router.navigate(['/auth']);
  }

  getToken(): string | null {
    return this.tokenService.getToken();
  }

  isAdmin(): boolean {
    const token = this.tokenService.getToken();
    if (token) {
      try {
        const payload = this.decodeToken(token);
        return payload.role === 'ADMIN';
      } catch (error) {
        console.error('Error checking admin role:', error);
      }
    }
    return false;
  }
  
  isClient(): boolean {
    const token = this.tokenService.getToken();
    if (token) {
      try {
        const payload = this.decodeToken(token);
        return payload.role === 'CLIENT';
      } catch (error) {
        console.error('Error checking client role:', error);
      }
    }
    return false;
  }

  // Get user role directly from token
  getUserRole(): string | null {
    const token = this.tokenService.getToken();
    if (token) {
      try {
        const payload = this.decodeToken(token);
        return payload.role;
      } catch (error) {
        console.error('Error getting user role:', error);
      }
    }
    return null;
  }
}