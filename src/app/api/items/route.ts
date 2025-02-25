import { NextResponse } from "next/server";
import { getSupabaseServer, isGroupMember, isGroupAdmin } from "@/lib/auth";

// ✅ Modifier un item existant
export async function PUT(req: Request) {
  try {

    const userId = req.headers.get("x-user-id");
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 }); // Verify authentification
    }

    const { itemId, newState } = await req.json(); // Restore the item ID from the client to update

    const supabase = await getSupabaseServer(); // Connect to Supabase
        
    
    const { data:item, error:itemError } = await supabase // Get the item from the database with the group_id and user_id
      .from("group_items")
      .select("id, group_id, user_id")
      .eq("id", itemId)
      .single();
          
    if (itemError || !item) {
      return NextResponse.json({ error: "Erreur lors de la recherche de l'élément." }, { status: 500 });
    }

    const isAdmin = await isGroupAdmin(item.group_id, userId, supabase); // Check admin status

    // ✅ If user is NOT the owner AND NOT an admin, block them
    if (!isAdmin && item.user_id !== userId) {
      return NextResponse.json({ error: "Vous n'êtes pas autorisé à supprimer cet élément." }, { status: 403 });
    }

    const { data, error } = await supabase
      .from("group_items")
      .update({state:newState})
      .eq("id", itemId)
      .select("*");

    if (!data || error) {
      return NextResponse.json({ error: "Erreur lors de la mise à jour de l'élément." }, { status: 500 });
    }


    return NextResponse.json({ success: true });

  } catch (error) {
    console.error("❌ Erreur interne du serveur :", error);
    return NextResponse.json({ error: "Erreur interne du serveur." }, { status: 500 });
  }
}

// ✅ Supprimer un item existant

export async function POST(req: Request) {
  try {

    const userId = req.headers.get("x-user-id");
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 }); // Verify authentification
    }

    const { groupId, content, details } = await req.json(); // Récupère la data du client

    if (!groupId || !content) {
      return NextResponse.json({ error: "Tous les champs sont requis." }, { status: 400 });
    
    }

    const supabase = await getSupabaseServer();

    const groupCheck = await isGroupMember(groupId, userId, supabase);

    if (!groupCheck) {
      return NextResponse.json({ error: "Vous n'êtes pas autorisé à ajouter un élément à ce groupe." }, { status: 403 });
    }

    // 🔹 Insérer et récupérer immédiatement l'élément ajouté
    const { data } = await supabase
      .from("group_items")
      .insert([{ group_id: groupId, content:content, user_id: userId, details:details }])
      .select("*"); // ✅ Récupère immédiatement les données ajoutées

    if (!data|| data.length === 0) {
      return NextResponse.json({ error: "Erreur lors de l'ajout de l'élément." }, { status: 500 });
    }

    return NextResponse.json({ success: true, data: data[0] }); // ✅ Renvoie uniquement l'élément ajouté

  } catch (error) {
    console.error("❌ Erreur interne du serveur :", error);
    return NextResponse.json({ error: "Erreur interne du serveur." }, { status: 500 });
  }
}
