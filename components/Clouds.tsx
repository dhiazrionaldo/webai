"use client";

import { motion } from "framer-motion";

// ─── CLOUDS — TIDAK DIUBAH (sudah sesuai permintaan) ──────────────────────────
export function Clouds() {
  const clouds = [
    { id: 1,  top: "5%",  left: "2%",   endX: "110vw", duration: 50, scale: 1.3,  opacity: 0.95 },
    { id: 2,  top: "13%", left: "-5%",  endX: "110vw", duration: 60, scale: 0.9,  opacity: 0.85 },
    { id: 3,  top: "20%", left: "8%",   endX: "110vw", duration: 70, scale: 0.6,  opacity: 0.75 },
    { id: 4,  top: "4%",  left: "28%",  endX: "110vw", duration: 55, scale: 1.0,  opacity: 0.88 },
    { id: 5,  top: "16%", left: "22%",  endX: "110vw", duration: 65, scale: 0.7,  opacity: 0.72 },
    { id: 6,  top: "9%",  left: "42%",  endX: "110vw", duration: 48, scale: 0.55, opacity: 0.65 },
    { id: 7,  top: "3%",  left: "58%",  endX: "110vw", duration: 52, scale: 1.1,  opacity: 0.90 },
    { id: 8,  top: "11%", left: "65%",  endX: "110vw", duration: 58, scale: 0.85, opacity: 0.80 },
    { id: 9,  top: "18%", left: "72%",  endX: "110vw", duration: 45, scale: 0.65, opacity: 0.70 },
    { id: 10, top: "6%",  left: "82%",  endX: "110vw", duration: 62, scale: 0.8,  opacity: 0.82 },
    { id: 11, top: "14%", left: "88%",  endX: "110vw", duration: 40, scale: 0.5,  opacity: 0.68 },
    { id: 12, top: "7%",  left: "105vw",endX: "-20%",  duration: 68, scale: 0.75, opacity: 0.78 },
    { id: 13, top: "21%", left: "95vw", endX: "-20%",  duration: 72, scale: 0.45, opacity: 0.60 },
    { id: 14, top: "2%",  left: "78%",  endX: "-20%",  duration: 80, scale: 0.6,  opacity: 0.65 },
  ];

  return (
    <>
      {clouds.map((c) => (
        <motion.div
          key={c.id}
          className="absolute pointer-events-none z-10"
          style={{ top: c.top, left: c.left, opacity: c.opacity }}
          animate={{ x: [0, c.endX === "-20%" ? "-120vw" : "120vw"] }}
          transition={{
            duration: c.duration,
            repeat: Infinity,
            ease: "linear",
            repeatDelay: 0,
          }}
        >
          <svg width={180 * c.scale} height={80 * c.scale} viewBox="0 0 180 80" fill="none">
            <ellipse cx="90" cy="58" rx="80" ry="24" fill="white" />
            <ellipse cx="60" cy="46" rx="36" ry="30" fill="white" />
            <ellipse cx="100" cy="38" rx="44" ry="34" fill="white" />
            <ellipse cx="138" cy="50" rx="32" ry="24" fill="white" />
            <ellipse cx="38" cy="54" rx="26" ry="20" fill="white" />
            <ellipse cx="120" cy="42" rx="28" ry="26" fill="white" />
            <ellipse cx="90" cy="72" rx="76" ry="9" fill="rgba(160,195,230,0.3)" />
          </svg>
        </motion.div>
      ))}
    </>
  );
}
