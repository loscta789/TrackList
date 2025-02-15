import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";
import * as cookie from "cookie";

export async function POST(req: Request) {
    console.log("post");
    const { group_id, content } = await req.json();

    console.log("group_id", group_id);
    console.log("content", content);

    if (!group_id || !content.trim()) {
        return NextResponse.json({ error: "Invalid message data" }, { status: 400 });
    }

    // 🔍 Récupérer le token depuis les cookies
    const cookies = cookie.parse(req.headers.get("cookie") || "");
    console.log("cookies recu", cookies);
    const access_token = cookies.supabaseToken;

    if (!access_token) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 🔹 Récupérer l'utilisateur authentifié
    const { data: user, error } = await supabase.auth.getUser(access_token);

    if (error || !user?.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user_id = user.user.id;
    console.log("Utilisateur authentifié", user_id);

    console.log("Données envoyées :", { user_id, group_id, content });

    // 🔍 Récupérer le `username` depuis `profiles`
    const { data: profiles, error: profileError } = await supabase
      .from("profiles")
      .select("username, avatar")
      .eq("id", user_id)
      .single();

    if (profileError || !profiles) {
        console.error("❌ Erreur lors de la récupération du profil :", profileError?.message);
        return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }


    // 🔹 Insérer le message avec `user_id`
    const { data: message, error: insertError } = await supabase
        .from("group_messages")
        .insert([{ user_id, group_id, content }])
        .select("*")
        .single()
        .throwOnError();

    if (insertError) {
        console.error("❌ Error sending message:", insertError.message);
        return NextResponse.json({ error: "Could not send message" }, { status: 500 });
    }

    console.log("✅ Message inséré avec succès :", message);

    // 🔍 Joindre le `username` dans la réponse
    const responseMessage = { ...message, profiles : { username:profiles.username, avatar:profiles.avatar} };

    return NextResponse.json(responseMessage);
}


export async function GET(req: Request) {
  const url = new URL(req.url);
  const groupId = url.searchParams.get("groupId");

  if (!groupId) {
    return NextResponse.json({ error: "Group ID is required" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("messages")
    .select("id, content, created_at, user_id, profiles(username)")
    .eq("group_id", groupId)
    .order("created_at", { ascending: true });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ messages: data });
}
