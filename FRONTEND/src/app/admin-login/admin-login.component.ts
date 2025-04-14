import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';
import * as CryptoJS from 'crypto-js';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-admin-login',
  standalone: true,
  imports: [ReactiveFormsModule, NgIf],
  templateUrl: './admin-login.component.html',
  styleUrl: './admin-login.component.css'
})
export class AdminLoginComponent {
  adminLoginForm: FormGroup;
  loginIsSubmitting = false;
  successMessage: string | null = null;
  loginError: string | null = null;

  constructor(private fb: FormBuilder, private userService: UserService, private router: Router) {
    this.adminLoginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  onSubmit(): void {
    if (this.adminLoginForm.invalid) {
      return;
    }

    this.loginIsSubmitting = true;

    const formValue = this.adminLoginForm.value;

    // Hash the password field
    formValue.password = CryptoJS.SHA256(formValue.password).toString();

    this.userService.adminLogin(formValue).subscribe({
      next: () => {
        this.successMessage = 'Admin login successful!';
        this.loginIsSubmitting = false;
        setTimeout(() => {
          this.successMessage = null;
          this.router.navigate(['/admin/']); // Redirect to admin dashboard
        }, 3000); // Hide the message after 3 seconds
      },
      error: () => {
        this.loginError = 'Admin login failed. Please check your credentials.';
        this.loginIsSubmitting = false;
      },
    });
  }
}
