import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): boolean {
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/auth/login']);
      return false;
    }
  
    const user = this.authService.getUser();
    if (user.role === 'admin' && this.router.url.startsWith('/client')) {
      this.router.navigate(['/admin/dashboard']);
      return false;
    } else if (user.role === 'client' && this.router.url.startsWith('/admin')) {
      this.router.navigate(['/client/dashboard']);
      return false;
    }
  
    return true;
  }
}
