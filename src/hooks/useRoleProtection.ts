import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../config/firebase";
import { getUserRole } from "../services/user"

export function useRoleProtection(allowedRoles: string[] = []) {
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        router.push("/login");
        return;
      }

      const role = await getUserRole(user.uid);

      if (role && allowedRoles.includes(role)) {
        setAuthorized(true);
      } else {
        router.push("/unauthorized");
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return { loading, authorized };
}
