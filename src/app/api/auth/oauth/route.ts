import { NextRequest, NextResponse } from "next/server";
import * as cookie from "cookie";

export async function POST(req: NextRequest) {
  try {
    const { access_token } = await req.json();

    if (!access_token) {
      console.error("❌ Aucun `access_token` reçu !");
      return NextResponse.json({ error: "Token manquant" }, { status: 400 });
    }

    console.log("✅ Token OAuth reçu :", access_token);

    // ✅ Stocker dans `sb-access-token` pour respecter le format de Supabase
    const cookieHeader = cookie.serialize("sb-access-token", access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 jours
      path: "/",
    });

    console.log("🍪 Cookie `sb-access-token` défini :", cookieHeader);

    const response = NextResponse.json({ message: "Token stocké en cookie" });
    response.headers.set("Set-Cookie", cookieHeader);

    return response;
  } catch (error) {
    console.error("🔥 Erreur lors du stockage du token :", error);
    return NextResponse.json({ error: "Erreur interne du serveur" }, { status: 500 });
  }
}
