import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CreateReviews, GetReviews } from '../../models/reviews';
import { User } from '../../models/auth';

@Injectable({
  providedIn: 'root'
})
export class ReviewService {
  private apiUrl = '/api/review';

  constructor(private http: HttpClient) { }

  addreview(productId: number, comments: string, rating: number) {
    return this.http.post<CreateReviews>(`${this.apiUrl}/create/${productId}`, { comments, rating });
  }
  getAllReviews(productId: number, page: number, limit: number) {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString())

    return this.http.get<GetReviews<User>>(`${this.apiUrl}/get-all/${productId}`, { params });
  }
  deleteReview(reviewId: number) {
    return this.http.delete<Omit<CreateReviews, 'review'>>(`${this.apiUrl}/delete/${reviewId}`);
  }
}
