import { supabase } from "@/lib/supabaseClient";


export async function getUserGroups(userId: string | undefined) {
  console.log("🔄 Exécution de getUserGroups()", userId);

  if (!userId) {
    console.error("❌ Erreur : userId est undefined !");
    return [];
  }

  // 🔥 Récupération des groupes liés à l'utilisateur
  const { data, error } = await supabase
    .from("group_members")
    .select("group_id, groups(id, name)")
    .eq("user_id", userId);

  if (error) {
    console.error("❌ Erreur Supabase :", error.message);
    return [];
  }

  // console.log("📌 Données reçues de Supabase :", JSON.stringify(data, null, 2));

  // ✅ Mapping des données pour avoir un tableau propre
  return data.map((g: any) => ({
    id: g.groups?.id || g.group_id, // Utilise l'id de groups si dispo, sinon group_id
    name: g.groups?.name || "Nom inconnu",
  }));
}






export async function joinGroup(joinCode: string) {
  const res = await fetch("/api/group/join", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ joinCode }),
    credentials: "include",
  });

  return res.json(); // ✅ Renvoie la réponse de l’API
}


export async function getGroupDetails(groupId: string) {

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/group/${groupId}`, {
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  });

  if (!res.ok) {
    console.log("res not ok");
    console.error("❌ Erreur lors de la récupération du groupe :", res.statusText);
    return null;
  }

  const data = await res.json();

  // ✅ Vérifier que chaque membre a bien un tableau `items`
  if (data && data.members) {
    data.members = data.members.map((user: any) => ({
      ...user,
      items: Array.isArray(user.items) ? user.items : [], // ✅ Force un tableau vide si `items` est `undefined`
    }));
  }
  
  console.log("la vrai data", data);
  return {response : {
    data:data,
    currentUserId:data.currentUserId,
  }}
}




export async function fetchGroupDetails(groupId: string) {
  try {
    const response = await fetch(`/api/group/${groupId}`);
    if (!response.ok) {
      throw new Error("Failed to fetch group details");
    }



    return await response.json();
  } catch (error) {
    console.error("Error fetching group details:", error);
    return null;
  }
}
