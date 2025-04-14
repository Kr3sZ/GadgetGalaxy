import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {ProductResponse} from '../models/product/product-response';
import {CategoryResponse} from '../models/product/category-response';
import {Search} from '../models/product/search';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private baseUrl = "http://localhost:8080/api/"

  constructor(private http: HttpClient) {}

  getProducts() {
    return this.http.get<ProductResponse>(this.baseUrl+"products");
  }

  getCategories() {
    return this.http.get<CategoryResponse>(this.baseUrl+"categories");
  }

  searchProducts(search: Search) {
    return this.http.post<ProductResponse>(this.baseUrl+"searchProducts", search);
  }

  deleteProduct(id: number) : Observable<{error:string, message:string}> {
    return this.http.post<{error:string, message:string}>(this.baseUrl+"auth/removeFromCart", { productId: id},
      {
        withCredentials: true
      });
  }
}
