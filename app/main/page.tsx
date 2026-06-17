"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

// ─── RESPONSIVE HOOK ───────────────────────────────────────────────────────────
function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);
  return isMobile;
}

// ─── IMAGE ASPECT RATIO HOOK ──────────────────────────────────────────────────
// Mengukur AR asli Background.png agar "stage" punya rasio yang TEPAT sama dengan
// gambar. Dengan begini semua elemen (asap, ikan, truk, orang, box) nempel ke
// fitur gambar di SEMUA ukuran layar — tidak perlu adjust manual lagi.
function useImageAR(src: string, fallback = 2.11) {
  const [ar, setAr] = useState(fallback);
  useEffect(() => {
    if (typeof window === "undefined") return;
    const img = new window.Image();
    img.onload = () => {
      if (img.naturalWidth && img.naturalHeight) {
        setAr(img.naturalWidth / img.naturalHeight);
      }
    };
    img.src = src;
  }, [src]);
  return ar;
}

// ─── HIGHLIGHT HELPER ─────────────────────────────────────────────────────────
function HighlightAI({ text }: { text: string }) {
  const parts = text.split("AI");
  return (
    <>
      {parts.map((part, i) => (
        <React.Fragment key={i}>
          {part.split("\n").map((line, j) => (
            <React.Fragment key={j}>
              {j > 0 && <br />}
              {line}
            </React.Fragment>
          ))}
          {i < parts.length - 1 && (
            <span style={{ color: "#FFB800", fontWeight: 900 }}>AI</span>
          )}
        </React.Fragment>
      ))}
    </>
  );
}

