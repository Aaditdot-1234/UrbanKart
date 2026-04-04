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

  register(registerDetails: Register){
    return this.http.post<RegisterResponse>(this.apiUrl + '/register', registerDetails, {withCredentials:true}).pipe(
      tap((response) => {
        this.currentUser$.next(response.user);
      })
    );
  }
  
  login(loginDetails: Login){
    return this.http.post<RegisterResponse>(this.apiUrl + '/login', loginDetails, {withCredentials: true}).pipe(
      tap((response) => {
        this.currentUser$.next(response.user);
      })
    );
  }

  logout(){
    return this.http.post<LogoutResponse>(this.apiUrl + '/logout', {}, {withCredentials:true}).pipe(
      tap(() => {
        this.currentUser$.next(null);
      })
    );    
  }

  lockUser(userId: string){
    return this.http.patch(`${this.apiUrl}/users/${userId}/logout`, {}).pipe(
      tap(() => {
        this.currentUser$.next(null);
      })
    )
  }

  
}
