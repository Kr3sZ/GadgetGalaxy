import { Component, OnInit } from '@angular/core';
import {Product} from '../models/product';
import {ProductService} from '../services/product.service';
import {NgFor, NgIf} from '@angular/common';

@Component({
  selector: 'app-index',
  imports: [NgFor, NgIf],
  templateUrl: './index.component.html',
  standalone: true,
  styleUrl: './index.component.css'
})
export class IndexComponent implements OnInit{
  products: Product[] = [];
  isLoading = false;
  error: string | null = null;

  constructor(private productService: ProductService) {}

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
      error: (err) => {
        this.error = 'Failed to load products.';
        this.isLoading = false;
      },
    });
  }
}
