import { db } from "@/config/firebase";
import { Customer } from "@/types/customer";
import { collection, addDoc, query, where, getDocs } from "firebase/firestore";

export const createCustomer = async (customer: {
  name: string;
  document: string;
  phone: string;
}) => {
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