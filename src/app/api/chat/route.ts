import { getSupabaseServer } from "@/lib/auth";
import { NextResponse } from "next/server";
import { isGroupMember } from "@/lib/auth";

export async function POST(req: Request) {

  const userId = req.headers.get("x-user-id");

  if (!userId) {
    console.log("Unauthorized")
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { groupId, content } = await req.json();

  if (!groupId || !content) {
    console.log("Missing fields")
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const supabase = await getSupabaseServer();
  const checkGroup = await isGroupMember(groupId, userId, supabase);

  if (!checkGroup) {
    return NextResponse.json({ error: "You are not a member of this group" }, { status: 403 });
  }

  const { data, error } = await supabase
  .from("group_messages")
  .insert([{ group_id: groupId, user_id: userId, content }])
  .select("*, profiles(username)") // 🔥 Inclure le username
  .single();


  if (error) {
    console.log("err", error)
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  console.log("📦 Message sent successfully:", data);

  return NextResponse.json({ message: data });
}
