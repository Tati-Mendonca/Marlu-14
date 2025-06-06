import { ProtectedRoute } from "@/components/ProtectedRoute";
import Sidebar from "@/components/Sidebar";
import { useAuth } from "@/hooks/useAuth";
import Head from "next/head";

export default function Dashboard() {
  const { user } = useAuth();

  return (
    <ProtectedRoute>
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
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}
