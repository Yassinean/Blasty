import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html'
})
export class LoginComponent implements OnInit {
  loginForm = this.fb.group({
    identifier: ['', [Validators.required]], // Validation mise à jour dynamiquement
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  error: string = '';
  loading: boolean = false;
  role: 'admin' | 'client' = 'client';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const roleParam = params.get('role');
      if (roleParam === 'admin' || roleParam === 'client') {
        this.role = roleParam;
        this.updateValidation();
      }
    });
  }

  updateValidation() {
    const identifierControl = this.loginForm.get('identifier');
    if (this.role === 'admin') {
      identifierControl?.setValidators([Validators.required, Validators.email]);
    } else {
      identifierControl?.setValidators([Validators.required, Validators.pattern(/^(\+\d{1,3}[- ]?)?\d{10}$/)]);
    }
    identifierControl?.updateValueAndValidity();
  }

  onSubmit() {
    if (this.loginForm.invalid) return;
  
    this.loading = true;
    this.error = '';
  
    const { identifier, password } = this.loginForm.value;
    const loginMethod = this.role === 'admin'
      ? this.authService.adminLogin(identifier!, password!)
      : this.authService.clientLogin(identifier!.replace(/\s/g, ''), password!);
  
    loginMethod.subscribe({
      next: (response) => {
        this.loading = false;
        if (!response.error) {
          this.authService.redirectUser();
        } else {
          this.error = response.message;
        }
      },
      error: (error) => {
        this.loading = false;
        this.error = error.message || 'An error occurred during login';
      }
    });
  }
}
