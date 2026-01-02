import { NextResponse } from "next/server";
import { signToken } from "@/lib/auth";
import { exchangeCodeForToken } from "@/modules/oauth/linkedin.client";
import { decodeLinkedInIdToken } from "@/utils/auth/jwt.utils";
import { setAuthCookie } from "@/utils/auth/cookies";
import { handleLinkedInDbAuth } from "@/modules/oauth/linkedin-auth.service";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get("code");

    if (!code) {
      return NextResponse.json(
        { error: "Missing authorization code" },
        { status: 400 }
      );
    }
    
    const tokenData = await exchangeCodeForToken(code);
    console.log(tokenData.access_token);

    
    const decoded = decodeLinkedInIdToken(tokenData.id_token);

    const email = decoded.email;
    const name = decoded.name ?? null;
    const picture = decoded.picture ?? null;
    const providerUserId = decoded.sub as string;

    const accessTokenExpiresAt = new Date(
      Date.now() + tokenData.expires_in * 1000
    );

    const refreshTokenExpiresAt = tokenData.refresh_token_expires_in
      ? new Date(Date.now() + tokenData.refresh_token_expires_in * 1000)
      : null;

    const userId = await handleLinkedInDbAuth({
      email,
      name,
      picture,
      providerUserId,
      accessToken: tokenData.access_token,
      refreshToken: tokenData.refresh_token ?? null,
      accessTokenExpiresAt,
      refreshTokenExpiresAt,
    });

    const appToken = await signToken({ userId, email });

    const response = NextResponse.redirect(
      new URL("/profile/linkedin", request.url)
    );

    setAuthCookie(response, appToken);
    return response;
  } catch (err: unknown) {
    console.log(err);
    
    return NextResponse.json(err, { status: 500 });
  }
}
