import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: false, // ❌ Désactive le stockage en localStorage
    autoRefreshToken: true, // ✅ Active le rafraîchissement automatique des tokens avec cookies
    detectSessionInUrl: true, // ✅ Détecte la session OAuth après redirection
    storage: undefined, // ✅ Supprime l'option de stockage en `localStorage`
  },
});
