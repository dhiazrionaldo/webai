"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { navLinks } from "../data/siteData";

// ─── MOBILE NAVBAR ────────────────────────────────────────────────────────────
export function MobileNavbar() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <nav
        className="fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-4"
        style={{ height: 52, background: "rgba(255,255,255,0.95)", backdropFilter: "blur(12px)", borderBottom: "1px solid rgba(0,0,0,0.06)" }}
      >
        <div
          className="font-black"
          style={{
            fontSize: 20,
            background: "linear-gradient(135deg, #FF6B00, #FF3B30)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          Mulia <span style={{ fontStyle: "italic", fontFamily: "Georgia, serif" }}>AI</span>
        </div>

        <button
          onClick={() => setOpen((v) => !v)}
          className="flex flex-col justify-center items-center gap-[5px] w-10 h-10 rounded-lg"
          style={{ background: "rgba(20,23,72,0.08)" }}
          aria-label="Toggle menu"
        >
          <motion.span className="block rounded-full" style={{ width: 20, height: 2, background: "#1a1a2e", transformOrigin: "center" }}
            animate={open ? { rotate: 45, y: 7 } : { rotate: 0, y: 0 }} transition={{ duration: 0.22 }} />
          <motion.span className="block rounded-full" style={{ width: 20, height: 2, background: "#1a1a2e" }}
            animate={open ? { opacity: 0 } : { opacity: 1 }} transition={{ duration: 0.15 }} />
          <motion.span className="block rounded-full" style={{ width: 20, height: 2, background: "#1a1a2e", transformOrigin: "center" }}
            animate={open ? { rotate: -45, y: -7 } : { rotate: 0, y: 0 }} transition={{ duration: 0.22 }} />
        </button>
      </nav>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              className="fixed inset-0 z-30"
              style={{ background: "rgba(0,0,0,0.3)", backdropFilter: "blur(2px)" }}
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
            />
            <motion.div
              className="fixed left-0 right-0 z-40 px-4 pb-4"
              style={{ top: 52 }}
              initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="rounded-xl overflow-hidden" style={{ background: "rgba(255,255,255,0.97)", backdropFilter: "blur(16px)", border: "1px solid rgba(0,0,0,0.08)", boxShadow: "0 8px 32px rgba(0,0,0,0.18)" }}>
                {navLinks.map((label, i) => (
                  <Link key={label} href="#" onClick={() => setOpen(false)}>
                    <div
                      className="flex items-center justify-between px-5 py-4 active:bg-orange-50 transition-colors"
                      style={{ borderBottom: i < navLinks.length - 1 ? "1px solid rgba(0,0,0,0.06)" : "none" }}
                    >
                      <span className="font-semibold text-sm" style={{ color: "#1a1a2e" }}>{label}</span>
                      <span style={{ color: "#e05a00", fontSize: 16 }}>›</span>
                    </div>
                  </Link>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
