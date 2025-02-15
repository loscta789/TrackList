import { useAuthStore } from "@/app/store/authStore";

export const updateItemState = async (itemId: string, newState: string) => {
    try {
      const res = await fetch("/api/items/update", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ itemId, newState }),
      });
  
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erreur inconnue");
      return true; // ✅ Succès
    } catch (err) {
      console.error("Erreur lors de la mise à jour :", err);
      return false; // ❌ Échec
    }
  };

  export const fetchAddItem = async (groupId: string, userId: string, content: string, details: string) => {
    try {
      console.log("fetch", userId);
      const res = await fetch("/api/items/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ groupId, userId, content, details: details || "" }),
      });

      const data = await res.json();
      console.log("📌 Réponse API après ajout :", data); // 🔍 Log la réponse API

      if (!res.ok || !data.data) {
        throw new Error(data.error || "Erreur inconnue, aucune donnée retournée");
      }

      // ✅ Récupérer `username` depuis Zustand au lieu de refaire une requête API
      const username = useAuthStore.getState().user?.username || "Utilisateur inconnu";

      return { ...data.data, username }; // ✅ Ajoute immédiatement le `username`
    } catch (err) {
      console.error("❌ Erreur lors de l'ajout de l'élément :", err);
      return null; // ❌ Échec
    }
};

export const fetchDeleteItem = async (id: string, userId: string): Promise<boolean> => {
  try {
    console.log("🔴 Suppression de l'élément avec ID:", id, "par l'utilisateur", userId);


    const res = await fetch(`/api/items/${id}?userId=${userId}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.error || "Erreur inconnue lors de la suppression");
    }

    console.log("✅ Élement supprimé avec succès !");
    return true; // ✅ Succès
  } catch (err) {
    console.error("❌ Erreur lors de la suppression de l'élément :", err);
    return false; // ❌ Échec
  }
};




  

  
   
