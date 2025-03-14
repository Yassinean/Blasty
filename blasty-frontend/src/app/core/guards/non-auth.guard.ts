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
      if(this.authService.getUser().role === 'ADMIN') {
        this.router.navigate(['/admin/dashboard']);
      } else if(this.authService.getUser().role === 'CLIENT') {
        this.router.navigate(['/client/dashboard/places']);
      }
      return false;
    }
    return true;
  }
}
