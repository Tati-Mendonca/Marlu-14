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
          <header className="flex items-center justify-between border-b border-[var(--color-muted)] bg-[var(--color-light)] px-4 py-3 sm:px-6 sm:py-4 shadow-sm">
            <h1 className="text-lg sm:text-xl font-semibold">
              Bem-vinda, {user?.displayName || user?.email?.split("@")[0]}!
            </h1>
          </header>
          <main className="flex flex-col flex-1 justify-between p-4 sm:p-6 bg-[var(--color-primary)]">
            <div className="space-y-4">
              <div className="rounded-xl bg-white p-4 sm:p-6 shadow-md">
                <h2 className="mb-2 sm:mb-4 text-base sm:text-lg font-semibold">
                  Visão Geral
                </h2>
                <p className="text-sm">
                  Este é um dashboard com algumas informações importantes sobre
                  o seu apartamento 14 no Edificio Marlu II.
                </p>
              </div>

              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
                <div className="rounded-xl bg-white p-6 shadow-md lg:col-span-3">
                  <h2 className="mb-4 text-xl font-semibold">
                    Ano: {currentYear}
                  </h2>
                  <p>Dias alugados: {totalDays}</p>
                </div>

                <div className="rounded-xl bg-white p-6 shadow-md text-center lg:col-span-1 flex flex-col justify-center items-center">
                  <h2 className="mb-4 text-xl font-semibold">
                    {totalBookings}
                  </h2>
                  <p className="text-sm">Total de reservas</p>
                </div>

                <div className="rounded-xl bg-white p-6 shadow-md text-center lg:col-span-1 flex flex-col justify-center items-center">
                  <h2 className="mb-4 text-xl font-semibold">
                    {totalCustomers}
                  </h2>
                  <p className="text-sm">Total de clientes</p>
                </div>

                <div className="rounded-xl bg-white p-6 shadow-md text-center lg:col-span-1 flex flex-col justify-center items-center">
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

            {message && (
              <div className="flex justify-center mt-4">
                <p className="text-lg text-gray-700 transition-opacity duration-500">
                  {message}
                </p>
              </div>
            )}

            <div className="mt-6 flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => setBookingModalOpen(true)}
                className="w-full sm:w-auto flex-1 flex justify-center items-center border-2 rounded-xl bg-[var(--color-secondary)] text-white hover:bg-[var(--color-secondary2)] outline-none transition px-6 py-4 shadow-md text-center text-lg font-semibold"
              >
                Nova Reserva
              </button>

              <button
                onClick={() => setCustomerModalOpen(true)}
                className="w-full sm:w-auto flex-1 flex justify-center items-center border-2 rounded-xl bg-[var(--color-secondary)] text-white hover:bg-[var(--color-secondary2)] outline-none transition px-6 py-4 shadow-md text-center text-lg font-semibold"
              >
                Novo Cliente
              </button>

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
