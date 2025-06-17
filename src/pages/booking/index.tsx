import { useCallback, useEffect, useState } from "react";
import BookingModal from "@/components/BookingModal";
import { createBooking, getBookingsByMonth } from "@/services/booking";
import { Booking, BookingInput } from "@/types/booking";
import { Card } from "@/components/Card";
import HamburgerMenu from "@/components/HamburguerMenu";

export default function BookingPage() {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());
  const monthNames = [
    "Janeiro",
    "Fevereiro",
    "Março",
    "Abril",
    "Maio",
    "Junho",
    "Julho",
    "Agosto",
    "Setembro",
    "Outubro",
    "Novembro",
    "Dezembro",
  ];

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
    <>
      <HamburgerMenu />
      <main className="min-h-screen bg-[var(--color-primary)] flex flex-col items-center pt-18 px-4 pb-8 ">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-semibold py-2">Página de Reservas</h1>
          <p className="text-sm text-gray-500 mb-4">
            Informação com todas as reservas blá blá blá blá blá blá blá blá
            blá:
          </p>
          <div className="flex justify-end items-center mb-4">
            <label>
              Selecione o mês:
              <select
                className="py-2 bg-white cursor-pointer rounded mx-1"
                value={month}
                onChange={(e) => setMonth(Number(e.target.value))}
              >
                {monthNames.map((name, index) => (
                  <option key={index + 1} value={index + 1}>
                    {name}
                  </option>
                ))}
              </select>
            </label>

            <label>
              e ano:
              <input
                type="text"
                className="p-2 rounded bg-white cursor-pointer w-13 mx-1"
                value={year}
                onChange={(e) => setYear(Number(e.target.value))}
              ></input>
            </label>
          </div>

          {bookings.map((booking) => (
            <Card key={booking.id} booking={booking} />
          ))}

          <button
            // onClick={() => setIsModalOpen(true)}
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
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
    </>
  );
}
