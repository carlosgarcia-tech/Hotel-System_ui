import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { ReservationService } from '../../services/reservation.service';

export interface Reservation {
  id: string;
  hotelId: string;
  hotelName?: string;
  roomId: string;
  roomNumber?: string;
  roomType?: string;
  checkInDate: string;
  checkOutDate: string;
  numberOfGuests: number;
  guestAge?: number;
  guestDocumentType?: string;
  guestDocumentNumber?: string;
  specialRequests?: string;
  totalAmount?: number;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  createdAt: string;
  updatedAt: string;
}

export interface ReservationsApiResponse {
  success: boolean;
  message: string;
  data: Reservation[];
  timestamp: string;
}

@Component({
  selector: 'app-my-reservations',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './my-reservations.component.html',
  styleUrls: ['./my-reservations.component.scss'],
})
export class MyReservationsComponent implements OnInit {
  private reservationService = inject(ReservationService);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);

  reservations: Reservation[] = [];
  filteredReservations: Reservation[] = [];
  isLoading = true;
  error: string | null = null;

  selectedTab: 'all' | 'active' | 'completed' | 'cancelled' = 'all';

  showCancelModal = false;
  reservationToCancel: Reservation | null = null;
  cancellingReservations = new Set<string>();

  ngOnInit() {
    this.loadReservations();
  }

  loadReservations() {
    this.isLoading = true;
    this.error = null;
    this.cdr.detectChanges();

    this.reservationService.getMyReservations().subscribe({
      next: (response: ReservationsApiResponse) => {
        if (response.success) {
          this.reservations = response.data || [];
          this.applyFilter();
        } else {
          this.error = response.message || 'Error al cargar las reservas';
        }
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error loading reservations:', err);
        this.error = err.error?.message || 'Error al cargar las reservas';
        this.isLoading = false;
        this.cdr.detectChanges();
      },
    });
  }

  selectTab(tab: 'all' | 'active' | 'completed' | 'cancelled') {
    this.selectedTab = tab;
    this.applyFilter();
  }

  applyFilter() {
    switch (this.selectedTab) {
      case 'active':
        this.filteredReservations = this.getActiveReservations();
        break;
      case 'completed':
        this.filteredReservations = this.getCompletedReservations();
        break;
      case 'cancelled':
        this.filteredReservations = this.getCancelledReservations();
        break;
      default:
        this.filteredReservations = [...this.reservations];
    }
  }

  getActiveReservations(): Reservation[] {
    return this.reservations.filter((r) => r.status === 'confirmed' || r.status === 'pending');
  }

  getCompletedReservations(): Reservation[] {
    return this.reservations.filter((r) => r.status === 'completed');
  }

  getCancelledReservations(): Reservation[] {
    return this.reservations.filter((r) => r.status === 'cancelled');
  }

  getTabDisplayText(): string {
    switch (this.selectedTab) {
      case 'active':
        return 'activas';
      case 'completed':
        return 'completadas';
      case 'cancelled':
        return 'canceladas';
      default:
        return '';
    }
  }

  getStatusDisplay(status: string): string {
    const statusMap: { [key: string]: string } = {
      pending: 'Pendiente',
      confirmed: 'Confirmada',
      cancelled: 'Cancelada',
      completed: 'Completada',
    };
    return statusMap[status] || status;
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
    return typeMap[type?.toLowerCase()] || type || 'N/A';
  }

  getDocumentTypeDisplay(type: string): string {
    const docMap: { [key: string]: string } = {
      passport: 'Pasaporte',
      id_card: 'Cédula de Identidad',
      driver_license: 'Licencia de Conducir',
      other: 'Otro',
    };
    return docMap[type] || type;
  }

  formatDate(dateString: string): string {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('es-ES', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      });
    } catch {
      return 'Fecha inválida';
    }
  }

  calculateNights(checkIn: string, checkOut: string): number {
    try {
      const checkInDate = new Date(checkIn);
      const checkOutDate = new Date(checkOut);
      const timeDiff = checkOutDate.getTime() - checkInDate.getTime();
      return Math.ceil(timeDiff / (1000 * 3600 * 24));
    } catch {
      return 0;
    }
  }

  canCancelReservation(reservation: Reservation): boolean {
    if (reservation.status === 'cancelled' || reservation.status === 'completed') {
      return false;
    }

    // Check if check-in date is in the future (allow cancellation up to check-in day)
    try {
      const checkInDate = new Date(reservation.checkInDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return checkInDate >= today;
    } catch {
      return false;
    }
  }

  canModifyReservation(reservation: Reservation): boolean {
    if (reservation.status === 'cancelled' || reservation.status === 'completed') {
      return false;
    }

    // Allow modification if check-in is more than 24 hours away
    try {
      const checkInDate = new Date(reservation.checkInDate);
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      return checkInDate > tomorrow;
    } catch {
      return false;
    }
  }

  viewReservationDetails(reservationId: string) {
    // Navigate to reservation details page or show detailed modal
    alert(`Ver detalles de la reserva: ${reservationId}`);
    // this.router.navigate(['/reservations', reservationId]);
  }

  modifyReservation(reservationId: string) {
    // Navigate to modification page
    alert(`Modificar reserva: ${reservationId}`);
    // this.router.navigate(['/reservations', reservationId, 'modify']);
  }

  confirmCancelReservation(reservation: Reservation) {
    this.reservationToCancel = reservation;
    this.showCancelModal = true;
  }

  closeCancelModal() {
    this.showCancelModal = false;
    this.reservationToCancel = null;
  }

  cancelReservation() {
    if (!this.reservationToCancel) return;

    const reservationId = this.reservationToCancel.id;
    this.cancellingReservations.add(reservationId);
    this.cdr.detectChanges();

    this.reservationService.cancelReservation(reservationId).subscribe({
      next: (response) => {
        if (response.success) {
          const reservation = this.reservations.find((r) => r.id === reservationId);
          if (reservation) {
            reservation.status = 'cancelled';
          }
          this.applyFilter();
          this.closeCancelModal();
        } else {
          alert('Error al cancelar la reserva: ' + (response.message || 'Error desconocido'));
        }
        this.cancellingReservations.delete(reservationId);
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error cancelling reservation:', err);
        alert('Error al cancelar la reserva: ' + (err.error?.message || 'Error de conexión'));
        this.cancellingReservations.delete(reservationId);
        this.cdr.detectChanges();
      },
    });
  }
}
