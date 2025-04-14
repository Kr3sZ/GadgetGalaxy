import { Component, ElementRef, HostListener, OnInit } from '@angular/core';
import { Product } from '../../models/product/product';
import { ProductService } from '../../services/product.service';
import { NgFor, NgIf } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {faHome, faShoppingCart, faSignInAlt, faUser, faUserPlus} from '@fortawesome/free-solid-svg-icons';
import {UserService} from '../../services/user.service';
import {UserData} from '../../models/user/user-data';

@Component({
  selector: 'app-index',
  imports: [NgFor, NgIf, FontAwesomeModule],
  templateUrl: './index.component.html',
  standalone: true,
  styleUrl: './index.component.css'
})
export class IndexComponent implements OnInit {

  constructor(
    private productService: ProductService,
    private userService: UserService,
    private eRef: ElementRef
  ) {}

  ngOnInit(): void {
    this.fetchUser();
    this.fetchProducts();
  }



  // PRODUCTS
  productsList: Product[] = [];
  productsIsLoading = false;
  productsError: string | null = null;

  fetchProducts(): void {
    this.productsIsLoading = true;
    this.productService.getProducts().subscribe({
      next: (res) => {
        if (!res.error) {
          this.productsList = res.message;
        } else {
          this.productsError = 'Something went wrong!';
        }
        this.productsIsLoading = false;
      },
      error: () => {
        this.productsError = 'Failed to load products.';
        this.productsIsLoading = false;
      },
    });
  }


  // USER DATA
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
      },
    });
  }

  logoutUser() {
    this.userService.logoutUser().subscribe({

      next: (res) => {
        if (!res.error) {
          this.userDataUser = null;
        } else {
          this.userDataError = 'Something went wrong!';
        }
      },
      error: () => {
        this.userDataError = 'Failed to logout.';
      },
    });
  }



  // ACCOUNT POPUP
  accountDropdown = false;

  toggleDropdown(): void {
    this.accountDropdown = !this.accountDropdown;
  }

  protected readonly faShoppingCart = faShoppingCart;
  protected readonly faUser = faUser;
  protected readonly faSignInAlt = faSignInAlt;
  protected readonly faUserPlus = faUserPlus;
  protected readonly faHome = faHome;
}
