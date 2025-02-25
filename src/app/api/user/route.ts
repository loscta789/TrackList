import { supabase } from "../../../lib/supabaseClient";
import { NextResponse } from "next/server";
import * as cookie from "cookie";

export async function GET(req: Request) {
  console.log("📢 Requête reçue sur /api/user");

  // ✅ Récupérer et parser les cookies
  const cookies = cookie.parse(req.headers.get("cookie") || "");
  //console.log("🍪 Cookies disponibles :", cookies);

  // ✅ Vérifier la présence du `sb-access-token`
  const token = cookies["sb-access-token"];

  if (!token) {
    console.warn("⚠️ Aucun `sb-access-token` trouvé !");
    return NextResponse.json({ error: "Non connecté" }, { status: 401 });
  }

  // console.log("🔑 Token récupéré :", token);

  // ✅ Récupérer l'utilisateur à partir du token
  try {
    const { data, error } = await supabase.auth.getUser(token);

    if (error || !data.user) {
      console.error("❌ Session invalide ou expirée :", error?.message);
      return NextResponse.json({ error: "Session expirée ou invalide" }, { status: 401 });
    }

    console.log("✅ Utilisateur authentifié :", data.user);
    return NextResponse.json({ user: data.user });

  } catch (error) {
    console.error("🔥 Erreur serveur :", error);
    return NextResponse.json({ error: "Erreur interne du serveur" }, { status: 500 });
  }
}
