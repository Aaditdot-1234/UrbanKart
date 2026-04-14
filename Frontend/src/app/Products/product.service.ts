import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CreateProduct, CreateProductRes, GetProducts, Product, UploadImagesRes } from '../models/product';
import { BehaviorSubject, pipe, switchMap, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl = '/api/product';
  private imagesUrl = '/api/images';

  constructor(private http: HttpClient) { }

  getAllProducts(page: number, limit: number){
    const params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString())

    return this.http.get<GetProducts>(`${this.apiUrl}/get-all`, {params});
  }

  getProductById(productId:number){
    return this.http.get<Product>(`${this.apiUrl}/get-by-id/${productId}`);
  }

  uploadImages(files: File[]){
    const formData = new FormData();
    files.forEach(file => formData.append('images', file));
    return this.http.post<UploadImagesRes>(`${this.imagesUrl}/upload`, formData, { withCredentials: true });
  }

  createProduct( productDetails: CreateProduct ){
    return this.http.post<CreateProductRes>(`${this.apiUrl}/create`, productDetails, { withCredentials: true });
  }

  updateProduct(productId: number, productDetails: Partial<CreateProduct>){
    return this.http.patch<CreateProductRes>(`${this.apiUrl}/update/${productId}`, productDetails, { withCredentials: true });
  }

  deleteProduct( productId: number ){
    return this.http.delete<Omit<CreateProductRes, 'product'>>(`${this.apiUrl}/delete/${productId}`, { withCredentials: true });
  }
}
