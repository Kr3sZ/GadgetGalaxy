import { Routes } from '@angular/router';

import { IndexComponent } from './index/index.component';
import { ProfileComponent } from './profile/profile.component';
import { CartComponent } from './cart/cart.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';

export const routes: Routes = [
  { path: '', component: IndexComponent },
  { path: 'profile', component: ProfileComponent },
  { path: 'cart', component: CartComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent }
];
