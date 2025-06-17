import Head from "next/head";
import { useDashboardData } from "@/hooks/useDashboardData";
import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import BookingModal from "@/components/BookingModal";
import CustomerModal from "@/components/CustomerModal";
import { useAuth } from "@/hooks/useAuth";

export default function Dashboard() {
  const { user } = useAuth();
  const [isBookingModalOpen, setBookingModalOpen] = useState(false);
  const [isCustomerModalOpen, setCustomerModalOpen] = useState(false);

  const currentYear = new Date().getFullYear();
  const {
    totalBookings,
    totalCustomers,
    totalRevenue,
    totalDays,
    message,
    handleCreateBooking,
    handleCreateCustomer,
  } = useDashboardData(currentYear);

  return (
    <>
      <Head>
        <title>Dashboard | Marlu 14</title>
      </Head>
      <div className="flex min-h-screen bg-background text-foreground">
        <Sidebar />

        <div className="flex flex-1 flex-col">
          <header className="flex items-center justify-between border-b border-[var(--color-muted)] border-muted bg-[var(--color-light)] px-6 py-4 shadow-sm">
            <h1 className="text-xl font-semibold">
              Bem-vinda, {user?.displayName || user?.email?.split("@")[0]}!
            </h1>
          </header>
          <main className="flex flex-col flex-1 justify-between p-6 bg-[var(--color-primary)]">
            <div>
              <div className="rounded-xl bg-white p-6 shadow-md">
                <h2 className="mb-4 text-lg font-semibold">Visão Geral</h2>
                <p>
                  Este é um dashboard com algumas informações importantes sobre
                  o seu apartamento 14 no Edificio Marlu II.
                </p>
              </div>
              <div className="flex gap-4 mt-4">
                <div className="flex-1 rounded-xl bg-white p-6 shadow-md">
                  <h2 className="mb-4 text-xl font-semibold">
                    Ano: {currentYear}
                  </h2>
                  <p>Dias alugados: {totalDays} </p>
                </div>
                <div className="flex flex-col justify-center items-center rounded-xl bg-white p-6 shadow-md">
                  <h2 className="mb-4 text-xl font-semibold">
                    {totalBookings}
                  </h2>
                  <p className="text-sm">Total de reservas</p>
                </div>
                <div className="flex flex-col justify-center items-center rounded-xl bg-white p-6 shadow-md">
                  <h2 className="mb-4 text-xl font-semibold">
                    {totalCustomers}
                  </h2>
                  <p className="text-sm">Total de clientes</p>
                </div>
                <div className="flex flex-col justify-center items-center rounded-xl bg-white p-6 shadow-md">
                  <h2 className="mb-4 text-xl font-semibold">
                    {totalRevenue.toLocaleString("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    })}
                  </h2>
                  <p className="text-sm">Receita do ano</p>
                </div>
              </div>
            </div>
            <div className="flex justify-center">
              {message && (
                <p className="mt-4 text-2xl text-gray-700 transition-opacity duration-500">
                  {message}
                </p>
              )}
            </div>

            <div className="flex gap-4">
              <div className="flex-1 border-2 rounded-xl bg-white p-3 shadow-md text-center">
                <button
                  onClick={() => setBookingModalOpen(true)}
                  className="px-46 py-2"
                >
                  Nova Reserva
                </button>
              </div>
              <div className="flex-1 border-2 rounded-xl bg-white p-3 shadow-md text-center">
                <button
                  onClick={() => setCustomerModalOpen(true)}
                  className="px-46 py-2"
                >
                  Novo Cliente
                </button>
              </div>
              <BookingModal
                isOpen={isBookingModalOpen}
                onClose={() => setBookingModalOpen(false)}
                onSave={handleCreateBooking}
              />
              <CustomerModal
                isOpen={isCustomerModalOpen}
                onClose={() => setCustomerModalOpen(false)}
                onSave={handleCreateCustomer}
              />
            </div>
          </main>
        </div>
      </div>
    </>
  );
}
