"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { signOut } from "next-auth/react";
import {
  LayoutDashboard,
  Search,
  FileText,
  Swords,
  MapPin,
  Wrench,
  BarChart3,
  Settings,
  LogOut,
  Scale,
} from "lucide-react";

const navItems = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/keywords", label: "Keywords", icon: Search },
  { href: "/admin/content", label: "Content", icon: FileText },
  { href: "/admin/competitors", label: "Competitors", icon: Swords },
  { href: "/admin/locations", label: "Locations", icon: MapPin },
  { href: "/admin/technical", label: "Technical", icon: Wrench },
  { href: "/admin/reports", label: "Reports", icon: BarChart3 },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 z-40 flex h-screen w-60 flex-col border-r border-[var(--border-glass)] bg-[var(--bg-glass)] backdrop-blur-xl">
      {/* Logo */}
      <div className="flex items-center gap-3 px-5 py-6 border-b border-[var(--border-subtle)]">
        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-[var(--color-manhattan)]/10">
          <Scale className="w-4 h-4 text-[var(--color-manhattan)]" />
        </div>
        <div>
          <p className="text-sm font-semibold text-[var(--text-primary)]">SEO Intelligence</p>
          <p className="text-[10px] text-[var(--text-muted)]">Muchnik Elder Law</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-[var(--radius-md)] px-3 py-2 text-sm font-medium transition-all duration-150",
                isActive
                  ? "bg-[var(--bg-glass-active)] text-[var(--text-primary)] border-l-2 border-[var(--color-manhattan)]"
                  : "text-[var(--text-tertiary)] hover:text-[var(--text-secondary)] hover:bg-[var(--bg-glass-hover)]"
              )}
            >
              <item.icon size={18} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="px-3 py-4 border-t border-[var(--border-subtle)] space-y-1">
        <Link
          href="/admin/settings"
          className="flex items-center gap-3 rounded-[var(--radius-md)] px-3 py-2 text-sm text-[var(--text-tertiary)] hover:text-[var(--text-secondary)] hover:bg-[var(--bg-glass-hover)] transition-colors"
        >
          <Settings size={18} />
          Settings
        </Link>
        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="flex w-full items-center gap-3 rounded-[var(--radius-md)] px-3 py-2 text-sm text-[var(--text-tertiary)] hover:text-[var(--color-negative)] hover:bg-[var(--color-negative)]/5 transition-colors"
        >
          <LogOut size={18} />
          Logout
        </button>
      </div>
    </aside>
  );
}
