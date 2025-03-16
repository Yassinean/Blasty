import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TokenService {
  private readonly TOKEN_KEY = 'auth_token';
  private readonly REFRESH_TOKEN_KEY = 'refresh_token';
  private readonly USER_KEY = 'user';

  constructor() {}

  setTokens(token: string, refreshToken: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
    localStorage.setItem(this.REFRESH_TOKEN_KEY, refreshToken);
  }

  getToken(): string | null {
    console.log('getToken method in token service:', localStorage.getItem(this.TOKEN_KEY));
    return localStorage.getItem(this.TOKEN_KEY);
  }

  getRefreshToken(): string | null {
    console.log('getRefreshToken method in token service:', localStorage.getItem(this.REFRESH_TOKEN_KEY));
    return localStorage.getItem(this.REFRESH_TOKEN_KEY);
  }

  setUser(user: any): void {
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
  }

  getUser(): any {
    const user = localStorage.getItem(this.USER_KEY);
    console.log('getUser method in token service:', user);
    return user ? JSON.parse(user) : null;
  }

  getUserRole(): string | null {
    // Get role directly from token instead of user object
    const token = this.getToken();
    if (token) {
      try {
        const payload = this.decodeToken(token);
        const role = payload.role;
        console.log('getUserRole method in token service (from token):', role);
        return role;
      } catch (error) {
        console.error('Error decoding token for role:', error);
        return null;
      }
    }
    return null;
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

  clear(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.REFRESH_TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
  }

  isAuthenticated(): boolean {
    const token = this.getToken();
    const isAuth = !!token;
    console.log('TokenService: isAuthenticated called, result:', isAuth);
    
    // Basic token validation - check if it's not expired
    if (token) {
      try {
        // Simple check for JWT expiration
        const payload = this.decodeToken(token);
        const expiry = payload.exp * 1000; // Convert to milliseconds
        const now = Date.now();
        
        if (expiry < now) {
          console.log('TokenService: Token is expired, clearing tokens');
          this.clear();
          return false;
        }
      } catch (e) {
        console.error('TokenService: Error parsing token', e);
        return false;
      }
    }
    
    return isAuth;
  }
}