"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { NAV_ITEMS } from "@/lib/navigation";
import { fetchIncidents } from "@/lib/telemetry-client";
import type { ReactNode } from "react";

type AppShellProps = {
  children: ReactNode;
};

export function AppShell({ children }: AppShellProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [isSubmittingEvidence, setIsSubmittingEvidence] = useState(false);

  async function onSubmitEvidence() {
    try {
      setIsSubmittingEvidence(true);
      const incidents = await fetchIncidents(100);
      const selectedIncidentId = incidents[0]?.incidentId;
      const targetUrl = selectedIncidentId
        ? `/ngo-reporting?incidentId=${encodeURIComponent(selectedIncidentId)}`
        : "/ngo-reporting";

      router.push(targetUrl);
    } finally {
      setIsSubmittingEvidence(false);
    }
  }

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
        <button className="primary-cta" type="button" onClick={onSubmitEvidence} disabled={isSubmittingEvidence}>
          {isSubmittingEvidence ? "Submitting..." : "Submit Evidence"}
        </button>
      </aside>

      <main className="page-canvas">{children}</main>
    </div>
  );
}
