import { logout } from "@/lib/auth";
import router from "next/router";

export default function Sidebar() {
  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };
  return (
    <aside className="hidden w-64 flex-col bg-[var(--color-secondary)] p-4 shadow-lg md:flex">
      <div className="mb-3 text-2xl p-2 font-bold">Marlu 14</div>
      <nav className="space-y-1">
        <a href="/dashboard" className="block rounded-lg p-2 hover:bg-muted">
          Dashboard
        </a>
        <a href="/booking" className="block rounded-lg p-2 hover:bg-muted">
          Relatórios
        </a>
        <a href="/client" className="block rounded-lg p-2 hover:bg-muted">
          Perfil
        </a>
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
