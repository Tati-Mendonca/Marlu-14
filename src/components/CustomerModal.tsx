import { X } from "lucide-react";
import { useState, useEffect } from "react";

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

  // Preenche os campos se estiver editando
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[var(--color-primary)] transition-opacity duration-300">
      <form className="bg-white p-6 rounded-2xl w-full max-w-md space-y-4">
        <header className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold">
            {customerToEdit ? "Editar Cliente" : "Novo Cliente"}
          </h2>
          <button type="button" onClick={onClose} aria-label="Fechar">
            <X />
          </button>
        </header>
        <div
          className="relative flex flex-col
         gap-3"
        >
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
            <input
              type="text"
              placeholder="Ex: 000.000.000-00"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-[var(--color-secondary)]"
              value={document}
              onChange={(e) => setDocument(e.target.value)}
            />
          </label>

          <label className="flex-1 text-sm">
            <span className="text-sm">Telefone:</span>
            <input
              type="text"
              placeholder="Ex: 9999-9999"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-[var(--color-secondary)]"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </label>
        </div>

        <div className="flex justify-end gap-2">
          <button className="bg-gray-300 px-4 py-2 rounded" onClick={onClose}>
            Cancelar
          </button>
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
