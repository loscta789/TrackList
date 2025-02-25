import { createServerClient } from "@supabase/ssr";
import { SupabaseClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";


export async function getSupabaseServer() {
  const cookieStore = cookies();
  const accessToken = (await cookieStore).get("sb-access-token")?.value; // ✅ Extract access token

  if (!accessToken) {
    console.error(" No access token found in cookies.");
    throw new Error("AuthSessionMissingError: No auth session found!");
  }

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      global: {
        headers: { Authorization: `Bearer ${accessToken}` }, // ✅ Pass token explicitly
      },
      cookies: {
        getAll: async () => (await cookieStore).getAll(),
        setAll: async (newCookies) => {
          newCookies.forEach(async (cookie) => {
            (await cookieStore).set(cookie.name, cookie.value, cookie.options);
          });
        },
      },
    }
  );

  return supabase;
}


/* export async function getAuthenticatedUser() {
  const supabase = await getSupabaseServer();
  const { data: user, error } = await supabase.auth.getUser();

  if (error || !user) return { user: null, error: "Unauthorized" };
  return { user, error: null };
}
 */

export async function isGroupAdmin(groupId: string, userId: string, supabase:SupabaseClient) : Promise<boolean> {
  const { data: groupAdmin, error } = await supabase
    .from("group_members")
    .select("role")
    .eq("group_id", groupId)
    .eq("user_id", userId)
    .single();

  if (error || !groupAdmin) {
    return false
  }
  return true
}

export async function isGroupMember(groupId: string, userId: string, supabase:SupabaseClient) : Promise<boolean> {
  const { data: groupMember, error } = await supabase
    .from("group_members")
    .select("role")
    .eq("group_id", groupId)
    .eq("user_id", userId)
    .single();

  if (error || !groupMember) {
    return false
  }
  return true
}




