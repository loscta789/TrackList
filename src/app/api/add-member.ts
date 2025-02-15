import { supabase } from '../../lib/supabaseClient';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { groupId, userId, adminId } = req.body;

    // Vérifie si l'utilisateur qui invite est bien l'admin du groupe
    const { data: group } = await supabase
      .from('groups')
      .select('*')
      .eq('id', groupId)
      .eq('admin_id', adminId)
      .single();

    if (!group) {
      return res.status(403).json({ error: "Seul l'administrateur peut ajouter des membres" });
    }

    // Ajoute l'utilisateur au groupe
    const { data, error } = await supabase.from('group_members').insert([
      {
        group_id: groupId,
        user_id: userId,
        role: 'member',
      },
    ]);

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    res.status(201).json({ message: 'Membre ajouté avec succès', member: data });
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
