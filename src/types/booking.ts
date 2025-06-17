export type BookingStatus = "Reservado" | "Pago" | "Interessado" | "Cancelado";

export interface BookingInput {
  customerId: string;
  customerName: string;
  userId: string;
  bookingByName: string;
  checkIn: Date;
  checkOut: Date;
  price: number;
  days: number;
  status: BookingStatus;
}

export interface Booking extends BookingInput {
  id: string;
}

export interface Booking {
  id: string;
  customerId: string;
  customerName: string;
  userId: string;
  checkIn: Date;
  checkOut: Date;
  price: number;
  days: number;
  status: BookingStatus;
}