import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

// ✅ Modifier un item existant
export async function PUT(req: Request) {
  try {
    const { id, content, status, userId, groupId } = await req.json();

    if (!id || !content || !status || !userId || !groupId) {
      return NextResponse.json({ error: "Tous les champs sont requis." }, { status: 400 });
    }

    const { error } = await supabase
      .from("group_items")
      .update({ content, status })
      .eq("id", id)
      .eq("user_id", userId)
      .eq("group_id", groupId);

    if (error) {
      return NextResponse.json({ error: "Erreur lors de la mise à jour de l'élément." }, { status: 500 });
    }

    return NextResponse.json({ success: true });

  } catch (error) {
    return NextResponse.json({ error: "Erreur interne du serveur." }, { status: 500 });
  }
}

// ✅ Supprimer un item existant

