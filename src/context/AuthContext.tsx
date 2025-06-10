"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth, db } from "@/config/firebase";
import { doc, getDoc } from "firebase/firestore";

type AuthContextType = {
  user: User | null;
  role: string | null;
  loading: boolean;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  role: null,
  loading: true,
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUser(user);
        try {
          // Garante token atualizado com custom claims
          const idTokenResult = await user.getIdTokenResult(true);

          const customRole = idTokenResult.claims?.role ?? null;
          console.log("🔥 Custom Claim role:", customRole);

          // Pega role do Firestore como fallback
          let firestoreRole: string | null = null;
          try {
            const userDoc = await getDoc(doc(db, "users", user.uid));
            firestoreRole = userDoc.data()?.role ?? null;
            console.log("📦 Firestore role:", firestoreRole);
          } catch (e) {
            console.warn("Erro ao buscar role do Firestore:", e);
          }

          const finalRole = customRole || firestoreRole || "user";

          setRole(typeof finalRole === "string" ? finalRole : null);
        } catch (err) {
          console.error("Erro ao obter token/result:", err);
          setRole(null);
        }
      } else {
        setUser(null);
        setRole(null);
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, role, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
