import { Component } from '@angular/core';
import {UserData} from '../../models/user/user-data';
import {UserService} from '../../services/user.service';
import {Router} from '@angular/router';
import {NgFor, NgIf} from '@angular/common';
import {CartProduct} from '../../models/product/cart-product';

@Component({
  selector: 'app-cart',
  imports: [ NgIf, NgFor],
  standalone: true,
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css'
})
export class CartComponent {

  constructor( private userService: UserService,public router: Router) {}

  // USER DATA

  ngOnInit(): void {
    this.fetchUser();
    this.fetchCart();
  }

  userDataUser: UserData | null = null;
  userDataIsLoading = false;
  userDataError: string | null = null;

  fetchUser(): void {
    this.userService.getUserData().subscribe({
      next: (res) => {
        if (!res.error) {
          this.userDataUser = res.message;
        } else {
          this.userDataError = 'Something went wrong!';
        }
        this.userDataIsLoading = false;
      },
      error: () => {
        this.userDataError = 'Failed to load user data.';
        this.userDataIsLoading = false;
        this.router.navigate(['/login']);
      },
    });
  }

  products: CartProduct[] = [];
  productIsLoading = false;
  productError: string | null = null;

  // LOGOUT
  fetchCart() {
    this.userService.getCart().subscribe({
      next: (res) => {
        if (!res.error) {
          this.products = res.message;
        } else {
          this.productError = 'Something went wrong!';
        }
        this.productIsLoading = false;
      },
      error: () => {
        this.productError = 'Failed to load cart data.';
        this.productIsLoading = false;
      },
    });
  }
  getTotal(): number {
    return this.products.reduce((total, product) => total + product.price * product.amount, 0);
  }
}
