import { supabase } from '../../../lib/supabaseClient';
import { NextResponse } from "next/server";
import * as cookie from "cookie";

export async function POST(req) {
  try {
    const { email, password } = await req.json();
    console.log("🟢 Requête reçue - Email :", email);

    // 🔹 Vérifie les identifiants avec Supabase
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error || !data.session) {
      console.log("❌ Erreur de connexion :", error?.message);
      return NextResponse.json({ error: "Email ou mot de passe incorrect" }, { status: 401 });
    }

    console.log("✅ Connexion réussie - Utilisateur :", data.user.email);
    console.log("🔐 Token reçu :", data.session.access_token);

    // **🔹 Supprimer la création manuelle du cookie !**
    console.log("🍪 Supabase gère déjà les cookies, pas besoin de les définir manuellement.");

    return NextResponse.json({ message: "Connexion réussie", user: data.user });
  } catch (error) {
    console.log("🔥 Erreur serveur :", error);
    return NextResponse.json({ error: "Erreur interne du serveur" }, { status: 500 });
  }
}

