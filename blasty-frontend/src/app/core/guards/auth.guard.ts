import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): boolean {
    const isLogged = this.authService.isLoggedIn();
    console.log("État connexion :", isLogged);
    if (isLogged) return true;

    this.router.navigate(['/auth/login']);
    return false;
  }
}
