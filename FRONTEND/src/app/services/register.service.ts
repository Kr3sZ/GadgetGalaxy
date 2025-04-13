import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RegisterUser } from '../models/register-user';

@Injectable({
  providedIn: 'root',
})
export class RegisterService {
  private apiUrl = 'http://localhost:8080/api/register';

  constructor(private http: HttpClient) {}

  registerUser(user: RegisterUser): Observable<any> {
    return this.http.post<any>(this.apiUrl, user);
  }
}
