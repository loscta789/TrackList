import { useAuthStore } from "../store/authStore";
import { signIn } from "next-auth/react";
import { supabase } from "@/lib/supabaseClient";

export const registerUser = async (username: string, email: string, password: string) => {
    console.log("RegisterUser")
    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password }),
      });
  
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || "Registration failed");
      }
  
      return data; // Retourne les données si la requête est réussie
    } catch (error) {
      console.error("Error registering user:", error);
      throw error;
    }
  };

  export const loginUser = async (email: string, password: string) => {
    console.log("🔑 Tentative de connexion...");
    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
        credentials: "include",
      });
  
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || "Erreur de connexion");
      }
  
      console.log("✅ Connexion réussie, vérification de la session...");
  
      // 🔹 Vérifie immédiatement la session
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
  
      if (sessionError || !sessionData.session) {
        console.error("🚨 Session non récupérée après connexion :", sessionError);
        throw new Error("Impossible de récupérer la session.");
      }
  
      console.log("🔍 Session active :", sessionData);
  
      // 🔹 Stocker l'utilisateur dans Zustand
      useAuthStore.getState().setUser(data.user);
  
      // 🔹 Vérifie si `checkAuth()` est nécessaire
      const isAuthenticated = !!useAuthStore.getState().user;
      if (!isAuthenticated) {
        console.log("🔄 L'utilisateur n'était pas encore chargé, appel de checkAuth()...");
        await useAuthStore.getState().checkAuth();
      }
  
      return data.user;
    } catch (error) {
      console.error("❌ Erreur lors de la connexion :", error);
      throw error;
    }
  };
  
  
  
  export const getUser = async () => {
    try {
      const res = await fetch("/api/user", { credentials: "include" });
      const data = await res.json();
  
      if (!res.ok) {
        throw new Error(data.error || "Non connecté");
      }
  
      return data.user; // ✅ Retourne `user`, qui contient `username`
    } catch (error) {
      return null; // ✅ Retourne `null` si l'utilisateur n'est pas connecté
    }
  };
  
  export const logoutUser = async () => {
  try {
    const res = await fetch("/api/logout", { method: "POST", credentials: "include" });

    if (!res.ok) {
      throw new Error("Erreur lors de la déconnexion");
    }
  } catch (error) {
    console.error("❌ Erreur de déconnexion :", error);
  }
};


export const signUpGoogle = async () => {
  console.log("Début de signInWithOAuth");
  console.log("URL de redirection:", window.location.origin);

  try {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `http://localhost:3000/auth/callback`,
      },
    });

    
    

    console.log("Données retournées par Supabase:", data);

    if (error) {
      console.error("Erreur détectée !");
      throw error;
    }
  } catch (error) {
    console.error("⚠️ Erreur lors de l'authentification Google:");
    console.error(error);
  }

  console.log("Fin de signInWithOAuth");
};

export const signUpFacebook = async () => {
  console.log("Début de signInWithOAuth");
  console.log("URL de redirection:", window.location.origin);

  try {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "facebook",
      options: {
        redirectTo: `http://localhost:3000/auth/callback`,
      },
    });

    console.log("Données retournées par Supabase:", data);

    if (error) {
      console.error("Erreur détectée !");
      console.log("Erreur complète :", error);
      console.log("Code d'erreur :", error.code);
      console.log("Message :", error.message);
      console.log("Détails supplémentaires :", error.details);
      console.log("Statut :", error.status);
      throw error;
    }
  } catch (error) {
    console.error("⚠️ Erreur lors de l'authentification Google:");
    console.error(error);
  }

  console.log("Fin de signInWithOAuth");
};


export const addProfiles = async (userId: string, username: string, avatar: string) => {
  try {
    const res = await fetch("/api/user/profile", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: userId, username, avatar }),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error || "Erreur lors de l'ajout du profil");
    }

    return data;
  } catch (error) {
    console.error("❌ Erreur lors de l'ajout du profil :", error);
    throw error;
  }
};