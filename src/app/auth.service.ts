import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, tap } from 'rxjs';
import { AuthUser, Role } from './models';
import { environment } from '../environments/environment';
import { UserAccount } from './models';

const KEY = 'pathshala.auth';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private current$ = new BehaviorSubject<AuthUser | null>(this.read());

  constructor(private http: HttpClient, private router: Router) {}

  user() {
    return this.current$.asObservable();
  }

  snapshot(): AuthUser | null {
    return this.current$.value;
  }

  role(): Role | null {
    return this.current$.value?.role ?? null;
  }

  login(username: string, password: string) {
    return this.http.post<AuthUser>(`${environment.apiUrl}/auth/login`, { username, password }).pipe(
      tap(user => {
        localStorage.setItem(KEY, JSON.stringify(user));
        this.current$.next(user);
      })
    );
  }

  logout() {
    localStorage.removeItem(KEY);
    this.current$.next(null);
    this.router.navigate(['/login']);
  }

  register(data: { fullName: string; dateOfBirth: string; address: string; phone: string; email: string; username: string; password: string }) {
    return this.http.post<AuthUser>(`${environment.apiUrl}/auth/register`, data).pipe(
      tap(user => {
        localStorage.setItem(KEY, JSON.stringify(user));
        this.current$.next(user);
      })
    );
  }

  private read(): AuthUser | null {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) as AuthUser : null;
  }
}
