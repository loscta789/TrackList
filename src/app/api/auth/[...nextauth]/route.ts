import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { SupabaseAdapter } from "@auth/supabase-adapter";
import { supabase } from "@/lib/supabaseClient";
import { createClient } from "@supabase/supabase-js";



/* async function testSupabaseConnection() {
  const { data, error } = await supabaseAdmin.from("users").select("*").limit(1);
  if (error) {
    console.error("❌ Erreur de connexion à Supabase:", error.message);
  } else {
    console.log("✅ Supabase est bien connecté !");
  }
}


testSupabaseConnection(); */

export const authOptions: NextAuthOptions = {
  debug: true, // Active les logs dans la console
  logger: {
    error(code, metadata) {
      console.error("❌ NextAuth ERROR:", code, metadata);
    },
    warn(code) {
      console.warn("⚠️ NextAuth WARNING:", code);
    },
    debug(code, metadata) {
      console.debug("🔍 NextAuth DEBUG:", code, metadata);
    },
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  adapter: SupabaseAdapter({
    url: process.env.NEXT_PUBLIC_SUPABASE_URL!,
    secret: process.env.SUPABASE_SERVICE_ROLE_KEY!,
  }) ,
  session: { strategy: "jwt" },
  callbacks: {
    async session({ session, token }: { session: any; token: any }) {
      session.user.id = token.sub; // Associe l'ID utilisateur à la session
      return session;
    },
    async redirect({ url, baseUrl }: { url: string; baseUrl: string }) {
      return url.startsWith(baseUrl) ? url : baseUrl;
    },

  },

};

const handler = NextAuth(authOptions);

export const GET = handler;
export const POST = handler;
