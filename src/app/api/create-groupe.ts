import { supabase } from '../../lib/supabaseClient';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { name, adminId } = req.body;

    // Vérifie si l'utilisateur a un abonnement actif
    const { data: admin } = await supabase
      .from('users')
      .select('*')
      .eq('id', adminId)
      .single();

    if (!admin || admin.subscription_status !== 'subscribed') {
      return res.status(403).json({ error: 'Vous devez être abonné pour créer un groupe' });
    }

    // Crée le groupe
    const { data, error } = await supabase.from('groups').insert([
      {
        name,
        admin_id: adminId,
      },
    ]);

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    // Ajoute l'admin comme membre du groupe
    await supabase.from('group_members').insert([
      {
        group_id: data[0].id,
        user_id: adminId,
        role: 'admin',
      },
    ]);

    res.status(201).json({ message: 'Groupe créé avec succès', group: data });
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
