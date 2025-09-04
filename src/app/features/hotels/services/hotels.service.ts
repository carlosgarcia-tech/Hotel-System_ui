import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Hotel, HotelApiResponse, HotelSearchCriteria } from '../../../domain/models/hotel.model';

@Injectable({
  providedIn: 'root'
})
export class HotelsService {
  private http = inject(HttpClient);
  private readonly API_BASE_URL = 'http://localhost:3000/api';

  getAllHotels(): Observable<HotelApiResponse> {
    return this.http.get<HotelApiResponse>(`${this.API_BASE_URL}/hotels`);
  }

  getHotelById(id: string): Observable<HotelApiResponse> {
    return this.http.get<HotelApiResponse>(`${this.API_BASE_URL}/hotels/${id}`);
  }

  searchHotels(criteria: HotelSearchCriteria): Observable<HotelApiResponse> {
    let params = new HttpParams();

    if (criteria.name) params = params.set('name', criteria.name);
    if (criteria.minRating) params = params.set('minRating', criteria.minRating.toString());
    if (criteria.maxRating) params = params.set('maxRating', criteria.maxRating.toString());
    if (criteria.amenities?.length) params = params.set('amenities', criteria.amenities.join(','));
    if (criteria.priceRange?.min) params = params.set('minPrice', criteria.priceRange.min.toString());
    if (criteria.priceRange?.max) params = params.set('maxPrice', criteria.priceRange.max.toString());
    if (criteria.location?.city) params = params.set('city', criteria.location.city);
    if (criteria.location?.state) params = params.set('state', criteria.location.state);
    if (criteria.location?.country) params = params.set('country', criteria.location.country);
    if (criteria.isActive !== undefined) params = params.set('isActive', criteria.isActive.toString());
    if (criteria.minAvailableRooms) params = params.set('minAvailableRooms', criteria.minAvailableRooms.toString());

    return this.http.get<HotelApiResponse>(`${this.API_BASE_URL}/hotels/search`, { params });
  }

  getHotelsByCity(city: string): Observable<HotelApiResponse> {
    return this.http.get<HotelApiResponse>(`${this.API_BASE_URL}/hotels/city/${encodeURIComponent(city)}`);
  }

  getHotelsNearLocation(latitude: number, longitude: number): Observable<HotelApiResponse> {
    return this.http.get<HotelApiResponse>(`${this.API_BASE_URL}/hotels/near/${latitude}/${longitude}`);
  }
}