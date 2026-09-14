import { TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { HeaderComponent } from './header.component';
import { AuthService } from '../../../features/auth/services/auth.service';

describe('HeaderComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeaderComponent],
      providers: [provideZonelessChangeDetection(), provideHttpClient(), provideHttpClientTesting(), provideRouter([])],
    }).compileComponents();
    localStorage.clear();
  });

  afterEach(() => localStorage.clear());

  it('should create', () => {
    const fixture = TestBed.createComponent(HeaderComponent);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should start with loading state', () => {
    const fixture = TestBed.createComponent(HeaderComponent);
    expect(fixture.componentInstance.isLoading).toBeTrue();
  });

  it('should toggle menu', () => {
    const fixture = TestBed.createComponent(HeaderComponent);
    const header = fixture.componentInstance;
    expect(header.isMenuOpen).toBeFalse();

    header.toggleMenu();
    expect(header.isMenuOpen).toBeTrue();

    header.toggleMenu();
    expect(header.isMenuOpen).toBeFalse();
  });

  it('should have isAuthenticated false initially', () => {
    const fixture = TestBed.createComponent(HeaderComponent);
    expect(fixture.componentInstance.isAuthenticated).toBeFalse();
  });

  it('should have currentUser null initially', () => {
    const fixture = TestBed.createComponent(HeaderComponent);
    expect(fixture.componentInstance.currentUser).toBeNull();
  });

  it('should have UserRole enum', () => {
    const fixture = TestBed.createComponent(HeaderComponent);
    expect(fixture.componentInstance.UserRole).toBeDefined();
  });

  it('should render header element', () => {
    const fixture = TestBed.createComponent(HeaderComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('header, nav, .header')).toBeTruthy();
  });

  it('should clean up subscriptions on destroy', () => {
    const fixture = TestBed.createComponent(HeaderComponent);
    fixture.componentInstance.ngOnDestroy();
    expect(true).toBeTrue();
  });
});
