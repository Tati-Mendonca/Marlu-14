import { useState } from "react";
import { Menu, X } from "lucide-react";
import Link from "next/link";

export default function HamburgerMenu() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        className={`absolute p-4 transition-opacity ${isOpen ? "hidden" : ""}`}
        onClick={() => setIsOpen(true)}
        aria-label="Abrir menu"
      >
        <Menu size={24} />
      </button>

      {isOpen && <div onClick={() => setIsOpen(false)} />}
      <div
        className={`
          fixed top-0 left-0 h-full w-64 bg-[var(--color-secondary)] shadow-lg z-50 p-2
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        <button
          onClick={() => setIsOpen(false)}
          className="absolute top-4 right-4 text-gray-700 hover:text-black"
          aria-label="Fechar menu"
        >
          <X size={24} />
        </button>

        <ul className="flex flex-col mt-16 space-y-4">
          <li>
            <Link href="/dashboard" onClick={() => setIsOpen(false)}>
              <span className="block px-4 py-2 hover:bg-gray-100 rounded">
                Dashboard
              </span>
            </Link>
          </li>
          <li>
            <Link href="/customer" onClick={() => setIsOpen(false)}>
              <span className="block px-4 py-2 hover:bg-gray-100 rounded">
                Clientes
              </span>
            </Link>
          </li>
          <li>
            <Link href="/booking" onClick={() => setIsOpen(false)}>
              <span className="block px-4 py-2 hover:bg-gray-100 rounded">
                Reservas
              </span>
            </Link>
          </li>
          <li>
            <Link href="/history" onClick={() => setIsOpen(false)}>
              <span className="block px-4 py-2 hover:bg-gray-100 rounded">
                Histórico
              </span>
            </Link>
          </li>
          <li>
            <Link href="/" onClick={() => setIsOpen(false)}>
              <span className="block px-4 py-2 hover:bg-gray-100 rounded">
                Sair
              </span>
            </Link>
          </li>
        </ul>
      </div>
    </>
  );
}
