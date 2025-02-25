import { NextResponse } from "next/server";
import { cookies } from "next/headers"; // Gestion des cookies
import { supabase } from "@/lib/supabaseClient"; // Connexion à Supabase

// Interface pour la requête
interface GroupRequestBody {
  groupName: string;
  maxParticipants: number;
}

// API Route pour créer un groupe
export async function POST(req: Request) {

  const userId = req.headers.get("x-user-id");

  if (!userId) {
    console.log("Unauthorized")
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 }); 
  }




  try {

    const body = (await req.json()) as GroupRequestBody;
    const { groupName, maxParticipants } = body;

    // 🔹 Vérifier que les données sont valides
    if (!groupName || maxParticipants <= 0) {
      return NextResponse.json(
        { error: "Nom du groupe ou nombre de participants requis" },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from("groups")
      .insert([{ name: groupName, max_participants: maxParticipants, admin_id: userId }])
      .select();

    if (error) {
      console.error("❌ Erreur Supabase:", error);
      return NextResponse.json({ error: "Erreur lors de la création du groupe" }, { status: 500 });
    }

    const newGroup = data[0];

    // 🔹 Ajouter le créateur du groupe dans `group_members`
    const { error: memberError } = await supabase.from("group_members").insert([
      {
        group_id: newGroup.id,
        user_id: userId,
        role: "admin",
      },
    ]);

    if (memberError) {
      console.error("❌ Erreur lors de l'ajout du créateur dans group_members:", memberError);
      return NextResponse.json(
        { error: "Groupe créé, mais erreur lors de l'ajout du membre" },
        { status: 500 }
      );
    }

    console.log("✅ Groupe créé avec succès et admin ajouté !");
    return NextResponse.json({ success:true }, { status: 201 });

  } catch (error) {
    console.error("❌ Erreur serveur:", error);
    return NextResponse.json(
      { error: "Erreur lors de la création du groupe" },
      { status: 500 }
    );
  }
}
