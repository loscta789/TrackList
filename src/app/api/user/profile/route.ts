import { supabase } from "@/lib/supabaseClient";
import { NextResponse } from "next/server";
import * as cookie from "cookie";
import { getSupabaseServer } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const { id, username, avatar } = await req.json();

    if (!id || !username) {
      return NextResponse.json({ error: "Données utilisateur manquantes" }, { status: 400 });
    }

    console.log("📢 Requête reçue pour ajouter un profil :", { id, username, avatar });

    // 🔹 Vérifier si le profil existe déjà
    const { data: existingProfile } = await supabase
      .from("profiles")
      .select("id")
      .eq("id", id)
      .single();

    if (existingProfile) {
      console.log("✅ Le profil existe déjà, aucune action nécessaire.");
      return NextResponse.json({ message: "Profil déjà existant" }, { status: 200 });
    }

    // 🔹 Insérer un nouveau profil
    const { error: insertError } = await supabase
      .from("profiles")
      .insert([{ id, username, avatar, created_at: new Date().toISOString() }]);

    if (insertError) {
      console.error("❌ Erreur lors de l'ajout du profil :", insertError.message);
      return NextResponse.json({ error: "Impossible de créer le profil" }, { status: 500 });
    }

    console.log("✅ Profil ajouté avec succès :", username);
    return NextResponse.json({ message: "Profil créé avec succès" }, { status: 201 });
  } catch (error) {
    console.error("🔥 Erreur serveur :", error);
    return NextResponse.json({ error: "Erreur interne du serveur" }, { status: 500 });
  }
}

// 🔹 Récupérer un profil utilisateur (GET)
export async function GET(req: Request) {
  try {
    console.log("🔁 Requête GET `/api/users/profile` reçue");

    // 🔹 Récupérer le token d'authentification depuis les cookies
    const cookies = cookie.parse(req.headers.get("cookie") || "");
    const access_token = cookies["sb-access-token"];

    if (!access_token) {
      console.warn("❌ Aucun `sb-access-token` trouvé !");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    console.log("🔑 Token récupéré :", access_token);

    // 🔹 Récupérer la session utilisateur
    const { data, error } = await supabase.auth.getUser(access_token);

    if (error || !data.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user_id = data.user.id;

    // 🔹 Récupérer le profil utilisateur depuis Supabase
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("theme, last_group_id, username, avatar")
      .eq("id", user_id)
      .single();

    if (profileError || !profile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    console.log("📢 Profil récupéré :", profile);
    return NextResponse.json(profile);
  } catch (error) {
    console.error("🔥 Erreur API `/api/users/profile` :", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// 🔹 Met à jour le profil utilisateur (PATCH)
export async function PATCH(req: Request) {
  console.log("🔁 Requête PATCH `/api/user/profile`");

  try {
   
    const userId = req.headers.get("x-user-id");
    if (!userId) {
      console.log("Not authentified")
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const supabase = await getSupabaseServer();


    const { theme, lastGroupId } = await req.json();

    const hasTheme = theme !== undefined;
    const hasLastGroupId = lastGroupId !== undefined;

    if (hasTheme === hasLastGroupId) { 
      return NextResponse.json(
        { error: "Vous devez envoyer soit `theme`, soit `lastGroupId`, mais pas les deux." },
        { status: 400 }
      );
    }

    const updateData: Record<string, unknown> = hasTheme ? { theme } : { last_group_id: lastGroupId };

    // 🔹 Mise à jour dans la base de données
    const { error: updateError } = await supabase
      .from("profiles")
      .update(updateData)
      .eq("id", userId);

    if (updateError) {
      console.error("❌ Erreur mise à jour du profil :", updateError.message);
      return NextResponse.json({ error: "Could not update profile" }, { status: 500 });
    }

    console.log("✅ Profil mis à jour avec succès :", updateData);
    return NextResponse.json({ message: "Profile updated successfully", updateData });

  } catch (error) {
    console.error("🔥 Erreur serveur PATCH `/api/user/profile` :", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
