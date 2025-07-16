import React from "react";
import { useEffect, useState } from "react";
import {
  createCustomer,
  deleteCustomer,
  getAllCustomers,
  updateCustomer,
} from "@/services/customer";
import { Customer, CustomerInput } from "@/types/customer";
import { ChevronLeft, ChevronRight, Pencil, Trash } from "lucide-react";
import CustomerModal from "@/components/CustomerModal";
import HamburgerMenu from "@/components/HamburguerMenu";
import { withAuth } from "@/utils/Firebase-auth";
import toast from "react-hot-toast";
import Button from "@/components/Button";

function CustomerPage() {
  const ITEMS_PER_PAGE = 10;
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [customerToEdit, setCustomerToEdit] = useState<Customer | null>(null);

  useEffect(() => {
    const fetchCustomers = async () => {
      const data = await getAllCustomers();
      setCustomers(data);
    };
    fetchCustomers();
  }, []);

  const totalPages = Math.ceil(customers.length / ITEMS_PER_PAGE);
  const paginatedCustomers = customers.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleEdit = (customer: Customer) => {
    setCustomerToEdit(customer);
    setIsModalOpen(true);
  };

  const handleSave = async (customer: CustomerInput & { id?: string }) => {
    try {
      if (customer.id) {
        await updateCustomer(customer.id, customer);
        setCustomers((prev) =>
          prev.map((c) => (c.id === customer.id ? { ...c, ...customer } : c))
        );
      } else {
        const id = await createCustomer(customer);
        const newCustomer: Customer = {
          id,
          ...customer,
          createdAt: new Date(),
        };

        setCustomers((prev) => [...prev, newCustomer]);
      }
    } catch (error) {
      toast.error("Erro ao salvar o cliente. Tente novamente! " + error);
    }
  };

  const handleDelete = async (id: string) => {
    const confirm = window.confirm(
      "Tem certeza que deseja excluir este cliente?"
    );
    if (!confirm) return;

    try {
      await deleteCustomer(id);
      setCustomers((prev) => prev.filter((c) => c.id !== id));
    } catch (error) {
      toast.error("Não foi possível excluir o cliente. " + error);
    }
  };

  return (
    <>
      <HamburgerMenu />
      <main className="min-h-screen bg-[var(--color-primary)] flex flex-col items-center pt-24 px-4 pb-8">
        <section className="w-full md:w-auto max-w-5xl">
          <header className="text-center mb-6">
            <h1 className="text-2xl font-semibold">Cadastro de Clientes</h1>
            <p className="text-sm text-gray-700 mt-1">
              Informações essenciais dos clientes que já alugaram o apartamento:
            </p>
          </header>

          <div className="overflow-x-auto bg-white shadow-md rounded-lg">
            <table className="min-w-full divide-y divide-gray-300 text-sm text-gray-700">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-6 py-3 font-semibold uppercase tracking-wider">
                    Nome
                  </th>
                  <th className="px-6 py-3 font-semibold uppercase tracking-wider">
                    Documento
                  </th>
                  <th className="px-6 py-3 font-semibold uppercase tracking-wider">
                    Telefone
                  </th>
                  <th className="px-6 py-3 font-semibold uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {paginatedCustomers.map((customer) => (
                  <tr key={customer.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      {customer.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {customer.document || "-"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {customer.phone || "-"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap flex gap-2">
                      <button
                        onClick={() => handleEdit(customer)}
                        className="hover:text-[var(--color-secondary2)]"
                        title="Editar"
                      >
                        <Pencil className="size-4 cursor-pointer" />
                      </button>
                      <button
                        onClick={() => handleDelete(customer.id)}
                        className="pl-1 hover:text-[var(--color-danger)]"
                        title="Excluir"
                      >
                        <Trash className="size-4 cursor-pointer" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-center gap-4 mt-6">
            <button
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              className="p-2 rounded hover:text-[var(--color-secondary2)] disabled:opacity-50"
              aria-label="Página anterior"
            >
              <ChevronLeft />
            </button>

            <span className="text-sm">
              Página {currentPage} de {totalPages}
            </span>

            <button
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="p-2 rounded hover:text-[var(--color-secondary2)] disabled:opacity-50"
              aria-label="Próxima página"
            >
              <ChevronRight />
            </button>
          </div>
        </section>
        <Button onClick={() => setIsModalOpen(true)} label="Nova Reserva" />
        <CustomerModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setCustomerToEdit(null);
          }}
          onSave={handleSave}
          customerToEdit={customerToEdit}
        />
      </main>
    </>
  );
}
export default withAuth(CustomerPage);
