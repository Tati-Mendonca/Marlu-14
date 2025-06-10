import Sidebar from "@/components/Sidebar";
import { useAuth } from "@/hooks/useAuth";
import Head from "next/head";
import { useRoleProtection } from "../../hooks/useRoleProtection";

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

          <main className="flex-1 p-6 bg-[var(--color-primary)]">
            <div className="rounded-xl bg-white p-6 shadow-md">
              <h2 className="mb-4 text-lg font-semibold">Visão Geral</h2>
              <p>
                Este é um dashboard básico. Você pode começar a construir seus
                componentes aqui.
              </p>
            </div>
            <div className="flex gap-4 mt-4">
              <div className="flex-1 rounded-xl bg-white p-6 shadow-md">
                <h2 className="mb-4 text-lg font-semibold">Junho 2025</h2>
                <p>Total de aluguel: 0 </p>
              </div>
              <div className="flex flex-col justify-center items-center rounded-xl bg-white p-6 shadow-md">
                <h2 className="mb-4 text-lg font-semibold">01</h2>
                <p>Total de aluguel</p>
              </div>
              <div className="flex flex-col justify-center items-center rounded-xl bg-white p-6 shadow-md">
                <h2 className="mb-4 text-lg font-semibold">01</h2>
                <p>Total de aluguel</p>
              </div>
              <div className="flex flex-col justify-center items-center rounded-xl bg-white p-6 shadow-md">
                <h2 className="mb-4 text-lg font-semibold">01</h2>
                <p>Total de aluguel</p>
              </div>
            </div>
            {/* <div className="flex gap-4 mt-4">
              <div className="flex-1 rounded-xl bg-white p-6 shadow-md">
                <h2 className="mb-4 text-lg font-semibold">01</h2>
                <p>Total de aluguel</p>
              </div>
              <div className="flex-1 rounded-xl bg-white p-6 shadow-md">
                <h2 className="mb-4 text-lg font-semibold">01</h2>
                <p>Total de aluguel</p>
              </div>
              <div className="flex-1 rounded-xl bg-white p-6 shadow-md">
                <h2 className="mb-4 text-lg font-semibold">01</h2>
                <p>Total de aluguel</p>
              </div>
            </div> */}
          </main>
        </div>
      </div>
    </>
  );
}
