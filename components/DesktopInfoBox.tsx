"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { HighlightAI } from "./HighlightAI";

// ─── DESKTOP INFO BOX ─────────────────────────────────────────────────────────
export function DesktopInfoBox({
  title, top, left, delay, showPin = false, href = "#",
}: {
  title: string; top: string; left: string; delay: number;
  showPin?: boolean; href?: string;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      className="absolute z-20"
      style={{ top, left, transform: "translate(-50%, -50%)" }}
      initial={{ opacity: 0, y: -20, scale: 0.85 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
    >
      <motion.div
        animate={hovered ? { y: 0 } : { y: [0, -7, 0, -4, 0], rotate: [0, 0.8, 0, -0.8, 0] }}
        transition={hovered ? {} : {
          duration: 3.5 + delay * 0.4,
          repeat: Infinity,
          ease: "easeInOut",
          delay: delay * 0.6,
        }}
      >
        <Link href={href}>
          <motion.div
            className="cursor-pointer select-none"
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            whileHover={{ scale: 1.08, y: -4 }}
            whileTap={{ scale: 0.96 }}
            transition={{ duration: 0.18 }}
          >
            <div
              className="px-5 py-3 rounded-lg font-bold text-white text-center leading-tight"
              style={{
                background: hovered ? "rgba(26,29,80,1)" : "rgba(20,23,72,0.92)",
                border: hovered ? "1.5px solid rgba(255,180,0,0.6)" : "1.5px solid rgba(255,255,255,0.12)",
                boxShadow: hovered
                  ? "0 10px 36px rgba(0,0,0,0.5), 0 0 0 2px rgba(255,180,0,0.2)"
                  : "0 4px 20px rgba(0,0,0,0.4)",
                backdropFilter: "blur(10px)",
                minWidth: 130,
                fontSize: 14,
                transition: "background 0.2s, border 0.2s, box-shadow 0.2s",
              }}
            >
              <HighlightAI text={title} />
            </div>
            <div
              className="mx-auto"
              style={{ width: 2, height: 28, background: "linear-gradient(to bottom, rgba(255,255,255,0.55), transparent)" }}
            />
            {showPin && (
              <motion.div
                className="flex justify-center"
                style={{ marginTop: -4 }}
                animate={{ scale: [1, 1.15, 1] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              >
                <svg width="26" height="34" viewBox="0 0 28 36" fill="none">
                  <path d="M14 0C6.268 0 0 6.268 0 14c0 9.625 14 22 14 22s14-12.375 14-22C28 6.268 21.732 0 14 0z" fill="#E53E3E" />
                  <circle cx="14" cy="14" r="5" fill="white" />
                </svg>
              </motion.div>
            )}
          </motion.div>
        </Link>
      </motion.div>
    </motion.div>
  );
}
