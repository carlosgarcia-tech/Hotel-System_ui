import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Room } from '../../../domain/models/room.model';
import { environment } from '../../../../environments/environment';

export interface RoomApiResponse {
  success: boolean;
  message: string;
  data: Room[];
  timestamp: string;
}

export interface SingleRoomApiResponse {
  success: boolean;
  message: string;
  data: Room;
  timestamp: string;
}

@Injectable({
  providedIn: 'root',
})
export class RoomsService {
  private http = inject(HttpClient);
  private readonly API_BASE_URL = environment.apiUrl;

  getRoomsByHotelId(hotelId: string): Observable<RoomApiResponse> {
    return this.http.get<RoomApiResponse>(`${this.API_BASE_URL}/rooms/hotel/${hotelId}`);
  }

  getRoomById(hotelId: string, roomId: string): Observable<SingleRoomApiResponse> {
    return this.http.get<SingleRoomApiResponse>(`${this.API_BASE_URL}/rooms/${roomId}`);
  }

  getAvailableRooms(
    hotelId: string,
    checkInDate?: string,
    checkOutDate?: string
  ): Observable<RoomApiResponse> {
    let url = `${this.API_BASE_URL}/rooms/hotel/${hotelId}/available`;

    if (checkInDate && checkOutDate) {
      url += `?checkInDate=${checkInDate}&checkOutDate=${checkOutDate}`;
    }

    return this.http.get<RoomApiResponse>(url);
  }
}