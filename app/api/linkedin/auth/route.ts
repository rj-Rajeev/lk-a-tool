import { getAuth } from "@/lib/auth";
import { trySilentLinkedInAuth } from "@/lib/providers/linkedin";
import { setAuthCookie } from "@/utils/auth/cookies";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const LINKEDIN_AUTH_URL =
    "https://www.linkedin.com/oauth/v2/authorization" +
    "?response_type=code" +
    `&client_id=${process.env.NEXT_PUBLIC_LINKEDIN_CLIENT_ID}` +
    `&redirect_uri=${process.env.NEXT_PUBLIC_LINKEDIN_REDIRECT_URI}` +
    "&state=foobar" +
    `&scope=${process.env.NEXT_PUBLIC_LINKEDIN_SCOPES}`;

  try {
    // 1. Check normal session
    const user = await getAuth();
    if (user) {
      return NextResponse.redirect(new URL("/profile/linkedin", request.url));
    }

    // 2. Try silent auth
    const silentSession = await trySilentLinkedInAuth();

    if (silentSession) {
      const response = NextResponse.redirect(
        new URL("/profile/linkedin", request.url)
      );
      setAuthCookie(response, silentSession);
      return response;
    }

    // 3. No session → redirect to LinkedIn OAuth
    return NextResponse.redirect(new URL(LINKEDIN_AUTH_URL, request.url));
  } catch (err) {
    console.error("Auth error:", err);

    // Fallback: send user to OAuth page to fix possible issues
    return NextResponse.redirect(new URL(LINKEDIN_AUTH_URL, request.url));
  }
}
