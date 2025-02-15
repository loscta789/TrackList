import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

// ✅ Récupérer les messages d'un groupe
export async function GET(req: Request, context: { params: { id: string } }) {

  console.log("get")
  const { id: groupId } = await context.params; // ✅ Pas besoin de `await`




  console.log("groupId", groupId)

  if (!groupId) {
    return NextResponse.json({ error: "Group ID is required" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("group_messages")
    .select(`
      id, content, created_at, user_id,
      profiles (username, avatar)
    `)
    .eq("group_id", groupId)
    .order("created_at", { ascending: true });

  if (error) {
    console.error("❌ Error fetching messages:", error.message);
    return NextResponse.json({ error: "Could not fetch messages" }, { status: 500 });
  }

  return NextResponse.json(data);
}

// ✅ Envoyer un message dans un groupe
