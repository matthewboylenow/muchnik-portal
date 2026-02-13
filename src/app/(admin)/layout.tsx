import { AdminSidebar } from "@/components/admin/AdminSidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[var(--bg-base)]">
      <AdminSidebar />
      <main className="ml-60 min-h-screen">
        <div className="mx-auto max-w-[1400px] px-8 py-8">{children}</div>
      </main>
    </div>
  );
}
