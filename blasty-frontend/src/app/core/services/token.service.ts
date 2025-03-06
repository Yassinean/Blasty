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
    const user = this.getUser();
    console.log('getUserRole method in token service:', user ? user.role : null);
    return user ? user.role : null;
  }

  clear(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.REFRESH_TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
  }

  isAuthenticated(): boolean {
    console.log('isAuthenticated method in token service:', !!this.getToken());
    return !!this.getToken();
  }
}  