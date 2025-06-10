import { useEffect, useState } from "react";
import { getIdToken, onAuthStateChanged, User } from "firebase/auth";
import { useRouter } from "next/router";
import { auth } from "@/config/firebase";
import Sidebar from "@/components/Sidebar";
import { Search, UserRound, X } from "lucide-react";
import { ShieldUser } from "lucide-react";

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

  const toggleRole = async (uid: string, fromRole: string, toRole: string) => {
    const confirmChange = confirm(
      `Tem certeza que deseja alterar de ${fromRole.toUpperCase()} para ${toRole.toUpperCase()}?`
    );
    if (!confirmChange) return;

    try {
      const token = await currentUser?.getIdToken();
      const res = await fetch("/api/users/setRole", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ uid, newRole: toRole }),
      });

      if (!res.ok) throw new Error("Erro ao definir role");

      fetchUsers();
    } catch (error) {
      console.error("Erro ao atualizar role:", error);
    }
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
          <div className="rounded-xl overflow-hidden shadow-md">
            <table className="min-w-full bg-white divide-y divide-gray-700">
              <thead className="bg-gray-200">
                <tr>
                  <th className="py-3 px-4 text-left">Nome</th>
                  <th className="py-3 px-4 text-left">Email</th>
                  <th className="py-3 px-4 text-left">Função</th>
                  <th className="py-3 px-4 text-left">Atualizar</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user.uid}>
                    <td className="py-2 px-4">{user.name || "-"}</td>
                    <td className="py-2 px-4">{user.email}</td>
                    <td className="py-2 px-4 capitalize flex items-center gap-2">
                      {user.role === "admin" && (
                        <ShieldUser className="w-4 h-4" />
                      )}
                      {user.role === "user" && (
                        <UserRound className="w-4 h-4" />
                      )}
                      {user.role}
                    </td>
                    <td className="py-2 text-center">
                      {user.uid !== currentUser?.uid ? (
                        <div className="flex justify-center gap-2">
                          {user.role !== "admin" && (
                            <button
                              onClick={() =>
                                toggleRole(user.uid, "user", "admin")
                              }
                              className="px-3 capitalize flex items-center gap-2 cursor-pointer border-2 hover:border-[var(--color-secondary)] rounded"
                            >
                              <ShieldUser className="w-4 h-4" /> Admin
                            </button>
                          )}

                          {user.role === "admin" && (
                            <button
                              onClick={() =>
                                toggleRole(user.uid, "admin", "user")
                              }
                              className="px-3 capitalize flex items-center gap-2 cursor-pointer border-2 hover:border-[var(--color-secondary)] rounded"
                            >
                              <X className="w-4 h-4" /> Remover
                            </button>
                          )}
                        </div>
                      ) : (
                        <span className="text-gray-400 italic"></span>
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
    </div>
  );
}
