import { Toast } from './../../../core/models/toast';
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html',
})
export class LoginComponent implements OnInit {
  loginForm = this.fb.group({
    identifier: ['', [Validators.required]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  error: string = '';
  loading: boolean = false;
  role: 'admin' | 'client' = 'client';
  toasts: Toast[] = [];
  toastIdCounter:number = 0

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private toastService: ToastService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe((params) => {
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
      identifierControl?.setValidators([
        Validators.required,
        Validators.pattern(/^(\+\d{1,3}[- ]?)?\d{10}$/),
      ]);
    }
    identifierControl?.updateValueAndValidity();
  }

  onSubmit() {
    if (this.loginForm.invalid) return;

    this.loading = true;
    this.error = '';

    const { identifier, password } = this.loginForm.value;
    const loginMethod =
      this.role === 'admin'
        ? this.authService.adminLogin(identifier!, password!)
        : this.authService.clientLogin(
            identifier!.replace(/\s/g, ''),
            password!
          );

    loginMethod.subscribe({
      next: (response) => {
        this.loading = false;
        if (!response.error) {
          this.toastService.showToast('success','Vous avez été connecté avec succès');
          this.authService.redirectUser();
        } else {
          this.error = response.message;
          this.toastService.showToast('error', response.message);
        }
      },
      error: (error) => {
        this.loading = false;
        this.error = error.message || `Une erreur s'est produite lors de la connexion`;
        this.toastService.showToast('error', 'numero ou password incorrect');
      },
    });
  }
}
