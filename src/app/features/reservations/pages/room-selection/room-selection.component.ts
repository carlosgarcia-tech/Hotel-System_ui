import { Component, OnInit, inject, ChangeDetectorRef, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { RoomsService } from '../../../hotels/services/rooms.service';
import { Room } from '../../../../domain/models/room.model';
import { CardComponent, CardAction } from '../../../../shared/components/card/card.component';
import { AuthService } from '../../../auth/services/auth.service';

@Component({
  selector: 'app-room-selection',
  standalone: true,
  imports: [CommonModule, CardComponent],
  templateUrl: './room-selection.component.html',
  styleUrls: ['./room-selection.component.scss'],
})
export class RoomSelectionComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private roomsService = inject(RoomsService);
  public authService = inject(AuthService);
  private cdr = inject(ChangeDetectorRef);
  private platformId = inject(PLATFORM_ID);

  hotelId: string = '';
  rooms: Room[] = [];
  isLoading = true;
  error: string | null = null;

  ngOnInit() {
    this.hotelId = this.route.snapshot.paramMap.get('hotelId') || '';

    if (!this.hotelId) {
      console.error('No hotel ID found in route parameters');
      this.error = 'ID de hotel no válido';
      this.isLoading = false;
      this.cdr.detectChanges();
      return;
    }

    if (isPlatformBrowser(this.platformId)) {
      this.loadRooms();
    } else {
      this.isLoading = true;
    }
  }

  loadRooms() {
    this.isLoading = true;
    this.error = null;
    this.cdr.detectChanges();

    this.roomsService.getRoomsByHotelId(this.hotelId).subscribe({
      next: (response) => {

        if (response.success) {
          this.rooms = response.data || [];
        } else {
          this.error = response.message || 'Error al cargar las habitaciones';
        }
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('HTTP Error occurred:', err);
        console.error('Error details:', err.error);
        console.error('Error status:', err.status);
        console.error('Error message:', err.message);

        this.error = err.error?.message || 'Error al cargar las habitaciones';
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      complete: () => {
        this.cdr.detectChanges();
      },
    });
  }

  getRoomTypeDisplay(type: string): string {
    const typeMap: { [key: string]: string } = {
      standard: 'Estándar',
      suite: 'Suite',
      deluxe: 'Deluxe',
      family: 'Familiar',
      executive: 'Ejecutiva',
      presidential: 'Presidencial',
    };
    return typeMap[type.toLowerCase()] || type;
  }

  getRoomBadges(room: Room): any[] {
    const badges: any[] = [];

    if (room.type === 'suite' || room.type === 'deluxe' || room.type === 'presidential') {
      badges.push({ text: 'Premium', variant: 'primary' });
    }

    if (!room.availability.isAvailable) {
      badges.push({ text: 'No Disponible', variant: 'danger' });
    } else if (room.features.hasWifi) {
      badges.push({ text: 'Wi-Fi', variant: 'success' });
    }

    if (room.features.hasSeaView) {
      badges.push({ text: 'Vista al Mar', variant: 'info' });
    }

    if (room.features.isAccessible) {
      badges.push({ text: 'Accesible', variant: 'warning' });
    }

    return badges;
  }

  getCardActions(room: Room): CardAction[] {
    const isAuthenticated = this.authService.isAuthenticated();

    const actions = [
      {
        label: 'Ver Detalles',
        icon: 'fas fa-eye',
        action: 'view-details',
        variant: 'primary' as const,
      },
      {
        label: 'Reservar',
        icon: 'fas fa-calendar-check',
        action: 'book-now',
        variant: 'success' as const,
        disabled: !room.availability.isAvailable || !isAuthenticated,
      },
    ];

    return actions;
  }

  onCardAction(action: string, roomId: string) {
    switch (action) {
      case 'view-details':
        this.viewRoomDetails(roomId);
        break;
      case 'book-now':
        this.bookRoom(roomId);
        break;
    }
  }

  getBedSummary(bedConfig: any): string {
    if (!bedConfig?.beds) {
      console.warn('No bed configuration found for room');
      return 'Sin información';
    }

    return bedConfig.beds
      .map((bed: any) => `${bed.count} ${this.getBedTypeDisplay(bed.type)}`)
      .join(', ');
  }

  getBedTypeDisplay(bedType: string): string {
    const bedMap: { [key: string]: string } = {
      king: 'King Size',
      queen: 'Queen Size',
      double: 'Doble',
      single: 'Individual',
      twin: 'Gemelas',
    };
    return bedMap[bedType] || bedType;
  }

  viewRoomDetails(roomId: string) {
    const room = this.rooms.find((r) => r.id === roomId);
    if (room) {
      alert(`Detalles de la habitación:
Número: ${room.number}
Tipo: ${this.getRoomTypeDisplay(room.type)}
Piso: ${room.floor}
Precio: $${room.pricing.basePrice} ${room.pricing.currency}
Capacidad: ${room.capacity.total} personas (${room.capacity.adults} adultos, ${
        room.capacity.children
      } niños)
Tamaño: ${room.size.area} ${room.size.unit}
Disponible: ${room.availability.isAvailable ? 'Sí' : 'No'}`);
    }
  }

  bookRoom(roomId: string) {
    this.router.navigate(['/reservations/create', this.hotelId, roomId]);
  }

  goBack() {
    this.router.navigate(['/hotels']);
  }
}
