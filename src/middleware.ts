import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getSupabaseServer } from "@/lib/auth"

export async function middleware(req: Request) {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("sb-access-token")?.value; 
  const refreshToken = cookieStore.get("sb-refresh-token")?.value;


  // console.log("🔐 Access token:", accessToken);

  if (!accessToken) {
    console.log("okzz")
    return handleUnauthorized(req);
  }

  const supabase = await getSupabaseServer();
  const { data: user, error } = await supabase.auth.getUser();

  if (error?.message === "JWT expired" && refreshToken) {
    console.log("🔄 Session expired, refreshing session...");
  
    const { data, error: refreshError } = await supabase.auth.refreshSession({refresh_token: refreshToken});

    if (refreshError) {
      console.log("❌ Error refreshing session:", refreshError.message);
      return handleUnauthorized(req);
    }

    if (!data.session) {
      console.log("❌ No session data returned from refresh");
      return handleUnauthorized(req);
    }

    cookieStore.set("sb-access-token", data.session.access_token, { httpOnly: true, secure: true, path: "/" });
    cookieStore.set("sb-refresh-token", data.session.refresh_token, { httpOnly: true, secure: true, path: "/" });


  }
  



  // ✅ Successfully refreshed the session, update the cookies
 

  // ✅ Attach `user_id` to request headers for later use in API routes or Server Components
  const requestHeaders = new Headers(req.headers);
  if (user?.user?.id) {
    requestHeaders.set("x-user-id", user.user.id);
  } else {
    return handleUnauthorized(req);
  }

  return NextResponse.next({ headers: requestHeaders });
}

function handleUnauthorized(req: Request) {
  const isApiRequest = req.url.includes("/api/");
  
  if (isApiRequest) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 }); // ✅ API returns JSON
  } else {
    return NextResponse.redirect(new URL("/login", req.url)); // ✅ Pages redirect to login
  }
}

// ✅ Apply middleware only to protected routes
export const config = {
  matcher: ["/api/items", "/api/chat", "/api/user/profile", "/api/group/:id", "/group/:id"],  // 🔹 Define where authentication is required
};
