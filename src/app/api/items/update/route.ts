import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

// ✅ Initialiser le client Supabase


// ✅ Map pour convertir le texte en `INTEGER`
const stateMap: Record<string, number> = {
    pending:0,
    done: 1,
    process:2,
};

// ✅ API Route : Mise à jour du statut d’un item
export async function PUT(req: Request) {
  try {
    const { itemId, newState } = await req.json();

    // ✅ Vérifier si `newState` est valide
    if (!itemId || !(newState in stateMap)) {
      return NextResponse.json({ error: "État invalide" }, { status: 400 });
    }

    // ✅ Convertir "process" ou "done" en `INTEGER`
    const stateValue = stateMap[newState];

    // ✅ Mettre à jour l’état dans la base
    const { error } = await supabase
      .from("group_items")
      .update({ state: stateValue })
      .eq("id", itemId);

    if (error) {
      throw new Error(error.message);
    }

    console.log("✅ Mise à jour réussie :", itemId, newState);

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
