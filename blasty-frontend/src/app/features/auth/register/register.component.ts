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
import { ToastService } from '../../../core/services/toast.service';

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
    private toastService: ToastService,
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
          this.toastService.showToast(
            'success',
            'Vous avez été enregistré avec succès'
          );
          this.router.navigate(['/client/dashboard']);
        },
        error: (error) => {
          this.toastService.showToast(
            'error', error.error?.message || 'Register failed'
          );
        },
      });
    }
  }
}
