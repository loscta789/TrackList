import { supabase } from "@/lib/supabaseClient";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const groupId = url.searchParams.get("groupId");

  if (!groupId) {
    return NextResponse.json({ error: "Group ID is required" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("group_messages")
    .select("id, content, created_at, user_id, profiles(username)")
    .eq("group_id", groupId)
    .order("created_at", { ascending: true });


  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  console.log("📦 Messages récupérés avec succès :", data);
  return NextResponse.json({ messages: data });
}