// ─── CLOUDS — TIDAK DIUBAH (sudah sesuai permintaan) ──────────────────────────
function Clouds() {
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

// ─── CHIMNEY SMOKE — asap TEPAT di ujung cerobong, naik lurus ─────────────────
// Anchor (left, top) = ujung cerobong. Puff naik dari titik itu (drift minim).
function ChimneySmoke({
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

// ─── FISH — ikan menyelam ke air & meloncat keluar, di KOLAM kanan bawah ──────
// Anchor (left, top) = permukaan air. y=0 di permukaan, + = menyelam, - = loncat.
function Fish() {
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

// ─── ROAD WORKERS — pekerja JALAN KAKI naik-turun di jalan sebelah kolam ──────
// Jalan di kiri kolam: ~x 61%, bergerak vertikal ~y 59%→84%.
// Perspektif: makin ke ATAS = jauh = kecil; ke BAWAH = dekat = besar.
function RoadWorkers() {
  const workers = [
    { id: 1, left: "63.5%", topKeys: ["59%", "84%"], scaleKeys: [0.46, 0.82], duration: 11,   delay: 0,    helm: "#F6C90E", body: "#2B6CB0", skin: "#C8956C", face: 1  },
    { id: 2, left: "62.5%", topKeys: ["82%", "59%"], scaleKeys: [0.80, 0.48], duration: 13,   delay: -3,   helm: "#E86C00", body: "#2D8A4E", skin: "#D4A574", face: -1 },
    { id: 3, left: "64.2%", topKeys: ["64%", "80%"], scaleKeys: [0.52, 0.74], duration: 12,   delay: -6,   helm: "#EFEFEF", body: "#607080", skin: "#C8956C", face: 1  },
    { id: 4, left: "63%",   topKeys: ["78%", "61%"], scaleKeys: [0.72, 0.50], duration: 14,   delay: -1.5, helm: "#F6C90E", body: "#C0392B", skin: "#B07A4E", face: -1 },
    { id: 5, left: "64.5%", topKeys: ["61%", "79%"], scaleKeys: [0.48, 0.70], duration: 10.5, delay: -8,   helm: "#E86C00", body: "#1A4A8A", skin: "#D4A574", face: 1  },
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

// ─── FACTORY WORKERS — DIAM di tempat & seperti SEDANG BEKERJA (dekat tangki) ──
// Anchor (left, top) = posisi KAKI pekerja (translate -50%,-100%).
function Worker({
  left, top, scale, variant, helm, body, skin,
}: {
  left: string; top: string; scale: number;
  variant: "operate" | "clipboard" | "dig";
  helm: string; body: string; skin: string;
}) {
  const W = 28 * scale;
  const H = 48 * scale;
  const brim = helm === "#EFEFEF" ? "#DDD" : helm;

  return (
    <div
      className="absolute pointer-events-none z-10"
      style={{ left, top, transform: "translate(-50%, -100%)" }}
    >
      <svg width={W} height={H} viewBox="0 0 28 48" fill="none">
        {/* Shadow */}
        <ellipse cx="14" cy="46" rx="8" ry="2.5" fill="rgba(0,0,0,0.18)" />

        {/* Kaki diam (berdiri) */}
        <line x1="12" y1="32" x2="10" y2="45" stroke={body} strokeWidth="3.5" strokeLinecap="round" />
        <line x1="16" y1="32" x2="18" y2="45" stroke={body} strokeWidth="3.5" strokeLinecap="round" />
        <ellipse cx="10" cy="45" rx="3.5" ry="2" fill="#333" />
        <ellipse cx="18" cy="45" rx="3.5" ry="2" fill="#333" />

        {/* ── BAGIAN ATAS: badan + tangan + kepala, dibungkus group utk gerak kerja ── */}
        <g>
          {/* untuk variant "dig" & "clipboard": seluruh badan atas bergoyang halus */}
          {variant !== "operate" && (
            <animateTransform
              attributeName="transform"
              type="translate"
              values={variant === "dig" ? "0 0; 0 1.5; 0 0" : "0 0; 0 -1; 0 0"}
              dur={variant === "dig" ? "0.7s" : "2.4s"}
              repeatCount="indefinite"
            />
          )}

          {/* Badan / rompi safety */}
          <rect x="7" y="18" width="14" height="14" rx="3" fill={body} />
          <rect x="7" y="24" width="14" height="2.5" rx="1" fill="rgba(255,255,255,0.55)" />
          <rect x="7" y="28" width="14" height="2.5" rx="1" fill="rgba(255,255,255,0.55)" />

          {/* ── TANGAN sesuai variant ── */}
          {variant === "operate" && (
            <>
              {/* tangan kiri diam */}
              <line x1="7" y1="21" x2="2" y2="31" stroke={body} strokeWidth="3.5" strokeLinecap="round" />
              {/* tangan kanan memompa (operasikan alat) */}
              <line x1="21" y1="21" x2="26" y2="14" stroke={body} strokeWidth="3.5" strokeLinecap="round">
                <animate attributeName="y2" values="14;22;14" dur="0.55s" repeatCount="indefinite" />
                <animate attributeName="x2" values="26;24;26" dur="0.55s" repeatCount="indefinite" />
              </line>
              {/* alat di tangan (kunci/tuas) */}
              <rect x="24" y="11" width="3" height="7" rx="1" fill="#555">
                <animate attributeName="y" values="11;19;11" dur="0.55s" repeatCount="indefinite" />
              </rect>
            </>
          )}

          {variant === "clipboard" && (
            <>
              {/* tangan kiri memegang clipboard */}
              <line x1="7" y1="22" x2="2" y2="28" stroke={body} strokeWidth="3.5" strokeLinecap="round" />
              <rect x="-3" y="24" width="8" height="10" rx="1.5" fill="#F0F0F0" stroke="#999" strokeWidth="1" />
              <line x1="-1" y1="27" x2="3" y2="27" stroke="#888" strokeWidth="0.8" />
              <line x1="-1" y1="29" x2="3" y2="29" stroke="#888" strokeWidth="0.8" />
              <line x1="-1" y1="31" x2="1" y2="31" stroke="#888" strokeWidth="0.8" />
              {/* tangan kanan menunjuk/cek */}
              <line x1="21" y1="21" x2="25" y2="27" stroke={body} strokeWidth="3.5" strokeLinecap="round">
                <animate attributeName="y2" values="27;25;27" dur="1.2s" repeatCount="indefinite" />
              </line>
            </>
          )}

          {variant === "dig" && (
            <>
              {/* kedua tangan memegang alat & menyekop/menggali */}
              <line x1="7"  y1="21" x2="13" y2="28" stroke={body} strokeWidth="3.5" strokeLinecap="round">
                <animate attributeName="y2" values="28;24;28" dur="0.7s" repeatCount="indefinite" />
              </line>
              <line x1="21" y1="21" x2="15" y2="30" stroke={body} strokeWidth="3.5" strokeLinecap="round">
                <animate attributeName="y2" values="30;26;30" dur="0.7s" repeatCount="indefinite" />
              </line>
              {/* gagang alat */}
              <line x1="14" y1="26" x2="20" y2="38" stroke="#7A4A1A" strokeWidth="2" strokeLinecap="round">
                <animate attributeName="y2" values="38;34;38" dur="0.7s" repeatCount="indefinite" />
                <animate attributeName="x2" values="20;22;20" dur="0.7s" repeatCount="indefinite" />
              </line>
            </>
          )}

          {/* Leher */}
          <rect x="12" y="13" width="4" height="5" rx="2" fill={skin} />
          {/* Kepala */}
          <ellipse cx="14" cy="10" rx="7" ry="8" fill={skin} />
          <circle cx="11" cy="9" r="1.8" fill="white" />
          <circle cx="11" cy="9" r="1" fill="#3A2A1A" />
          <circle cx="17" cy="9" r="1.8" fill="white" />
          <circle cx="17" cy="9" r="1" fill="#3A2A1A" />
          <path d="M11,13 Q14,15.5 17,13" stroke="#8B5E3C" strokeWidth="1" fill="none" />
          {/* Helm */}
          <ellipse cx="14" cy="5" rx="8.5" ry="4.5" fill={helm} />
          <rect x="5.5" y="4" width="17" height="4" rx="2" fill={helm} opacity="0.85" />
          <ellipse cx="14" cy="3.5" rx="7.5" ry="4" fill={helm} />
          <rect x="4" y="7" width="20" height="2.5" rx="1.5" fill={brim} opacity="0.7" />
        </g>
      </svg>
    </div>
  );
}

function FactoryWorkers() {
  // Posisi dekat tangki/area kerja depan pabrik (~x 30-39%, kaki di ~y 62-64%)
  return (
    <>
      <Worker left="31%"   top="63%"   scale={0.46} variant="operate"  helm="#F6C90E" body="#2B6CB0" skin="#C8956C" />
      <Worker left="37%"   top="62.5%" scale={0.43} variant="clipboard" helm="#EFEFEF" body="#607080" skin="#D4A574" />
      <Worker left="34%"   top="64%"   scale={0.45} variant="dig"      helm="#E86C00" body="#2D8A4E" skin="#C8956C" />
    </>
  );
}

// ─── DESKTOP INFO BOX ─────────────────────────────────────────────────────────
function DesktopInfoBox({
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

// ─── MOBILE INFO CARD ─────────────────────────────────────────────────────────
function MobileInfoCard({
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

// ─── DATA ─────────────────────────────────────────────────────────────────────
const infoBoxData = [
  { title: "Berita\nTerbaru AI",   icon: "📰", top: "43%", left: "30%", delay: 0.3, href: "/berita",   showPin: false },
  { title: "Jadwal\nWorkShop AI",  icon: "📅", top: "48%", left: "54%", delay: 0.5, href: "/workshop", showPin: false },
  { title: "Video\nTutorial AI",   icon: "▶️", top: "37%", left: "73%", delay: 0.7, href: "/video",    showPin: true  },
];

const navLinks = ["Home", "Video", "Workshop", "Halaman 4"];

// ─── DESKTOP NAVBAR ───────────────────────────────────────────────────────────
function DesktopNavbar() {
  return (
    <nav
      className="absolute top-0 left-0 right-0 z-30 flex items-center justify-end px-8"
      style={{ height: 52, background: "rgba(255,255,255,0.92)", backdropFilter: "blur(12px)", borderBottom: "1px solid rgba(0,0,0,0.06)" }}
    >
      <div className="flex items-center gap-8">
        {navLinks.map((label) => (
          <Link
            key={label}
            href="#"
            className="text-sm font-medium transition-colors duration-150"
            style={{ color: "#1a1a2e" }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#e05a00")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "#1a1a2e")}
          >
            {label}
          </Link>
        ))}
      </div>
    </nav>
  );
}

// ─── MOBILE NAVBAR ────────────────────────────────────────────────────────────
function MobileNavbar() {
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

// ─── LOGO ─────────────────────────────────────────────────────────────────────
function Logo() {
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

// ─── PAGE ─────────────────────────────────────────────────────────────────────
export default function MuliaAiCenterPage() {
  const isMobile = useIsMobile();
  const ar = useImageAR("/Background.png", 2.11);

  // ── MOBILE LAYOUT ──
  if (isMobile) {
    return (
      <main className="relative overflow-hidden select-none flex flex-col" style={{ width: "100vw", minHeight: "100dvh" }}>
        {/* <MobileNavbar /> */}

        {/* Background atas (55dvh) */}
        <div className="relative flex-shrink-0" style={{ width: "100%", height: "55dvh", marginTop: 52, overflow: "hidden" }}>
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: "url('/Background.png')",
              backgroundSize: "cover",
              backgroundPosition: "center center",
              backgroundRepeat: "no-repeat",
            }}
          />
          <Clouds />
        </div>

        {/* Cards section */}
        <div className="relative z-10 flex-1" style={{ background: "linear-gradient(to bottom, #0f1140 0%, #1a1d60 100%)", padding: "20px 16px 32px" }}>
          <motion.div className="text-center mb-5" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <div
              className="font-black leading-none"
              style={{
                fontSize: 28,
                background: "linear-gradient(135deg, #FF6B00 0%, #FF3B30 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                display: "inline",
              }}
            >
              Mulia <span style={{ fontStyle: "italic", fontFamily: "Georgia, serif" }}>AI</span>
            </div>
            <div style={{ fontSize: 13, color: "rgba(255,255,255,0.6)", fontFamily: "Georgia, serif", fontStyle: "italic", marginTop: 2 }}>
              Learning Center
            </div>
          </motion.div>

          <div className="mx-auto mb-5" style={{ height: 1, background: "rgba(255,255,255,0.1)", maxWidth: 280 }} />

          <div className="flex flex-col gap-3 max-w-sm mx-auto">
            {infoBoxData.map((box, i) => (
              <MobileInfoCard key={i} title={box.title} icon={box.icon} href={box.href} delay={0.15 + i * 0.12} />
            ))}
          </div>

          <motion.p
            className="text-center mt-6"
            style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", letterSpacing: "0.08em" }}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}
          >
            PT. MULIA INDUSTRINDO — AI LEARNING PLATFORM
          </motion.p>
        </div>
      </main>
    );
  }

  // ── DESKTOP / TABLET LAYOUT ──
  // ".scene" = viewport. ".stage" = kotak ber-AR sama dengan gambar, di-cover ke
  // viewport. SEMUA elemen world ada di dalam .stage → terkunci ke fitur gambar
  // di SEMUA ukuran layar.
  return (
    <main className="relative overflow-hidden select-none" style={{ width: "100vw", height: "100dvh" }}>
      {/* <DesktopNavbar /> */}

      <div className="relative" style={{ width: "100vw", height: "100dvh", overflow: "hidden" }}>
        {/* STAGE — terkunci ke aspect ratio Background.png */}
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: `max(100vw, calc(100dvh * ${ar}))`,
            height: `max(100dvh, calc(100vw / ${ar}))`,
            backgroundImage: "url('/Background.png')",
            backgroundSize: "100% 100%",
            backgroundRepeat: "no-repeat",
          }}
        >
          {/* Awan (tidak diubah) */}
          <Clouds />

          {/* Asap — tepat di ujung tiap cerobong */}
          {/* Cerobong utama tengah (tinggi, merah-putih) */}
          <ChimneySmoke left="49.5%" top="6.5%" scale={1.5} delay={0} />
          {/* Cerobong kiri (merah-putih, lebih pendek) */}
          <ChimneySmoke left="28.5%" top="33%" scale={0.85} delay={1.2} />
          {/* Cerobong background kanan jauh */}
          <ChimneySmoke left="80%" top="27%" scale={0.55} delay={0.6} />
          <ChimneySmoke left="87%" top="25%" scale={0.45} delay={2.0} />

          {/* Ikan menyelam & meloncat di kolam kanan bawah */}
          <Fish />

          {/* Pekerja jalan kaki naik-turun di jalan sebelah kolam (kanan) */}
          <RoadWorkers />

          {/* Pekerja diam & bekerja di dekat tangki */}
          <FactoryWorkers />

          {/* Info boxes */}
          {infoBoxData.map((box, i) => (
            <DesktopInfoBox
              key={i}
              title={box.title}
              top={box.top}
              left={box.left}
              delay={box.delay}
              showPin={box.showPin}
              href={box.href}
            />
          ))}
        </div>

        {/* Logo — anchor ke viewport (selalu di pojok kanan atas layar) */}
        <Logo />
      </div>
    </main>
  );
}
// "use client";

// import React, { useRef, useState, useEffect } from "react";
// import dynamic from "next/dynamic";
// import { Canvas, useFrame } from "@react-three/fiber";
// import { OrbitControls, Html, Torus, Cylinder } from "@react-three/drei";
// import { motion } from "framer-motion";
// import * as THREE from "three";

// // ─── THEME TOKENS ──────────────────────────────────────────────────────────────
// // Background:   #f7fdf9   (near-white, barely-green tint — soft, not glaring)
// // Text primary: #1a1a1a   (near-black — crisp, readable on light bg)
// // Text mid:     #4b5563   (neutral gray — for body text)
// // Accent green: #22c55e   (green-500 — used sparingly for highlights/borders)
// // Light green:  #bbf7d0   (green-200 — subtle tint accents)

// const Spline = dynamic(() => import("@splinetool/react-spline"), {
//   ssr: false,
//   loading: () => (
//     <div style={{ color: "#22c55e", fontFamily: "Courier New", fontSize: 9, letterSpacing: "0.2em" }} className="animate-pulse">[LOADING...]</div>
//   ),
// });

// // ─── RESPONSIVE HOOK ───────────────────────────────────────────────────────────
// function useBreakpoint() {
//   const [bp, setBp] = useState<"mobile" | "tablet" | "laptop" | "desktop">("desktop");
//   useEffect(() => {
//     const update = () => {
//       const w = window.innerWidth;
//       if (w < 640) setBp("mobile");
//       else if (w < 1024) setBp("tablet");
//       else if (w < 1440) setBp("laptop");
//       else setBp("desktop");
//     };
//     update();
//     window.addEventListener("resize", update);
//     return () => window.removeEventListener("resize", update);
//   }, []);
//   return bp;
// }

// // ─── NODE COMPONENT ────────────────────────────────────────────────────────────
// function JarvisSplineNode({
//   position, title, splineUrl, delay, isCenter = false, scale = 1,
// }: {
//   position: [number, number, number];
//   title: string;
//   splineUrl: string;
//   delay: number;
//   isCenter?: boolean;
//   scale?: number;
// }) {
//   const groupRef   = useRef<THREE.Group>(null);
//   const wrapperRef = useRef<HTMLDivElement>(null);
//   const [hovered, setHovered] = useState(false);

//   useFrame((state) => {
//     if (!groupRef.current) return;
//     const t = state.clock.getElapsedTime();
//     groupRef.current.position.y = position[1] + Math.sin(t * 1.2 + delay) * 0.08;

//     if (wrapperRef.current) {
//       const worldPos = new THREE.Vector3();
//       groupRef.current.getWorldPosition(worldPos);
//       const dist = state.camera.position.distanceTo(worldPos);
//       const z = Math.round(Math.max(10, Math.min(200, 1000 / dist)));
//       wrapperRef.current.style.zIndex = String(z);
//     }
//   });

//   const ringRadius = (isCenter ? 1.4 : 0.9) * scale;
//   const htmlSize   = (isCenter ? 320 : 220) * scale;

//   return (
//     <group ref={groupRef} position={position}>
//       <Torus args={[ringRadius, 0.012 * scale, 16, 80]} rotation={[Math.PI / 2, 0, 0]}>
//         <meshBasicMaterial color={hovered ? "#16a34a" : "#22c55e"} transparent opacity={hovered ? 0.45 : 0.22} />
//       </Torus>
//       {isCenter && (
//         <Torus args={[0.65 * scale, 0.008 * scale, 16, 64]} rotation={[Math.PI / 2, 0, 0]}>
//           <meshBasicMaterial color="#bbf7d0" transparent opacity={0.18} />
//         </Torus>
//       )}

//       <Html center distanceFactor={8} zIndexRange={[200, 0]} style={{ pointerEvents: "none" }}>
//         <div
//           ref={wrapperRef}
//           style={{ width: htmlSize, height: htmlSize, position: "relative" }}
//           onMouseEnter={() => setHovered(true)}
//           onMouseLeave={() => setHovered(false)}
//         >
//           <div style={{
//             width: htmlSize, height: htmlSize, pointerEvents: "auto",
//             transition: "transform 0.3s ease",
//             transform: hovered ? "scale(1.08)" : "scale(1)",
//           }}>
//             <Spline scene={splineUrl} style={{ width: "100%", height: "100%" }} />
//           </div>

//           {/* HUD label */}
//           <div style={{
//             position: "absolute", bottom: -28, left: "50%",
//             transform: "translateX(-50%)", whiteSpace: "nowrap",
//             background: "rgba(255,255,255,0.85)",
//             backdropFilter: "blur(8px)",
//             border: hovered ? "1px solid rgba(34,197,94,0.6)" : "1px solid rgba(34,197,94,0.2)",
//             borderRadius: 4, padding: "3px 8px", textAlign: "center",
//             transition: "border 0.25s, box-shadow 0.25s",
//             boxShadow: hovered ? "0 2px 12px rgba(34,197,94,0.15)" : "0 1px 4px rgba(0,0,0,0.06)",
//             pointerEvents: "none",
//           }}>
//             <p style={{ fontFamily:"Courier New", fontSize: 6, letterSpacing:"0.25em", color:"#22c55e", textTransform:"uppercase", marginBottom: 1 }}>
//               MODULE
//             </p>
//             <p style={{ fontFamily:"Courier New", fontSize: 10, fontWeight: 700, color: "#1a1a1a", letterSpacing:"0.12em", textTransform:"uppercase" }}>
//               {title}
//             </p>
//           </div>
//         </div>
//       </Html>
//     </group>
//   );
// }

// // ─── ROTATING GROUP (corner nodes only) ───────────────────────────────────────
// function RotatingGroup({ spread, nodeScale, groupX }: { spread: number; nodeScale: number; groupX: number }) {
//   const groupRef = useRef<THREE.Group>(null);

//   useFrame((_, delta) => {
//     if (groupRef.current) {
//       groupRef.current.rotation.y += delta * 0.18; // slow steady rotation
//     }
//   });

//   const modules = [
//     { id: 1, title: "INTRO TO AI",      pos: [-spread, 1.0, -spread] as [number,number,number], delay: 0,   url: "https://prod.spline.design/rXLiCykCpF-3VHLL/scene.splinecode" },
//     { id: 2, title: "PROMPTING MATRIX", pos: [-spread, 1.0,  spread] as [number,number,number], delay: 0.5, url: "https://prod.spline.design/632PDn-dVBnm4xup/scene.splinecode" },
//     { id: 3, title: "AI TOOLS LAB",     pos: [ spread, 1.0, -spread] as [number,number,number], delay: 1.0, url: "https://prod.spline.design/LBAgdJxb-gzxXJ8p/scene.splinecode" },
//     { id: 4, title: "AI GOVERNANCE",    pos: [ spread, 1.0,  spread] as [number,number,number], delay: 1.5, url: "https://prod.spline.design/632PDn-dVBnm4xup/scene.splinecode" },
//   ];

//   // Connector lines from center [0,0,0] to each corner
//   const connectors = [
//     [-spread, -spread], [-spread, spread],
//     [ spread, -spread], [ spread,  spread],
//   ] as [number, number][];

//   return (
//     <group ref={groupRef} position={[groupX, 0, 0]}>
//       {/* Connector lines */}
//       {connectors.map(([nx, nz], i) => {
//         const len = Math.sqrt(nx * nx + nz * nz);
//         const angle = Math.atan2(nx, nz);
//         return (
//           <Cylinder key={i} args={[0.010, 0.010, len]}
//             position={[nx / 2, -0.4, nz / 2]}
//             rotation={[Math.PI / 2, 0, -angle]}>
//             <meshBasicMaterial color="#22c55e" transparent opacity={0.18} />
//           </Cylinder>
//         );
//       })}

//       {/* Corner nodes */}
//       {modules.map((mod) => (
//         <JarvisSplineNode key={mod.id} position={mod.pos} title={mod.title}
//           delay={mod.delay} scale={nodeScale} splineUrl={mod.url} />
//       ))}
//     </group>
//   );
// }

// // ─── 3D SCENE ─────────────────────────────────────────────────────────────────
// function Scene({ bp }: { bp: "mobile" | "tablet" | "laptop" | "desktop" }) {
//   const isMobile = bp === "mobile";
//   const isTablet = bp === "tablet";
//   const isLaptop = bp === "laptop";

//   const nodeScale = isMobile ? 0.6 : isTablet ? 0.75 : isLaptop ? 0.65 : 0.85;
//   const spread    = isMobile ? 2.0  : isTablet ? 2.6  : 2.8;

//   // Camera zoomed to match the screenshot view — higher & further back
//   const camPos: [number, number, number] = isMobile
//     ? [8, 7, 8]
//     : isTablet
//     ? [9, 7.5, 9]
//     : isLaptop
//     ? [0.5, 2.0, 3]  // <-- Diubah: Y lebih rendah (5.5), X & Z dilebarkan (12)
//     : [14, 6.0, 14]; // <-- Diubah: Skala yang sama untuk layar desktop besar

//   const camFov = isMobile ? 55 : isTablet ? 50 : 52;

//   // Target: look at center node position (groupX, 0, 0) — not shifted
//   const groupX = isMobile ? 0 : isTablet ? 1 : isLaptop ? 3.0 : 3.5;
//   const target: [number, number, number] = [groupX, 0.5, 0];
// //   const groupX = isMobile ? 0 : isTablet ? 1 : isLaptop ? 3.0 : 3.5;
// //   const target: [number, number, number] = [groupX, 1.5, spread * 0.9];

//   return (
//     <Canvas camera={{ position: camPos, fov: camFov }} dpr={[1, 2]}>
//       <ambientLight intensity={1.0} />
//       <pointLight position={[0, 5, 0]} intensity={0.8} color="#22c55e" />
//       <pointLight position={[-4, 3, -4]} intensity={0.3} color="#dcfce7" />

//       {/* No autoRotate — rotation is handled manually on corner group only */}
//       <OrbitControls
//         enableZoom={!isMobile}
//         maxPolarAngle={Math.PI / 2.1}
//         minDistance={isMobile ? 3 : 9}
//         maxDistance={isMobile ? 3 : 9}
//         autoRotate={false}
//         target={target}
//         enablePan={false}
//       />

//       <fog attach="fog" args={["#f7fdf9", isMobile ? 12 : 18, isMobile ? 26 : 38]} />

//       {/* Grid + center node — static, never rotates */}
//       <group position={[groupX, 0, 0]}>
//         <gridHelper
//           args={[isMobile ? 16 : 24, isMobile ? 16 : 24, "#86efac", "#d1fae5"]}
//           position={[0, -0.5, 0]}
//         />
//         {/* MULIA AI CORE — fixed in front, does NOT rotate */}
//         <JarvisSplineNode
//           position={[0, 1.1, spread * 0.7]}
//           title="MULIA AI CORE"
//           delay={0}
//           isCenter
//           scale={nodeScale}
//           splineUrl="https://prod.spline.design/LUL6rg1zC9XXNgxF/scene.splinecode"
//         />
//       </group>

//       {/* Corner nodes rotate around the same center */}
//       <RotatingGroup spread={spread} nodeScale={nodeScale} groupX={groupX} />
//     </Canvas>
//   );
// }

// // ─── HUD PANEL (shared between layouts) ───────────────────────────────────────
// function HudPanel({ mobile = false }: { mobile?: boolean }) {
//   return (
//     <motion.div
//       initial={{ x: mobile ? 0 : -50, y: mobile ? -20 : 0, opacity: 0 }}
//       animate={{ x: 0, y: 0, opacity: 1 }}
//       transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
//     >
//       {/* Badge */}
//       <div className="flex items-center gap-2 mb-4">
//         <div className="animate-pulse w-2 h-2 rounded-full" style={{ background: "#22c55e", boxShadow: "0 0 8px rgba(34,197,94,0.5)" }} />
//         <p className="font-mono tracking-[0.3em] uppercase font-semibold"
//           style={{ fontSize: 10, color: "#16a34a" }}>
//           @ MULIA AI CENTER
//         </p>
//       </div>

//       {/* Heading — "MULIA" black, subtitle green accent */}
//       <h1 className={`font-black uppercase tracking-tight leading-none mb-5 ${mobile ? "text-4xl" : "text-5xl lg:text-6xl"}`}>
//         <span style={{ color: "#111827" }}>MULIA</span>
//         <br />
//         <span style={{ color: "#111827" }}>AI </span>
//         <span style={{
//           color: "#22c55e",
//           textShadow: "0 0 20px rgba(34,197,94,0.20)",
//         }}>
//           LEARNING
//         </span>
//         <br />
//         <span style={{ color: "#111827" }}>CENTER</span>
//       </h1>

//       {/* Body */}
//       <p className="font-sans text-sm leading-relaxed mb-8 max-w-xs"
//         style={{ color: "#6b7280", borderLeft: "2px solid #bbf7d0", paddingLeft: 12 }}>
//         Initialize enterprise capability protocols. Engage with the core modules to access
//         strategic AI learning pathways.
//       </p>

//       {/* CTA */}
//       <button
//         className="font-mono tracking-[0.18em] uppercase transition-all duration-250"
//         style={{
//           fontSize: 11, padding: "10px 28px",
//           border: "1px solid #22c55e",
//           color: "#15803d",
//           background: "rgba(34,197,94,0.06)",
//           borderRadius: 2,
//         }}
//         onMouseEnter={e => {
//           const el = e.currentTarget;
//           el.style.background = "#22c55e";
//           el.style.color = "#fff";
//           el.style.boxShadow = "0 0 18px rgba(34,197,94,0.25)";
//         }}
//         onMouseLeave={e => {
//           const el = e.currentTarget;
//           el.style.background = "rgba(34,197,94,0.06)";
//           el.style.color = "#15803d";
//           el.style.boxShadow = "none";
//         }}
//       >
//         Start Your AI Journey!
//       </button>
//     </motion.div>
//   );
// }

// // ─── PAGE ──────────────────────────────────────────────────────────────────────
// export default function MuliaAiCenterPage() {
//   const bp       = useBreakpoint();
//   const isMobile = bp === "mobile";
//   const isTablet = bp === "tablet";

//   return (
//     <main className="relative overflow-hidden font-sans select-none"
//       style={{ minHeight: "100dvh", background: "#f7fdf9" }}>

//       {/* Mobile / Tablet — stacked */}
//       {(isMobile || isTablet) && (
//         <div className="relative z-10 flex flex-col" style={{ height: "100dvh" }}>
//           <div className="px-6 pt-8 pb-4" style={{ flexShrink: 0 }}>
//             <HudPanel mobile />
//           </div>
//           <div className="relative flex-1 cursor-move" style={{ minHeight: 0 }}>
//             <Scene bp={bp} />
//           </div>
//         </div>
//       )}

//       {/* Laptop / Desktop — side-by-side */}
//       {!isMobile && !isTablet && (
//         <>
//           <div className="absolute top-0 left-0 lg:w-[38%] h-full z-10 flex flex-col justify-center px-10 lg:px-16 pointer-events-none">
//             <div className="pointer-events-auto">
//               <HudPanel />
//             </div>
//           </div>
//           <div className="absolute inset-0 w-full h-full z-0 cursor-move">
//             <Scene bp={bp} />
//           </div>
//         </>
//       )}
//     </main>
//   );
// }

// // "use client";

// // import React, { useRef, useState } from "react";
// // import dynamic from "next/dynamic";
// // import { Canvas, useFrame } from "@react-three/fiber";
// // import { OrbitControls, Html, Torus, Cylinder } from "@react-three/drei";
// // import { motion } from "framer-motion";
// // import * as THREE from "three";

// // const Spline = dynamic(() => import("@splinetool/react-spline"), {
// //   ssr: false,
// //   loading: () => (
// //     <div className="text-cyan-500 font-mono text-[9px] animate-pulse tracking-widest">[LOADING...]</div>
// //   ),
// // });

// // // ─── NODE COMPONENT ────────────────────────────────────────────────────────────
// // function JarvisSplineNode({
// //   position,
// //   title,
// //   splineUrl,
// //   delay,
// //   isCenter = false,
// // }: {
// //   position: [number, number, number];
// //   title: string;
// //   splineUrl: string;
// //   delay: number;
// //   isCenter?: boolean;
// // }) {
// //   const groupRef = useRef<THREE.Group>(null);
// //   const [hovered, setHovered] = useState(false);

// //   useFrame((state) => {
// //     if (groupRef.current) {
// //       const t = state.clock.getElapsedTime();
// //       groupRef.current.position.y = position[1] + Math.sin(t * 1.2 + delay) * 0.1;
// //     }
// //   });

// //   // Sizes tuned so Spline fills the ring nicely at distanceFactor=8
// //   const ringRadius   = isCenter ? 1.4 : 0.9;
// //   const htmlSize   = isCenter ? 350 : 250;   // px — bounding box Html overlay
// //   const splineSize = isCenter ? 350 : 250;  // px — Spline canvas (1:1, no double-scale trick)

// //   return (
// //     <group ref={groupRef} position={position}>
// //       {/* Hologram ring */}
// //       <Torus args={[ringRadius, 0.012, 16, 80]} rotation={[Math.PI / 2, 0, 0]}>
// //         <meshBasicMaterial color={hovered ? "#00ffee" : "#00eeff"} transparent opacity={hovered ? 0.45 : 0.22} />
// //       </Torus>
// //       {/* Second inner ring for center node */}
// //       {isCenter && (
// //         <Torus args={[0.65, 0.008, 16, 64]} rotation={[Math.PI / 2, 0, 0]}>
// //           <meshBasicMaterial color="#00eeff" transparent opacity={0.15} />
// //         </Torus>
// //       )}

// //       <Html
// //         center
// //         distanceFactor={8}
// //         zIndexRange={[100, 0]}
// //         style={{ pointerEvents: "none" }}
// //       >
// //         <div
// //           style={{ width: htmlSize, height: htmlSize, position: "relative" }}
// //           onMouseEnter={() => setHovered(true)}
// //           onMouseLeave={() => setHovered(false)}
// //         >
// //           {/* Spline — full size, no scaling tricks */}
// //           <div
// //             style={{
// //               width: splineSize,
// //               height: splineSize,
// //               pointerEvents: "auto",
// //               transition: "transform 0.3s ease",
// //               transform: hovered ? "scale(1.08)" : "scale(1)",
// //             }}
// //           >
// //             <Spline scene={splineUrl} style={{ width: "100%", height: "100%" }} />
// //           </div>

// //           {/* HUD label */}
// //           <div
// //             style={{
// //               position: "absolute",
// //               bottom: -32,
// //               left: "50%",
// //               transform: "translateX(-50%)",
// //               whiteSpace: "nowrap",
// //               background: "rgba(2,6,23,0.88)",
// //               backdropFilter: "blur(8px)",
// //               border: hovered ? "1px solid rgba(0,238,255,0.7)" : "1px solid rgba(0,238,255,0.25)",
// //               borderRadius: 4,
// //               padding: "4px 10px",
// //               textAlign: "center",
// //               transition: "border 0.25s",
// //               boxShadow: hovered ? "0 0 14px rgba(0,238,255,0.25)" : "none",
// //               pointerEvents: "none",
// //             }}
// //           >
// //             <p style={{ fontFamily:"Courier New", fontSize: 7, letterSpacing:"0.25em", color:"rgba(0,238,255,0.6)", textTransform:"uppercase", marginBottom: 2 }}>
// //               SEC_PROTOCOL
// //             </p>
// //             <p style={{ fontFamily:"Courier New", fontSize: 11, fontWeight: 700, color: "#fff", letterSpacing:"0.15em", textTransform:"uppercase" }}>
// //               {title}
// //             </p>
// //           </div>
// //         </div>
// //       </Html>
// //     </group>
// //   );
// // }

// // // ─── PAGE ──────────────────────────────────────────────────────────────────────
// // export default function MuliaAiCenterPage() {
// //   const modules = [
// //     {
// //       id: 1, title: "INTRO TO AI",
// //       // Corners pulled closer: ±3.2 instead of ±4 so they're visually proportional
// //       pos: [-3.2, 1.0, -3.2] as [number, number, number],
// //       delay: 0,
// //       url: "https://prod.spline.design/rXLiCykCpF-3VHLL/scene.splinecode",
// //     },
// //     {
// //       id: 2, title: "PROMPTING MATRIX",
// //       pos: [-3.2, 1.0, 3.2] as [number, number, number],
// //       delay: 0.5,
// //       url: "https://prod.spline.design/632PDn-dVBnm4xup/scene.splinecode",
// //     },
// //     {
// //       id: 3, title: "AI TOOLS LAB",
// //       pos: [3.2, 1.0, -3.2] as [number, number, number],
// //       delay: 1.0,
// //       url: "https://prod.spline.design/632PDn-dVBnm4xup/scene.splinecode",
// //     },
// //     {
// //       id: 4, title: "AI GOVERNANCE",
// //       pos: [3.2, 1.0, 3.2] as [number, number, number],
// //       delay: 1.5,
// //       url: "https://prod.spline.design/632PDn-dVBnm4xup/scene.splinecode",
// //     },
// //   ];

// //   return (
// //     <main className="relative h-screen w-full bg-slate-950 overflow-hidden font-sans select-none">
// //       {/* Scanlines */}
// //       <div
// //         className="absolute inset-0 pointer-events-none z-20 opacity-[0.04]"
// //         style={{
// //           backgroundImage: "linear-gradient(rgba(0,238,255,0.15) 1px, transparent 1px)",
// //           backgroundSize: "100% 3px",
// //         }}
// //       />

// //       {/* ── LEFT HUD PANEL ── */}
// //       <div className="absolute top-0 left-0 w-full lg:w-[38%] h-full z-10 flex flex-col justify-center px-8 sm:px-16 pointer-events-none">
// //         <motion.div
// //           initial={{ x: -50, opacity: 0 }}
// //           animate={{ x: 0, opacity: 1 }}
// //           transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
// //           className="pointer-events-auto"
// //         >
// //           <div className="flex items-center gap-3 mb-4">
// //             <div className="animate-pulse w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_10px_#00eeff]" />
// //             <p className="font-mono text-xs tracking-[0.3em] text-cyan-400 uppercase font-bold">
// //               @ MULIA AI CENTER
// //             </p>
// //           </div>

// //           <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white uppercase tracking-tighter leading-none mb-6">
// //             MULIA <br />
// //             <span
// //               className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-white to-blue-500"
// //               style={{ textShadow: "0 0 30px rgba(0,238,255,0.3)" }}
// //             >
// //               AI Learning <br /> Center
// //             </span>
// //           </h1>

// //           <p className="text-slate-400 text-xs sm:text-sm leading-relaxed mb-8 max-w-sm font-mono border-l-2 border-cyan-800 pl-4">
// //             Initialize enterprise capability protocols. Engage with the core modules to access
// //             strategic AI learning pathways.
// //           </p>

// //           <button className="relative group overflow-hidden border border-cyan-400 text-cyan-400 bg-cyan-950/20 px-8 py-3.5 font-mono text-xs tracking-[0.2em] uppercase hover:bg-cyan-400 hover:text-slate-950 transition-all duration-300 shadow-[0_0_15px_rgba(0,238,255,0.2)]">
// //             Start Your AI Journey!
// //           </button>
// //         </motion.div>
// //       </div>

// //       {/* ── 3D CANVAS ── */}
// //       <div className="absolute inset-0 w-full h-full z-0 cursor-move">
// //         <Canvas
// //           /*
// //             Camera tweaks:
// //             - position closer: [10, 8, 10] instead of [14,11,14]
// //             - fov 45 (wider than 40) so nodes don't get clipped at edges
// //             - The group is shifted +2 on X so 3D content sits in the right half
// //           */
// //           camera={{ position: [10, 8, 10], fov: 45 }}
// //           dpr={[1, 2]}
// //         >
// //           <ambientLight intensity={0.5} />
// //           <pointLight position={[0, 5, 0]} intensity={1.8} color="#00ffff" />
// //           <pointLight position={[-4, 3, -4]} intensity={0.4} color="#0044ff" />

// //           <OrbitControls
// //             enableZoom={true}
// //             maxPolarAngle={Math.PI / 2.1}
// //             minDistance={7}
// //             maxDistance={22}
// //             autoRotate={true}
// //             autoRotateSpeed={0.25}
// //             target={[2.5, 0.5, 0]}  // orbit around the group center
// //           />

// //           <fog attach="fog" args={["#020617", 14, 32]} />

// //           <group position={[2, 0, 0]}>
// //             {/* Grid floor */}
// //             <gridHelper args={[22, 22, "#00eeff", "#001e2e"]} position={[0, -0.5, 0]} />

// //             {/* Center node */}
// //             <JarvisSplineNode
// //               position={[0, 1.1, 0]}
// //               title="MULIA AI CORE"
// //               delay={0}
// //               isCenter={true}
// //               splineUrl="https://prod.spline.design/LUL6rg1zC9XXNgxF/scene.splinecode"
// //             />

// //             {/* Connector lines — length matches corner distance (√2 × 3.2 ≈ 4.52, add a bit) */}
// //             <group position={[0, -0.4, 0]}>
// //               {[
// //                 { pos: [-1.6, 0, -1.6] as [number,number,number], rot: [Math.PI/2, 0,  Math.PI/4] as [number,number,number] },
// //                 { pos: [-1.6, 0,  1.6] as [number,number,number], rot: [Math.PI/2, 0, -Math.PI/4] as [number,number,number] },
// //                 { pos: [ 1.6, 0, -1.6] as [number,number,number], rot: [Math.PI/2, 0, -Math.PI/4] as [number,number,number] },
// //                 { pos: [ 1.6, 0,  1.6] as [number,number,number], rot: [Math.PI/2, 0,  Math.PI/4] as [number,number,number] },
// //               ].map((c, i) => (
// //                 <Cylinder key={i} args={[0.012, 0.012, 4.7]} position={c.pos} rotation={c.rot}>
// //                   <meshBasicMaterial color="#00ffee" transparent opacity={0.2} />
// //                 </Cylinder>
// //               ))}
// //             </group>

// //             {/* Corner nodes */}
// //             {modules.map((mod) => (
// //               <JarvisSplineNode
// //                 key={mod.id}
// //                 position={mod.pos}
// //                 title={mod.title}
// //                 delay={mod.delay}
// //                 splineUrl={mod.url}
// //               />
// //             ))}
// //           </group>
// //         </Canvas>
// //       </div>
// //     </main>
// //   );
// // }
// // "use client";

// // import React, { useState } from "react";
// // import Spline from "@splinetool/react-spline";
// // import { motion, AnimatePresence } from "framer-motion";

// // // --- KOMPONEN: Node Spline Individual + Label J.A.R.V.I.S ---
// // function SplineHoloNode({ title, desc, delay, top, left, splineUrl }: any) {
// //   const [hovered, setHovered] = useState(false);

// //   return (
// //     <motion.div
// //       className="absolute w-32 h-32 sm:w-48 sm:h-48 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center z-20"
// //       style={{ top, left }}
// //       initial={{ scale: 0, opacity: 0 }}
// //       animate={{ scale: 1, opacity: 1 }}
// //       transition={{ delay, duration: 0.8, type: "spring" }}
// //       onMouseEnter={() => setHovered(true)}
// //       onMouseLeave={() => setHovered(false)}
// //     >
// //       {/* Container untuk Spline 3D Model */}
// //       <motion.div 
// //         className="w-full h-full cursor-pointer relative z-10"
// //         animate={{ y: [0, -10, 0] }}
// //         transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay }}
// //         whileHover={{ scale: 1.15 }}
// //       >
// //         {/* Placeholder Spline URL. Ganti dengan URL Spline 3D Anda! */}
// //         <Spline scene={splineUrl} className="pointer-events-none" />
// //       </motion.div>

// //       {/* Label HTML J.A.R.V.I.S (Muncul saat di-hover/di dekatnya) */}
// //       <AnimatePresence>
// //         <motion.div 
// //           className={`absolute top-full mt-2 transition-all duration-300 pointer-events-none z-30 ${hovered ? "scale-110" : "scale-100 opacity-60"}`}
// //         >
// //           <div className="bg-[#020a14]/80 backdrop-blur-md border-t border-l border-cyan-400 p-3 sm:p-4 rounded-xl whitespace-nowrap shadow-[0_0_20px_rgba(0,238,255,0.2)] relative">
// //             <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-cyan-400 opacity-50"></div>
// //             <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-cyan-400 opacity-50"></div>
            
// //             <h3 className="text-white font-black text-sm sm:text-lg font-mono tracking-wider uppercase" style={{ textShadow: "0 0 10px rgba(0,238,255,0.7)" }}>
// //               {title}
// //             </h3>
            
// //             {/* Deskripsi memanjang saat di hover */}
// //             <motion.div
// //               initial={{ height: 0, opacity: 0 }}
// //               animate={hovered ? { height: "auto", opacity: 1, marginTop: 8 } : { height: 0, opacity: 0, marginTop: 0 }}
// //               className="overflow-hidden"
// //             >
// //               <p className="text-cyan-100 text-[10px] sm:text-xs w-48 sm:w-56 text-wrap font-sans leading-relaxed border-t border-cyan-800 pt-2">
// //                 {desc}
// //               </p>
// //               <p className="font-mono text-[8px] sm:text-[9px] text-emerald-400 mt-2">SYS_STATUS: [ ACTIVE ]</p>
// //             </motion.div>
// //           </div>
// //         </motion.div>
// //       </AnimatePresence>
// //     </motion.div>
// //   );
// // }

// // // --- KOMPONEN UTAMA HALAMAN ---
// // export default function SplineJarvisPage() {
// //   // Data Node dengan Persentase Posisi
// //   const modules = [
// //     { id: 1, title: "Intro to AI", desc: "Core concepts & transformation data.", top: "15%", left: "15%", delay: 0.2, url: "https://prod.spline.design/6Wq1Q7YGyM-iab9i/scene.splinecode" },
// //     { id: 2, title: "Prompting Matrix", desc: "Advanced prompt engineering protocols.", top: "15%", left: "85%", delay: 0.4, url: "https://prod.spline.design/6Wq1Q7YGyM-iab9i/scene.splinecode" },
// //     { id: 3, title: "AI Tools Lab", desc: "Agentic workflows and LLM deployment.", top: "85%", left: "15%", delay: 0.6, url: "https://prod.spline.design/6Wq1Q7YGyM-iab9i/scene.splinecode" },
// //     { id: 4, title: "AI Governance", desc: "Corporate guardrails & data security.", top: "85%", left: "85%", delay: 0.8, url: "https://prod.spline.design/6Wq1Q7YGyM-iab9i/scene.splinecode" },
// //   ];

// //   return (
// //     <main className="relative h-screen w-full bg-[#020610] overflow-hidden font-sans select-none flex">
      
// //       {/* Efek Scanlines */}
// //       <div className="absolute inset-0 pointer-events-none z-20 opacity-20" style={{
// //         backgroundImage: "linear-gradient(rgba(0, 238, 255, 0.1) 1px, transparent 1px)",
// //         backgroundSize: "100% 3px"
// //       }} />

// //       {/* --- KIRI: UI HUD OVERLAY --- */}
// //       <div className="relative z-30 w-full lg:w-1/3 h-full flex flex-col justify-center px-8 sm:px-12 pointer-events-none">
// //         <motion.div initial={{ x: -60, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ duration: 1 }} className="pointer-events-auto">
// //           <div className="flex items-center gap-3 mb-6">
// //             <div className="animate-pulse w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_15px_#00eeff]" />
// //             <p className="font-mono text-xs tracking-[0.4em] text-cyan-400 uppercase font-bold" style={{ textShadow: "0 0 10px #00eeff" }}>
// //               MULIA AI Core / Online
// //             </p>
// //           </div>

// //           <h1 className="text-5xl lg:text-7xl font-black text-white uppercase tracking-tighter leading-none mb-6 drop-shadow-2xl">
// //             MULIA <br />
// //             <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-white to-cyan-500" style={{ textShadow: "0 0 40px rgba(0,238,255,0.4)" }}>
// //               Artificial <br /> Intelligence
// //             </span>
// //           </h1>

// //           <p className="text-slate-400 text-sm sm:text-base leading-relaxed mb-10 max-w-sm border-l-2 border-cyan-800 pl-4 font-mono">
// //             Execute synchronization protocol. Initialize interaction with holographic data nodes to download learning sequences.
// //           </p>

// //           <button className="relative group overflow-hidden border border-cyan-400 text-cyan-400 px-8 py-3 font-mono text-xs tracking-[0.3em] uppercase hover:bg-cyan-400 hover:text-slate-950 transition-all duration-300 shadow-[0_0_15px_rgba(0,238,255,0.3)] hover:shadow-[0_0_40px_rgba(0,238,255,0.7)] group">
// //             <span className="absolute inset-0 w-1/2 h-full bg-white/20 -skew-x-12 -translate-x-full group-hover:translate-x-[200%] transition-transform duration-700"></span>
// //             Start Your AI Journey
// //           </button>
// //         </motion.div>
// //       </div>

// //       {/* --- KANAN: JARINGAN NODE SPLINE --- */}
// //       <div className="absolute right-0 top-0 w-full lg:w-2/3 h-full flex items-center justify-center p-10 z-10">
        
// //         {/* Kotak Virtual untuk menahan Node agar rapi */}
// //         <div className="relative w-full max-w-[600px] aspect-square">
          
// //           {/* Garis Koneksi Motherboard (SVG) */}
// //           <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-40 z-0">
// //             {/* Garis ke Sudut Kiri Atas */}
// //             <line x1="50%" y1="50%" x2="15%" y2="15%" stroke="#00eeff" strokeWidth="1" strokeDasharray="4 4" />
// //             {/* Garis ke Sudut Kanan Atas */}
// //             <line x1="50%" y1="50%" x2="85%" y2="15%" stroke="#00eeff" strokeWidth="1" strokeDasharray="4 4" />
// //             {/* Garis ke Sudut Kiri Bawah */}
// //             <line x1="50%" y1="50%" x2="15%" y2="85%" stroke="#00eeff" strokeWidth="1" strokeDasharray="4 4" />
// //             {/* Garis ke Sudut Kanan Bawah */}
// //             <line x1="50%" y1="50%" x2="85%" y2="85%" stroke="#00eeff" strokeWidth="1" strokeDasharray="4 4" />
            
// //             {/* Lingkaran Dekoratif di tengah SVG */}
// //             <circle cx="50%" cy="50%" r="20%" fill="none" stroke="#00eeff" strokeWidth="1" opacity="0.3" />
// //             <circle cx="50%" cy="50%" r="35%" fill="none" stroke="#00eeff" strokeWidth="0.5" strokeDasharray="2 6" opacity="0.5" />
// //           </svg>

// //           {/* NODE TENGAH (M.A.I.N CORE) */}
// //           <motion.div 
// //             className="absolute top-[50%] left-[50%] w-48 h-48 sm:w-64 sm:h-64 -translate-x-1/2 -translate-y-1/2 z-10"
// //             initial={{ scale: 0 }}
// //             animate={{ scale: 1 }}
// //             transition={{ duration: 1, type: "spring" }}
// //           >
// //             {/* Bola Energi Utama */}
// //             <Spline scene="https://prod.spline.design/632PDn-dVBnm4xup/scene.splinecode" className="pointer-events-auto cursor-grab active:cursor-grabbing" />
// //             <div className="absolute top-[85%] left-1/2 -translate-x-1/2 bg-cyan-950/80 border border-cyan-400 px-3 py-1 rounded text-cyan-400 font-mono text-[10px] tracking-widest whitespace-nowrap pointer-events-none">
// //               MULIA AI CORE
// //             </div>
// //           </motion.div>

// //           {/* 4 NODE MODUL DI SUDUT */}
// //           {modules.map((mod) => (
// //             <SplineHoloNode 
// //               key={mod.id}
// //               title={mod.title}
// //               desc={mod.desc}
// //               top={mod.top}
// //               left={mod.left}
// //               delay={mod.delay}
// //               splineUrl={mod.url} 
// //             />
// //           ))}

// //         </div>
// //       </div>
// //     </main>
// //   );
// // }