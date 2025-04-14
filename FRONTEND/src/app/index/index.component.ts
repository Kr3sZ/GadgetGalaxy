import { Component, ElementRef, HostListener, OnInit } from '@angular/core';
import { Product } from '../../models/product/product';
import { ProductService } from '../../services/product.service';
import { NgFor, NgIf } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {faHome, faShoppingCart, faSignInAlt, faUser, faUserPlus} from '@fortawesome/free-solid-svg-icons';
import {UserService} from '../../services/user.service';
import {UserData} from '../../models/user/user-data';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-index',
  imports: [NgFor, NgIf, FontAwesomeModule, FormsModule],
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
    this.fetchCategories();
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
  amount : number = 1;

  successMessage: string | null = null;

  addProduct(productId: number): void {
    for (let i = 0; i < this.amount; i++) {
      this.productService.addProduct(productId).subscribe({
        next: (res: { error: string, message: string }) => {
          if (!res.error) {
            this.successMessage = 'Product added to cart successfully!';
            setTimeout(() => {
              this.successMessage = null;
            }, 3000); // Hide the message after 3 seconds
          } else {
            this.productsError = 'Something went wrong!';
          }
        },
        error: () => {
          this.productsError = 'Failed to load cart data.';
        },
      });
    }
  }

  searchProduct() : void {
    this.productsIsLoading = true;
    this.productService.searchProducts({
      category: this.searchCategory,
      keyword: this.searchInput
    }).subscribe({
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

  sortProducts(): void {
    if (this.searchSort) {
      switch (this.searchSort) {
        case "0": // Price: Low to High
          this.productsList.sort((a, b) => a.price - b.price);
          break;
        case "1": // Price: High to Low
          this.productsList.sort((a, b) => b.price - a.price);
          break;
        case "2": // Name: A to Z
          this.productsList.sort((a, b) => a.name.localeCompare(b.name));
          break;
        case "3": // Name: Z to A
          this.productsList.sort((a, b) => b.name.localeCompare(a.name));
          break;
      }
    }
  }



  // CATEGORIES
  categoriesList: string[] = [];
  categoriesIsLoading = false;
  categoriesError: string | null = null;

  fetchCategories(): void {
    this.categoriesIsLoading = true;
    this.productService.getCategories().subscribe({
      next: (res) => {
        if (!res.error) {
          this.categoriesList = res.message;
        } else {
          this.categoriesError = 'Something went wrong!';
        }
        this.categoriesIsLoading = false;
      },
      error: () => {
        this.categoriesError = 'Failed to load categories.';
        this.categoriesIsLoading = false;
      },
    });
  }



  // SEARCH
  searchCategory: string = "";
  searchSort: string = "";
  searchInput: string = "";


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
