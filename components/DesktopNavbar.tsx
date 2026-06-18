"use client";

import Link from "next/link";
import { navLinks } from "../data/siteData";

// ─── DESKTOP NAVBAR ───────────────────────────────────────────────────────────
export function DesktopNavbar() {
  return (
    <nav
      className="absolute top-0 left-0 right-0 z-30 flex items-center justify-end px-8"
      style={{ height: 52, background: "rgba(255,255,255,0.92)", backdropFilter: "blur(12px)", borderBottom: "1px solid rgba(0,0,0,0.06)" }}
    >
      <div className="flex items-center gap-8">
        {navLinks.map((label) => (
          <Link
            key={label}
            href="#"
            className="text-sm font-medium transition-colors duration-150"
            style={{ color: "#1a1a2e" }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#e05a00")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "#1a1a2e")}
          >
            {label}
          </Link>
        ))}
      </div>
    </nav>
  );
}
