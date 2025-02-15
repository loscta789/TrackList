import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient" // Remplace par ton chemin correct

export async function DELETE(req: Request, { params }: { params: { itemId: string } }) {
  try {
    // 🔥 Récupérer les paramètres de l'URL (userId et groupId)
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");
    const groupId = searchParams.get("groupId");
    const { itemId } = params;

    console.log("🔴 Suppression de l'élément avec ID:", itemId, "par l'utilisateur", userId, "groupId", groupId);

    // 🔍 Vérifier que tous les paramètres sont présents
    if (!itemId || !userId || !groupId) {
      return NextResponse.json({ error: "Tous les champs (itemId, userId, groupId) sont requis." }, { status: 400 });
    }

    // 🔥 Vérifier si l'item appartient bien à l'utilisateur
    const { data: item, error: fetchError } = await supabase
      .from("group_items")
      .select("user_id")
      .eq("id", itemId)
      .single();

    if (fetchError || !item) {
      return NextResponse.json({ error: "Élément introuvable ou accès refusé." }, { status: 404 });
    }

    if (item.user_id !== userId) {
      return NextResponse.json({ error: "Vous ne pouvez supprimer que vos propres éléments." }, { status: 403 });
    }

    // 🔥 Suppression de l'élément
    const { error: deleteError } = await supabase
      .from("group_items")
      .delete()
      .eq("id", itemId)
      .eq("user_id", userId)
      .eq("group_id", groupId);

    if (deleteError) {
      return NextResponse.json({ error: `Erreur lors de la suppression: ${deleteError.message}` }, { status: 500 });
    }



    return NextResponse.json({ success: true });

  } catch (error) {
    console.error("❌ Erreur serveur :", error);
    return NextResponse.json({ error: "Erreur interne du serveur." }, { status: 500 });
  }
}
