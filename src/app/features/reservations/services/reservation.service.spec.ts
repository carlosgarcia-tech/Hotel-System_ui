import { TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ReservationService, CreateReservationData } from './reservation.service';
import { environment } from '../../../../environments/environment';

describe('ReservationService', () => {
  let service: ReservationService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideZonelessChangeDetection(), ReservationService, provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(ReservationService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should create a reservation', () => {
    const data: CreateReservationData = {
      checkInDate: '2025-01-01',
      checkOutDate: '2025-01-05',
      numberOfGuests: 2,
      guestAge: 30,
      guestDocumentType: 'passport',
      guestDocumentNumber: 'ABC123',
      specialRequests: 'Late check-in',
    };

    const mockResponse = { success: true, data: { id: 1 } };

    service.createReservation('hotel-1', 'room-1', data).subscribe((res) => {
      expect(res).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/reservations/hotel/hotel-1/room/room-1`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(data);
    req.flush(mockResponse);
  });

  it('should get my reservations', () => {
    const mockResponse = { success: true, data: [] };

    service.getMyReservations().subscribe((res) => {
      expect(res).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/reservations/my-reservations`);
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('should cancel a reservation', () => {
    const mockResponse = { success: true, message: 'Cancelled' };

    service.cancelReservation('res-1').subscribe((res) => {
      expect(res).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/reservations/res-1/cancel`);
    expect(req.request.method).toBe('PATCH');
    expect(req.request.body).toEqual({});
    req.flush(mockResponse);
  });
});
