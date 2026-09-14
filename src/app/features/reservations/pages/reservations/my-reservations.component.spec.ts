import { TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { MyReservationsComponent, Reservation } from './my-reservations.component';
import { NotificationService } from '../../../../core/services/notification.service';

describe('MyReservationsComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MyReservationsComponent],
      providers: [provideZonelessChangeDetection(), provideHttpClient(), provideHttpClientTesting(), provideRouter([])],
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(MyReservationsComponent);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should start with loading state', () => {
    const fixture = TestBed.createComponent(MyReservationsComponent);
    expect(fixture.componentInstance.isLoading).toBeTrue();
  });

  it('should default to all tab', () => {
    const fixture = TestBed.createComponent(MyReservationsComponent);
    expect(fixture.componentInstance.selectedTab).toBe('all');
  });

  it('should display status correctly', () => {
    const fixture = TestBed.createComponent(MyReservationsComponent);
    const component = fixture.componentInstance;
    expect(component.getStatusDisplay('pending')).toBe('Pendiente');
    expect(component.getStatusDisplay('confirmed')).toBe('Confirmada');
    expect(component.getStatusDisplay('cancelled')).toBe('Cancelada');
    expect(component.getStatusDisplay('completed')).toBe('Completada');
    expect(component.getStatusDisplay('unknown')).toBe('unknown');
  });

  it('should display room type correctly', () => {
    const fixture = TestBed.createComponent(MyReservationsComponent);
    const component = fixture.componentInstance;
    expect(component.getRoomTypeDisplay('standard')).toBe('Estándar');
    expect(component.getRoomTypeDisplay('suite')).toBe('Suite');
    expect(component.getRoomTypeDisplay(null as any)).toBe('N/A');
  });

  it('should display document type correctly', () => {
    const fixture = TestBed.createComponent(MyReservationsComponent);
    const component = fixture.componentInstance;
    expect(component.getDocumentTypeDisplay('passport')).toBe('Pasaporte');
    expect(component.getDocumentTypeDisplay('id_card')).toBe('Cédula de Identidad');
    expect(component.getDocumentTypeDisplay('driver_license')).toBe('Licencia de Conducir');
  });

  it('should format date correctly', () => {
    const fixture = TestBed.createComponent(MyReservationsComponent);
    const result = fixture.componentInstance.formatDate('2025-01-15');
    expect(result).toContain('2025');
  });

  it('should calculate nights correctly', () => {
    const fixture = TestBed.createComponent(MyReservationsComponent);
    const nights = fixture.componentInstance.calculateNights('2025-01-01', '2025-01-04');
    expect(nights).toBe(3);
  });

  it('should filter active reservations', () => {
    const fixture = TestBed.createComponent(MyReservationsComponent);
    const component = fixture.componentInstance;
    component.reservations = [
      { id: '1', status: 'confirmed' } as Reservation,
      { id: '2', status: 'pending' } as Reservation,
      { id: '3', status: 'cancelled' } as Reservation,
      { id: '4', status: 'completed' } as Reservation,
    ];

    const active = component.getActiveReservations();
    expect(active.length).toBe(2);
  });

  it('should filter completed reservations', () => {
    const fixture = TestBed.createComponent(MyReservationsComponent);
    const component = fixture.componentInstance;
    component.reservations = [
      { id: '1', status: 'completed' } as Reservation,
      { id: '2', status: 'pending' } as Reservation,
    ];

    const completed = component.getCompletedReservations();
    expect(completed.length).toBe(1);
  });

  it('should filter cancelled reservations', () => {
    const fixture = TestBed.createComponent(MyReservationsComponent);
    const component = fixture.componentInstance;
    component.reservations = [
      { id: '1', status: 'cancelled' } as Reservation,
      { id: '2', status: 'confirmed' } as Reservation,
    ];

    const cancelled = component.getCancelledReservations();
    expect(cancelled.length).toBe(1);
  });

  it('should not allow cancel for completed reservation', () => {
    const fixture = TestBed.createComponent(MyReservationsComponent);
    const reservation = { status: 'completed', checkInDate: '2025-12-01' } as Reservation;
    expect(fixture.componentInstance.canCancelReservation(reservation)).toBeFalse();
  });

  it('should not allow cancel for cancelled reservation', () => {
    const fixture = TestBed.createComponent(MyReservationsComponent);
    const reservation = { status: 'cancelled', checkInDate: '2025-12-01' } as Reservation;
    expect(fixture.componentInstance.canCancelReservation(reservation)).toBeFalse();
  });

  it('should open and close cancel modal', () => {
    const fixture = TestBed.createComponent(MyReservationsComponent);
    const component = fixture.componentInstance;
    const reservation = { id: '1', status: 'pending' } as Reservation;

    component.confirmCancelReservation(reservation);
    expect(component.showCancelModal).toBeTrue();
    expect(component.reservationToCancel).toBe(reservation);

    component.closeCancelModal();
    expect(component.showCancelModal).toBeFalse();
    expect(component.reservationToCancel).toBeNull();
  });

  it('should use notification service for view details', () => {
    const fixture = TestBed.createComponent(MyReservationsComponent);
    const notificationService = TestBed.inject(NotificationService);
    spyOn(notificationService, 'info');

    fixture.componentInstance.viewReservationDetails('res-1');

    expect(notificationService.info).toHaveBeenCalledWith('Detalles de la reserva: res-1');
  });

  it('should get tab display text', () => {
    const fixture = TestBed.createComponent(MyReservationsComponent);
    const component = fixture.componentInstance;
    component.selectedTab = 'active';
    expect(component.getTabDisplayText()).toBe('activas');
    component.selectedTab = 'completed';
    expect(component.getTabDisplayText()).toBe('completadas');
    component.selectedTab = 'all';
    expect(component.getTabDisplayText()).toBe('');
  });
});
