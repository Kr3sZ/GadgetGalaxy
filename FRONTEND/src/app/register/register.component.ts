import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { UserService } from '../../services/user.service';
import { HttpClientModule } from '@angular/common/http';
import { NgIf } from '@angular/common';
import { UserData } from '../../models/user/user-data';
import * as CryptoJS from 'crypto-js';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, ReactiveFormsModule, HttpClientModule, NgIf],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent {
  registerForm: FormGroup;
  registerIsSubmitting = false;
  registerError: string | null = null;

  constructor(private fb: FormBuilder, private userService: UserService, private router: Router) {
    this.registerForm = this.fb.group({
      username: ['', Validators.required],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phoneNum: ['', Validators.required],
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required],
      birthdate: ['', Validators.required],
    });
  }

  onSubmit(): void {
    if (this.registerForm.invalid) {
      return;
    }

    const formValue = this.registerForm.value;

    // Check if password and confirmPassword match
    if (formValue.password !== formValue.confirmPassword) {
      this.registerError = 'Passwords do not match.';
      return;
    }

    this.registerIsSubmitting = true;

    // Hash the password field
    formValue.password = CryptoJS.SHA256(formValue.password).toString();
    delete formValue.confirmPassword; // Remove confirmPassword before sending to the server

    const user: UserData = formValue;

    this.userService.registerUser(user).subscribe({
      next: (response) => {
        console.log('Registration successful:', response);
        this.registerIsSubmitting = false;
        this.router.navigate(['/login']);
      },
      error: (err) => {
        console.error('Registration failed:', err);
        this.registerError = 'Registration failed. Please try again.';
        this.registerIsSubmitting = false;
      },
    });
  }
}
