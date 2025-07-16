import React from "react";
interface ButtonProps {
  onClick: () => void;
  label?: string;
}
export default function Button({ onClick, label }: ButtonProps) {
  return (
    <>
      <button
        onClick={onClick}
        className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-[var(--color-secondary)] hover:bg-[var(--color-secondary2)] text-white px-4 py-3 rounded-lg shadow-lg transition cursor-pointer"
      >
        <span className="text-sm font-medium">{label}</span>
      </button>
    </>
  );
}
