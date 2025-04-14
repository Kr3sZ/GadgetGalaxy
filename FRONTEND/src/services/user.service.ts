import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {Observable} from 'rxjs';
import {LoginUser} from '../models/user/login-user';
import {UserData} from '../models/user/user-data';
import {UserDataResponse} from '../models/user/user-data-response';
import {CartResponse} from '../models/product/cart-response';
import {EditUser} from '../models/user/edit-user';
import {EditPassword} from '../models/user/edit-password';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private baseUrl = 'http://localhost:8080/api/';

  constructor(private http: HttpClient) { }
  loginUser(user: LoginUser): Observable<any> {
    return this.http.post<any>(
      this.baseUrl + "login",
      user,
      {
        withCredentials: true
      }
    );
  }
  registerUser(user: UserData): Observable<any> {
    return this.http.post<any>(this.baseUrl+"register", user);
  }

  getUserData(): Observable<UserDataResponse> {
    return this.http.get<UserDataResponse>(this.baseUrl+"auth/userData",
      {
        withCredentials: true
      });
  }
  logoutUser() {
    return this.http.get<any>(this.baseUrl+"auth/logout",
      {
        withCredentials: true
      });
  }

  getCart() {
    return this.http.get<CartResponse>(this.baseUrl+"auth/getCart",
      {
        withCredentials: true
      });
  }

  updateUser(user: EditUser): Observable<any> {
    return this.http.post<any>(this.baseUrl+"auth/editProfile", user,
      {
        withCredentials: true
      });
  }
  updatePassword(user: EditPassword): Observable<any> {
    return this.http.post<any>(this.baseUrl+"auth/newPass", user,
      {
        withCredentials: true
      });
  }
  adminLogin(admin: { username: string; password: string }): Observable<any> {
    return this.http.post<any>(
      this.baseUrl + "admin/login",
      admin,
      {
        withCredentials: true
      }
    );
  }
  addProduct(product: FormData): Observable<any> {
    return this.http.post<any>(
      this.baseUrl + "admin/auth/addProduct",
      product,
      {
        withCredentials: true
      }
    );
  }

  removeProduct(productId: number): Observable<any> {
    return this.http.delete<any>(
      `${this.baseUrl}admin/auth/removeProduct`,
      {
        body: { productId: productId },
        withCredentials: true
      }
    );
  }

  isAdminLoggedIn(): Observable<any> {
    return this.http.get<any>(
      this.baseUrl + "admin/auth/isLoggedIn",
      {
        withCredentials: true
      }
    );
  }

  adminLogout(): Observable<any> {
    return this.http.get<any>(
      this.baseUrl + "admin/auth/logout",
      {
        withCredentials: true
      }
    );
  }
}
