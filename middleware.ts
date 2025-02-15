import { NextResponse } from "next/server";
import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

export async function middleware(req: Request) {
     console.log("middelware")
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });

  // ✅ Vérifier la session utilisateur
  const { data: { user }, error } = await supabase.auth.getUser();

  console.log("🔍 Vérification middleware | Utilisateur :", user, "Erreur :", error);

  // 🔥 Si l'utilisateur n'est pas connecté, on bloque l'accès
  if (error || !user) {
    return NextResponse.json({ error: "Non autorisé. Connectez-vous." }, { status: 401 });
  }

  console.log("continuez, user connecté")

  return res;
}

// ✅ Définir les routes API protégées
export const config = {
  matcher: "/api/items*", // 🔥 Protège toutes les routes API
};
