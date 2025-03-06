import { CanActivate, Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { TokenService } from '../services/token.service';

@Injectable({
  providedIn: 'root',
})

export class ClientGuard implements CanActivate {
  constructor(private tokenService: TokenService, private router: Router) {}

  canActivate(): boolean {
    const userRole = this.tokenService.getUserRole();
    if (userRole !== 'CLIENT') {
      this.router.navigate(['/auth']);
      return false;
    }
    return true;
  }
}
