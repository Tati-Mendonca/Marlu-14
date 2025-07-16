import React from "react";
import { AuthProvider } from "@/context/AuthContext";
import { Toaster } from "react-hot-toast";
import "@/styles/globals.css";
import type { AppProps } from "next/app";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      <Toaster position="top-center" />
      <Component {...pageProps} />
    </AuthProvider>
  );
}
