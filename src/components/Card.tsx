"use client";

import { deleteBooking } from "@/services/booking";
import { Booking } from "@/types/booking";
import { normalizeDate } from "@/utils/Date";
import { Pencil, X } from "lucide-react";
import BookingModal from "./BookingModal";
import { useState } from "react";

type BookingCardProps = {
  booking: Booking;
};

export function Card({ booking }: BookingCardProps) {
  const { id, checkIn, checkOut, price, customerName, status } = booking;
  const [isModalOpen, setIsModalOpen] = useState(false);

  async function handleDelete() {
    const confirmed = confirm("Tem certeza que deseja excluir esta reserva?");
    if (!confirmed) return;

    try {
      await deleteBooking(id);
      alert("Reserva excluída com sucesso.");
      window.location.reload();
    } catch (err) {
      console.log("Erro ao excluir reserva.", err);
    }
  }

  return (
    <div className="w-full bg-white rounded-lg p-4 pt-2 mb-2 shadow-sm">
      <header className="flex justify-between">
        <span>{customerName}</span>
        <span>R$ {Number(price).toFixed(2).replace(".", ",")}</span>
      </header>
      <hr className="mb-2" />
      <section className="flex justify-between items-center text-sm text-gray-700">
        <ul>
          <li>
            {normalizeDate(checkIn).toLocaleDateString("pt-BR", {
              day: "2-digit",
              month: "2-digit",
            })}
          </li>
          <li>
            {normalizeDate(checkOut).toLocaleDateString("pt-BR", {
              day: "2-digit",
              month: "2-digit",
            })}
          </li>
        </ul>
        <span className="text-black text-sm">{status.toUpperCase()}</span>

        <div className="flex flex-col items-center justify-baseline">
          <Pencil
            className="size-[14px] text-sm cursor-pointer"
            onClick={() => setIsModalOpen(true)}
          />
          <X
            className="size-5 text-sm mt-1 cursor-pointer"
            onClick={handleDelete}
          />
        </div>
      </section>

      {isModalOpen && (
        <BookingModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSave={() => {
            setIsModalOpen(false);
            window.location.reload();
          }}
          bookingToEdit={booking}
        />
      )}
    </div>
  );
}
