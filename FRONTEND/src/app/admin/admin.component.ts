import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [ReactiveFormsModule, NgIf],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css'
})
export class AdminComponent {
  addProductForm: FormGroup;
  removeProductForm: FormGroup;
  isLoggedIn = false;
  successMessage: string | null = null;
  errorMessage: string | null = null;

  constructor(private fb: FormBuilder, private userService: UserService) {
    this.addProductForm = this.fb.group({
      id: ['', Validators.required],
      name: ['', Validators.required],
      category: ['', Validators.required],
      price: ['', [Validators.required, Validators.min(0)]],
      amount: ['', [Validators.required, Validators.min(1)]],
      description: ['', Validators.required],
      image: [null, Validators.required],
    });

    this.removeProductForm = this.fb.group({
      id: ['', Validators.required],
    });

    this.checkAdminLoginStatus();
  }

  checkAdminLoginStatus(): void {
    this.userService.isAdminLoggedIn().subscribe({
      next: () => {
        this.isLoggedIn = true;
      },
      error: () => {
        this.isLoggedIn = false;
      },
    });
  }

  logout(): void {
    this.userService.adminLogout().subscribe({
      next: () => {
        this.isLoggedIn = false;
        this.successMessage = 'Logged out successfully!';
        setTimeout(() => (this.successMessage = null), 3000);
      },
      error: () => {
        this.errorMessage = 'Failed to log out.';
        setTimeout(() => (this.errorMessage = null), 3000);
      },
    });
  }

  onFileSelected(event: Event): void {
    const fileInput = event.target as HTMLInputElement;
    if (fileInput.files && fileInput.files.length > 0) {
      this.addProductForm.patchValue({ image: fileInput.files[0] });
    }
  }

  addProduct(): void {
    if (this.addProductForm.invalid) {
      return;
    }

    const formData = new FormData();
    Object.entries(this.addProductForm.value).forEach(([key, value]) => {
      if (key === 'image' && value instanceof File) {
        formData.append('file', value); // Append the file with the key 'file'
      } else {
        formData.append(key, value as string);
      }
    });

    this.userService.addProduct(formData).subscribe({
      next: () => {
        this.successMessage = 'Product added successfully!';
        this.addProductForm.reset();
        setTimeout(() => (this.successMessage = null), 3000);
      },
      error: () => {
        this.errorMessage = 'Failed to add product.';
        setTimeout(() => (this.errorMessage = null), 3000);
      },
    });
  }
  removeProduct(): void {
    if (this.removeProductForm.invalid) {
      return;
    }

    const productId = this.removeProductForm.value.id;

    this.userService.removeProduct(productId).subscribe({
      next: () => {
        this.successMessage = 'Product removed successfully!';
        this.removeProductForm.reset();
        setTimeout(() => (this.successMessage = null), 3000);
      },
      error: () => {
        this.errorMessage = 'Failed to remove product.';
        setTimeout(() => (this.errorMessage = null), 3000);
      },
    });
  }

  protected readonly HTMLInputElement = HTMLInputElement;
}
