import { Service, computed, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { API_URL } from '../app.config';
import { LoginRequest, LoginResponse, RegisterRequest } from '../interfaces/auth';
import { User } from '../interfaces/user';

const TOKEN_KEY = 'lab2_token';

@Service()
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);
  private readonly url = `${API_URL}/auth`;

  readonly token = signal<string | null>(localStorage.getItem(TOKEN_KEY));

  private readonly payload = computed(() => {
    const token = this.token();
    if (!token) {
      return null;
    }
    try {
      const base64 = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
      return JSON.parse(atob(base64));
    } catch {
      return null;
    }
  });

  readonly isLoggedIn = computed(() => {
    const payload = this.payload();
    return !!payload && payload.exp * 1000 > Date.now();
  });

  readonly roles = computed<string[]>(() => this.payload()?.realm_access?.roles ?? []);

  readonly isAdmin = computed(() => this.roles().includes('SUPER-ADMIN-ROLE'));

  readonly username = computed<string>(() => this.payload()?.preferred_username ?? '');

  login(credentials: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.url}/login`, credentials);
  }

  register(data: RegisterRequest): Observable<User> {
    return this.http.post<User>(`${this.url}/register`, data);
  }

  saveToken(token: string) {
    localStorage.setItem(TOKEN_KEY, token);
    this.token.set(token);
  }

  clearSession() {
    localStorage.removeItem(TOKEN_KEY);
    this.token.set(null);
  }

  logout() {
    this.clearSession();
    this.router.navigate(['/login']);
  }
}
