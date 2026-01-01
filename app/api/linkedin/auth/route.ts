import { getAuth } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function GET(request:Request) {
    const LINKEDIN_AUTH_URL =
    "https://www.linkedin.com/oauth/v2/authorization" +
    "?response_type=code" +
    `&client_id=${process.env.NEXT_PUBLIC_LINKEDIN_CLIENT_ID}` +
    `&redirect_uri=${process.env.NEXT_PUBLIC_LINKEDIN_REDIRECT_URI}` +
    "&state=foobar" +
    `&scope=${process.env.NEXT_PUBLIC_LINKEDIN_SCOPES}`;

    const user  = await getAuth();    

    if (!user) {
        return NextResponse.redirect(
        new URL(LINKEDIN_AUTH_URL, request.url)
        );
    }

    return NextResponse.redirect(
      new URL("/profile/linkedin", request.url)
    );
}