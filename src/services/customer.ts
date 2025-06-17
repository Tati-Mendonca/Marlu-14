import { db } from "@/config/firebase";
import { Customer, CustomerInput } from "@/types/customer";
import { collection, addDoc, query, where, getDocs, deleteDoc, doc, updateDoc } from "firebase/firestore";

export const createCustomer = async (customer: CustomerInput) => {
  try {
    const customerRef = await addDoc(collection(db, "customers"), {
      name: customer.name,
      document: customer.document,
      phone: customer.phone,
      createdAt: new Date(),
    });

    return customerRef.id;
  } catch (error) {
    console.error("Erro ao salvar cliente:", error);
    throw error;
  }
};

export async function updateCustomer( customerId: string, input: CustomerInput ): Promise<void> {
  const docRef = doc(db, "customers", customerId);
  await updateDoc(docRef, {
    name: input.name,
    document: input.document,
    phone: input.phone,
  });
}

export const searchCustomersByName = async (name: string): Promise<Customer[]> => {
  const q = query(
    collection(db, "customers"),
    where("name", ">=", name),
    where("name", "<=", name + "\uf8ff")
  );

  const snapshot = await getDocs(q);

  return snapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      id: doc.id,
      name: data.name,
      document: data.document,
      phone: data.phone,
      createdAt: data.createdAt.toDate(), 
    };
  });
}

export const getTotalCustomers = async (): Promise<number> => {
  const querySnapshot = await getDocs(collection(db, "customers"));
  return querySnapshot.size;
};

export const getAllCustomers = async (): Promise<Customer[]> => {
  const snapshot = await getDocs(collection(db, "customers"));
  const customers: Customer[] = [];

  snapshot.forEach((doc) => {
    const data = doc.data();
    customers.push({
      id: doc.id,
      name: data.name || "",
      document: data.document || "",
      phone: data.phone || "",
      createdAt: data.createdAt?.toDate?.() || null,
    });
  });
  customers.sort((a, b) => a.name.localeCompare(b.name, "pt-BR"));
  return customers;
};

export async function deleteCustomer(customerId: string): Promise<void> {
  try {
    const customerRef = doc(db, "customers", customerId);
    await deleteDoc(customerRef);
  } catch (error) {
    console.error("Erro ao deletar cliente:", error);
    throw error;
  }
}