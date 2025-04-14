import { Component } from '@angular/core';
import {UserData} from '../../models/user/user-data';
import {UserService} from '../../services/user.service';
import {Router} from '@angular/router';
import {NgIf} from '@angular/common';

@Component({
  selector: 'app-cart',
  imports: [NgIf],
  standalone: true,
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css'
})
export class CartComponent {

  constructor( private userService: UserService, private router: Router) {}

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
}
