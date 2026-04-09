import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CategoriesByProduct, CategoryByProduct, ExtendedProductWithSubCategories, GetCategories, GetSubCategories, GetTypes } from '../../models/category';

@Injectable({
  providedIn: 'root'
})
export class CategoriesService {
  private apiUrl = 'http://localhost:3000/category';

  constructor( private http: HttpClient) { }

  getAllTypes(){
    return this.http.get<GetTypes>(`${this.apiUrl}/get-all-types`);
  }

  getAllCategories(page:number, limit: number){
    const params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());

    return this.http.get<GetCategories>(`${this.apiUrl}/get-all`, {params});
  }

  getAllSubCategories(){
    return this.http.get<GetSubCategories>(`${this.apiUrl}/get-all-subcategories`);
  }
  
  getCategoriesByProduct(productId: number){
    return this.http.get<CategoryByProduct>(`${this.apiUrl}/get-by-product/${productId}`);
  }

  filterProducts(){
    return this.http.get<CategoriesByProduct>(`${this.apiUrl}/filter`);
  }
}
