
export const updateItemState = async (itemId: string, newState: number) => {
    try {
      const res = await fetch("/api/items", {
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

  export const fetchAddItem = async (groupId: string, content: string, details: string) => {
    try {
      const res = await fetch("/api/items", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ groupId, content, details }),
        credentials: "include",
      });

      const data = await res.json();
      console.log("📌 Réponse API après ajout :", data); // 🔍 Log la réponse API

      if (!res.ok || !data.data) {
        return data.error
      }

      return true;

    } catch (err) {
      console.error("❌ Erreur lors de l'ajout de l'élément :", err);
      return err;
    }
};

export const fetchDeleteItem = async (id: string): Promise<boolean> => {
  try {


    const res = await fetch(`/api/items/${id}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
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




  

  
   
