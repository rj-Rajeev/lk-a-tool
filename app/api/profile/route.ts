import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { verifyToken } from "@/lib/auth";

function parseCookie(cookieHeader: string | null, name: string) {
  if (!cookieHeader) return undefined;
  const pairs = cookieHeader.split(";").map((c) => c.trim());
  for (const p of pairs) {
    const [k, ...rest] = p.split("=");
    if (k === name) return rest.join("=");
  }
  return undefined;
}

export async function GET(request: Request) {
  const cookieHeader = request.headers.get("cookie");
  const appToken = parseCookie(cookieHeader, "AppToken") || parseCookie(cookieHeader, "app_token");
  if (!appToken) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const decoded: any = verifyToken(appToken);

    const [rows] = (await db.query("SELECT * FROM users WHERE email = ?", [decoded.email])) as unknown as [any[], any];
    return NextResponse.json(rows[0]);
  } catch (e) {
    return NextResponse.json({ error: "Invalid token" }, { status: 403 });
  }
}
