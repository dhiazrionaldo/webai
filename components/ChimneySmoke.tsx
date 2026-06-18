"use client";

import { motion } from "framer-motion";

// ─── CHIMNEY SMOKE — asap TEPAT di ujung cerobong, naik lurus ─────────────────
// Anchor (left, top) = ujung cerobong. Puff naik dari titik itu (drift minim).
export function ChimneySmoke({
  left, top, scale = 1, delay = 0,
}: {
  left: string; top: string; scale?: number; delay?: number;
}) {
  const puffs = [
    { id: 1, delay: delay + 0,   duration: 3.6 },
    { id: 2, delay: delay + 0.9, duration: 3.9 },
    { id: 3, delay: delay + 1.8, duration: 3.4 },
    { id: 4, delay: delay + 2.7, duration: 4.1 },
  ];

  const puffSize = 34 * scale;

  return (
    <div
      className="absolute pointer-events-none"
      style={{ left, top, zIndex: 15, transform: "translate(-50%, -100%)" }}
    >
      {puffs.map((p) => (
        <motion.div
          key={p.id}
          className="absolute"
          style={{ left: -puffSize / 2, bottom: 0 }}
          animate={{
            y:       [0,    -26 * scale, -56 * scale, -92 * scale],
            x:       [0,      2 * scale,   4 * scale,   7 * scale],
            scale:   [0.4,    0.9,         1.5,         2.1],
            opacity: [0.92,   0.85,        0.5,         0],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: [0.2, 0.6, 0.8, 1],
          }}
        >
          <svg width={puffSize} height={puffSize} viewBox="0 0 40 40" fill="none">
            <circle cx="20" cy="20" r="18" fill="rgba(216,226,236,0.92)" />
            <circle cx="12" cy="24" r="11" fill="rgba(222,231,239,0.88)" />
            <circle cx="28" cy="24" r="10" fill="rgba(211,223,233,0.88)" />
            <circle cx="20" cy="14" r="13" fill="rgba(226,234,241,0.9)" />
            <circle cx="14" cy="13" r="5" fill="rgba(255,255,255,0.55)" />
            <circle cx="24" cy="10" r="3" fill="rgba(255,255,255,0.4)" />
          </svg>
        </motion.div>
      ))}
    </div>
  );
}
