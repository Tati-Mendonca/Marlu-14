import { useState } from "react";
import { login, loginWithGoogle } from "@/services/auth";
import { useRouter } from "next/router";
import Image from "next/image";
import { MapPin } from "lucide-react";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const { error } = await login(email, password);
    setLoading(false);

    if (error) {
      setError(error);
      return;
    }
    router.push("/dashboard");
  };

  const handleGoogleLogin = async () => {
    setError("");
    setLoading(true);
    const { error } = await loginWithGoogle();
    setLoading(false);
    if (error) {
      setError(error);
      return;
    }

    router.push("/dashboard");
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[var(--color-primary)]">
      <div className="w-full max-w-max p-8 bg-white rounded-2xl shadow-lg">
        <div className="flex items-center justify-center gap-2 text-primary mb-6">
          <MapPin className="w-6 h-6 stroke-[2.5] stroke-[var(--color-secondary)]" />
          <h1 className="text-2xl font-semibold">Marlu 14</h1>
        </div>
        <form onSubmit={handleLogin} className="space-y-2">
          <div>
            <label className="relative bg-white ml-2 px-0.5 text-gray-700 block mb-[-10px] text-sm font-foreground w-9.5">
              Email
            </label>
            <input
              type="email"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-[var(--color-secondary)]"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="relative bg-white ml-2 px-0.5 text-gray-700 block mb-[-10px] text-sm font-foreground w-10.5">
              Senha
            </label>
            <input
              type="password"
              className="w-full px-4 py-2 mb-2 border  border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-secondary)]"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {error && <p className="text-sm text-red-500">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className={`flex w-full items-center justify-center gap-2 rounded-lg border border-muted bg-[var(--color-secondary)] text-white px-4 py-2 text-foreground hover:bg-[var(--color-secondary2)] ${
              loading ? "opacity-60 cursor-not-allowed" : ""
            }`}
          >
            Entrar
          </button>
        </form>

        <div className="my-2 flex items-center">
          <div className="flex-grow border-t border-gray-300"></div>
          <span className="mx-4 text-gray-500">ou</span>
          <div className="flex-grow border-t border-gray-300"></div>
        </div>
        <button
          onClick={handleGoogleLogin}
          className="w-full py-2 px-4 border border-gray-300 rounded-lg flex items-center justify-center hover:bg-gray-100"
        >
          <Image
            src="/google.svg"
            width={20}
            height={20}
            className="mr-2"
            alt="Google"
          />
          {loading ? "Carregando..." : "Entrar com Google"}
        </button>
      </div>
    </div>
  );
}
