"use client";

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

export function FactoryWorkers() {
  // Posisi dekat tangki/area kerja depan pabrik (~x 30-39%, kaki di ~y 62-64%)
  return (
    <>
      <Worker left="31%"   top="63%"   scale={0.46} variant="operate"  helm="#F6C90E" body="#2B6CB0" skin="#C8956C" />
      <Worker left="37%"   top="65%" scale={0.43} variant="clipboard" helm="#EFEFEF" body="#607080" skin="#D4A574" />
      <Worker left="34%"   top="64%"   scale={0.45} variant="dig"      helm="#E86C00" body="#2D8A4E" skin="#C8956C" />
    </>
  );
}
