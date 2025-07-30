export type BookingStatus = "Reservado" | "Pago" | "Interessado" | "Cancelado";

export interface BookingInput {
  customerId: string;
  customerName: string;
  searchName: string;
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
