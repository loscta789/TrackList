import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { getSupabaseServer } from "@/lib/auth";

export async function DELETE() {

  const supabase = await getSupabaseServer();
  const cookieStore = cookies();

  
  const { error } = await supabase.auth.signOut();

  if (error) {
    return NextResponse.json({ error: "Erreur lors de la déconnexion" }, { status: 500 });
  }

  (await cookieStore).set("sb-access-token", "", {expires : new Date(0)});
  (await cookieStore).set("sb-refresh-token", "", {expires : new Date(0)});
  

  console.log("🚪 Déconnexion réussie !");
  
  const response = NextResponse.json({ message: "Déconnexion réussie" });


  return response;
}
