import React from "react";
import { isPhoneValid, isValidCPF } from "@/utils/Validators";
import { X } from "lucide-react";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { IMaskInput } from "react-imask";

interface Customer {
  id?: string;
  name: string;
  document: string;
  phone: string;
}

interface CustomerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (customer: Customer) => void;
  customerToEdit?: Customer | null;
}

export default function CustomerModal({
  isOpen,
  onClose,
  onSave,
  customerToEdit,
}: CustomerModalProps) {
  const [name, setName] = useState("");
  const [document, setDocument] = useState("");
  const [phone, setPhone] = useState("");

  useEffect(() => {
    if (customerToEdit) {
      setName(customerToEdit.name);
      setDocument(customerToEdit.document);
      setPhone(customerToEdit.phone);
    } else {
      setName("");
      setDocument("");
      setPhone("");
    }
  }, [customerToEdit]);

  const handleSubmit = () => {
    if (document && !isValidCPF(document)) {
      toast.error("CPF inválido!");
      return;
    }

    if (phone && !isPhoneValid(phone)) {
      toast.error("Telefone inválido. Digite um número completo.");
      return;
    }

    if (!document && !phone) {
      return;
    }

    onSave({
      id: customerToEdit?.id,
      name,
      document,
      phone,
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[var(--color-primary)] px-2 sm:px-4">
      <form className="bg-white p-6 rounded-2xl w-full max-w-md space-y-4">
        <header className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold">
            {customerToEdit ? "Editar Cliente" : "Novo Cliente"}
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
              placeholder="Nome"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-[var(--color-secondary)]"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </label>
          <label className="flex-1 text-sm">
            <span className="text-sm">Documento:</span>
            <IMaskInput
              mask="000.000.000-00"
              placeholder="Ex: 000.000.000-00"
              value={document}
              onAccept={(value) => setDocument(value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-[var(--color-secondary)]"
            />
          </label>

          <label className="flex-1 text-sm">
            <span className="text-sm">Telefone:</span>
            <IMaskInput
              mask="(00) 00000-0000"
              value={phone}
              onAccept={(value: string) => setPhone(value)}
              placeholder="Ex: (11) 91234-5678"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-[var(--color-secondary)]"
            />
          </label>
        </div>

        <div className="flex justify-end gap-2">
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded"
            onClick={handleSubmit}
          >
            Salvar
          </button>
        </div>
      </form>
    </div>
  );
}
