import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { Toast } from '../../../core/models/toast';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: 'register.component.html',
})
export class RegisterComponent {
  registerForm: FormGroup;
  toasts: Toast[] = [];
  toastIdCounter = 0;

  loading: any;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      name: ['', Validators.required],
      phone: [
        '',
        [Validators.required, Validators.pattern('^(0[5-6-7])[0-9]{8}$')],
      ],
      password: ['', Validators.required],
    });
  }

  onSubmit() {
    if (this.registerForm.valid) {
      this.authService.register(this.registerForm.value).subscribe({
        next: () => {
          this.showToast(
            'success',
            'Vous avez été enregistré avec succès'
          );
          this.router.navigate(['/client/dashboard']);
        },
        error: (error) => {
          this.showToast(
            'error', error.error?.message || 'Register failed'
          );
        },
      });
    }
  }
  // Toast notification methods
  showToast(
    type: 'success' | 'error' | 'info',
    message: string,
    duration: number = 5000
  ): void {
    const id = ++this.toastIdCounter;
    const toast: Toast = { id, type, message };

    // Add toast to the array
    this.toasts.push(toast);

    // Set timeout to remove the toast after duration
    toast.timeout = setTimeout(() => {
      this.removeToast(id);
    }, duration);
  }

  removeToast(id: number): void {
    const index = this.toasts.findIndex((t) => t.id === id);
    if (index !== -1) {
      // Clear the timeout to prevent memory leaks
      clearTimeout(this.toasts[index].timeout);
      // Remove the toast from the array
      this.toasts.splice(index, 1);
    }
  }
}
