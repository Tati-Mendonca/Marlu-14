import { useCallback, useState } from "react";
import BookingModal from "@/components/BookingModal";
import { createBooking } from "@/services/booking";
import { Booking } from "@/types/booking";

export default function BookingPage() {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");

  const handleCreateBooking = useCallback(async (booking: Booking) => {
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

  return (
    <main className="min-h-screen bg-[var(--color-primary)] flex flex-col items-center pt-28 px-4 pb-8 relative">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-semibold py-2">Página de Reservas</h1>
        <p className="text-sm text-gray-500 mb-4">
          Informação com todas as reservas:
        </p>

        <button
          onClick={() => setIsModalOpen(true)}
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
  );
}
