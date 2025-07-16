import React from "react";
import { Ban } from "lucide-react";

export default function Unauthorized() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-[var(--color-primary)] px-4">
      <div className=" text-center">
        <div className="flex justify-center mb-3">
          <Ban className="w-12 h-12 " />
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold mb-2">Acesso negado</h1>
        <p className="text-gray-700">
          Você não tem permissão para acessar esta página.
        </p>
      </div>
    </div>
  );
}
