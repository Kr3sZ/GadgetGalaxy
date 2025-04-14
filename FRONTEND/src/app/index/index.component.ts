import { Component, ElementRef, HostListener, OnInit } from '@angular/core';
import { Product } from '../models/product';
import { ProductService } from '../services/product.service';
import { NgFor, NgIf } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {faShoppingCart, faSignInAlt, faUser, faUserPlus} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-index',
  imports: [NgFor, NgIf, FontAwesomeModule],
  templateUrl: './index.component.html',
  standalone: true,
  styleUrl: './index.component.css'
})
export class IndexComponent implements OnInit {
  products: Product[] = [];
  isLoading = false;
  error: string | null = null;

  dropdownOpen = false;

  constructor(
    private productService: ProductService,
    private eRef: ElementRef
  ) {}

  ngOnInit(): void {
    this.fetchProducts();
  }

  fetchProducts(): void {
    this.isLoading = true;
    this.productService.getProducts().subscribe({
      next: (res) => {
        if (!res.error) {
          this.products = res.message;
        } else {
          this.error = 'Something went wrong!';
        }
        this.isLoading = false;
      },
      error: () => {
        this.error = 'Failed to load products.';
        this.isLoading = false;
      },
    });
  }

  toggleDropdown(): void {
    this.dropdownOpen = !this.dropdownOpen;
  }

  protected readonly faUser = faUser;
  protected readonly faShoppingCart = faShoppingCart;
  protected readonly faSignInAlt = faSignInAlt;
  protected readonly faUserPlus = faUserPlus;
}
