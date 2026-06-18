"use client";

import { motion } from "framer-motion";

// ─── FORKLIFT — forklift bekerja di area loading/tangki pabrik ───────────────
// Dari screenshot: area loading/tangki di sekitar ~60–72% x, ~55–65% y
// Forklift bolak-balik pendek, garpu naik-turun

interface ForkliftConfig {
  id: number;
  top: string;
  startX: string;
  endX: string;
  duration: number;
  delay: number;
  scale: number;
  bodyColor: string;
  accentColor: string;
  // garpu: naik dulu atau turun dulu
  forkUp: boolean;
}

function ForkliftSVG({
  bodyColor,
  accentColor,
  scale,
  flip,
  forkY,      // posisi garpu: 0 = bawah (turun), -18 = atas (angkat)
}: {
  bodyColor: string;
  accentColor: string;
  scale: number;
  flip: boolean;
  forkY: number;
}) {
  const W = 52 * scale;
  const H = 50 * scale;

  return (
    <svg
      width={W}
      height={H}
      viewBox="0 0 52 50"
      fill="none"
      style={{ transform: flip ? "scaleX(-1)" : "scaleX(1)" }}
    >
      {/* Shadow */}
      <ellipse cx="28" cy="47.5" rx="18" ry="3" fill="rgba(0,0,0,0.18)" />

      {/* ─── MAST (tiang garpu) ─── */}
      <rect x="6" y="8" width="4" height="30" rx="2" fill="#888" />
      <rect x="10" y="8" width="4" height="30" rx="2" fill="#999" />
      {/* Rail dalam mast */}
      <rect x="7" y="10" width="2" height="26" rx="1" fill="#AAA" opacity="0.4" />

      {/* ─── GARPU (fork) — posisi bergerak naik-turun ─── */}
      <g transform={`translate(0, ${forkY})`}>
        {/* Tine kiri */}
        <rect x="1"  y="30" width="14" height="3"   rx="1.5" fill={accentColor} />
        <rect x="1"  y="33" width="3"  height="12"  rx="1.5" fill={accentColor} />
        {/* Tine kanan */}
        <rect x="7"  y="30" width="14" height="3"   rx="1.5" fill={accentColor} />
        <rect x="18" y="33" width="3"  height="12"  rx="1.5" fill={accentColor} />
        {/* Pallet/kotak yang dibawa (hanya saat garpu naik) */}
        {forkY < -6 && (
          <>
            <rect x="0" y="20" width="22" height="10" rx="2" fill="#C8A46A" />
            <rect x="2" y="21" width="18" height="8"  rx="1" fill="#B8944A" opacity="0.7" />
            {/* Garis pallet */}
            <rect x="2" y="24" width="18" height="1" rx="0.5" fill="rgba(0,0,0,0.2)" />
            <rect x="10" y="21" width="1.5" height="8" rx="0.75" fill="rgba(0,0,0,0.15)" />
          </>
        )}
      </g>

      {/* ─── BADAN forklift ─── */}
      <rect x="10" y="18" width="36" height="22" rx="4" fill={bodyColor} />
      {/* Panel badan */}
      <rect x="12" y="20" width="32" height="18" rx="3" fill={bodyColor} />
      {/* Kap mesin */}
      <rect x="12" y="20" width="20" height="10" rx="2" fill={accentColor} opacity="0.35" />
      {/* Grill */}
      <rect x="14" y="21.5" width="3" height="7" rx="1"   fill="rgba(0,0,0,0.25)" />
      <rect x="18" y="21.5" width="3" height="7" rx="1"   fill="rgba(0,0,0,0.25)" />
      <rect x="22" y="21.5" width="3" height="7" rx="1"   fill="rgba(0,0,0,0.25)" />

      {/* ─── KABIN / ROPS (roll cage) ─── */}
      {/* Tiang kiri */}
      <rect x="30" y="8"  width="3" height="18" rx="1.5" fill="#777" />
      {/* Tiang kanan */}
      <rect x="41" y="8"  width="3" height="18" rx="1.5" fill="#888" />
      {/* Atap */}
      <rect x="28" y="6"  width="18" height="4"  rx="2"   fill="#666" />
      {/* Kursi operator */}
      <rect x="32" y="22" width="10" height="5"  rx="2"   fill="#2C2C2C" />
      <rect x="32" y="22" width="10" height="2"  rx="1"   fill="#3A3A3A" />

      {/* ─── OPERATOR (orang duduk) ─── */}
      {/* Badan */}
      <rect x="34" y="17" width="7" height="8" rx="2" fill="#2B6CB0" />
      {/* Kepala */}
      <circle cx="37.5" cy="13.5" r="4" fill="#C8956C" />
      {/* Helm */}
      <ellipse cx="37.5" cy="11.5" rx="4.5" ry="2.5" fill="#F6C90E" />
      <rect x="33" y="12" width="9" height="2.5" rx="1.5" fill="#F6C90E" opacity="0.8" />
      {/* Tangan di setir */}
      <rect x="30" y="22" width="5" height="2" rx="1" fill="#C8956C" />

      {/* ─── Lampu depan ─── */}
      <circle cx="44" cy="30" r="2.5" fill="#FFF5B0" opacity="0.9" />
      <circle cx="44" cy="30" r="1.5" fill="#FFEE55" />
      <circle cx="44" cy="35" r="2"   fill="#FF4444" opacity="0.8" />

      {/* ─── Roda ─── */}
      {/* Roda belakang */}
      <circle cx="20" cy="43" r="6.5" fill="#1A1A1A" />
      <circle cx="20" cy="43" r="4.5" fill="#333" />
      <circle cx="20" cy="43" r="2"   fill="#555" />
      {/* Spoke */}
      <line x1="20" y1="38.5" x2="20" y2="47.5" stroke="#444" strokeWidth="1" />
      <line x1="15.5" y1="43" x2="24.5" y2="43" stroke="#444" strokeWidth="1" />
      {/* Roda depan */}
      <circle cx="40" cy="43" r="5.5" fill="#1A1A1A" />
      <circle cx="40" cy="43" r="3.8" fill="#333" />
      <circle cx="40" cy="43" r="1.7" fill="#555" />
      <line x1="40" y1="39.2" x2="40" y2="46.8" stroke="#444" strokeWidth="1" />
      <line x1="36.2" y1="43" x2="43.8" y2="43" stroke="#444" strokeWidth="1" />

      {/* Exhaust pipe */}
      <rect x="42" y="19" width="3" height="6" rx="1.5" fill="#555" />
    </svg>
  );
}

