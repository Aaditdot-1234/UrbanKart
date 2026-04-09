import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FilterOrders, GetOrder } from '../../models/order';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  private apiUrl = "http://localhost:3000";
  constructor(private http: HttpClient) { }

  createOrder(addressId: number, paymentMethod: string, paymentStatus: string){
    return this.http.post<GetOrder>(`${this.apiUrl}/create`, {addressId, paymentMethod, paymentStatus});
  }
  getAllOrders(){
    return this.http.get<GetOrder>(`${this.apiUrl}/get-all`);
  }
  getOrderById(orderId: number){
    return this.http.get<GetOrder>(`${this.apiUrl}/create/${orderId}`);
  }
  updateOrder(addressId: number, paymentMethod: string, paymentStatus: string){
    return this.http.post<GetOrder>(`${this.apiUrl}/update-status`, {addressId, paymentMethod, paymentStatus});
  }
  filterOrderByDate(startDate:Date, endDate: Date, page: number, limit: number){
    const params = new HttpParams()
      .set('startDate', startDate.toString())
      .set('endDate', endDate.toString())
      .set('page', page.toString())
      .set('limit', limit.toString())

    return this.http.get<FilterOrders>(`${this.apiUrl}/create`, {params});
  }
  filterOrderByStatus(status:string, page: number, limit: number){
    const params = new HttpParams()
      .set('status', status.toString())
      .set('page', page.toString())
      .set('limit', limit.toString())

    return this.http.get<FilterOrders>(`${this.apiUrl}/create`, {params});
  }
  filterOrderByCategory(category:string, page: number, limit: number){
    const params = new HttpParams()
      .set('category', category.toString())
      .set('page', page.toString())
      .set('limit', limit.toString())

    return this.http.get<FilterOrders>(`${this.apiUrl}/create`, {params});
  }
}