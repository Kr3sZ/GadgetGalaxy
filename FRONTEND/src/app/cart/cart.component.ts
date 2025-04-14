import { Component } from '@angular/core';
import {UserData} from '../../models/user/user-data';
import {UserService} from '../../services/user.service';
import {Router} from '@angular/router';
import {NgFor, NgIf} from '@angular/common';
import {CartProduct} from '../../models/product/cart-product';
import {faTrashCan, faUser} from "@fortawesome/free-solid-svg-icons";
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import {ProductService} from '../../services/product.service';
import {CartResponse} from '../../models/product/cart-response';
import {Observable} from 'rxjs';

@Component({
  selector: 'app-cart',
    imports: [NgIf, NgFor, FaIconComponent],
  standalone: true,
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css'
})
export class CartComponent {

  constructor( private userService: UserService, private productService: ProductService, public router: Router) {}

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

  deleteProduct(productId: number): void {

    this.productService.deleteProduct(productId).subscribe({
      next: (res: {error:string, message:string}) => {
        if (!res.error) {
          this.fetchCart();
        } else {
          this.productError = 'Something went wrong!';
        }
      },
      error: () => {
        this.productError = 'Failed to load cart data.';
      },
    });
  }

    protected readonly faUser = faUser;
  protected readonly faTrashCan = faTrashCan;
}
