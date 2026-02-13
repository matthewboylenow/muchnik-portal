"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { signOut } from "next-auth/react";
import { Scale, Bell, LogOut, User } from "lucide-react";
import { useState } from "react";

const navItems = [
  { href: "/portal/overview", label: "Overview" },
  { href: "/portal/locations", label: "Locations" },
  { href: "/portal/content", label: "Content" },
  { href: "/portal/reviews", label: "Reviews" },
];

export function PortalNav() {
  const pathname = usePathname();
  const [showMenu, setShowMenu] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-[var(--border-glass)] bg-[var(--bg-base)]/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-[var(--color-manhattan)]/10">
            <Scale className="w-4 h-4 text-[var(--color-manhattan)]" />
          </div>
          <span className="text-sm font-semibold text-[var(--text-primary)]">
            Muchnik Elder Law
          </span>
        </div>

        {/* Navigation */}
        <nav className="flex items-center gap-1">
          {navItems.map((item) => {
            const isActive = pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "relative px-4 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "text-[var(--text-primary)]"
                    : "text-[var(--text-tertiary)] hover:text-[var(--text-secondary)]"
                )}
              >
                {item.label}
                {isActive && (
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 w-8 rounded-full bg-[var(--color-manhattan)]" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-3">
          <button className="relative rounded-[var(--radius-md)] p-2 text-[var(--text-tertiary)] hover:text-[var(--text-secondary)] hover:bg-[var(--bg-glass-hover)] transition-colors">
            <Bell size={18} />
            <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-[var(--color-manhattan)]" />
          </button>

          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="flex items-center gap-2 rounded-[var(--radius-md)] p-2 text-[var(--text-tertiary)] hover:text-[var(--text-secondary)] hover:bg-[var(--bg-glass-hover)] transition-colors"
            >
              <div className="flex items-center justify-center w-7 h-7 rounded-full bg-[var(--bg-surface)]">
                <User size={14} />
              </div>
            </button>

            {showMenu && (
              <div className="absolute right-0 mt-2 w-48 rounded-[var(--radius-lg)] border border-[var(--border-glass)] bg-[var(--bg-elevated)] p-1 shadow-lg">
                <button
                  onClick={() => signOut({ callbackUrl: "/login" })}
                  className="flex w-full items-center gap-2 rounded-[var(--radius-md)] px-3 py-2 text-sm text-[var(--text-tertiary)] hover:text-[var(--color-negative)] hover:bg-[var(--color-negative)]/5 transition-colors"
                >
                  <LogOut size={16} />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Location color strip */}
      <div className="flex justify-center gap-2 pb-3">
        <span className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[10px] font-medium bg-[var(--color-manhattan)]/10 text-[var(--color-manhattan)]">
          <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-manhattan)]" />
          Manhattan
        </span>
        <span className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[10px] font-medium bg-[var(--color-staten-island)]/10 text-[var(--color-staten-island)]">
          <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-staten-island)]" />
          Staten Island
        </span>
        <span className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[10px] font-medium bg-[var(--color-morris-county)]/10 text-[var(--color-morris-county)]">
          <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-morris-county)]" />
          Morris County
        </span>
      </div>
    </header>
  );
}
