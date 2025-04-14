import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {RegisterUser} from '../models/register-user';
import {Observable} from 'rxjs';
import {LoginUser} from '../models/login-user';

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
        withCredentials: true // 🔥 This is the key line
      }
    );
  }
  registerUser(user: RegisterUser): Observable<any> {
    return this.http.post<any>(this.baseUrl+"register", user);
  }
}
