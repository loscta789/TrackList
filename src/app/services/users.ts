export const fetchUserProfile = async () => {
    try {
      const response = await fetch("/api/user/profile", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // ✅ Envoie les cookies pour l'authentification
      });
  
      if (!response.ok) {
        throw new Error("Erreur lors de la récupération du profil utilisateur");
      }
  
      const data = await response.json();
      return data; // ✅ Retourne le `theme` récupéré
    } catch (error) {
      console.error("❌ Erreur fetchUserProfile :", error);
      return null;
    }
  };
  
  export const setUserTheme = async (theme: string) => {
    try {
      const response = await fetch("/api/user/profile", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // ✅ Nécessaire pour récupérer la session utilisateur
        body: JSON.stringify({ theme }),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`❌ Erreur mise à jour du thème : ${errorData.error || response.statusText}`);
      }
  
      const data = await response.json();
      console.log("✅ Thème mis à jour avec succès :", data.theme);
      return data.theme; // ✅ Retourne le nouveau thème
    } catch (error) {
      console.error("🚨 Erreur setUserTheme :", error);
      return null;
    }
  };
  
  



  export const updateLastGroup = async (groupId: string) => {
    try {

      const response = await fetch("/api/user/profile", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ lastGroupId: groupId }),
        credentials: "include", // ✅ Assure que le cookie Supabase est envoyé
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`❌ Échec mise à jour du dernier groupe : ${errorData.error || response.statusText}`);
      }
  
      return await response.json(); // ✅ Retourne les données de l'API
    } catch (error) {
      console.error("🚨 Erreur updateLastGroup:", error);
      throw error;
    }
  };
  
