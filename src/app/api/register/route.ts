import { NextResponse } from 'next/server';
import { supabase } from '../../../lib/supabaseClient';

export async function POST(req) {
  console.log("🟢 Arrivé dans l'inscription");

  try {
    const { email, password, username } = await req.json();

    console.log("📩 email, 🔑 password, 🏷️ username", email, password, username);

    // 🔹 1. Inscrire l'utilisateur dans `auth.users`
    const { data, error } = await supabase.auth.signUp({ 
      email, 
      password, 
      options: { data: { username } } 
    });

    if (error || !data.user) {
      console.log("❌ Erreur lors de l'inscription :", error?.message);
      return NextResponse.json({ error: "Inscription échouée" }, { status: 400 });
    }

    const userId = data.user.id;
    console.log("✅ Utilisateur inscrit dans auth.users :", userId);

    // 🔹 2. Ajouter l'utilisateur dans `profiles`
    const { error: profileError } = await supabase.from("profiles").insert([
      {
        id: userId, // Associe le profil à l'utilisateur
        username, // Stocke le username
        avatar: "https://exemple.com/default-avatar.png", // Image par défaut
      }
    ]);

    if (profileError) {
      console.log("⚠️ Erreur lors de l'ajout du profil :", profileError.message);
      return NextResponse.json({ error: "Inscription partielle : Profil non créé" }, { status: 400 });
    }

    console.log("✅ Profil ajouté dans profiles");

    return NextResponse.json({ 
      message: "Inscription réussie", 
      user: { id: userId, email, username },
    }, { status: 201 });

  } catch (error) {
    console.error("🔥 Erreur lors de l'inscription :", error);
    return NextResponse.json({ error: "Erreur interne du serveur" }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ message: "Utilisez POST pour enregistrer un utilisateur." });
}
