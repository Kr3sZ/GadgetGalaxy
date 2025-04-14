import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { LoginUser } from '../../models/user/login-user';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, ReactiveFormsModule],
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
    const user: LoginUser = this.loginForm.value;

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
}
