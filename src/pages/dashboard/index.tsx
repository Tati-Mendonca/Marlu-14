import Sidebar from "@/components/Sidebar";
import { useAuth } from "@/hooks/useAuth";
import Head from "next/head";
import { useRoleProtection } from "../../hooks/useRoleProtection";
import Link from "next/link";

export default function Dashboard() {
  const { user } = useAuth();
  const { loading, authorized } = useRoleProtection(["admin", "user"]);

  if (loading) return <p>Verificando permissões...</p>;
  if (!authorized) return null;

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
                  <h2 className="mb-4 text-xl font-semibold">Junho 2025</h2>
                  <p>Dias alugados: 0 </p>
                </div>
                <div className="flex flex-col justify-center items-center rounded-xl bg-white p-6 shadow-md">
                  <h2 className="mb-4 text-xl font-semibold">01</h2>
                  <p className="text-sm">Total de alugueis</p>
                </div>
                <div className="flex flex-col justify-center items-center rounded-xl bg-white p-6 shadow-md">
                  <h2 className="mb-4 text-xl font-semibold">01</h2>
                  <p className="text-sm">Total de clientes</p>
                </div>
                <div className="flex flex-col justify-center items-center rounded-xl bg-white p-6 shadow-md">
                  <h2 className="mb-4 text-xl font-semibold">R$ 100,00</h2>
                  <p className="text-sm">Receita do ano</p>
                </div>
              </div>
            </div>

            <div className="flex gap-4 mt-6">
              <div className="flex-1 border-2 rounded-xl bg-white p-6 shadow-md text-center">
                <Link href="/booking" className="px-47 py-5">
                  Reserva
                </Link>
              </div>
              <div className="flex-1 border-2 rounded-xl bg-white p-6 shadow-md text-center">
                <Link href="/customer" className="px-47 py-5">
                  Cliente
                </Link>
              </div>
            </div>
          </main>
        </div>
      </div>
    </>
  );
}
