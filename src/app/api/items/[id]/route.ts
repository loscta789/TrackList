import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient"; 


export async function DELETE(req: Request, context: { params: { id?: string } }) {
  try {
    // 🔥 Vérifier que params existe bien
    if (!context.params) {
      return NextResponse.json({ error: "Params introuvable." }, { status: 500 });
    }

    const {id: itemId} = await context.params;

    console.log("🔎 ID de l'élément à supprimer :", itemId);

    // 🔥 Récupérer `userId` depuis les query params
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    console.log("🔎 ID de l'utilisateur :", userId);

    // 🚨 Vérification des paramètres
    if (!itemId || !userId) {
      return NextResponse.json({ error: "Paramètres manquants." }, { status: 400 });
    }

    // 🔥 Vérifier si l'élément existe bien et appartient à l'utilisateur
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

    // 🔥 Supprimer l'élément
    const { error: deleteError } = await supabase
      .from("group_items")
      .delete()
      .eq("id", itemId)
      .eq("user_id", userId);

    if (deleteError) {
      return NextResponse.json({ error: deleteError.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error("❌ Erreur serveur :", error);
    return NextResponse.json({ error: "Erreur interne du serveur." }, { status: 500 });
  }
}
