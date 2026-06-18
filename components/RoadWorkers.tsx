"use client";

import { motion } from "framer-motion";

// ─── ROAD WORKERS — pekerja JALAN KAKI naik-turun di jalan sebelah kolam ──────
// Jalan di kiri kolam: ~x 61%, bergerak vertikal ~y 59%→84%.
// Perspektif: makin ke ATAS = jauh = kecil; ke BAWAH = dekat = besar.
export function RoadWorkers() {
  const workers = [
    { id: 1, left: "30%", topKeys: ["67%", "65%"], scaleKeys: [0.48, 0.52], duration: 1,   delay: 0,    helm: "#F6C90E", body: "#2B6CB0", skin: "#C8956C", face: 1  },
    { id: 2, left: "85%", topKeys: ["60%", "58%"], scaleKeys: [0.48, 0.48], duration: 1,   delay: -3,   helm: "#E86C00", body: "#2D8A4E", skin: "#D4A574", face: -1 },
    { id: 3, left: "83.5%", topKeys: ["60%", "58%"], scaleKeys: [0.52, 0.52], duration: 1,   delay: -6,   helm: "#EFEFEF", body: "#607080", skin: "#C8956C", face: 1  },
    { id: 4, left: "33%",   topKeys: ["68%", "65%"], scaleKeys: [0.50, 0.50], duration: 1,   delay: -1.5, helm: "#F6C90E", body: "#C0392B", skin: "#B07A4E", face: -1 },
    { id: 5, left: "35%", topKeys: ["62%", "64%"], scaleKeys: [0.48, 0.48], duration: 1, delay: -8,   helm: "#E86C00", body: "#1A4A8A", skin: "#D4A574", face: 1  },
  ];

  return (
    <>
      {workers.map((w) => (
        <motion.div
          key={w.id}
          className="absolute pointer-events-none z-10"
          style={{ left: w.left }}
          initial={{ top: w.topKeys[0], scale: w.scaleKeys[0], x: "-50%" }}
          animate={{ top: w.topKeys, scale: w.scaleKeys, x: "-50%" }}
          transition={{
            duration: w.duration,
            delay: w.delay,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "linear",
          }}
        >
          <svg
            width={28} height={48}
            viewBox="0 0 28 48"
            fill="none"
            style={{ transform: `scaleX(${w.face})` }}
          >
            {/* Shadow */}
            <ellipse cx="14" cy="46" rx="7" ry="2.5" fill="rgba(0,0,0,0.2)" />

            {/* Kaki kiri (jalan) */}
            <line x1="14" y1="32" x2="9" y2="45" stroke={w.body} strokeWidth="3.5" strokeLinecap="round">
              <animate attributeName="x2" values="9;19;9" dur="0.5s" repeatCount="indefinite" />
              <animate attributeName="y2" values="45;43;45" dur="0.5s" repeatCount="indefinite" />
            </line>
            {/* Kaki kanan (jalan) */}
            <line x1="14" y1="32" x2="19" y2="45" stroke={w.body} strokeWidth="3.5" strokeLinecap="round">
              <animate attributeName="x2" values="19;9;19" dur="0.5s" repeatCount="indefinite" />
              <animate attributeName="y2" values="43;45;43" dur="0.5s" repeatCount="indefinite" />
            </line>
            {/* Sepatu */}
            <ellipse cx="9" cy="45" rx="3" ry="1.8" fill="#333">
              <animate attributeName="cx" values="9;19;9" dur="0.5s" repeatCount="indefinite" />
            </ellipse>
            <ellipse cx="19" cy="45" rx="3" ry="1.8" fill="#333">
              <animate attributeName="cx" values="19;9;19" dur="0.5s" repeatCount="indefinite" />
            </ellipse>

            {/* Badan / rompi safety */}
            <rect x="7" y="18" width="14" height="14" rx="3" fill={w.body} />
            <rect x="7" y="24" width="14" height="2.5" rx="1" fill="rgba(255,255,255,0.55)" />
            <rect x="7" y="28" width="14" height="2.5" rx="1" fill="rgba(255,255,255,0.55)" />

            {/* Tangan kiri ayun */}
            <line x1="7" y1="21" x2="3" y2="30" stroke={w.body} strokeWidth="3.5" strokeLinecap="round">
              <animate attributeName="x2" values="3;6;3" dur="0.5s" repeatCount="indefinite" />
              <animate attributeName="y2" values="30;26;30" dur="0.5s" repeatCount="indefinite" />
            </line>
            {/* Tangan kanan ayun (fase berlawanan) */}
            <line x1="21" y1="21" x2="25" y2="30" stroke={w.body} strokeWidth="3.5" strokeLinecap="round">
              <animate attributeName="x2" values="25;22;25" dur="0.5s" repeatCount="indefinite" />
              <animate attributeName="y2" values="26;30;26" dur="0.5s" repeatCount="indefinite" />
            </line>

            {/* Leher */}
            <rect x="12" y="13" width="4" height="5" rx="2" fill={w.skin} />
            {/* Kepala */}
            <ellipse cx="14" cy="10" rx="7" ry="8" fill={w.skin} />
            <circle cx="11" cy="9" r="1.8" fill="white" />
            <circle cx="11" cy="9" r="1" fill="#3A2A1A" />
            <circle cx="17" cy="9" r="1.8" fill="white" />
            <circle cx="17" cy="9" r="1" fill="#3A2A1A" />
            <path d="M11,13 Q14,15.5 17,13" stroke="#8B5E3C" strokeWidth="1" fill="none" />
            {/* Helm */}
            <ellipse cx="14" cy="5" rx="8.5" ry="4.5" fill={w.helm} />
            <rect x="5.5" y="4" width="17" height="4" rx="2" fill={w.helm} opacity="0.85" />
            <ellipse cx="14" cy="3.5" rx="7.5" ry="4" fill={w.helm} />
            <rect x="4" y="7" width="20" height="2.5" rx="1.5" fill={w.helm === "#EFEFEF" ? "#DDD" : w.helm} opacity="0.7" />
          </svg>
        </motion.div>
      ))}
    </>
  );
}
