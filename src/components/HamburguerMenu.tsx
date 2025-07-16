import React from "react";
import { useState } from "react";
import {
  CalendarDays,
  ChartNoAxesCombined,
  GalleryVerticalEnd,
  LogOut,
  MapPin,
  Menu,
  UserPen,
  Users,
  X,
} from "lucide-react";
import Link from "next/link";

export default function HamburgerMenu() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {!isOpen && (
        <button
          className="fixed top-2 left-2 p-2 rounded-md z-50 hover:bg-gray-100 transition-all text"
          onClick={() => setIsOpen(true)}
          aria-label="Abrir menu"
        >
          <Menu size={24} />
        </button>
      )}

      {isOpen && (
        <div onClick={() => setIsOpen(false)} className="fixed inset-0" />
      )}

      <div
        className={`
      fixed top-0 left-0 h-full w-64 bg-[var(--color-secondary)] shadow-xl z-50 p-5
      transform transition-transform duration-300 ease-in-out
      ${isOpen ? "translate-x-0" : "-translate-x-full"}
    `}
      >
        <header className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2 text-primary">
            <MapPin className="w-6 h-6 stroke-[2.5]" />
            <h1 className="text-xl font-bold">Marlu 14</h1>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="text-gray-700 hover:text-black"
            aria-label="Fechar menu"
          >
            <X size={24} />
          </button>
        </header>
        <hr className="mb-4 mt-[-15px]" />
        <ul className="flex flex-col gap-2">
          {[
            {
              href: "/dashboard",
              icon: ChartNoAxesCombined,
              label: "Dashboard",
            },
            { href: "/historic", icon: GalleryVerticalEnd, label: "Histórico" },
            { href: "/booking", icon: CalendarDays, label: "Reservas" },
            { href: "/customer", icon: Users, label: "Clientes" },
            { href: "/", icon: UserPen, label: "Perfil" },
            { href: "/", icon: LogOut, label: "Sair" },
          ].map(({ href, icon: Icon, label }) => (
            <li key={label}>
              <Link
                href={href}
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-white/10 transition-colors "
              >
                <Icon className="w-5 h-5" />
                <span>{label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
