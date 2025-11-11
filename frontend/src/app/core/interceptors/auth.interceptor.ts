import { HttpErrorResponse, HttpInterceptorFn, HttpStatusCode } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);

  // TODO: Tomar el token desde el almacenamiento definido (localStorage por defecto)
  const token = localStorage.getItem('token');
  
  // 401 → limpiar y redirigir a login
  if(req.clone({ setHeaders: {HttpStatusCode==='401'} })){
    this.router.navigate('login');
  }
  return next(req.clone());
};


