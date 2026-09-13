import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { AuthService } from './auth.service';
import { environment } from '../../../../environments/environment';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AuthService, provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
    localStorage.clear();
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return false when not authenticated', () => {
    expect(service.isAuthenticated()).toBeFalse();
  });

  it('should return null user when not authenticated', () => {
    expect(service.getCurrentUser()).toBeNull();
  });

  it('should return null token when not authenticated', () => {
    expect(service.getAuthToken()).toBeNull();
  });

  it('should store token and user on login', () => {
    const mockResponse = {
      success: true,
      message: 'Login successful',
      data: {
        token: 'test-token',
        refreshToken: 'test-refresh-token',
        user: {
          id: '1',
          email: 'test@test.com',
          firstName: 'Test',
          lastName: 'User',
          role: 'USER' as const,
          isActive: true,
          createdAt: '2024-01-01',
          updatedAt: '2024-01-01',
        },
      },
    };

    service.login('test@test.com', 'password123').subscribe((response) => {
      expect(response.success).toBeTrue();
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/auth/login`);
    expect(req.request.method).toBe('POST');
    req.flush(mockResponse);

    expect(localStorage.getItem(environment.tokenKey)).toBe('test-token');
    expect(service.isAuthenticated()).toBeTrue();
    expect(service.getCurrentUser()?.email).toBe('test@test.com');
  });

  it('should clear storage on logout', () => {
    localStorage.setItem(environment.tokenKey, 'test-token');
    localStorage.setItem(environment.userKey, JSON.stringify({ id: '1' }));

    service.logout();

    expect(localStorage.getItem(environment.tokenKey)).toBeNull();
    expect(localStorage.getItem(environment.userKey)).toBeNull();
    expect(service.isAuthenticated()).toBeFalse();
  });

  it('should check user role correctly', () => {
    const mockUser = {
      id: '1',
      email: 'admin@test.com',
      firstName: 'Admin',
      lastName: 'User',
      role: 'ADMIN' as const,
      isActive: true,
      createdAt: '2024-01-01',
      updatedAt: '2024-01-01',
    };

    localStorage.setItem(environment.userKey, JSON.stringify(mockUser));

    // Re-initialize the service to pick up the stored user
    const freshService = TestBed.inject(AuthService);

    expect(freshService.hasRole('ADMIN')).toBeTrue();
    expect(freshService.hasRole('USER')).toBeFalse();
  });
});
