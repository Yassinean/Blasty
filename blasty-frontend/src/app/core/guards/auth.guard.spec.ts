import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { TokenService } from '../services/token.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private router: Router,
    private tokenService: TokenService
  ) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    if (this.tokenService.isAuthenticated()) {
      const userRole = this.tokenService.getUserRole();
      const requiredRole = route.data['role'];

      if (requiredRole && userRole !== requiredRole) {
        this.router.navigate([userRole === 'ADMIN' ? '/admin' : '/client']);
        return false;
      }

      return true;
    }

    this.router.navigate(['/auth'], { queryParams: { returnUrl: state.url } });
    return false;
  }
}
