import { useEffect, useState } from "react";
import { getIdToken, onAuthStateChanged, User } from "firebase/auth";
import { doc, updateDoc } from "firebase/firestore";
import { useRouter } from "next/router";
import { auth, db } from "@/config/firebase";
import Sidebar from "@/components/Sidebar";
import { Search } from "lucide-react";

interface UserData {
  uid: string;
  name: string | null;
  email: string;
  role: string;
}

export default function UsersAdminPage() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [users, setUsers] = useState<UserData[]>([]);

  const [search, setSearch] = useState("");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) return router.push("/unauthorized");

      try {
        const token = await getIdToken(user);
        const response = await fetch("/api/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!response.ok) throw new Error("Unauthorized");

        const userData = await response.json();

        if (userData.role !== "admin") {
          router.push("/unauthorized");
        } else {
          setCurrentUser(user);
          fetchUsers();
        }
      } catch {
        router.push("/unauthorized");
      }
    });
    return () => unsubscribe();
  }, [router]);

  const fetchUsers = async () => {
    try {
      const response = await fetch("/api/users");
      if (!response.ok) throw new Error("Erro ao buscar usuários");

      const data: UserData[] = await response.json();
      setUsers(data);
    } catch (error) {
      console.error("Erro ao buscar usuários:", error);
    }
  };

  const toggleRole = async (uid: string, currentRole: string) => {
    const newRole = currentRole === "admin" ? "user" : "admin";
    const userRef = doc(db, "users", uid);
    await updateDoc(userRef, { role: newRole });
    fetchUsers();
  };

  const filteredUsers = users.filter((user) => {
    const searchLower = search.toLowerCase();
    return (
      (user.name && user.name.toLowerCase().includes(searchLower)) ||
      user.email.toLowerCase().includes(searchLower)
    );
  });

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <Sidebar />
      <div className="flex-1 bg-[var(--color-primary)] p-6">
        <h1 className="text-3xl font-bold mb-6">Gerenciamento de Usuários</h1>

        {/* Campo de busca */}
        <div className="mb-4 relative">
          {/* <label className="">Buscar:</label> */}
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
          <input
            type="text"
            placeholder="Pesquisar por nome ou id..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg  px-4 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-[var(--color-secondary)]"
          />
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full bg-white divide-y divide-gray-700 shadow-md rounded-xl">
            <thead className="bg-primary">
              <tr>
                <th className="py-3 px-4 text-left">Nome</th>
                <th className="py-3 px-4 text-left">Email</th>
                <th className="py-3 px-4 text-left">Função</th>
                <th className="py-3 px-4">Ações</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.uid}>
                  <td className="py-2 px-4">{user.name || "-"}</td>
                  <td className="py-2 px-4">{user.email}</td>
                  <td className="py-2 px-4 capitalize">{user.role}</td>
                  <td className="py-2 px-4 text-center">
                    {user.uid !== currentUser?.uid && (
                      <button
                        onClick={() => toggleRole(user.uid, user.role)}
                        className="bg-secondary text-white px-3 py-1 rounded hover:bg-blue-700"
                      >
                        Tornar {user.role === "admin" ? "User" : "Admin"}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
              {filteredUsers.length === 0 && (
                <tr>
                  <td className="py-2 px-4 text-center" colSpan={4}>
                    Nenhum usuário encontrado.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
