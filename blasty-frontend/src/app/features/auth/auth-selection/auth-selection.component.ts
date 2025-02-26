import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-auth-selection',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl:'./auth-selection.component.html'
})
export class AuthSelectionComponent {}
