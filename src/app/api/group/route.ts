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
  console.log("📌 groups POST request received");

  try {
    // 🔹 Afficher tous les cookies disponibles pour debug
    const allCookies = await cookies();
    console.log("🍪 Tous les cookies disponibles :", allCookies);

    // 🔹 Récupérer le token d'authentification de Supabase
    const tokenCookie = allCookies.get("supabaseToken");

    if (!tokenCookie || !tokenCookie.value) {
      console.warn("⚠️ Aucun `supabaseToken` trouvé, utilisateur non authentifié !");
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    // 🔹 Vérifier la session avec Supabase
    const { data: userData, error: authError } = await supabase.auth.getUser(tokenCookie.value);

    if (authError || !userData.user) {
      console.error("❌ Erreur d'authentification :", authError);
      return NextResponse.json({ error: "Session invalide ou expirée" }, { status: 401 });
    }

    console.log("✅ Utilisateur authentifié :", userData.user.email);
    const adminId = userData.user.id;

    // 🔹 Vérifier si l'utilisateur a le droit de créer un groupe
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", adminId)
      .single();

    if (profileError || !profile) {
      return NextResponse.json({ error: "Impossible de récupérer les permissions" }, { status: 500 });
    }

    if (profile.role !== "admin") {
      return NextResponse.json({ error: "Vous n'avez pas la permission de créer un groupe" }, { status: 403 });
    }

    console.log("✅ Permission validée : l'utilisateur peut créer un groupe");

    // 🔹 Récupérer et typer les données reçues
    const body = (await req.json()) as GroupRequestBody;
    const { groupName, maxParticipants } = body;

    // 🔹 Vérifier que les données sont valides
    if (!groupName || maxParticipants <= 0) {
      return NextResponse.json(
        { error: "Nom du groupe et nombre de participants requis" },
        { status: 400 }
      );
    }

    // 🔹 Insérer le groupe dans Supabase
    const { data, error } = await supabase
      .from("groups")
      .insert([{ name: groupName, max_participants: maxParticipants, admin_id: adminId }])
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
        user_id: adminId,
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
    return NextResponse.json({ group: newGroup }, { status: 201 });

  } catch (error) {
    console.error("❌ Erreur serveur:", error);
    return NextResponse.json(
      { error: "Erreur lors de la création du groupe" },
      { status: 500 }
    );
  }
}