// Wrapper yang handle animasi garpu + gerak maju-mundur
// Flip direalisasikan dengan dua elemen bertumpuk (→ dan ←) yang toggle opacity,
// menghindari steps() easing yang tidak didukung framer-motion.
function AnimatedForklift({ config }: { config: ForkliftConfig }) {
  const forkKeys = config.forkUp
    ? [0, -18, -18, 0, 0, -18, -18, 0]
    : [-18, 0, 0, -18, -18, 0, 0, -18];

  return (
    <motion.div
      className="absolute pointer-events-none z-10"
      style={{ top: config.top }}
      animate={{ x: [config.startX, config.endX, config.startX] }}
      transition={{
        x: {
          duration: config.duration,
          delay: config.delay,
          repeat: Infinity,
          ease: "linear",
          times: [0, 0.5, 1],
        },
      }}
    >
        {/* Forklift menghadap KANAN — tampil paruh pertama (0→0.5) */}
        <motion.div
          style={{ display: "inline-block" }}
          animate={{ opacity: [1, 1, 0, 0, 1] }}
          transition={{
            duration: config.duration,
            delay: config.delay,
            repeat: Infinity,
            ease: "linear",
            times: [0, 0.48, 0.50, 0.98, 1],
          }}
        >
          <ForkliftSVG
            bodyColor={config.bodyColor}
            accentColor={config.accentColor}
            scale={config.scale}
            flip={false}
            forkY={0}
          />
        </motion.div>
        {/* Forklift menghadap KIRI — tampil paruh kedua (0.5→1) */}
        <motion.div
          style={{ position: "absolute", top: 0, left: 0, display: "inline-block" }}
          animate={{ opacity: [0, 0, 1, 1, 0] }}
          transition={{
            duration: config.duration,
            delay: config.delay,
            repeat: Infinity,
            ease: "linear",
            times: [0, 0.48, 0.50, 0.98, 1],
          }}
        >
          <ForkliftSVG
            bodyColor={config.bodyColor}
            accentColor={config.accentColor}
            scale={config.scale}
            flip={true}
            forkY={0}
          />
      </motion.div>
    </motion.div>
  );
}

const forkliftData: ForkliftConfig[] = [
  // Forklift 1 — jalan pinggir kolam kanan, lajur atas
  {
    id: 1,
    top: "44%",
    startX: "302%",
    endX: "370%",
    duration: 2,
    delay: -3,
    scale: 0.6,
    bodyColor: "#E67E22",
    accentColor: "#F39C12",
    forkUp: true,
  },
  // Forklift 2 — jalan pinggir kolam kanan, lajur bawah
  {
    id: 2,
    top: "45%",
    startX: "536%",
    endX: "575%",
    duration: 2,
    delay: -4,
    scale: 0.6,
    bodyColor: "#E74C3C",
    accentColor: "#C0392B",
    forkUp: false,
  },
  // Forklift 3 — area tangki/loading kiri, dekat gedung
  {
    id: 3,
    top: "47%",
    startX: "310%",
    endX: "415%",
    duration: 2,
    delay: -9,
    scale: 0.65,
    bodyColor: "#2980B9",
    accentColor: "#1A5276",
    forkUp: true,
  },
];

export function Forklifts() {
  return (
    <>
      {forkliftData.map((f) => (
        <AnimatedForklift key={f.id} config={f} />
      ))}
    </>
  );
}