import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {ProductResponse} from '../models/product-response';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private baseUrl = "http://localhost:8080/api/"

  constructor(private http: HttpClient) {}

  getProducts() {
    return this.http.get<ProductResponse>(this.baseUrl+"products");
  }
}
