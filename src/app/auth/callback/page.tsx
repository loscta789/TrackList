"use client";

import React, { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { useAuthStore } from "@/app/store/authStore"
export default function AuthCallback() {
  const [status, setStatus] = useState<"loading" | "error" | "success">("loading");
  const [errorMessage, setErrorMessage] = useState("");
  const { checkAuth} = useAuthStore();


  useEffect(() => {
    const handleAuthCallback = async () => {
      const hash = window.location.hash.substring(1); // 🔹 Remove "#"
      const params = new URLSearchParams(hash);
      const accessToken = params.get("access_token");
      const refreshToken = params.get("refresh_token");
  
      if (!accessToken) {
        setStatus("error");
        setErrorMessage("Aucun token d'accès trouvé");
        return;
      }
  
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/callback`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ accessToken, refreshToken }),
          credentials: "include",
        });
  
        if (!response.ok) {
          throw new Error("Erreur lors de l'envoi du token");
        }
  
        setStatus("success");
  
        // ✅ Ensure Zustand updates before redirecting
        await checkAuth(); 
  
        // ✅ Redirect after Zustand state is updated
        window.location.href = "/";
        
      } catch (error) {
        console.error("❌ Erreur d'authentification :", error);
        setStatus("error");
        setErrorMessage("Impossible de compléter l'authentification");
      }
    };
  
    handleAuthCallback(); // 🔥 Execute function on mount
  }, []);

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <div className="bg-white p-8 rounded-xl shadow-lg text-center max-w-md w-full">
        {status === "loading" && (
          <>
            <Loader2 className="w-12 h-12 animate-spin text-blue-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-700 mb-2">
              Authentification en cours...
            </h2>
            <p className="text-gray-500">
              Veuillez patienter pendant que nous sécurisons votre session
            </p>
          </>
        )}

        {status === "error" && (
          <div className="text-red-500">
            <svg
              className="w-12 h-12 mx-auto mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <h2 className="text-xl font-semibold mb-2">Une erreur est survenue</h2>
            <p className="text-sm text-red-400">{errorMessage}</p>
            <button
              onClick={() => window.location.href = "/"}
              className="mt-4 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
            >
              Retour accueil
            </button>
          </div>
        )}

        {status === "success" && (
          <div className="text-green-500">
            <svg
              className="w-12 h-12 mx-auto mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <h2 className="text-xl font-semibold mb-2">Authentification réussie</h2>
            <p className="text-sm text-green-400">Redirection en cours...</p>
          </div>
        )}
      </div>
    </div>
  );
}