import { supabase } from "@/lib/supabaseClient";
import { NextResponse } from "next/server";
import { LoginFormData} from "@/app/login/_typings/form"; // ✅ Importe le type LoginFormData
export async function POST(req: Request) { // ✅ Ajout du type Request
  try {
    const body: LoginFormData = await req.json();
    const { email, password } = body;

    // 🔹 Vérifie les identifiants avec Supabase
    console.log(email, password)
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      console.error("❌ Erreur d'authentification :", error.message);
      return NextResponse.json({ error: error.message }, { status: 401 });
    }

    if (!data.session) {
      console.log("❌ Session introuvable dans la réponse");
      return NextResponse.json({ error: "Erreur de connexion" }, { status: 500 });
    }

    return NextResponse.json({ message: "Connexion réussie", user: data.user }, { status: 200 });
  } catch (error : unknown) {

    if (error instanceof Error) {
      console.error("🚨 Erreur inattendue lors de la connexion :", error.message);
    }
    return NextResponse.json({ error: "Erreur interne du serveur" }, { status: 0 });
  }
}
