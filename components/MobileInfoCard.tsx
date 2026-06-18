"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { HighlightAI } from "./HighlightAI";

// ─── MOBILE INFO CARD ─────────────────────────────────────────────────────────
export function MobileInfoCard({
  title, icon, href, delay,
}: {
  title: string; icon: string; href: string; delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
    >
      <Link href={href}>
        <motion.div
          className="flex items-center gap-3 rounded-xl px-4 py-3"
          style={{
            background: "rgba(20,23,72,0.95)",
            border: "1.5px solid rgba(255,255,255,0.1)",
            boxShadow: "0 4px 16px rgba(0,0,0,0.35)",
            backdropFilter: "blur(12px)",
          }}
          whileTap={{ scale: 0.97 }}
          animate={{ y: [0, -4, 0, -2, 0], rotate: [0, 0.4, 0, -0.4, 0] }}
          transition={{ duration: 3.8 + delay * 0.5, repeat: Infinity, ease: "easeInOut", delay }}
        >
          <div
            className="flex items-center justify-center rounded-lg flex-shrink-0"
            style={{ width: 40, height: 40, background: "rgba(255,184,0,0.15)", border: "1px solid rgba(255,184,0,0.3)", fontSize: 20 }}
          >
            {icon}
          </div>
          <div className="font-bold text-white leading-tight" style={{ fontSize: 14 }}>
            <HighlightAI text={title} />
          </div>
          <div className="ml-auto text-white opacity-40" style={{ fontSize: 18 }}>›</div>
        </motion.div>
      </Link>
    </motion.div>
  );
}
