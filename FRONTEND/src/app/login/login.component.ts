import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { LoginUser } from '../../models/user/login-user';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import * as CryptoJS from 'crypto-js';
import {UserData} from '../../models/user/user-data';
import {NgIf} from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, ReactiveFormsModule, NgIf],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  loginForm: FormGroup;
  loginIsSubmitting = false;
  loginError: string | null = null;

  constructor(private fb: FormBuilder, private userService: UserService, private router: Router) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      return;
    }

    this.loginIsSubmitting = true;

    const formValue = this.loginForm.value;

    // Hash the password field
    formValue.password = CryptoJS.SHA256(formValue.password).toString();

    const user: LoginUser = formValue;

    this.userService.loginUser(user).subscribe({
      next: (response) => {
        console.log('Login successful:', response);
        this.loginIsSubmitting = false;
        this.router.navigate(['/']); // Redirect to home or another page
      },
      error: (err) => {
        console.error('Login failed:', err);
        this.loginError = 'Login failed. Please check your credentials.';
        this.loginIsSubmitting = false;
      },
    });
  }

  // USER DATA

  ngOnInit(): void {
    this.fetchUser();
  }

  userDataUser: UserData | null = null;
  userDataIsLoading = false;
  userDataError: string | null = null;

  fetchUser(): void {
    this.userService.getUserData().subscribe({
      next: (res) => {
        if (!res.error) {
          this.userDataUser = res.message;
          this.router.navigate(['/']);
        } else {
          this.userDataError = 'Something went wrong!';
        }
        this.userDataIsLoading = false;
      },
      error: () => {
        this.userDataError = 'Failed to load user data.';
        this.userDataIsLoading = false;
      },
    });
  }
}
