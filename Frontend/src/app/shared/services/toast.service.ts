import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface ToastMessage{
  errorStatus: number;
  errorMessage: string;
}

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  private toast$ = new BehaviorSubject<ToastMessage| null>(null);
  toastState$ = this.toast$.asObservable();

  constructor() { }

  showToast(status: number, message: string){
    this.toast$.next({errorStatus: status, errorMessage: message});
    setTimeout(() => {
      this.toast$.next(null);
    },5000);
  }

  clearToast(){
    this.toast$.next(null);
  }
}
