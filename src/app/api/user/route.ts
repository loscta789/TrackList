import { supabase } from "../../../lib/supabaseClient";
import { NextResponse } from "next/server";
import * as cookie from "cookie";

export async function GET(req) {
  console.log("📢 Requête reçue sur /api/user");

  const cookies = cookie.parse(req.headers.get("cookie") || "");
  console.log("🍪 Cookies disponibles dans /api/user :", cookies);

  // ✅ Utiliser `sb-access-token`, le vrai cookie de Supabase
  const token = cookies["sb-access-token"];

  if (!token) {
    console.warn("⚠️ Aucun `sb-access-token` trouvé dans les cookies !");
    return NextResponse.json({ error: "Non connecté" }, { status: 401 });
  }

  console.log("🔑 Token récupéré :", token);

  const { data, error } = await supabase.auth.getUser(token);

  if (error || !data.user) {
    console.error("❌ Session expirée ou invalide !");
    return NextResponse.json({ error: "Session expirée ou invalide" }, { status: 401 });
  }

  return NextResponse.json({ user: data.user });
}
