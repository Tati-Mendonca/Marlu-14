import { useAuth } from "@/context/AuthContext";
import { logout } from "@/services/auth";
import { MapPin } from "lucide-react";
import Link from "next/link";
import router from "next/router";

export default function Sidebar() {
  const { role } = useAuth();

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };
  return (
    <aside className="hidden w-64 flex-col bg-[var(--color-secondary)] p-4 shadow-lg md:flex">
      <header className="flex items-center gap-2 text-primary mb-6">
        <MapPin className="w-6 h-6 stroke-[2.5]" />
        <h1 className="text-2xl font-semibold">Marlu 14</h1>
      </header>

      <nav className="space-y-1">
        <Link href="/dashboard" className="block rounded-lg p-2 hover:bg-muted">
          Dashboard
        </Link>
        <Link href="/booking" className="block rounded-lg p-2 hover:bg-muted">
          Relatórios
        </Link>
        {role === "admin" && (
          <Link
            href="/admin/users"
            className="block rounded-lg p-2 hover:bg-muted"
          >
            Usuários
          </Link>
        )}
        <Link href="/client" className="block rounded-lg p-2 hover:bg-muted">
          Perfil
        </Link>
      </nav>

      <button
        onClick={handleLogout}
        className="mt-auto rounded-lg bg-primary px-4 py-2 border bg-[var(--color-primary)] hover:bg-[var(--color-mutedark)] font-bold"
      >
        Sair
      </button>
    </aside>
  );
}
