export enum ReservationStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  CANCELLED = 'CANCELLED',
  COMPLETED = 'COMPLETED'
}

export interface Reservation {
  id: number;
  userId: number;
  hotelId: number;
  roomId: number;
  checkInDate: Date;
  checkOutDate: Date;
  guestCount: number;
  totalAmount: number;
  status: ReservationStatus;
  guestDetails: {
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
  };
  createdAt: Date;
  updatedAt: Date;
}