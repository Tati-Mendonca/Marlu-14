import { useState, useEffect } from "react";
import { searchCustomersByName } from "@/services/customer";
import { getAuth } from "firebase/auth";
import { Booking, BookingStatus } from "@/types/booking";
import { Customer } from "@/types/customer";

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (booking: Booking) => void;
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
  const [days, setDays] = useState(0);
  const [status, setStatus] = useState<BookingStatus>("reservado");

  const formatDate = (date: string | Date): string => {
    const d = typeof date === "string" ? new Date(date) : date;
    return d.toISOString().split("T")[0];
  };

  useEffect(() => {
    if (bookingToEdit) {
      setCustomerId(bookingToEdit.customerId);
      setCustomerName("Cliente selecionado");
      setCheckIn(formatDate(bookingToEdit.checkIn));
      setCheckOut(formatDate(bookingToEdit.checkOut));
      setPrice(bookingToEdit.price);
      setDays(bookingToEdit.days);
      setStatus(bookingToEdit.status);
    } else {
      setCustomerId("");
      setCustomerName("");
      setCheckIn("");
      setCheckOut("");
      setPrice(0);
      setDays(0);
      setStatus("reservado");
    }
  }, [bookingToEdit]);

  const handleCustomerSearch = async (name: string) => {
    setCustomerName(name);
    if (name.length >= 2) {
      const results = await searchCustomersByName(name);
      setSuggestions(results);
    } else {
      setSuggestions([]);
    }
  };

  const selectCustomer = (customer: Customer) => {
    setCustomerName(customer.name);
    setCustomerId(customer.id);
    setSuggestions([]);
  };

  const handleSubmit = () => {
    const auth = getAuth();
    const userId = auth.currentUser?.uid || "usuario-desconhecido";

    const booking: Booking = {
      id: bookingToEdit?.id,
      customerId,
      userId,
      checkIn: new Date(checkIn),
      checkOut: new Date(checkOut),
      price,
      days,
      status,
    };

    onSave(booking);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-md w-full max-w-md">
        <h2 className="text-lg font-semibold mb-4">
          {bookingToEdit ? "Editar Reserva" : "Nova Reserva"}
        </h2>
        <div className="relative mb-2">
          <label>
            Nome:
            <input
              type="text"
              placeholder="Buscar cliente pelo nome"
              className="w-full p-2 border"
              value={customerName}
              onChange={(e) => handleCustomerSearch(e.target.value)}
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
        <div className="flex gap-4">
          <label>
            Data de Entrada:
            <input
              type="date"
              className="w-full p-2 border mb-2"
              value={checkIn}
              onChange={(e) => setCheckIn(e.target.value)}
            />
          </label>
          <label>
            Data de Saida:
            <input
              type="date"
              className="w-full p-2 border mb-2"
              value={checkOut}
              onChange={(e) => setCheckOut(e.target.value)}
            />
          </label>
        </div>
        <div className="flex gap-4">
          <label>
            Preço:
            <input
              type="string"
              placeholder="Valor total"
              className="w-full p-2 border mb-2"
              value={price}
              onChange={(e) => setPrice(Number(e.target.value))}
            />
          </label>

          <label>
            Status:
            <select
              className="w-full p-2 border mb-4"
              value={status}
              onChange={(e) => setStatus(e.target.value as BookingStatus)}
            >
              <option value="reservado">Reservado</option>
              <option value="pago">Pago</option>
              <option value="interessado">Interessado</option>
              <option value="cancelado">Cancelado</option>
            </select>
          </label>
        </div>

        <div className="flex justify-end gap-2">
          <button className="bg-gray-300 px-4 py-2 rounded" onClick={onClose}>
            Cancelar
          </button>
          <button
            className="bg-green-600 text-white px-4 py-2 rounded"
            onClick={handleSubmit}
            disabled={!customerId}
          >
            Salvar
          </button>
        </div>
      </div>
    </div>
  );
}
