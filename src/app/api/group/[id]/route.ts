import { NextResponse } from "next/server";
import { getSupabaseServer } from "@/lib/auth";
import { isGroupMember } from "@/lib/auth";
import {GroupInfo} from "@/app/group/[id]/_typings/groupInterfaces";
export async function GET(req: Request, {params} : { params : {id:string}}) {
  
  const userId = req.headers.get("x-user-id");

  if (!userId) {
    console.log("Unauthorized")
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  }

  const groupId = params.id;
  console.log("ID du groupe requis", groupId)


  if (!groupId) {
    console.log("ID du groupe requis")
    return NextResponse.json({ error: "ID du groupe requis" }, { status: 400 });
  }


  
  let response: GroupInfo;
  try {
  


    const supabase = await getSupabaseServer();
    const checkGroup = await isGroupMember(groupId, userId, supabase);

    if (!checkGroup) {
      console.log("Vous n'êtes pas membre de ce groupe")
      return NextResponse.json({ error: "Vous n'êtes pas membre de ce groupe" }, { status: 403 });
    }

    const { data, error } = await supabase
    .from("groups")
    .select(`
      id,
      name,
      join_code,
      created_at,
      max_participants,
      group_members (
        user_id,
        role,
        joined_at,
        profiles (
          username,
          avatar
        )
      ),
      group_items (
        id,
        content,
        state,
        user_id,
        created_at,
        details,
        profiles (
          username,
          avatar
        )
      )
    `)
    .eq("id", groupId)
    .single();


    if (error) {
      console.log("❌ Erreur lors de la recherche du groupe :", error);
      return NextResponse.json({ error: "Erreur lors de la recherche du groupe." }, { status: 500 });
    }

    if (!data) {
      return NextResponse.json({ error: "Groupe introuvable" }, { status: 404 });
    }

    response ={
      id: data.id,
      name: data.name,
      joinCode: data.join_code,
      created_at: data.created_at,
      max_participants: data.max_participants,
      members: data.group_members.map((member) => ({
        id: member.user_id,
        username: Array.isArray(member.profiles) ? member.profiles[0]?.username || "Utilisateur inconnu" : member.profiles?.username || "Utilisateur inconnu",
        avatar: Array.isArray(member.profiles) ? member.profiles[0]?.avatar || "" : member.profiles?.avatar || "",
        role: member.role || "user",
        joined_at: member.joined_at,
        items: data.group_items
          .filter((item) => item.user_id === member.user_id) // ✅ Automatically associate items
          .map((item) => ({
            id: item.id,
            content: item.content,
            state: item.state,
            details: item.details,
            created_at: item.created_at,
            username: Array.isArray(item.profiles) ? item.profiles[0]?.username || "Utilisateur inconnu" : item.profiles?.username || "Utilisateur inconnu",
            avatar: Array.isArray(item.profiles) ? item.profiles[0]?.avatar || "" : item.profiles?.avatar || "",
            user_id: item.user_id, // ✅ Ensure this matches GroupItem
          })),
      }))
    };

  } catch (error) {
    console.error("❌ Erreur interne du serveur :", error);
    return NextResponse.json({ error: "Erreur interne du serveur" }, { status: 500 });
  }

  return NextResponse.json({ group: response, currentUserId: userId });



};


