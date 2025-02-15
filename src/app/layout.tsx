"use client";
import "@/styles/tailwind.css";
import Header from "./components/Header";
import { useAuthStore } from "./store/authStore";
import { useEffect } from "react";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const { checkAuth, theme } = useAuthStore();

  // 🔥 Ensure Zustand state is initialized correctly
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);



  return (
    <html lang="en" data-theme={theme}>
      <body className="bg-background text-foreground">
        <Header />
        <main>{children}</main>
      </body>
    </html>
  );
}
