import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, CanActivateChild, CanLoad, Route, UrlSegment } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { TokenService } from '../services/token.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate, CanActivateChild, CanLoad {
  
  constructor(
    private authService: AuthService,
    private tokenService: TokenService,
    private router: Router
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    return this.checkAuth(route);
  }

  canActivateChild(
    childRoute: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    return this.checkAuth(childRoute);
  }

  canLoad(
    route: Route,
    segments: UrlSegment[]
  ): Observable<boolean> | Promise<boolean> | boolean {
    return this.authService.isLoggedIn();
  }

  private checkAuth(route: ActivatedRouteSnapshot): Observable<boolean> | boolean {
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/auth'], {
        queryParams: { returnUrl: route.url.join('/') }
      });
      return false;
    }

    // Check for role-specific access
    const requiredRoles = route.data['roles'] as Array<string>;
    if (!requiredRoles || requiredRoles.length === 0) {
      return true; // No specific roles required
    }

    const userRole = this.tokenService.getUserRole();
    if (!userRole || !requiredRoles.includes(userRole)) {
      if (userRole === 'ADMIN') {
        this.router.navigate(['/admin/dashboard']);
      } else if (userRole === 'CLIENT') {
        this.router.navigate(['/client/dashboard//places']);
      } else {
        this.router.navigate(['/auth']);
      }
      return false;
    }

    return true;
  }
}