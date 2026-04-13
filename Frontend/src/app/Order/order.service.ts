import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FilterOrders, GetAllOrders, GetOrder } from '../models/order';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  private apiUrl = "/api/order";
  constructor(private http: HttpClient) { }

  createOrder(addressId: number) {
    return this.http.post<GetOrder>(`${this.apiUrl}/create`, { addressId });
  }
  
  createDirectOrder(addressId: number, productId: number, quantity: number) {
    const payload = {
      addressId,
      productId,
      quantity
    };

    return this.http.post<GetOrder>(`${this.apiUrl}/buyNow`, payload);
  }

  getAllOrders(page: number, limit: number) {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString())

    return this.http.get<GetAllOrders>(`${this.apiUrl}/get-all`, { params });
  }
  getOrderById(orderId: number) {
    return this.http.get<GetOrder>(`${this.apiUrl}/get-by-id/${orderId}`);
  }
  updateOrder(orderId: number, payment_method: string) {
    return this.http.patch<GetOrder>(`${this.apiUrl}/update-status`, { orderId, payment_method });
  }
  filterOrderByDate(startDate: Date, endDate: Date, page: number, limit: number) {
    const params = new HttpParams()
      .set('startDate', startDate.toString())
      .set('endDate', endDate.toString())
      .set('page', page.toString())
      .set('limit', limit.toString())

    return this.http.get<FilterOrders>(`${this.apiUrl}/filter-by-date`, { params });
  }
  filterOrderByStatus(status: string, page: number, limit: number) {
    const params = new HttpParams()
      .set('status', status.toString())
      .set('page', page.toString())
      .set('limit', limit.toString())

    return this.http.get<FilterOrders>(`${this.apiUrl}/filter-by-status`, { params });
  }
}