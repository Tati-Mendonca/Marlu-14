import { auth } from "@/config/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export function withAuth<T extends object>(Component: React.ComponentType<T>) {
  const AuthenticatedComponent = (props: T) => {
    const router = useRouter();
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(
      null
    );

    useEffect(() => {
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        if (user) {
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
          router.push("/unauthorized");
        }
      });
      return () => unsubscribe();
    }, [router]);

    if (isAuthenticated === null) {
      return (
        <div className="flex items-center justify-center h-screen">
          <p className="text-gray-500 text-lg">Verificando acesso...</p>
        </div>
      );
    }

    if (!isAuthenticated) {
      return null;
    }
    return <Component {...props} />;
  };

  return AuthenticatedComponent;
}
