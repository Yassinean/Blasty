import {CanActivate, CanActivateFn, Router} from '@angular/router';
import {AuthService} from "../services/auth.service";
import {Injectable} from "@angular/core";

@Injectable({
  providedIn: 'root',
})
export class NonAuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): boolean {
    if (this.authService.isLoggedIn()) {
      const user = this.authService.getUser();
      if(user?.role === 'ADMIN') {
        this.router.navigate(['/admin/dashboard']);
      } else if(user?.role === 'CLIENT') {
        this.router.navigate(['/client/dashboard']);
      }
      return false;
    }
    return true;
  }
}
