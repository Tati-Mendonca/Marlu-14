export type BookingStatus = "reservado" | "pago" | "interessado" | "cancelado";

export interface Booking {
  id?: string;
  customerId: string;
  userId: string;
  checkIn: Date;
  checkOut: Date;
  price: number;
  days: number;
  status: BookingStatus;
}