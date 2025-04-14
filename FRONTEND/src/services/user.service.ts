import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {RegisterUser} from '../models/user/register-user';
import {Observable} from 'rxjs';
import {LoginUser} from '../models/user/login-user';
import {ProductResponse} from '../models/product/product-response';
import {UserData} from '../models/user/user-data';
import {UserDataResponse} from '../models/user/user-data-response';

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
  registerUser(user: RegisterUser): Observable<any> {
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
}
