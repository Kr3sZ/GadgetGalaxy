import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import {Router, RouterLink, RouterLinkActive, RouterOutlet} from '@angular/router';
import { UserService } from '../../services/user.service';
import { HttpClientModule } from '@angular/common/http';
import {NgIf} from '@angular/common';
import {UserData} from '../../models/user/user-data';

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

    this.registerIsSubmitting = true;
    const user: UserData = this.registerForm.value;

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
