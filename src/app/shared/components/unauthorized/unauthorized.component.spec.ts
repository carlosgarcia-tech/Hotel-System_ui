import { TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { UnauthorizedComponent } from './unauthorized.component';

describe('UnauthorizedComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UnauthorizedComponent],
      providers: [provideZonelessChangeDetection(), provideRouter([])],
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(UnauthorizedComponent);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should render 403 text', () => {
    const fixture = TestBed.createComponent(UnauthorizedComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.error-title')?.textContent).toContain('403');
  });

  it('should render unauthorized message', () => {
    const fixture = TestBed.createComponent(UnauthorizedComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.error-subtitle')?.textContent).toContain('Acceso No Autorizado');
  });

  it('should have home link', () => {
    const fixture = TestBed.createComponent(UnauthorizedComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('a[routerLink="/"]')).toBeTruthy();
  });

  it('should have back button', () => {
    const fixture = TestBed.createComponent(UnauthorizedComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('button')).toBeTruthy();
  });
});
