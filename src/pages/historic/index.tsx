"use client";

import React from "react";
import { useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";

import { Booking } from "@/types/booking";
import { db } from "@/config/firebase";
import HamburgerMenu from "@/components/HamburguerMenu";
import { normalizeDate } from "@/utils/Date";
import { withAuth } from "@/utils/Firebase-auth";
import toast from "react-hot-toast";

function HistoryPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    const term = searchTerm.trim().toUpperCase();

    if (!term) return;

    setLoading(true);
    try {
      const bookingsRef = collection(db, "bookings");

      const q = query(
        bookingsRef,
        where("customerName", ">=", term),
        where("customerName", "<=", term + "\uf8ff")
      );

      const snapshot = await getDocs(q);
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Booking[];

      setResults(data);
    } catch (error) {
      toast.error("Erro ao buscar reservas: " + error);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleSearch();
  };

  return (
    <>
      <HamburgerMenu />
      <main className="bg-[var(--color-primary)] pt-18 px-4 pb-8 h-screen">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-semibold py-2">Histórico</h1>
          <p className="text-sm text-gray-700 mb-4">
            Busque pelo histórico de reservas de cada cliente.
          </p>
        </div>

        <div className="p-4 max-w-md mx-auto">
          <div className="flex gap-2 mb-6">
            <input
              type="text"
              placeholder="Digite o nome do cliente"
              className=" p-2 w-full rounded-lg bg-white"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <button
              onClick={handleSearch}
              className="bg-[var(--color-secondary)] hover:bg-[var(--color-secondary2)] text-white px-4 py-2 rounded-lg"
            >
              Buscar
            </button>
          </div>

          {loading ? (
            <p>Carregando...</p>
          ) : results.length === 0 ? (
            <p>Nenhuma reserva encontrada.</p>
          ) : (
            <ul className="space-y-2">
              {results.map((booking) => (
                <li
                  key={booking.id}
                  className="p-4 rounded-lg bg-white shadow-sm"
                >
                  <header className="flex justify-between">
                    <span>{booking.customerName}</span>
                    <span>
                      R$ {Number(booking.price).toFixed(2).replace(".", ",")}
                    </span>
                  </header>
                  <hr className="mb-2" />

                  <section className="flex flex-row justify-between">
                    <p>
                      {normalizeDate(booking.checkIn).toLocaleDateString(
                        "pt-BR",
                        {
                          day: "2-digit",
                          month: "2-digit",
                        }
                      )}
                    </p>

                    <p>
                      <p className="text-sm">{booking.status.toUpperCase()}</p>
                    </p>
                    <p>Dias: {booking.days}</p>
                  </section>
                  <section className="flex flex-row justify-between">
                    <p>
                      {normalizeDate(booking.checkOut).toLocaleDateString(
                        "pt-BR",
                        {
                          day: "2-digit",
                          month: "2-digit",
                        }
                      )}
                    </p>

                    <p> {booking.bookingByName}</p>
                  </section>
                </li>
              ))}
            </ul>
          )}
        </div>
      </main>
    </>
  );
}
export default withAuth(HistoryPage);
