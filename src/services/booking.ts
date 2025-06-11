import { db } from "@/config/firebase";
import { addDoc, collection } from "firebase/firestore";

type BookingStatus = "reservado" | "pago" | "interessado" | "cancelado";

export const createBooking = async (booking: {
  customerId: string;
  userId: string;
  checkIn: Date;
  checkOut: Date;
  price: number;
  days: number;
  status?: BookingStatus;
}) => {
  try {
    const bookingRef = await addDoc(collection(db, "bookings"), {
      customerId: booking.customerId,
      checkIn: booking.checkIn,
      checkOut: booking.checkOut,
      price: booking.price,
      days: booking.days,
      status: booking.status ?? "interessado",
      createdAt: new Date(),
    });

    return bookingRef.id;
  } catch (error) {
    console.error("Erro ao criar reserva:", error);
    throw error;
  }
};
