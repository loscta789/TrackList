import { supabase } from "../../lib/supabaseClient";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    const { name, adminId } = req.body;

    // ✅ Vérifie si l'utilisateur a un abonnement actif
    const { data: admin, error: adminError } = await supabase
      .from("users")
      .select("*")
      .eq("id", adminId)
      .single();

    if (adminError || !admin || admin.subscription_status !== "subscribed") {
      return res.status(403).json({ error: "Vous devez être abonné pour créer un groupe" });
    }

    // ✅ Crée le groupe
    const { data, error } = await supabase
      .from("groups")
      .insert([{ name, admin_id: adminId }])
      .select("id")
      .single();

    if (error || !data) {
      return res.status(500).json({ error: error?.message || "Erreur lors de la création du groupe" });
    }

    // ✅ Ajoute l'admin comme membre du groupe
    const { error: memberError } = await supabase
      .from("group_members")
      .insert([{ group_id: data.id, user_id: adminId, role: "admin" }]);

    if (memberError) {
      return res.status(500).json({ error: "Erreur lors de l'ajout de l'admin au groupe" });
    }

    return res.status(201).json({ message: "Groupe créé avec succès", group: data });
  }

  res.setHeader("Allow", ["POST"]);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}
