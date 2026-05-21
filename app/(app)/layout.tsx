import Nav from "@/components/Nav";
import { requireAuth } from "@/lib/auth";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  await requireAuth();
  return (
    <>
      <Nav />
      <main className="max-w-7xl mx-auto px-4 py-6">{children}</main>
    </>
  );
}
