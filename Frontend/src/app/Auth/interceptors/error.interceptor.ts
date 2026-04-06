import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { ToastService } from '../../shared/services/toast.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const toast = inject(ToastService)

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      
      let errorMessage = "Something went wrong";
      const errorStatuses = [200, 201, 400, 401, 403, 404, 500];

      if(errorStatuses.includes(error.status)){
        errorMessage = `${error.statusText}: ${error.error?.error || 'Unknown Error'}`;
      }

      toast.showToast(error.status, errorMessage);

      return throwError(() => error);
    })

  )
};
