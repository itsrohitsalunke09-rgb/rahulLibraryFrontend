import { Injectable } from '@angular/core';
import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  constructor(private auth: AuthService) {}

  intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const token = this.auth.snapshot()?.token;
    if (!token) {
      return next.handle(req);
    }
    return next.handle(req.clone({
      setHeaders: { Authorization: `Bearer ${token}` }
    })).pipe(
      catchError((err: unknown) => {
        // Token expired or account no longer valid: drop the session and go back to login
        if (err instanceof HttpErrorResponse && err.status === 401 && this.auth.snapshot()) {
          this.auth.logout(true);
        }
        return throwError(() => err);
      })
    );
  }
}
