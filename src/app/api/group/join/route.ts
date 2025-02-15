import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

// 🔹 On exporte une fonction `POST` au lieu d'un handler
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { joinCode, userId } = body;

    if (!joinCode || !userId) {
      return NextResponse.json({ error: "Code et utilisateur requis" }, { status: 400 });
    }

    console.log("🔍 Tentative de rejoindre le groupe avec le code :", joinCode, userId, "userId");
    // 🔹 1. Vérifier si le groupe existe
    const { data: group, error: groupError } = await supabase
      .from("groups")
      .select("id, max_participants")
      .ilike("join_code", joinCode)
      .single();

    if (groupError || !group) {
      return NextResponse.json({ error: "Code invalide ou groupe introuvable." }, { status: 404 });
    }

    // 🔹 2. Vérifier si le groupe est plein
    const { count } = await supabase
      .from("group_members")
      .select("id", { count: "exact" })
      .eq("group_id", group.id);

    if (count !== null && count >= group.max_participants) {
      return NextResponse.json({ error: "Le groupe est plein." }, { status: 403 });
    }

    // 🔹 3. Vérifier si l'utilisateur est déjà membre
    const { data: existingMember } = await supabase
      .from("group_members")
      .select("id")
      .eq("group_id", group.id)
      .eq("user_id", userId)
      .maybeSingle();

    if (existingMember) {
      return NextResponse.json({ error: "Déjà membre du groupe." }, { status: 409 });
    }

    // 🔹 4. Ajouter l'utilisateur au groupe
    const { error: insertError } = await supabase
      .from("group_members")
      .insert([{ group_id: group.id, user_id: userId, role: "member" }]);

    if (insertError) {
      return NextResponse.json({ error: "Erreur lors de l'ajout." }, { status: 500 });
    }

    return NextResponse.json({ success: "Rejoint avec succès !" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Erreur serveur." }, { status: 500 });
  }
}
