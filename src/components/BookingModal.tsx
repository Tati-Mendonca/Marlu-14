import { useState, useEffect } from "react";
import { createCustomer, searchCustomersByName } from "@/services/customer";
import { getAuth } from "firebase/auth";
import { Booking, BookingInput, BookingStatus } from "@/types/booking";
import { Customer } from "@/types/customer";
import { normalizeDate } from "@/utils/Date";
import { X } from "lucide-react";
import { createBooking, updateBooking } from "@/services/booking";
import toast from "react-hot-toast";
import { isCheckOutAfterCheckIn } from "@/utils/Validators";

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (booking: BookingInput) => void;
  bookingToEdit?: Booking | null;
}

export default function BookingModal({
  isOpen,
  onClose,
  onSave,
  bookingToEdit,
}: BookingModalProps) {
  const [customerName, setCustomerName] = useState("");
  const [customerId, setCustomerId] = useState("");
  const [suggestions, setSuggestions] = useState<Customer[]>([]);
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [price, setPrice] = useState<number>(0);
  const [status, setStatus] = useState<BookingStatus>("Reservado");

  const formatDate = (date: string | Date): string => {
    const d = typeof date === "string" ? new Date(date) : date;
    return d.toISOString().split("T")[0];
  };

  useEffect(() => {
    if (bookingToEdit) {
      setCustomerName(bookingToEdit.customerName);
      setCheckIn(formatDate(bookingToEdit.checkIn));
      setCheckOut(formatDate(bookingToEdit.checkOut));
      setPrice(bookingToEdit.price);
      setStatus(bookingToEdit.status);
      setCustomerId(bookingToEdit.customerId);
    } else {
      setCustomerId("");
      setCustomerName("");
      setCheckIn("");
      setCheckOut("");
      setPrice(0);
      setStatus("Reservado");
    }
  }, [bookingToEdit]);

  const handleCustomerSearch = async (name: string) => {
    setCustomerName(name);
    if (name.trim().length < 2) {
      setSuggestions([]);
      return;
    }
    const term = name.trim().toUpperCase();
    const results = await searchCustomersByName(term);
    setSuggestions(results);
    const exactMatch = results.find(
      (customer) => customer.name.toLowerCase() === name.trim().toLowerCase()
    );
    if (exactMatch) {
      setCustomerId(exactMatch.id);
    } else {
      setCustomerId("");
    }
  };

  const selectCustomer = (customer: Customer) => {
    setCustomerName(customer.name);
    setCustomerId(customer.id);
    setSuggestions([]);
  };

  const handleSubmit = async () => {
    if (!customerName.trim()) {
      toast.error("O nome do cliente é obrigatório.");
      return;
    }

    if (!checkIn || !checkOut) {
      toast.error("As datas de entrada e saída são obrigatórias.");
      return;
    }

    if (!isCheckOutAfterCheckIn(checkIn, checkOut)) {
      toast.error("A data de saída deve ser posterior à data de entrada.");
      return;
    }

    if (!price || isNaN(price) || price <= 0) {
      toast.error("O preço deve ser maior que zero.");
      return;
    }

    const auth = getAuth();
    const user = auth.currentUser;
    const userId = user?.uid || "usuario-desconhecido";
    const bookingByName = user?.displayName || user?.email || "desconhecido";

    const checkInDate = new Date(checkIn + "T00:00:00");
    const checkOutDate = new Date(checkOut + "T00:00:00");
    const diffInMs = checkOutDate.getTime() - checkInDate.getTime();
    const diffInDays = Math.max(
      Math.floor(diffInMs / (1000 * 60 * 60 * 24)),
      1
    );

    let finalCustomerId = customerId;

    if (!finalCustomerId) {
      try {
        const newCustomer = {
          name: customerName.trim(),
          document: "",
          phone: "",
          createdAt: new Date(),
        };

        const newCustomerId = await createCustomer(newCustomer);
        finalCustomerId = newCustomerId;
      } catch (err) {
        toast.error("Erro ao criar cliente automaticamente: " + err);
        return;
      }
    }

    if (!finalCustomerId) {
      toast.error("Erro: customerId está indefinido. Cancelando operação.");
      return;
    }

    const booking: BookingInput = {
      customerId: finalCustomerId,
      customerName: customerName.trim(),
      userId,
      bookingByName,
      checkIn: normalizeDate(checkIn),
      checkOut: normalizeDate(checkOut),
      price,
      days: diffInDays,
      status,
    };

    try {
      if (bookingToEdit && bookingToEdit.id) {
        await updateBooking(bookingToEdit.id, booking);
        onSave(booking);
      } else {
        await createBooking(booking);
      }

      toast.success("Reserva salva com sucesso!");
      onClose();
    } catch (err) {
      toast.error("Erro ao salvar reserva.");
      console.error(err);
    }
  };
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[var(--color-primary)] transition-opacity duration-300">
      <form
        method="dialog"
        className="bg-white p-6 rounded-2xl w-full max-w-md space-y-4"
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
      >
        <header className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold">
            {bookingToEdit ? "Editar Reserva" : "Cadastrar Reserva"}
          </h2>
          <button type="button" onClick={onClose} aria-label="Fechar">
            <X />
          </button>
        </header>

        <div className="relative">
          <label className="block">
            <span className="text-sm">Nome:</span>
            <input
              type="text"
              placeholder="Buscar cliente pelo nome"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-[var(--color-secondary)]"
              value={customerName}
              onChange={(e) => handleCustomerSearch(e.target.value)}
              disabled={!!bookingToEdit}
            />
          </label>

          {suggestions.length > 0 && (
            <ul className="absolute z-10 top-full left-0 right-0 bg-white border border-t-0 rounded-b shadow-md max-h-40 overflow-y-auto">
              {suggestions.map((customer) => (
                <li
                  key={customer.id}
                  className="p-2 hover:bg-gray-100 cursor-pointer"
                  onClick={() => selectCustomer(customer)}
                >
                  {customer.name}
                </li>
              ))}
            </ul>
          )}
        </div>

        <fieldset className="flex gap-4">
          <label className="flex-1 text-sm">
            Entrada
            <input
              type="date"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-[var(--color-secondary)]"
              value={checkIn}
              onChange={(e) => setCheckIn(e.target.value)}
            />
          </label>

          <label className="flex-1 text-sm">
            Saida
            <input
              type="date"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-[var(--color-secondary)]"
              value={checkOut}
              onChange={(e) => setCheckOut(e.target.value)}
            />
          </label>
        </fieldset>

        <fieldset className="flex gap-4">
          <label className="flex-1 text-sm">
            Preço
            <input
              type="text"
              placeholder="Valor total"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-[var(--color-secondary)]"
              value={price}
              onChange={(e) => setPrice(Number(e.target.value))}
            />
          </label>

          <label className="flex-1 text-sm">
            Status
            <select
              className="w-full px-4 py-2 border border-gray-300 rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-[var(--color-secondary)]"
              value={status}
              onChange={(e) => setStatus(e.target.value as BookingStatus)}
            >
              <option value="reservado">Reservado</option>
              <option value="pago">Pago</option>
              <option value="interessado">Interessado</option>
              <option value="cancelado">Cancelado</option>
            </select>
          </label>
        </fieldset>

        <footer className="flex justify-end">
          <button className="bg-[var(--color-secondary)] hover:bg-[var(--color-secondary2)] text-white px-4 py-2 rounded disabled:opacity-50">
            Salvar
          </button>
        </footer>
      </form>
    </div>
  );
}
