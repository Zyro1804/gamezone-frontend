import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from '@openng/optimus-ui/api';
import { environment } from '../../../environments/environment';
import { catchError, throwError } from 'rxjs';
import { Auth } from '../services/auth';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(Auth);
  const router = inject(Router);
  const messageService = inject(MessageService);

  const token = localStorage.getItem('access_token');

  const esApiPropia = req.url.startsWith(
    `${environment.apiUrl}/`
  );

  const request = token && esApiPropia
    ? req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      })
    : req;

  return next(request).pipe(
    catchError((error: HttpErrorResponse) => {
      const esErrorDeSesion =
        esApiPropia &&
        error.status === 401 &&
        !!token;

      if (esErrorDeSesion) {
        authService.cerrarSesion();

        router.navigate(['/gamezone']);

        messageService.add({
          severity: 'warn',
          summary: 'Sesión finalizada',
          detail: 'Tu sesión expiró. Inicia sesión nuevamente.',
          life: 5000
        });
      }

      return throwError(() => error);
    })
  );
};