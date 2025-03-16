import { Component } from '@angular/core';
import { User } from '../../core/models/auth.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-not-found',
  standalone: true,
  templateUrl: './not-found.component.html',
  styleUrl: './not-found.component.css',
})
export class NotFoundComponent {
  user: User = JSON.parse(localStorage.getItem('user') || '{}');

  constructor(private router: Router) {}

  redirectPage() {
    if (this.user.role == 'ADMIN') {
      this.router.navigate(['/admin/dashboard'])
    }else this.router.navigate(['/client/dashboard'])
  }
}
