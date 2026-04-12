import { HttpErrorResponse, HttpHandlerFn, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req:HttpRequest<any>, next: HttpHandlerFn) => {
  const router = inject(Router);

  const authReq = req.clone({
    withCredentials:true
  });

  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {

      if(error.status === 401){
        router.navigate(['/auth/login']);
      }

      return throwError(() => error);
    })
  );
};
