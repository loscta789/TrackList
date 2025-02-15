import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

// ✅ Ajouter un nouvel item
export async function POST(req: Request) {
    try {
      const { groupId, content, userId, details } = await req.json();
  
      console.log(groupId, content, userId, details, "🚀");
      if (!groupId || !content || !userId) {
        return NextResponse.json({ error: "Tous les champs sont requis." }, { status: 400 });
      }
  
      // 🔹 Insérer et récupérer immédiatement l'élément ajouté
      const { data, error } = await supabase
        .from("group_items")
        .insert([{ group_id: groupId, content, user_id: userId, details }])
        .select("*"); // ✅ Récupère immédiatement les données ajoutées
  
      if (error || !data || data.length === 0) {
        return NextResponse.json({ error: "Erreur lors de l'ajout de l'élément." }, { status: 500 });
      }
  
      return NextResponse.json({ success: true, data: data[0] }); // ✅ Renvoie uniquement l'élément ajouté
  
    } catch (error) {
      console.error("❌ Erreur interne du serveur :", error);
      return NextResponse.json({ error: "Erreur interne du serveur." }, { status: 500 });
    }
}
