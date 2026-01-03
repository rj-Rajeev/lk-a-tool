import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const response =  NextResponse.redirect(
      new URL("/", request.url)
    );

  // Remove the AppToken cookie by setting it to empty and expiring immediately
  response.cookies.set("AppToken", "", {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    path: "/",       // ensure it matches the original cookie path
    expires: new Date(0), // expire immediately
  });

  return response;
}