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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-md w-full max-w-md">
        <h2 className="text-lg font-semibold mb-4">
          {customerToEdit ? "Editar Cliente" : "Novo Cliente"}
        </h2>
        <input
          type="text"
          placeholder="Nome"
          className="w-full p-2 border mb-2"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="text"
          placeholder="Documento"
          className="w-full p-2 border mb-2"
          value={document}
          onChange={(e) => setDocument(e.target.value)}
        />
        <input
          type="text"
          placeholder="Telefone"
          className="w-full p-2 border mb-4"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
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
      </div>
    </div>
  );
}
