import { useAuth } from "@/context/AuthContext";
import { logout } from "@/services/auth";
import {
  CalendarDays,
  ChartNoAxesCombined,
  GalleryVerticalEnd,
  Lock,
  LogOut,
  UserPen,
  Users,
} from "lucide-react";
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
    <aside className="hidden w-64 flex-col bg-[var(--color-secondary)] p-5 shadow-lg md:flex">
      <header className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2 text-primary">
          <MapPin className="w-6 h-6 stroke-[2.5]" />
          <h1 className="text-xl font-bold">Marlu 14</h1>
        </div>
      </header>
      <hr className="mb-4 mt-[-15px] " />

      <ul className="flex flex-col gap-2">
        <li className="flex items-center gap-3 px-3 rounded-md hover:bg-white/10 transition-colors ">
          <ChartNoAxesCombined className="w-4 h-4" />
          <Link
            href="/dashboard"
            className="block rounded-lg py-2 hover:bg-muted"
          >
            Dashboard
          </Link>
        </li>

        <li className="flex items-center gap-3 px-3 rounded-md hover:bg-white/10 transition-colors ">
          <GalleryVerticalEnd className="w-4 h-4" />
          <Link
            href="/historic"
            className="block rounded-lg py-2 hover:bg-muted"
          >
            Histórico
          </Link>
        </li>
        <li className="flex items-center gap-3 px-3 rounded-md hover:bg-white/10 transition-colors ">
          <CalendarDays className="w-4 h-4" />
          <Link
            href="/booking"
            className="block rounded-lg py-2 hover:bg-muted"
          >
            Reservas
          </Link>
        </li>
        <li className="flex items-center gap-3 px-3 rounded-md hover:bg-white/10 transition-colors ">
          <Users className="w-4 h-4" />
          <Link
            href="/customer"
            className="block rounded-lg py-2 hover:bg-muted"
          >
            Clientes
          </Link>
        </li>
        <div className="flex items-center gap-3 px-3 rounded-md hover:bg-white/10 transition-colors ">
          {role === "admin" && (
            <>
              <Lock className="w-4 h-4" />
              <Link
                href="/admin/users"
                className="block rounded-lg py-2 hover:bg-muted"
              >
                Admin
              </Link>
            </>
          )}
        </div>
        <li className="flex items-center gap-3 px-3 rounded-md hover:bg-white/10 transition-colors ">
          <UserPen className="w-4 h-4" />
          <Link href="" className="block rounded-lg py-2 hover:bg-muted">
            Perfil
          </Link>
        </li>

        <li className="flex items-center gap-3 px-3 rounded-md hover:bg-white/10 transition-colors ">
          <LogOut className="w-4 h-4" />
          <Link href="/" onClick={handleLogout}>
            <span className="block py-2 rounded">Sair</span>
          </Link>
        </li>
      </ul>
    </aside>
  );
}
