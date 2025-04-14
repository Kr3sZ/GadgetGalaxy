import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink, RouterLinkActive} from '@angular/router';
import { UserService } from '../../services/user.service';
import { HttpClientModule } from '@angular/common/http';
import { NgIf } from '@angular/common';
import { UserData } from '../../models/user/user-data';
import * as CryptoJS from 'crypto-js';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, ReactiveFormsModule, HttpClientModule, NgIf],
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

    if (formValue.password !== formValue.confirmPassword) {
      this.registerError = 'Passwords do not match.';
      return;
    }

    this.registerIsSubmitting = true;

    formValue.password = CryptoJS.SHA256(formValue.password).toString();
    delete formValue.confirmPassword;

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
