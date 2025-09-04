import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface CreateReservationData {
  checkInDate: string;
  checkOutDate: string;
  numberOfGuests: number;
  guestAge: number;
  guestDocumentType: string;
  guestDocumentNumber: string;
  specialRequests?: string;
}

@Injectable({
  providedIn: 'root',
})
export class ReservationService {
  private http = inject(HttpClient);
  private readonly API_BASE_URL = 'http://localhost:3000/api';

  createReservation(hotelId: string, roomId: string, data: CreateReservationData): Observable<any> {
    return this.http.post(
      `${this.API_BASE_URL}/reservations/hotel/${hotelId}/room/${roomId}`,
      data
    );
  }

  getMyReservations(): Observable<any> {
    return this.http.get(`${this.API_BASE_URL}/reservations/my-reservations`);
  }

  cancelReservation(reservationId: string): Observable<any> {
    return this.http.patch(`${this.API_BASE_URL}/reservations/${reservationId}/cancel`, {});
  }
}
