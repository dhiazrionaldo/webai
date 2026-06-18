"use client";

import { motion } from "framer-motion";

// ─── BIRDS — burung kartun terbang melintasi langit ────────────────────────────
// Posisi di langit: top 5–22%, lintas dari kiri ke kanan (atau sebaliknya)
// Sayap dikepakkan dengan CSS SVG animate

interface BirdProps {
  id: number;
  top: string;
  startX: string;
  endX: string;
  duration: number;
  delay: number;
  scale: number;
  opacity: number;
  flap: number; // durasi kepak sayap (detik)
  reverse?: boolean; // terbang dari kanan ke kiri
}

function BirdSVG({ scale, flap }: { scale: number; flap: number }) {
  const w = 48 * scale;
  const h = 22 * scale;
  return (
    <svg width={w} height={h} viewBox="0 0 48 22" fill="none">
      {/* Sayap kiri — kepak ke atas/bawah */}
      <path fill="#2A2A2A">
        <animate
          attributeName="d"
          dur={`${flap}s`}
          repeatCount="indefinite"
          values="
            M24,11 Q16,4 6,2 Q12,8 14,11 Z;
            M24,11 Q16,14 6,18 Q12,14 14,11 Z;
            M24,11 Q16,4 6,2 Q12,8 14,11 Z
          "
        />
      </path>
      {/* Sayap kanan — kepak berlawanan */}
      <path fill="#2A2A2A">
        <animate
          attributeName="d"
          dur={`${flap}s`}
          repeatCount="indefinite"
          values="
            M24,11 Q32,4 42,2 Q36,8 34,11 Z;
            M24,11 Q32,14 42,18 Q36,14 34,11 Z;
            M24,11 Q32,4 42,2 Q36,8 34,11 Z
          "
        />
      </path>
      {/* Badan burung */}
      <ellipse cx="24" cy="11.5" rx="5.5" ry="3" fill="#1A1A1A" />
      {/* Kepala */}
      <circle cx="29.5" cy="9.5" r="3.2" fill="#1A1A1A" />
      {/* Paruh */}
      <path d="M32.5,9 L36,8.5 L32.5,10 Z" fill="#E8A020" />
      {/* Mata */}
      <circle cx="31" cy="9" r="1.2" fill="white" />
      <circle cx="31.3" cy="9" r="0.7" fill="#111" />
      {/* Ekor */}
      <path d="M18.5,12 L12,10 L13,13.5 L18.5,12.5 Z" fill="#2A2A2A" />
    </svg>
  );
}

const birdsData: BirdProps[] = [
  // Formasi 1 — kiri ke kanan, langit atas
  { id: 1,  top: "6%",  startX: "-8%",  endX: "110%", duration: 28, delay: 0,    scale: 0.9,  opacity: 0.92, flap: 0.42 },
  { id: 2,  top: "9%",  startX: "-12%", endX: "110%", duration: 30, delay: -1.2, scale: 0.75, opacity: 0.85, flap: 0.38 },
  { id: 3,  top: "7%",  startX: "-16%", endX: "110%", duration: 29, delay: -2.1, scale: 0.65, opacity: 0.80, flap: 0.45 },
  // Formasi 2 — kiri ke kanan, agak bawah
  { id: 4,  top: "14%", startX: "-5%",  endX: "110%", duration: 34, delay: -8,   scale: 0.8,  opacity: 0.88, flap: 0.40 },
  { id: 5,  top: "17%", startX: "-9%",  endX: "110%", duration: 36, delay: -10,  scale: 0.60, opacity: 0.75, flap: 0.35 },
  { id: 6,  top: "15%", startX: "-13%", endX: "110%", duration: 35, delay: -11.5,scale: 0.50, opacity: 0.70, flap: 0.48 },
  // Formasi 3 — kanan ke kiri
  { id: 7,  top: "10%", startX: "110%", endX: "-8%",  duration: 40, delay: -15,  scale: 0.7,  opacity: 0.82, flap: 0.44, reverse: true },
  { id: 8,  top: "13%", startX: "112%", endX: "-10%", duration: 42, delay: -18,  scale: 0.55, opacity: 0.72, flap: 0.36, reverse: true },
  // Burung tunggal
  { id: 9,  top: "5%",  startX: "110%", endX: "-6%",  duration: 22, delay: -5,   scale: 1.0,  opacity: 0.90, flap: 0.50, reverse: true },
  { id: 10, top: "20%", startX: "-4%",  endX: "110%", duration: 45, delay: -20,  scale: 0.45, opacity: 0.65, flap: 0.32 },
  { id: 11, top: "8%",  startX: "-6%",  endX: "110%", duration: 32, delay: -6,   scale: 0.85, opacity: 0.88, flap: 0.41 },
  { id: 12, top: "18%", startX: "108%", endX: "-5%",  duration: 38, delay: -25,  scale: 0.65, opacity: 0.78, flap: 0.39, reverse: true },
];

export function Birds() {
  return (
    <>
      {birdsData.map((b) => (
        <motion.div
          key={b.id}
          className="absolute pointer-events-none z-20"
          style={{
            top: b.top,
            left: b.startX,
            opacity: b.opacity,
          }}
          animate={{ x: [0, b.reverse ? "-120vw" : "120vw"] }}
          transition={{
            duration: b.duration,
            delay: b.delay,
            repeat: Infinity,
            ease: "linear",
            repeatDelay: 0,
          }}
        >
          <div style={{ transform: b.reverse ? "scaleX(-1)" : "scaleX(1)" }}>
            <BirdSVG scale={b.scale} flap={b.flap} />
          </div>
        </motion.div>
      ))}
    </>
  );
}
