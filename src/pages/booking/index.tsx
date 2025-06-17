import { useCallback, useEffect, useState } from "react";
import BookingModal from "@/components/BookingModal";
import { createBooking, getBookingsByMonth } from "@/services/booking";
import { Booking, BookingInput } from "@/types/booking";
import { Card } from "@/components/Card";

export default function BookingPage() {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());

  const handleCreateBooking = useCallback(async (booking: BookingInput) => {
    try {
      await createBooking(booking);
      setMessage("Reserva criada com sucesso!");
    } catch (error) {
      if (process.env.NODE_ENV === "development") {
        console.error("Erro ao salvar reserva:", error);
      }
      setMessage("Erro ao salvar reserva.");
    }
  }, []);

  useEffect(() => {
    async function fetchBookings() {
      const results = await getBookingsByMonth(year, month);
      // const results = await getBookingsByMonth(month);
      setBookings(results);
    }

    fetchBookings();
    // }, [month]);
  }, [month, year]);

  return (
    <main className="min-h-screen bg-[var(--color-primary)] flex flex-col items-center pt-18 px-4 pb-8 ">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-semibold py-2">Página de Reservas</h1>
        <p className="text-sm text-gray-500 mb-4">
          Informação com todas as reservas blá blá blá blá blá blá blá blá blá:
        </p>
        <div className="flex gap-4 items-center mb-4">
          <select
            className="p-2 border rounded"
            value={month}
            onChange={(e) => setMonth(Number(e.target.value))}
          >
            {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
              <option key={m} value={m}>
                {m.toString().padStart(2, "0")}
              </option>
            ))}
          </select>
          <input
            type="text"
            className="p-2 border rounded"
            value={year}
            onChange={(e) => setYear(Number(e.target.value))}
          ></input>
        </div>

        {bookings.map((booking) => (
          <Card key={booking.id} booking={booking} />
        ))}

        <button
          // onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 top-4 right-4 absolute text-white px-6 py-2 rounded hover:bg-blue-700"
        >
          Nova Reserva
        </button>

        {message && <p className="mt-4 text-sm text-gray-700">{message}</p>}
      </div>

      <BookingModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleCreateBooking}
      />
    </main>
  );
}
