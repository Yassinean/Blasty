import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {Router, RouterLink} from '@angular/router';
import {AuthService} from "../../../core/services/auth.service";

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: 'register.component.html'
})
export class RegisterComponent {
  registerForm: FormGroup

  loading: any;

  constructor(private fb: FormBuilder , private authService:AuthService , private router:Router) {
    this.registerForm = this.fb.group({
      name: ['', Validators.required],
      phone: ['', [Validators.required, Validators.pattern('^(0[5-6-7])[0-9]{8}$')]],
      password: ['', Validators.required],
    });
  }

  onSubmit() {
      if (this.registerForm.valid) {
        this.authService.register(this.registerForm.value).subscribe({
          next: () => this.router.navigate(['/login']),
          error: () => alert('Échec de l’inscription'),
        });
      }
  }
}
