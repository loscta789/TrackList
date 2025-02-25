import { NextApiRequest, NextApiResponse } from "next";
import { supabase } from "../../lib/supabaseClient";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    const { groupId, userId, adminId } = req.body;

    // ✅ Vérifie si l'adminId correspond à l'admin du groupe
    const { data: group, error: groupError } = await supabase
      .from("groups")
      .select("*")
      .eq("id", groupId)
      .eq("admin_id", adminId)
      .single();

    if (groupError || !group) {
      return res.status(403).json({ error: "Seul l'administrateur peut ajouter des membres" });
    }

    // ✅ Ajoute l'utilisateur au groupe
    const { data, error } = await supabase
      .from("group_members")
      .insert([{ group_id: groupId, user_id: userId, role: "member" }]);

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    return res.status(201).json({ message: "Membre ajouté avec succès", member: data });
  }

  // ✅ Gérer les méthodes non supportées
  res.setHeader("Allow", ["POST"]);
  return res.status(405).end(`Method ${req.method} Not Allowed`);
}
