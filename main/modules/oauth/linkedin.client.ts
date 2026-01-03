type LinkedInTokenResponse = {
  access_token: string;
  expires_in: number;
  refresh_token?: string;
  refresh_token_expires_in?: number;
  id_token: string;
};

export const exchangeCodeForToken = async (
  code: string
): Promise<LinkedInTokenResponse> => {
  const params = new URLSearchParams({
    grant_type: "authorization_code",
    code,
    client_id: process.env.NEXT_PUBLIC_LINKEDIN_CLIENT_ID!,
    client_secret: process.env.LINKEDIN_CLIENT_SECRET!,
    redirect_uri: process.env.NEXT_PUBLIC_LINKEDIN_REDIRECT_URI!,
  });

  const res = await fetch("https://www.linkedin.com/oauth/v2/accessToken", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: params,
  });

  if (!res.ok) {
    throw new Error(await res.text());
  }

  return res.json();
};