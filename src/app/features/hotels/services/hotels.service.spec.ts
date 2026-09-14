import { TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { HotelsService } from './hotels.service';
import { environment } from '../../../../environments/environment';

describe('HotelsService', () => {
  let service: HotelsService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideZonelessChangeDetection(), HotelsService, provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(HotelsService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get all hotels', () => {
    const mockResponse = { success: true, data: [], message: '', timestamp: '' };

    service.getAllHotels().subscribe((res) => {
      expect(res).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/hotels`);
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('should get hotel by id', () => {
    const mockResponse = { success: true, data: [{ id: '1', name: 'Test Hotel' }] as any, message: '', timestamp: '' };

    service.getHotelById('1').subscribe((res) => {
      expect(res.success).toBeTrue();
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/hotels/1`);
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('should search hotels with criteria', () => {
    const criteria = { name: 'Beach', minRating: 4, location: { city: 'Miami' } };
    const mockResponse = { success: true, data: [], message: '', timestamp: '' };

    service.searchHotels(criteria).subscribe((res) => {
      expect(res).toEqual(mockResponse);
    });

    const req = httpMock.expectOne((r) => r.url === `${environment.apiUrl}/hotels/search`);
    expect(req.request.params.get('name')).toBe('Beach');
    expect(req.request.params.get('minRating')).toBe('4');
    expect(req.request.params.get('city')).toBe('Miami');
    req.flush(mockResponse);
  });

  it('should get hotels by city', () => {
    const mockResponse = { success: true, data: [], message: '', timestamp: '' };

    service.getHotelsByCity('New York').subscribe((res) => {
      expect(res).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/hotels/city/New%20York`);
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('should get hotels near location', () => {
    const mockResponse = { success: true, data: [], message: '', timestamp: '' };

    service.getHotelsNearLocation(25.7617, -80.1918).subscribe((res) => {
      expect(res).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/hotels/near/25.7617/-80.1918`);
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });
});
