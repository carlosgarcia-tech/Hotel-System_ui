import { TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { HomeComponent } from './home.component';
import { NotificationService } from '../../../../core/services/notification.service';

describe('HomeComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomeComponent],
      providers: [provideZonelessChangeDetection(), provideHttpClient(), provideHttpClientTesting(), provideRouter([])],
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(HomeComponent);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should have sample hotels', () => {
    const fixture = TestBed.createComponent(HomeComponent);
    expect(fixture.componentInstance.sampleHotels.length).toBe(3);
  });

  it('should have title HotelManager', () => {
    const fixture = TestBed.createComponent(HomeComponent);
    expect((fixture.componentInstance as any).title).toBe('HotelManager');
  });

  it('should track by hotel id', () => {
    const fixture = TestBed.createComponent(HomeComponent);
    const hotel = { id: 42 };
    expect(fixture.componentInstance.trackByHotelId(0, hotel)).toBe(42);
  });

  it('should call notification on view-details action', () => {
    const fixture = TestBed.createComponent(HomeComponent);
    const notificationService = TestBed.inject(NotificationService);
    spyOn(notificationService, 'info');

    fixture.componentInstance.onActionClick('view-details', 1);

    expect(notificationService.info).toHaveBeenCalledWith('Ver detalles del hotel 1');
  });

  it('should call notification on book-now action', () => {
    const fixture = TestBed.createComponent(HomeComponent);
    const notificationService = TestBed.inject(NotificationService);
    spyOn(notificationService, 'info');

    fixture.componentInstance.onActionClick('book-now', 2);

    expect(notificationService.info).toHaveBeenCalledWith('Reservar hotel 2');
  });

  it('should render hero section', () => {
    const fixture = TestBed.createComponent(HomeComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.hero-section')).toBeTruthy();
  });

  it('should render hotel cards', () => {
    const fixture = TestBed.createComponent(HomeComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelectorAll('app-card').length).toBe(3);
  });
});
