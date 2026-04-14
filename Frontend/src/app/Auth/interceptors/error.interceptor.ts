import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { ToastService } from '../../shared/services/toast.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const toast = inject(ToastService)

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      
      let errorMessage = "An unexpected error ocurred";
      console.log(error.status)
      if(error.status === 401){
        console.log(error.status)
        
        localStorage.removeItem('user');

        errorMessage = 'Session expired. Please login again.';
      } else {

        errorMessage = error.error?.message || error.message || errorMessage;
      }

      toast.showToast(error.status, errorMessage);

      return throwError(() => error);
    })
  )
};
