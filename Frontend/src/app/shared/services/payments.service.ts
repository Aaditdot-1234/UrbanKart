import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GetByOrder, GetPayments } from '../../models/payments';

@Injectable({
  providedIn: 'root'
})
export class PaymentsService {
  private apiUrl = "/api/payment"
  constructor(private http: HttpClient) { }

  getAllPayments(page: number, limit: number, status?: string, method?: string) {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());
    if (status) {
      params = params.set('status', status)
    }
    if (method) {
      params = params.set('method', method)
    }

    return this.http.get<GetPayments>(`${this.apiUrl}/get-all`, { params });
  }

  getPaymentById(paymentId: number) {
    return this.http.get<GetByOrder>(`${this.apiUrl}/get-by-id/${paymentId}`);
  }
  getPaymentByOrderId(orderId: number) {
    return this.http.get<GetByOrder>(`${this.apiUrl}/get-by-order/${orderId}`);
  }

  getMyPayments(page: number, limit: number) {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());

    return this.http.get<GetPayments>(`${this.apiUrl}/get-my-payments`, { params });
  }
}
