import { TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { LoginComponent } from './login.component';
import { AuthService } from '../../services/auth.service';

describe('LoginComponent', () => {
  let authService: AuthService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoginComponent, ReactiveFormsModule],
      providers: [provideZonelessChangeDetection(), provideHttpClient(), provideHttpClientTesting(), provideRouter([])],
    }).compileComponents();
    authService = TestBed.inject(AuthService);
    localStorage.clear();
  });

  afterEach(() => localStorage.clear());

  it('should create', () => {
    const fixture = TestBed.createComponent(LoginComponent);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should have invalid form when empty', () => {
    const fixture = TestBed.createComponent(LoginComponent);
    expect(fixture.componentInstance.loginForm.valid).toBeFalse();
  });

  it('should have valid form with correct data', () => {
    const fixture = TestBed.createComponent(LoginComponent);
    fixture.componentInstance.loginForm.setValue({
      email: 'test@test.com',
      password: 'password123',
      rememberMe: false,
    });
    expect(fixture.componentInstance.loginForm.valid).toBeTrue();
  });

  it('should validate email format', () => {
    const fixture = TestBed.createComponent(LoginComponent);
    const emailControl = fixture.componentInstance.loginForm.get('email');

    emailControl?.setValue('invalid-email');
    expect(emailControl?.hasError('email')).toBeTrue();

    emailControl?.setValue('valid@email.com');
    expect(emailControl?.hasError('email')).toBeFalse();
  });

  it('should require minimum 6 characters for password', () => {
    const fixture = TestBed.createComponent(LoginComponent);
    const passwordControl = fixture.componentInstance.loginForm.get('password');

    passwordControl?.setValue('12345');
    expect(passwordControl?.hasError('minlength')).toBeTrue();

    passwordControl?.setValue('123456');
    expect(passwordControl?.hasError('minlength')).toBeFalse();
  });

  it('should toggle password visibility', () => {
    const fixture = TestBed.createComponent(LoginComponent);
    expect(fixture.componentInstance.showPassword()).toBeFalse();

    fixture.componentInstance.togglePasswordVisibility();
    expect(fixture.componentInstance.showPassword()).toBeTrue();

    fixture.componentInstance.togglePasswordVisibility();
    expect(fixture.componentInstance.showPassword()).toBeFalse();
  });

  it('should return field error message for required field', () => {
    const fixture = TestBed.createComponent(LoginComponent);
    const emailControl = fixture.componentInstance.loginForm.get('email');
    emailControl?.markAsTouched();

    expect(fixture.componentInstance.getFieldError('email')).toContain('requerido');
  });

  it('should return empty string for valid field', () => {
    const fixture = TestBed.createComponent(LoginComponent);
    const emailControl = fixture.componentInstance.loginForm.get('email');
    emailControl?.setValue('test@test.com');
    emailControl?.markAsTouched();

    expect(fixture.componentInstance.getFieldError('email')).toBe('');
  });

  it('should not submit when form is invalid', () => {
    const fixture = TestBed.createComponent(LoginComponent);
    spyOn(authService, 'login');

    fixture.componentInstance.onSubmit();

    expect(authService.login).not.toHaveBeenCalled();
  });

  it('should render login form', () => {
    const fixture = TestBed.createComponent(LoginComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('form')).toBeTruthy();
  });
});
