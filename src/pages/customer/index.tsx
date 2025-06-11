import { useState } from "react";
import { createCustomer } from "@/services/customer";

export default function Customer() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleCreateCustomer = async () => {
    setLoading(true);
    setMessage("");

    try {
      await createCustomer({
        name: "João Silva",
        document: "123.456.789-00",
        phone: "(11) 91234-5678",
      });

      setMessage("Cliente criado com sucesso!");
    } catch (error) {
      setMessage("Erro ao criar cliente. Verifique o console.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[var(--color-primary)] flex flex-col items-center pt-28 px-4 pb-8 relative">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-semibold py-2">Cadastro de Clientes</h1>
        <p className="text-sm text-gray-500 mb-4">
          Informação de todos os clientes que já alugaram o apartamento:
        </p>

        <button
          onClick={handleCreateCustomer}
          disabled={loading}
          className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 disabled:opacity-50"
        >
          {loading ? "Salvando..." : "Criar Cliente de Teste"}
        </button>

        {message && <p className="mt-4 text-sm text-gray-700">{message}</p>}
      </div>
    </main>
  );
}
