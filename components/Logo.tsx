"use client";

import { motion } from "framer-motion";

// ─── LOGO ─────────────────────────────────────────────────────────────────────
export function Logo() {
  return (
    <motion.div
      className="absolute z-20"
      style={{ top: 64, right: 36 }}
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
    >
      <div
        className="font-black leading-none"
        style={{
          fontSize: 38,
          background: "linear-gradient(135deg, #FF6B00 0%, #FF3B30 60%, #e02020 100%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
          fontFamily: "'Segoe UI', system-ui, sans-serif",
          letterSpacing: "-0.5px",
        }}
      >
        Mulia <span style={{ fontStyle: "italic", fontFamily: "Georgia, serif" }}>AI</span>
      </div>
      <div
        style={{
          fontSize: 18,
          color: "#1a1a2e",
          fontFamily: "Georgia, 'Times New Roman', serif",
          fontStyle: "italic",
          fontWeight: 600,
          marginTop: -4,
          letterSpacing: "0.02em",
          paddingLeft: 2,
        }}
      >
        Learning Center
      </div>
    </motion.div>
  );
}
