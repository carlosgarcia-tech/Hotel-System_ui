import { TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter, ActivatedRoute } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { CreateReservationComponent } from './create-reservation.component';

describe('CreateReservationComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateReservationComponent, ReactiveFormsModule],
      providers: [provideZonelessChangeDetection(), 
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([]),
      ],
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(CreateReservationComponent);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should have document types', () => {
    const fixture = TestBed.createComponent(CreateReservationComponent);
    expect(fixture.componentInstance.documentTypes.length).toBe(4);
  });

  it('should have invalid form initially', () => {
    const fixture = TestBed.createComponent(CreateReservationComponent);
    expect(fixture.componentInstance.reservationForm.valid).toBeFalse();
  });

  it('should validate required fields', () => {
    const fixture = TestBed.createComponent(CreateReservationComponent);
    const form = fixture.componentInstance.reservationForm;

    expect(form.get('checkInDate')?.hasError('required')).toBeTrue();
    expect(form.get('checkOutDate')?.hasError('required')).toBeTrue();
    expect(form.get('guestAge')?.hasError('required')).toBeTrue();
    expect(form.get('guestDocumentType')?.hasError('required')).toBeTrue();
    expect(form.get('guestDocumentNumber')?.hasError('required')).toBeTrue();
  });

  it('should validate guest age min 18', () => {
    const fixture = TestBed.createComponent(CreateReservationComponent);
    const form = fixture.componentInstance.reservationForm;

    form.get('guestAge')?.setValue(15);
    expect(form.get('guestAge')?.hasError('min')).toBeTrue();

    form.get('guestAge')?.setValue(18);
    expect(form.get('guestAge')?.hasError('min')).toBeFalse();
  });

  it('should calculate nights correctly', () => {
    const fixture = TestBed.createComponent(CreateReservationComponent);
    const component = fixture.componentInstance;
    component.reservationForm.patchValue({
      checkInDate: '2025-01-01',
      checkOutDate: '2025-01-04',
    });
    expect(component.calculateNights()).toBe(3);
  });

  it('should return 0 nights for invalid dates', () => {
    const fixture = TestBed.createComponent(CreateReservationComponent);
    expect(fixture.componentInstance.calculateNights()).toBe(0);
  });

  it('should get today date string', () => {
    const fixture = TestBed.createComponent(CreateReservationComponent);
    const today = fixture.componentInstance.getTodayDate();
    expect(today).toBe(new Date().toISOString().split('T')[0]);
  });

  it('should display room types correctly', () => {
    const fixture = TestBed.createComponent(CreateReservationComponent);
    const component = fixture.componentInstance;
    expect(component.getRoomTypeDisplay('standard')).toBe('Estándar');
    expect(component.getRoomTypeDisplay('suite')).toBe('Suite');
    expect(component.getRoomTypeDisplay('presidential')).toBe('Presidencial');
  });

  it('should calculate total when room is set', () => {
    const fixture = TestBed.createComponent(CreateReservationComponent);
    const component = fixture.componentInstance;
    component.room = { pricing: { basePrice: 200 } } as any;
    component.reservationForm.patchValue({
      checkInDate: '2025-01-01',
      checkOutDate: '2025-01-04',
    });
    expect(component.calculateTotal()).toBe(600);
  });

  it('should return 0 total when no room', () => {
    const fixture = TestBed.createComponent(CreateReservationComponent);
    expect(fixture.componentInstance.calculateTotal()).toBe(0);
  });
});
