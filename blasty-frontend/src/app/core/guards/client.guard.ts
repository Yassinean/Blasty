import { CanActivate, Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { TokenService } from '../services/token.service';

@Injectable({
  providedIn: 'root',
})
export class ClientGuard implements CanActivate {
  constructor(private tokenService: TokenService, private router: Router) {}

  canActivate(): boolean {
    console.log('ClientGuard: Checking if user can activate route');
    
    // First check if the user is authenticated at all
    if (!this.tokenService.isAuthenticated()) {
      console.log('ClientGuard: User is not authenticated, redirecting to auth');
      this.router.navigate(['/auth']);
      return false;
    }
    
    // Then check if the user has the correct role
    const userRole = this.tokenService.getUserRole();
    console.log('ClientGuard: User role is', userRole);
    
    if (userRole !== 'CLIENT') {
      console.log('ClientGuard: User is not a CLIENT, redirecting to auth');
      this.router.navigate(['/auth']);
      return false;
    }
    
    console.log('ClientGuard: User is authorized as CLIENT');
    return true;
  }
}