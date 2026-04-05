import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Login, LogoutResponse, Register, RegisterResponse, User } from '../models/auth.model';
import { BehaviorSubject, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/auth';
  constructor(private http: HttpClient) { }
  currentUser$ = new BehaviorSubject<Omit<User, 'password'> | null>(null);

  register(registerDetails: Register) {
    return this.http.post<RegisterResponse>(this.apiUrl + '/register', registerDetails, { withCredentials: true }).pipe(
      tap((response) => {
        this.currentUser$.next(response.user);
      })
    );
  }

  login(loginDetails: Login) {
    return this.http.post<RegisterResponse>(this.apiUrl + '/login', loginDetails, { withCredentials: true }).pipe(
      tap((response) => {
        this.currentUser$.next(response.user);
      })
    );
  }

  logout() {
    return this.http.post<LogoutResponse>(this.apiUrl + '/logout', {}, { withCredentials: true }).pipe(
      tap(() => {
        this.currentUser$.next(null);
      })
    );
  }

  lockUser(userId: string) {
    return this.http.patch(`${this.apiUrl}/users/${userId}/logout`, {}).pipe(
      tap(() => {
        this.currentUser$.next(null);
      })
    )
  }

  forgotpassword(email: string, password: string) {
    return this.http.patch<RegisterResponse>(this.apiUrl + '/forgot-password', { email, password }, { withCredentials: true }).pipe(
      tap((response) => {
        this.currentUser$.next(response.user);
      })
    );
  }

  getUser(userId: string) {
    return this.http.get<RegisterResponse>(`${this.apiUrl}/user/${userId}`, { withCredentials: true });
  }

  getAllusers() {
    return this.http.get<User[]>(`${this.apiUrl}/users`, { withCredentials: true });
  }

  updateUserInfo(updatedDetails: Partial<User>) {
    return this.http.patch<RegisterResponse>(`${this.apiUrl}/user/update-info`, updatedDetails, { withCredentials: true }).pipe(
      tap((response) => {
        this.currentUser$.next(response.user);
      })
    );
  }

  isAdmin() {
    return this.currentUser$.value?.role === 'admin';
  }
}
