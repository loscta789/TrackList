"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { useAuthStore } from "@/app/store/authStore";
import { addProfiles } from "@/app/services/auth";
import { Loader } from "@/app/components/Loader"; // 🔹 Loader moderne

export default function AuthCallback() {
  const router = useRouter();
  const setUser = useAuthStore((state) => state.setUser);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    async function finalizeOAuth() {
      console.log("📢 Vérification de la session OAuth...");

      const { data, error } = await supabase.auth.getSession();

      if (error || !data.session) {
        console.error("❌ Erreur OAuth :", error);
        setErrorMessage("An authentication error occurred. Please try again.");
        setLoading(false);
        return;
      }

      console.log("✅ Session OAuth active :", data.session);
      const user = data.session.user;

      if (!user) {
        setErrorMessage("User not found after authentication.");
        setLoading(false);
        return;
      }

      try {
        await addProfiles(
          user.id,
          user.user_metadata.full_name || user.email.split("@")[0],
          user.user_metadata.avatar_url || ""
        );
      } catch (error) {
        console.error("❌ Error adding user profile:", error);
      }

      try {
        await fetch("/api/auth/oauth", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ access_token: data.session.access_token }),
          credentials: "include",
        });
      } catch (error) {
        console.error("❌ Error sending token to backend:", error);
      }

      console.log("📢 Cookies after login:", document.cookie);

      setUser(user);
      router.push("/");
    }

    finalizeOAuth();
  }, [router, setUser]);

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-background text-foreground">
      {loading ? (
        <>
          <Loader />
          <p className="text-primary mt-4">Authenticating...</p>
        </>
      ) : (
        <div className="text-center p-6 bg-error text-white rounded-lg shadow-lg">
          <p className="font-bold">⚠️ Authentication Failed</p>
          <p className="text-sm mt-2">{errorMessage}</p>
          <button 
            onClick={() => router.push("/login")}
            className="mt-4 px-4 py-2 bg-white text-error font-semibold rounded-lg hover:bg-gray-200 transition"
          >
            Try Again
          </button>
        </div>
      )}
    </div>
  );
}
