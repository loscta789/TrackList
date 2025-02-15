import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";
import * as cookie from "cookie";

export async function GET(req: Request) {
  console.log("ok")
  // 🔹 Récupérer la session utilisateur depuis Supabase
  const { data, error } = await supabase.auth.getSession();

  if (error || !data.session) {
    console.error("❌ Erreur session OAuth :", error);
    return NextResponse.redirect(new URL("/login", req.url)); // Rediriger en cas d'échec
  }

  // 🔹 Créer un cookie avec `cookie.serialize()`
  const authCookie = cookie.serialize("supabaseToken", data.session.access_token, {
    httpOnly: true, // Sécurise contre l'accès JS
    secure: process.env.NODE_ENV === "production", // HTTPS en prod uniquement
    path: "/",
    sameSite: "lax", // Évite les attaques CSRF
    maxAge: 60 * 60 * 24 * 7, // Expire dans 7 jours
  });

  console.log("✅ Connexion réussie :", data.session.user.email);

  // 🔹 Retourner une réponse avec le cookie attaché
  const response = NextResponse.redirect(new URL("/dashboard", req.url));
  response.headers.set("Set-Cookie", authCookie);

  return response;
}
