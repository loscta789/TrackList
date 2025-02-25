import { NextRequest, NextResponse } from "next/server";
import { getSupabaseServer, isGroupAdmin} from "@/lib/auth";

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    
    const userId = req.headers.get("x-user-id");
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 }); // Verify authentification
    }

    const itemId = params?.id; // Get the item ID from the URL
    if (!itemId) {
      return NextResponse.json({ error: "ID de l'élément requis." }, { status: 400 });
    }

    const supabase = await getSupabaseServer();
    

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


      const { error} = await supabase // Delete the item from the database
        .from("group_items")
        .delete()
        .eq("id", itemId);

      if (error) {
        return NextResponse.json({ error: "Erreur lors de la suppression de l'élément." }, { status: 500 });
      }

      return true;



  } catch (error) {
    console.error("❌ Server Error:", error);
    return NextResponse.json({ error: "Erreur interne du serveur." }, { status: 500 });
  }
}
