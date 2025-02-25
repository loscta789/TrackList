import { useAuthStore } from "../store/authStore";
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
      // ✅ Appel de l'API Backend
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
        credentials: "include",
      });
  
      const data = await res.json();
  
      if (!res.ok) {
        console.log("Res pas ok")
        return { success: false, error: data.error || "Erreur de connexion" };
      }
  
      console.log("✅ Connexion réussie, mise à jour du store...");
  
      // ✅ Updat store with user data
      const setUser = useAuthStore.getState().setUser;
      setUser(data.user);
  
      return { success: true, user: data.user };
  
    } catch (error: unknown) {
      console.error("🚨 Erreur inattendue lors de la connexion :", error);
  
      let errorMessage = "Une erreur inconnue est survenue";
      if (error instanceof Error) {
        errorMessage = error.message;
      }
  
      return { success: false, error: errorMessage };
    }
  };
  
  
  export const getUser = async () => {
    try {
      const res = await fetch("/api/user", { credentials: "include" });
      const data = await res.json();
  
      if (!res.ok) {
        return false;
      }
  
      return data.user; // ✅ Retourne `user`, qui contient `username`
    } catch (error) {
      console.error("❌ Erreur lors de la récupération de l'utilisateur :", error);
      return null; // ✅ Retourne `null` si l'utilisateur n'est pas connecté
    }
  };
  
  export const logoutUser = async () => {
  try {
    const res = await fetch("/api/logout", 
      { method: "DELETE", credentials: "include" });
    

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
        redirectTo: `${process.env.NEXT_PUBLIC_API_URL}/auth/callback`,
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
        redirectTo: `${process.env.NEXTAUTH_URL}/auth/callback`,
      },
    });

    console.log("Données retournées par Supabase:", data);

    if (error) {
      console.error("Erreur détectée !");
      console.log("Erreur complète :", error);
      console.log("Code d'erreur :", error.code);
      console.log("Message :", error.message);
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