import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ReservationService, CreateReservationData } from '../../services/reservation.service';
import { RoomsService, SingleRoomApiResponse } from '../../../hotels/services/rooms.service';
import { Room } from '../../../../domain/models/room.model';
import { HotelsService } from '../../../hotels/services/hotels.service';
import { Hotel } from '../../../../domain/models/hotel.model';

@Component({
  selector: 'app-create-reservation',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './create-reservation.component.html',
  styleUrls: ['./create-reservation.component.scss'],
})
export class CreateReservationComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private fb = inject(FormBuilder);
  private reservationService = inject(ReservationService);
  private roomsService = inject(RoomsService);
  private hotelsService = inject(HotelsService);
  private cdr = inject(ChangeDetectorRef);

  hotelId: string = '';
  roomId: string = '';
  reservationForm: FormGroup;
  isLoading = true;
  error: string | null = null;
  successMessage: string | null = null;
  room: Room | null = null;
  hotel: Hotel | null = null;

  documentTypes = [
    { value: 'passport', label: 'Pasaporte' },
    { value: 'id_card', label: 'Cédula de Identidad' },
    { value: 'driver_license', label: 'Licencia de Conducir' },
    { value: 'other', label: 'Otro' },
  ];

  constructor() {
    this.reservationForm = this.fb.group({
      checkInDate: ['', [Validators.required]],
      checkOutDate: ['', [Validators.required]],
      numberOfGuests: [1, [Validators.required, Validators.min(1)]],
      guestAge: ['', [Validators.required, Validators.min(18)]],
      guestDocumentType: ['', [Validators.required]],
      guestDocumentNumber: ['', [Validators.required]],
      specialRequests: [''],
    });
  }

  ngOnInit() {
    this.hotelId = this.route.snapshot.paramMap.get('hotelId') || '';
    this.roomId = this.route.snapshot.paramMap.get('roomId') || '';

    if (!this.hotelId || !this.roomId) {
      this.error = 'ID de hotel o habitación no válido';
      this.isLoading = false;
      this.cdr.detectChanges();
      return;
    }

    this.loadData();
  }

  loadData() {
    this.isLoading = true;
    this.error = null;

    Promise.all([this.loadHotelDetails(), this.loadRoomDetails()])
      .then(() => {
        this.isLoading = false;
        this.cdr.detectChanges();
      })
      .catch(() => {
        this.error = 'Error al cargar los datos';
        this.isLoading = false;
        this.cdr.detectChanges();
      });
  }

  async loadRoomDetails(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.roomsService.getRoomById(this.hotelId, this.roomId).subscribe({
        next: (response: SingleRoomApiResponse) => {
          if (response.success && response.data) {
            this.room = response.data;
            this.reservationForm
              .get('numberOfGuests')
              ?.setValidators([
                Validators.required,
                Validators.min(1),
                Validators.max(this.room.capacity.total),
              ]);
            this.reservationForm.get('numberOfGuests')?.updateValueAndValidity();
            resolve();
          } else {
            this.error = 'Habitación no encontrada';
            reject();
          }
        },
        error: () => {
          this.error = 'Error al cargar los detalles de la habitación';
          reject();
        },
      });
    });
  }

  async loadHotelDetails(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.hotelsService.getHotelById(this.hotelId).subscribe({
        next: (response) => {
          if (response.success && response.data) {
            if (Array.isArray(response.data)) {
              if (response.data.length > 0) {
                this.hotel = response.data[0];
                resolve();
              } else {
                this.error = 'Hotel no encontrado';
                reject(new Error('Hotel not found'));
              }
            } else {
              this.hotel = response.data;
              resolve();
            }
          } else {
            this.error = 'Hotel no encontrado';
            reject(new Error('Hotel not found'));
          }
        },
        error: () => {
          this.error = 'Error al cargar los detalles del hotel';
          reject(new Error('Hotel load failed'));
        },
      });
    });
  }

  onSubmit() {
    if (this.reservationForm.valid && this.room && this.hotel) {
      this.isLoading = true;
      this.error = null;

      const formData: CreateReservationData = {
        checkInDate: new Date(this.reservationForm.value.checkInDate).toISOString(),
        checkOutDate: new Date(this.reservationForm.value.checkOutDate).toISOString(),
        numberOfGuests: this.reservationForm.value.numberOfGuests,
        guestAge: this.reservationForm.value.guestAge,
        guestDocumentType: this.reservationForm.value.guestDocumentType,
        guestDocumentNumber: this.reservationForm.value.guestDocumentNumber,
        specialRequests: this.reservationForm.value.specialRequests,
      };

      this.reservationService.createReservation(this.hotelId, this.roomId, formData).subscribe({
        next: (response) => {
          this.isLoading = false;
          if (response.success) {
            this.successMessage = 'Reserva creada exitosamente!';
            setTimeout(() => {
              this.router.navigate(['/reservations/my-reservations']);
            }, 2000);
          } else {
            this.error = response.message || 'Error al crear la reserva';
          }
          this.cdr.detectChanges();
        },
        error: (err) => {
          this.isLoading = false;
          this.error = err.error?.message || 'Error al crear la reserva';
          this.cdr.detectChanges();
        },
      });
    } else {
      this.markFormGroupTouched();
    }
  }

  private markFormGroupTouched() {
    Object.keys(this.reservationForm.controls).forEach((key) => {
      const control = this.reservationForm.get(key);
      control?.markAsTouched();
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

  getTodayDate(): string {
    return new Date().toISOString().split('T')[0];
  }

  getMinCheckoutDate(): string {
    const checkInDate = this.reservationForm.get('checkInDate')?.value;
    if (!checkInDate) return this.getTodayDate();

    const minDate = new Date(checkInDate);
    minDate.setDate(minDate.getDate() + 1);
    return minDate.toISOString().split('T')[0];
  }

  calculateNights(): number {
    const checkIn = new Date(this.reservationForm.value.checkInDate);
    const checkOut = new Date(this.reservationForm.value.checkOutDate);

    if (isNaN(checkIn.getTime()) || isNaN(checkOut.getTime())) return 0;

    const timeDiff = checkOut.getTime() - checkIn.getTime();
    return Math.ceil(timeDiff / (1000 * 3600 * 24));
  }

  calculateTotal(): number {
    if (!this.room) return 0;

    const nights = this.calculateNights();
    return nights * this.room.pricing.basePrice;
  }

  goBack() {
    this.router.navigate(['/rooms', this.hotelId]);
  }
}
