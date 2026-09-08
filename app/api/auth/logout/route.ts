import { NextResponse } from "next/server";
import crypto from "node:crypto";
import { eq } from "drizzle-orm";

import { db } from "@/lib/db";
import { sessions } from "@/lib/schema";

export async function POST(request: Request) {
  try {
    const cookieHeader = request.headers.get("cookie") || "";

    const match = cookieHeader.match(
      /(?:^|;\s*)rivo_session=([^;]+)/
    );

    const token = match?.[1];

    if (token) {
      const tokenHash = crypto
        .createHash("sha256")
        .update(token)
        .digest("hex");

      await db
        .delete(sessions)
        .where(eq(sessions.tokenHash, tokenHash));
    }

    const response = NextResponse.json({
      success: true,
    });

    response.cookies.set({
      name: "rivo_session",
      value: "",
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 0,
    });

    return response;
  } catch (error) {
    console.error("Logout error:", error);

    const response = NextResponse.json(
      { error: "Unable to log out." },
      { status: 500 }
    );

    response.cookies.set({
      name: "rivo_session",
      value: "",
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 0,
    });

    return response;
  }
}
