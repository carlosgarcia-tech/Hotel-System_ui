import { TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { RoomsService } from './rooms.service';
import { environment } from '../../../../environments/environment';

describe('RoomsService', () => {
  let service: RoomsService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideZonelessChangeDetection(), RoomsService, provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(RoomsService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get rooms by hotel id', () => {
    const mockResponse = { success: true, data: [], message: '', timestamp: '' };

    service.getRoomsByHotelId('hotel-1').subscribe((res) => {
      expect(res).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/rooms/hotel/hotel-1`);
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('should get room by id', () => {
    const mockResponse = { success: true, data: { id: 'room-1', number: '101' } as any, message: '', timestamp: '' };

    service.getRoomById('hotel-1', 'room-1').subscribe((res) => {
      expect(res.success).toBeTrue();
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/rooms/room-1`);
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('should get available rooms without dates', () => {
    const mockResponse = { success: true, data: [], message: '', timestamp: '' };

    service.getAvailableRooms('hotel-1').subscribe((res) => {
      expect(res).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/rooms/hotel/hotel-1/available`);
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('should get available rooms with dates', () => {
    const mockResponse = { success: true, data: [], message: '', timestamp: '' };

    service.getAvailableRooms('hotel-1', '2025-01-01', '2025-01-05').subscribe((res) => {
      expect(res).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(
      `${environment.apiUrl}/rooms/hotel/hotel-1/available?checkInDate=2025-01-01&checkOutDate=2025-01-05`
    );
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });
});
