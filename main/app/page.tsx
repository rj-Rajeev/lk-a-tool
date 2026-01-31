import { redirect } from "next/navigation";
import { getAuth } from "@/lib/auth";
import LandingClient from "./LandingClient";

export default async function LandingPage() {
  const user = await getAuth();
  if (user) redirect("/profile/linkedin");
  return <LandingClient />;
}