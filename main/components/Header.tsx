import { getAuth } from "@/lib/auth";
import Navbar from "./layout/Navbar";

export default async function Header() {
  const user = await getAuth();
  const provider = "LinkedIn";

  return <Navbar user={user} provider={provider} />;
}
