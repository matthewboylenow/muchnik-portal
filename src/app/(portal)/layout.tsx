import { PortalNav } from "@/components/portal/PortalNav";

export default function PortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[var(--bg-base)]">
      <PortalNav />
      <main className="mx-auto max-w-7xl px-6 py-8">{children}</main>
      <footer className="border-t border-[var(--border-subtle)] py-4 text-center text-xs text-[var(--text-muted)]">
        Last updated: {new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
      </footer>
    </div>
  );
}
