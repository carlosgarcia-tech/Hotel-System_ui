import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';
import { isPlatformBrowser } from '@angular/common';
import { environment } from '../../../../environments/environment';
import { UserRole, User } from '../../../domain/models/user.model';

export interface LoginResponse {
  success: boolean;
  message: string;
  data: {
    token: string;
    refreshToken: string;
    user: User;
  };
}

export interface ProfileResponse {
  success: boolean;
  message: string;
  data: User;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);
  private platformId = inject(PLATFORM_ID);
  private readonly API_BASE_URL = environment.apiUrl;
  private readonly TOKEN_KEY = environment.tokenKey;
  private readonly USER_KEY = environment.userKey;
  private readonly REFRESH_TOKEN_KEY = environment.refreshTokenKey;

  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();
  private isInitialized = false;

  constructor() {
    this.initializeAuthState();
  }

  private isBrowser(): boolean {
    return isPlatformBrowser(this.platformId);
  }

  private getUserFromStorage(): User | null {
    if (!this.isBrowser()) return null;
    try {
      const userStr = localStorage.getItem(this.USER_KEY);
      return userStr ? JSON.parse(userStr) : null;
    } catch (error) {
      return null;
    }
  }

  private getTokenFromStorage(): string | null {
    if (!this.isBrowser()) return null;
    return localStorage.getItem(this.TOKEN_KEY);
  }

  private setStorageItem(key: string, value: string): void {
    if (!this.isBrowser()) return;
    localStorage.setItem(key, value);
  }

  private removeStorageItem(key: string): void {
    if (!this.isBrowser()) return;
    localStorage.removeItem(key);
  }

  private cleanupInvalidSession(): void {
    this.removeStorageItem(this.TOKEN_KEY);
    this.removeStorageItem(this.USER_KEY);
    this.removeStorageItem(this.REFRESH_TOKEN_KEY);
    this.currentUserSubject.next(null);
  }

  private initializeAuthState(): void {
    if (this.isInitialized) return;

    const token = this.getTokenFromStorage();
    const user = this.getUserFromStorage();


    if (token && user) {
      this.currentUserSubject.next(user);
    } else {
      this.cleanupInvalidSession();
    }

    this.isInitialized = true;
  }

  getAuthToken(): string | null {
    return this.getTokenFromStorage();
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  isAuthenticated(): boolean {
    return !!this.currentUserSubject.value && !!this.getTokenFromStorage();
  }

  login(email: string, password: string): Observable<any> {
    return this.http
      .post<LoginResponse>(`${this.API_BASE_URL}/auth/login`, { email, password })
      .pipe(
        tap((response) => {
          if (response.success && response.data) {
            const { token, refreshToken, user } = response.data;
            this.setStorageItem(this.TOKEN_KEY, token);
            this.setStorageItem(this.REFRESH_TOKEN_KEY, refreshToken);
            this.setStorageItem(this.USER_KEY, JSON.stringify(user));
            this.currentUserSubject.next(user);
          }
        }),
        catchError(this.handleError)
      );
  }

  register(userData: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
  }): Observable<any> {
    return this.http
      .post(`${this.API_BASE_URL}/users/register`, userData)
      .pipe(catchError(this.handleError));
  }

  logout(): void {
    this.cleanupInvalidSession();
  }

  hasRole(role: UserRole): boolean {
    const user = this.currentUserSubject.value;
    return user ? user.role === role : false;
  }

  getProfile(): Observable<User> {
    const token = this.getTokenFromStorage();
    if (!token) return throwError(() => new Error('No authentication token found'));

    return this.http.get<ProfileResponse>(`${this.API_BASE_URL}/auth/profile`).pipe(
      tap((response) => {
        if (response.success && response.data) {
          this.setStorageItem(this.USER_KEY, JSON.stringify(response.data));
          this.currentUserSubject.next(response.data);
        }
      }),
      map((response) => response.data),
      catchError(this.handleError)
    );
  }

  updateUser(userId: string, userData: Partial<User>): Observable<User> {
    const token = this.getTokenFromStorage();
    if (!token) return throwError(() => new Error('No authentication token found'));

    return this.http
      .put<ProfileResponse>(`${this.API_BASE_URL}/users/${userId}`, userData)
      .pipe(
        tap((response) => {
          if (response.success && response.data && this.getCurrentUser()?.id === response.data.id) {
            this.setStorageItem(this.USER_KEY, JSON.stringify(response.data));
            this.currentUserSubject.next(response.data);
          }
        }),
        map((response) => response.data),
        catchError(this.handleError)
      );
  }

  private handleError = (error: HttpErrorResponse) => {
    let errorMessage = 'An unexpected error occurred';

    if (error.error?.message) {
      errorMessage = error.error.message;
    } else if (error.message) {
      errorMessage = error.message;
    }

    return throwError(() => ({ error: { message: errorMessage }, status: error.status }));
  };
}
