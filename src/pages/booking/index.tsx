import { useCallback, useEffect, useState } from "react";
import BookingModal from "@/components/BookingModal";
import { createBooking, getBookingsByMonth } from "@/services/booking";
import { Booking, BookingInput } from "@/types/booking";
import { Card } from "@/components/Card";
import HamburgerMenu from "@/components/HamburguerMenu";
import { withAuth } from "@/utils/Firebase-auth";
import { toast } from "react-hot-toast";
import Button from "@/components/Button";

function BookingPage() {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [bookingToEdit, setBookingToEdit] = useState<Booking | null>(null);
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
        toast.error("Erro ao salvar reserva " + error);
      }
      setMessage("Erro ao salvar reserva.");
    }
  }, []);

  const handleEditBookingSubmit = async () => {
    try {
      setMessage("Reserva editada com sucesso!");

      const results = await getBookingsByMonth(year, month);
      setBookings(results);

      setIsModalOpen(false);
      setBookingToEdit(null);
    } catch (error) {
      if (process.env.NODE_ENV === "development") {
        toast.error("Erro ao editar reserva " + error);
      }
      setMessage("Erro ao editar reserva.");
    }
  };

  const handleEditBooking = (booking: Booking) => {
    setBookingToEdit(booking);
    setIsModalOpen(true);
  };

  useEffect(() => {
    async function fetchBookings() {
      const results = await getBookingsByMonth(year, month);
      setBookings(results);
    }

    fetchBookings();
  }, [month, year]);

  return (
    <>
      <HamburgerMenu />
      <main className="min-h-screen bg-[var(--color-primary)] flex flex-col items-center pt-18 px-4 pb-8">
        <div className="text-center w-[25em] mb-6">
          <h1 className="text-2xl font-semibold py-2">Localize Reservas</h1>
          <p className="text-sm text-gray-700 mb-4">
            Consulte reservas referentes a data selecionada abaixo.
          </p>
          <div className="flex justify-end items-center mb-4">
            <label>
              Mês:
              <select
                className="px-1 py-1 bg-white cursor-pointer rounded mx-2"
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
              Ano:
              <input
                type="text"
                className="px-2 py-1 rounded bg-white cursor-pointer w-13 mx-1"
                value={year}
                onChange={(e) => setYear(Number(e.target.value))}
              ></input>
            </label>
          </div>
          {message && <p className="my-4 text-sm text-gray-700">{message}</p>}

          {bookings.map((booking) => (
            <Card
              key={booking.id}
              booking={booking}
              onEdit={handleEditBooking}
            />
          ))}

          <Button onClick={() => setIsModalOpen(true)} label="Nova reserva" />
        </div>
        <BookingModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setBookingToEdit(null);
          }}
          onSave={bookingToEdit ? handleEditBookingSubmit : handleCreateBooking}
          bookingToEdit={bookingToEdit}
        />
      </main>
    </>
  );
}

export default withAuth(BookingPage);
