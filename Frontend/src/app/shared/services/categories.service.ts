import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CategoriesByProduct, CategoryByProduct, ExtendedProductWithSubCategories, FilterProducts, GetCategories, GetSubCategories, GetTypes } from '../../models/category';

@Injectable({
  providedIn: 'root'
})
export class CategoriesService {
  private apiUrl = 'http://localhost:3000/category';

  constructor(private http: HttpClient) { }

  getAllTypes() {
    return this.http.get<GetTypes>(`${this.apiUrl}/get-all-types`);
  }

  getAllCategories(page: number, limit: number) {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());

    return this.http.get<GetCategories>(`${this.apiUrl}/get-all`, { params });
  }

  getAllSubCategories(page: number, limit: number) {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());
    return this.http.get<GetSubCategories>(`${this.apiUrl}/get-all-subcategories`, { params });
  }

  getCategoriesByProduct(productId: number) {
    return this.http.get<CategoryByProduct>(`${this.apiUrl}/get-by-product/${productId}`);
  }

  filterProducts(
    page: number,
    limit: number,
    name?: string,
    minPrice?: number,
    maxPrice?: number,
    typeIds?: number[],
    categoryIds?: number[],
    subCategoryIds?: number[]
  ) {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());

    if (name) params = params.set('name', name);
    if (minPrice) params = params.set('minPrice', minPrice.toString());
    if (maxPrice) params = params.set('maxPrice', maxPrice.toString());
    if (typeIds?.length) params = params.set('typeId', typeIds.join(','));
    if (categoryIds?.length) params = params.set('categoryId', categoryIds.join(','));
    if (subCategoryIds?.length) params = params.set('subCategoryId', subCategoryIds.join(','));

    return this.http.get<FilterProducts>(`${this.apiUrl}/filter`, { params });
  }
}
