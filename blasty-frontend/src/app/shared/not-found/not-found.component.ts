import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { User } from '../../core/models/auth.model';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './not-found.component.html',
  styleUrl: './not-found.component.css'
})
export class NotFoundComponent {
  user: User = JSON.parse(localStorage.getItem('user') || '{}');
}
