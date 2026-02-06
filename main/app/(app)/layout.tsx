import { Sidebar } from "@/components/dashboard/sidebar/Sidebar";
import Header from "@/components/Header";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <div className="relative flex flex-1">
        <Sidebar />
        <main className="flex-1 mt-20 px-4 py-6">
          {children}
        </main>
      </div>
    </div>
  );
}
