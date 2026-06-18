"use client";

import { motion } from "framer-motion";

// ─── FISH — ikan menyelam ke air & meloncat keluar, di KOLAM kanan bawah ──────
// Anchor (left, top) = permukaan air. y=0 di permukaan, + = menyelam, - = loncat.
export function Fish() {
  const fishes = [
    {
      id: 1, left: "81%", top: "79%", scale: 1.0, delay: 0,   duration: 4.2,
      yKeys:       [18,  34,  18,   0,  -58,  -78,  -52,  -10,   18],
      rotKeys:     [0,    6,   0, -12,  -34,  -14,   22,   10,    0],
      opacityKeys: [0.25, 0.08, 0.25, 0.85,  1.0,  1.0,  1.0,  0.8,  0.25],
    },
    {
      id: 2, left: "86.5%", top: "81%", scale: 0.78, delay: 1.9, duration: 5.1,
      yKeys:       [15,  28,  15,   0,  -46,  -66,  -42,   -8,  15],
      rotKeys:     [0,    5,   0, -10,  -30,  -12,   18,    8,   0],
      opacityKeys: [0.25, 0.08, 0.25, 0.85,  1.0,  1.0,  1.0,  0.8, 0.25],
    },
    {
      id: 3, left: "83.5%", top: "83%", scale: 0.62, delay: 3.1, duration: 3.7,
      yKeys:       [12,  22,  12,   0,  -36,  -52,  -32,   -6,  12],
      rotKeys:     [0,    4,   0,  -8,  -25,  -10,   15,    6,   0],
      opacityKeys: [0.25, 0.08, 0.25, 0.85,  1.0,  1.0,  1.0,  0.8, 0.25],
    },
  ];

  return (
    <>
      {fishes.map((f) => (
        <motion.div
          key={f.id}
          className="absolute pointer-events-none z-10"
          style={{ left: f.left, top: f.top }}
          animate={{ y: f.yKeys, rotate: f.rotKeys, opacity: f.opacityKeys }}
          transition={{
            duration: f.duration,
            delay: f.delay,
            repeat: Infinity,
            ease: "easeInOut",
            times: [0, 0.1, 0.2, 0.32, 0.52, 0.62, 0.78, 0.9, 1],
          }}
        >
          <svg
            width={52 * f.scale}
            height={28 * f.scale}
            viewBox="0 0 52 28"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <ellipse cx="24" cy="14" rx="20" ry="11" fill="#C8D4DC" />
            <ellipse cx="25" cy="17" rx="13" ry="7" fill="#E8EEF2" opacity="0.85" />
            <path d="M12,8 Q17,4 22,8" stroke="#A8B8C4" strokeWidth="1" fill="none" />
            <path d="M18,6 Q23,2 28,6" stroke="#A8B8C4" strokeWidth="1" fill="none" />
            <path d="M8,12 Q13,8 18,12" stroke="#A8B8C4" strokeWidth="0.8" fill="none" />
            <path d="M42,6 L50,2 L48,14 L50,24 L42,20 Z" fill="#B0BCC8" />
            <line x1="43" y1="8"  x2="49" y2="4"  stroke="#98A8B4" strokeWidth="0.8" />
            <line x1="43" y1="14" x2="50" y2="14" stroke="#98A8B4" strokeWidth="0.8" />
            <line x1="43" y1="20" x2="49" y2="22" stroke="#98A8B4" strokeWidth="0.8" />
            <path d="M14,3 Q20,-3 28,3" fill="#BCC8D4" stroke="#A0B0BC" strokeWidth="0.8" />
            <path d="M18,25 Q22,30 28,25" fill="#BCC8D4" stroke="#A0B0BC" strokeWidth="0.8" />
            <ellipse cx="5" cy="15" rx="4" ry="3" fill="#E8A090" />
            <ellipse cx="5" cy="16" rx="2.5" ry="1.5" fill="#D07060" />
            <circle cx="11" cy="10" r="6" fill="white" />
            <circle cx="11" cy="10" r="4" fill="#2A4060" />
            <circle cx="11" cy="10" r="2" fill="#111" />
            <circle cx="13"  cy="8"  r="1.5" fill="white" />
            <path d="M16,5 Q24,3 32,7" stroke="white" strokeWidth="1.5" fill="none" opacity="0.4" />
          </svg>
        </motion.div>
      ))}

      {/* Ripple saat ikan menyelam masuk & keluar permukaan */}
      {fishes.map((f) => (
        <div
          key={`ripple-${f.id}`}
          className="absolute pointer-events-none"
          style={{ left: f.left, top: f.top, zIndex: 9 }}
        >
          {/* ripple saat keluar air (loncat) */}
          <motion.div
            style={{
              width: 8, height: 4, borderRadius: 999,
              border: "1.5px solid rgba(255,255,255,0.7)",
              position: "absolute", left: 12 * f.scale, top: 8 * f.scale,
            }}
            animate={{ scaleX: [1, 5], scaleY: [1, 2.5], opacity: [0.9, 0] }}
            transition={{
              duration: f.duration * 0.32,
              delay: f.delay + f.duration * 0.3,
              repeat: Infinity,
              repeatDelay: f.duration * 0.68,
              ease: "easeOut",
            }}
          />
          {/* splash saat masuk air lagi */}
          <motion.div
            style={{
              width: 10, height: 5, borderRadius: 999,
              border: "2px solid rgba(200,235,255,0.8)",
              position: "absolute", left: 8 * f.scale, top: 6 * f.scale,
            }}
            animate={{ scaleX: [1, 6], scaleY: [1, 2], opacity: [0.85, 0] }}
            transition={{
              duration: f.duration * 0.25,
              delay: f.delay + f.duration * 0.78,
              repeat: Infinity,
              repeatDelay: f.duration * 0.75,
              ease: "easeOut",
            }}
          />
        </div>
      ))}
    </>
  );
}
