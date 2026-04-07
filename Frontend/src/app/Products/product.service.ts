import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CreateProduct, CreateProductRes, GetProducts, Product } from '../models/product';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl = 'http://localhost:3000/product';
  
  constructor(private http: HttpClient) { }

  getAllProducts(){
    return this.http.get<GetProducts>(`${this.apiUrl}/get-all`);
  }

  getProductById(productId:number){
    return this.http.get<Product>(`${this.apiUrl}/get-by-id/${productId}`);
  }

  createProduct( productDetails: CreateProduct ){
    return this.http.post<CreateProductRes>(`${this.apiUrl}/create`, productDetails);
  }

  updateProduct(productId: number, productDetails: Partial<CreateProduct>){
    return this.http.patch<CreateProductRes>(`${this.apiUrl}/update/${productId}`, productDetails);
  }

  deleteProduct( productId: number ){
    return this.http.delete<Omit<CreateProductRes, 'product'>>(`${this.apiUrl}/delete/${productId}`);
  }
}
