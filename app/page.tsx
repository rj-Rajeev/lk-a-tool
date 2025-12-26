
const LINKEDIN_AUTH_URL =
  "https://www.linkedin.com/oauth/v2/authorization" +
  "?response_type=code" +
  `&client_id=${process.env.NEXT_PUBLIC_LINKEDIN_CLIENT_ID}` +
  `&redirect_uri=${process.env.LINKEDIN_REDIRECT_URI}` +
  "&state=foobar" +
  `&scope=${process.env.NEXT_PUBLIC_LINKEDIN_SCOPES}`;

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-black">
      <main className="w-full max-w-md rounded-xl bg-white p-10 shadow dark:bg-black">
        <a
          href={LINKEDIN_AUTH_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="block w-full rounded-lg bg-blue-600 px-6 py-3 text-center text-white font-medium hover:bg-blue-700"
        >
          Continue with LinkedIn
        </a>
      </main>
    </div>
  );
}
