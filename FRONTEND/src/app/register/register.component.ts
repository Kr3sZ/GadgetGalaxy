import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { RegisterService } from '../services/register.service';
import { RegisterUser } from '../models/register-user';
import { HttpClientModule } from '@angular/common/http';
import {NgIf} from '@angular/common';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, ReactiveFormsModule, HttpClientModule, NgIf],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent {
  registerForm: FormGroup;
  isSubmitting = false;
  error: string | null = null;

  constructor(private fb: FormBuilder, private registerService: RegisterService) {
    this.registerForm = this.fb.group({
      username: ['', Validators.required],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: ['', Validators.required],
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required],
      birthdate: ['', Validators.required],
    });
  }

  onSubmit(): void {
    if (this.registerForm.invalid) {
      return;
    }

    this.isSubmitting = true;
    const user: RegisterUser = this.registerForm.value;

    this.registerService.registerUser(user).subscribe({
      next: (response) => {
        console.log('Registration successful:', response);
        this.isSubmitting = false;
      },
      error: (err) => {
        console.error('Registration failed:', err);
        this.error = 'Registration failed. Please try again.';
        this.isSubmitting = false;
      },
    });
  }
}
