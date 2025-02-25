import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function createSupabaseServer() {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: async () => (await cookies()).getAll(),  // ✅ NEW: Use getAll()
        setAll: (newCookies) => {
          newCookies.forEach(async (cookie) => (await cookies()).set(cookie.name, cookie.value, cookie.options));
        }, // ✅ NEW: Use setAll()
      },
    }
  );
}
