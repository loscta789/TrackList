import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

export async function GET(req: Request, context: { params: { id: string } }) {
  const { id: groupId } = await context.params; // ✅ Pas besoin de `await`

  console.log(`📌 Récupération du groupe avec ID : ${groupId}`);

  if (!groupId) {
    return NextResponse.json({ error: "ID du groupe requis" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("groups")
    .select(`
      id,
      name,
      join_code,
      created_at,
      max_participants,
      group_members (
        user_id,
        role,
        profiles (
          username,
          avatar
        )
      ),
      group_items (
        id,
        content,
        state,
        user_id,
        created_at,
        details,
        profiles (
          username,
          avatar
        )
      )
    `)
    .eq("id", groupId)
    .single();

  if (error || !data) {
    console.error("❌ Erreur lors de la récupération du groupe :", error?.message);
    return NextResponse.json({ error: "Groupe introuvable" }, { status: 404 });
  }

  console.log("✅ Groupe récupéré avec succès :");

  // ✅ Associer les items à leur auteur
  const membersMap = new Map();

  // Construire une map des membres pour l'association des items
  data.group_members?.forEach((m) => {
    membersMap.set(m.user_id, {
      id: m.user_id,
      username: m.profiles?.username || "Utilisateur inconnu",
      role: m.role || "user",
      avatar: m.profiles?.avatar || null,
      isAdmin: m.role === "admin",
      items: [], // Initialisation avec un tableau vide d'items
    });
  });

  // Associer les items à leur auteur
  data.group_items?.forEach((item) => {
    if (membersMap.has(item.user_id)) {
      membersMap.get(item.user_id).items.push({
        id: item.id,
        content: item.content,
        state: item.state,
        created_at: item.created_at,
        details: item.details,
      });
    }
  });

  return NextResponse.json({
    id: data.id,
    name: data.name,
    joinCode: data.join_code,
    created_at: data.created_at,
    max_participants: data.max_participants,

    members: Array.from(membersMap.values()), // Convertir la Map en tableau
  });
}
