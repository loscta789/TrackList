import { supabase } from "@/lib/supabaseClient";

export async function getUserGroups(userId: string | undefined) {

  console.log("🔄 Exécution de getUserGroups()", userId);

  if (!userId) {
    console.error("❌ Erreur : userId est undefined !");
    return [];
  }

  const { data, error } = await supabase
    .from("group_members")
    .select("group_id, groups!inner(id, name)")
    .eq("user_id", userId);

  if (error) {
    console.error("❌ Erreur lors de la récupération des groupes :", error.message);
    return [];
  }

  console.log(data, "data");
  return data.map((g) => ({ id: g.groups.id, name: g.groups.name }));
}




export async function joinGroup(joinCode: string, userId: string) {
  const res = await fetch("/api/group/join", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ joinCode, userId }),
  });

  return res.json(); // ✅ Renvoie la réponse de l’API
}


export async function getGroupDetails(groupId: string) {
  const res = await fetch(`/api/group/${groupId}`);

  if (!res.ok) {
    console.log("res not ok");
    console.error("❌ Erreur lors de la récupération du groupe :", res.statusText);
    return null;
  }

  const data = await res.json();

  // ✅ Vérifier que chaque membre a bien un tableau `items`
  if (data && data.members) {
    data.members = data.members.map((user) => ({
      ...user,
      items: Array.isArray(user.items) ? user.items : [], // ✅ Force un tableau vide si `items` est `undefined`
    }));
  }

  console.log("la vrai data", data);
  return data;
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
