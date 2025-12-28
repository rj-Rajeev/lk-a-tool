import { NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";
import { cookies } from "next/headers";
import { findUserByEmail } from "@/modules/user/user.repository";



export async function GET(request: Request) {
  const cookieStore = await cookies()
  const appToken = cookieStore.get("AppToken")?.value || cookieStore.get("app_token")?.value;

  if (!appToken) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const decodedUser: any = verifyToken(appToken);
    if (!decodedUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const currUser =  await findUserByEmail(decodedUser.email);
    
    return NextResponse.json(currUser);
  } catch (e) {
    return NextResponse.json({ error: "Invalid token" }, { status: 403 });
  }
}
