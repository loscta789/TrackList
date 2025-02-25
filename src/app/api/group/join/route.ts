import { NextResponse } from "next/server";
import { getSupabaseServer } from "@/lib/auth";
import { isGroupMember } from "@/lib/auth";

// 🔹 On exporte une fonction `POST` au lieu d'un handler
export async function POST(req: Request) {

  const userId = req.headers.get("x-user-id");

  if (!userId) {
    console.log("Unauthorized")
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { joinCode } = body;

    if (!joinCode) {
      console.log("Code requis")
      return NextResponse.json({ error: "Code et utilisateur requis" }, { status: 400 });
    }



    const supabase = await getSupabaseServer();


    const { data: group, error: groupError } = await supabase // Recupere les informations du groupe par rapport au join_code
      .from("groups")
      .select("id, max_participants")
      .eq("join_code", joinCode)
      .single();

    if (groupError || !group) {
      console.log("Code invalide ou groupe introuvable")
      return NextResponse.json({ error: "Code invalide ou groupe introuvable." }, { status: 404 });
    }

    // 🔹 2. Vérifier si le groupe est plein
    const { count } = await supabase
      .from("group_members")
      .select("id", { count: "exact" })
      .eq("id", group.id);

    if (count !== null && count >= group.max_participants) {
      console.log("Le groupe est plein")
      return NextResponse.json({ error: "Le groupe est plein." }, { status: 403 });
    }

    // 🔹 3. Vérifier si l'utilisateur est déjà membre
    const isMember = await isGroupMember(group.id, userId, supabase);

    if (isMember) {
      console.log("Vous êtes déjà membre de ce groupe")
      return NextResponse.json({ error: "Vous êtes déjà membre de ce groupe." }, { status: 403 });
    }

    // 🔹 4. Ajouter l'utilisateur au groupe
    const { error: insertError } = await supabase
      .from("group_members")
      .insert([{ group_id: group.id, user_id: userId, role: "member" }]);

    if (insertError) {
      return NextResponse.json({ error: "Erreur lors de l'ajout." }, { status: 500 });
    }

    return NextResponse.json({ success: true }, { status: 200 });

  } catch (error) {
    console.error("❌ Erreur serveur :", error);
    return NextResponse.json({ error: "Erreur serveur." }, { status: 500 });
  }
}
