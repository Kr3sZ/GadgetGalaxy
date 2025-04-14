import {Component, ElementRef, OnInit} from '@angular/core';
import {UserData} from '../../models/user/user-data';
import {UserService} from '../../services/user.service';
import {Router} from '@angular/router';
import {NgIf} from '@angular/common';
import {faSignOutAlt, faUser} from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';

@Component({
  selector: 'app-profile',
  imports: [NgIf, FontAwesomeModule],
  templateUrl: './profile.component.html',
  standalone: true,
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit{

  constructor(
    private userService: UserService,
    private router: Router,
    private eRef: ElementRef
  ) {}

  ngOnInit(): void {
    this.fetchUser();
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
        this.router.navigate(['/login']);
      },
    });
  }



  // LOGOUT
  logoutUser() {
    this.userService.logoutUser().subscribe({

      next: (res) => {
        if (!res.error) {
          this.userDataUser = null;
          this.router.navigate(['/']);
        } else {
          this.userDataError = 'Something went wrong!';
        }
      },
      error: () => {
        this.userDataError = 'Failed to logout.';
      },
    });
  }


  protected readonly faSignOutAlt = faSignOutAlt;
  protected readonly faUser = faUser;
}
