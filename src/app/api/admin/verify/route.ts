import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(request: Request) {
  try {
    const { token } = await request.json();
    const { verifyAdminToken } = await import("@/lib/db");

    const email = verifyAdminToken(token);
    
    if (email) {
      const cookieStore = await cookies();
      cookieStore.set("admin-verified", "true", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 60 * 60 * 4, // 4 hours verification
        path: "/",
      });

      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  } catch (err) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
