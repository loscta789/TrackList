import { NextResponse } from "next/server";
import * as cookie from "cookie";

export async function POST() {
  // 🔹 Supprimer le cookie en le mettant à vide
  const cookieHeader = cookie.serialize("supabaseToken", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    expires: new Date(0), // Expire immédiatement
    path: "/",
  });

  const cookieUserId = cookie.serialize("user_id", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    expires: new Date(0), // Expire immédiatement
    path: "/",
  });

  console.log("🚪 Déconnexion réussie !");
  
  const response = NextResponse.json({ message: "Déconnexion réussie" });
  response.headers.set("Set-Cookie", cookieHeader);
  response.headers.append("Set-Cookie", cookieUserId);

  return response;
}
