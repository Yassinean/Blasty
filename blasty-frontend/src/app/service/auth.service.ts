import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private API_URL = 'http://localhost:8080/api/auth';

  constructor(private http: HttpClient, private router: Router) {}

  login(email: string, password: string): Observable<any> {
    return this.http.post(`${this.API_URL}/login`, { email, password }).pipe(
      tap(response => {
        localStorage.setItem('token', response.token);
        localStorage.setItem('refreshToken', response.refreshToken);
      })
    );
  }

  register(name: string, phone: string, password: string): Observable<any> {
    return this.http.post(`${this.API_URL}/register`, { name, phone, password });
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    this.router.navigate(['/login']);
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
  }
}
