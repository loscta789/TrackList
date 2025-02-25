import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { accessToken, refreshToken } = await req.json();

  console.log("🔑 Token received on the server:", accessToken);

  if (!accessToken) {
    return NextResponse.json({ error: "No token provided" }, { status: 400 });
  }

  console.log("✅ Token received on the server:", accessToken);

  // ✅ Store the token in an HTTP-only cookie
  const response = NextResponse.json({ success: true });
  response.cookies.set("sb-access-token", accessToken, {
    httpOnly: true, // ✅ Prevent JavaScript access
    secure: process.env.NODE_ENV === "production", // Use HTTPS in production
    sameSite: "lax", // ✅ Protects against CSRF attacks
    path: "/", // ✅ Available on all routes
  });

  response.cookies.set("sb-refresh-token", refreshToken, {
    httpOnly: true, // ✅ Prevent JavaScript access
    secure: process.env.NODE_ENV === "production", // Use HTTPS in production
    sameSite: "lax", // ✅ Protects against CSRF attacks
    path: "/", // ✅ Available on all routes
  });

  return response;
}
