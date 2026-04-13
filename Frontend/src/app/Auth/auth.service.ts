import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GetAllUsers, Login, LogoutResponse, OTPResponse, Register, RegisterResponse, User } from '../models/auth';
import { BehaviorSubject, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = '/api/auth';
  constructor(private http: HttpClient) {
    const user = localStorage.getItem('user');
    if (user) {
      this.currentUser$.next(JSON.parse(user));
    }
  }
  currentUser$ = new BehaviorSubject<Omit<User, 'password'> | null>(null);

  register(registerDetails: Register) {
    return this.http.post<RegisterResponse>(this.apiUrl + '/register', registerDetails).pipe(
      tap((response) => {
        this.currentUser$.next(response.user);
      })
    );
  }

  login(loginDetails: Login) {
    return this.http.post<RegisterResponse>(this.apiUrl + '/login', loginDetails).pipe(
      tap((response) => {
        localStorage.setItem('user', JSON.stringify(response.user));
        this.currentUser$.next(response.user);
      })
    );
  }

  logout() {
    return this.http.post<LogoutResponse>(this.apiUrl + '/logout', {}).pipe(
      tap(() => {
        localStorage.removeItem('user');
        this.currentUser$.next(null);
      })
    );
  }

  lockUser(userId: string) {
    return this.http.patch<{ message: string }>(`${this.apiUrl}/users/${userId}/lock`, {});
  }

  forgotpassword(email: string, otp: string, password: string) {
    return this.http.patch<RegisterResponse>(this.apiUrl + '/forgot-password', { email, otp, password }).pipe(
      tap((response) => {
        this.currentUser$.next(response.user);
      })
    );
  }

  getUser(userId: string) {
    return this.http.get<RegisterResponse>(`${this.apiUrl}/users/${userId}`);
  }

  getAllusers(page: number, limit: number) {
    const params = new HttpParams().set('page', page.toString()).set('limit', limit.toString());

    return this.http.get<GetAllUsers>(`${this.apiUrl}/users`, { params });
  }

  getOTP(email: string) {
    return this.http.patch<OTPResponse>(`${this.apiUrl}/getOTP`, { email });
  }

  updateUserInfo(updatedDetails: Partial<User>) {
    return this.http.patch<RegisterResponse>(`${this.apiUrl}/users/update-info`, updatedDetails, { withCredentials: true }).pipe(
      tap((response) => {
        this.currentUser$.next(response.user);
      })
    );
  }

  isAdmin() {
    return this.currentUser$.value?.role === 'admin';
  }

  isLoggedIn() {
    return !!this.currentUser$.value;
  }

  getMe() {
    return this.http.get<RegisterResponse>(`${this.apiUrl}/users/me`).pipe(
      tap((response) => {
        this.currentUser$.next(response.user);
      })
    );
  }
}
