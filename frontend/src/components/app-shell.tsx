"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { NAV_ITEMS } from "@/lib/navigation";

type AppShellProps = {
  children: ReactNode;
};

export function AppShell({ children }: AppShellProps) {
  const pathname = usePathname();

  return (
    <div className="app-shell">
      <header className="top-bar">
        <div className="top-bar__brand">AQUAVIGIL</div>
        <nav className="top-bar__tabs">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={pathname === item.href ? "tab-link tab-link--active" : "tab-link"}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </header>

      <aside className="side-nav">
        <div className="side-nav__title">Vigilance Protocol v1.0</div>
        {NAV_ITEMS.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={pathname === item.href ? "side-link side-link--active" : "side-link"}
          >
            <span>{item.shortLabel}</span>
            <span>{item.label}</span>
          </Link>
        ))}
        <button className="primary-cta" type="button">
          Submit Evidence
        </button>
      </aside>

      <main className="page-canvas">{children}</main>
    </div>
  );
}
