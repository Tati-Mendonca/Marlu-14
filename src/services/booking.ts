import { db } from "@/config/firebase";
import { Booking, BookingInput } from "@/types/booking";
import { normalizeDate } from "@/utils/Date";
import { addDoc, collection, deleteDoc, doc, getDocs, query, updateDoc, where } from "firebase/firestore";

export const createBooking = async (booking: BookingInput): Promise<Booking> => {
  const docRef = await addDoc(collection(db, "bookings"), {
    ...booking,
    createdAt: new Date(),
  });

  return {
    ...booking,
    id: docRef.id,
  };
};

export async function updateBooking(bookingId: string, booking: BookingInput) {
  const bookingRef = doc(db, "bookings", bookingId);

  await updateDoc(bookingRef, {
    ...booking,
    updatedAt: new Date(),
  });
}

  export const getTotalBookings = async (): Promise<number> => {
  const querySnapshot = await getDocs(collection(db, "bookings"));
  return querySnapshot.size;
};

export const getTotalRevenue = async (year: number): Promise<number> => {
  const querySnapshot = await getDocs(collection(db, "bookings"));
  let total = 0;

  querySnapshot.forEach((doc) => {
    const data = doc.data() as Booking;

    const checkInDate = normalizeDate(data.checkIn);
    const bookingYear = checkInDate.getFullYear();
    if (bookingYear === year && typeof data.price === "number") {
      total += data.price;
    }
  });

  return total;
};

export async function getTotalDaysRentedInYear(year: number): Promise<number> {
  const snapshot = await getDocs(collection(db, "bookings"));
  let totalDays = 0;

  snapshot.forEach((doc) => {
    const data = doc.data();
    const checkIn = normalizeDate(data.checkIn);

    if (checkIn.getFullYear() === year) {
      totalDays += data.days || 0;
    }
  });

  return totalDays;
}

export async function getBookingsByMonth(year: number, month: number): Promise<Booking[]> {
  const startDate = new Date(year, month - 1, 1);
  const endDate = new Date(year, month, 1);

  const bookingsRef = collection(db, "bookings");
  const q = query(
    bookingsRef,
    where("checkIn", ">=", startDate),
    where("checkIn", "<", endDate)
  );

  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => {
  const data = doc.data();
  return {
    id: doc.id,
    checkIn: data.checkIn.toDate(),
    checkOut: data.checkOut.toDate(),
    price: data.price,
    customerName: data.customerName,
    status: data.status,
    days: data.days,
  } as Booking;
});
}

export async function deleteBooking(bookingId: string): Promise<void> {
  try {
    const bookingRef = doc(db, "bookings", bookingId);
    await deleteDoc(bookingRef);
    console.log(`Reserva com ID ${bookingId} deletada com sucesso.`);
  } catch (error) {
    console.error("Erro ao deletar reserva:", error);
    throw error;
  }
}