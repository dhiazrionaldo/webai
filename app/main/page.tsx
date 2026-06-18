"use client";

import { motion } from "framer-motion";
import { useIsMobile } from "@/hooks/useIsMobile";
import { useImageAR } from "@/hooks/useImageAR";
import { Clouds } from "@/components/Clouds";
import { ChimneySmoke } from "@/components/ChimneySmoke";
import { Fish } from "@/components/Fish";
import { RoadWorkers } from "@/components/RoadWorkers";
import { FactoryWorkers } from "@/components/FactoryWorkers";
import { DesktopInfoBox } from "@/components/DesktopInfoBox";
import { MobileInfoCard } from "@/components/MobileInfoCard";
import { Logo } from "@/components/Logo";
import { infoBoxData } from "@/data/siteData";

// ── Komponen baru ──
import { Birds } from "@/components/Birds";
import { RoadTrucks } from "@/components/RoadTrucks";
import { Forklifts } from "@/components/Forklifts";

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
          <Birds />
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
          {/* ── Langit ── */}
          <Clouds />
          <Birds />

          {/* ── Asap cerobong ── */}
          {/* Cerobong utama tengah (tinggi, merah-putih) */}
          <ChimneySmoke left="49.5%" top="6.5%" scale={1.5} delay={0} />
          {/* Cerobong kiri (merah-putih, lebih pendek) */}
          <ChimneySmoke left="28.5%" top="33%" scale={0.85} delay={1.2} />
          {/* Cerobong background kanan jauh */}
          <ChimneySmoke left="80%" top="27%" scale={0.55} delay={0.6} />
          <ChimneySmoke left="87%" top="25%" scale={0.45} delay={2.0} />

          {/* ── Kendaraan & alat berat ── */}
          {/* Truk di jalan raya depan pabrik */}
          <RoadTrucks />
          {/* Forklift di area loading */}
          <Forklifts />

          {/* ── Ikan di kolam ── */}
          <Fish />

          {/* ── Pekerja ── */}
          <RoadWorkers />
          <FactoryWorkers />

          {/* ── Info boxes ── */}
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

// import { motion } from "framer-motion";
// import { useIsMobile } from "@/hooks/useIsMobile";
// import { useImageAR } from "@/hooks/useImageAR";
// import { Clouds } from "@/components/Clouds";
// import { ChimneySmoke } from "@/components/ChimneySmoke";
// import { Fish } from "@/components/Fish";
// import { RoadWorkers } from "@/components/RoadWorkers";
// import { FactoryWorkers } from "@/components/FactoryWorkers";
// import { DesktopInfoBox } from "@/components/DesktopInfoBox";
// import { MobileInfoCard } from "@/components/MobileInfoCard";
// import { Logo } from "@/components/Logo";
// import { infoBoxData } from "@/data/siteData";

// // NB: DesktopNavbar & MobileNavbar sengaja TIDAK di-import di sini karena di kode
// // aslinya kedua komponen ini juga tidak dipakai (hanya tertulis sebagai komentar
// // JSX `{/* <MobileNavbar /> */}` dan `{/* <DesktopNavbar /> */}`). File-nya sudah
// // dipisah di components/DesktopNavbar.tsx dan components/MobileNavbar.tsx, kalau
// // nanti mau diaktifkan tinggal import & pasang seperti baris yang dikomentari.

// // ─── PAGE ─────────────────────────────────────────────────────────────────────
// export default function MuliaAiCenterPage() {
//   const isMobile = useIsMobile();
//   const ar = useImageAR("/Background.png", 2.11);

//   // ── MOBILE LAYOUT ──
//   if (isMobile) {
//     return (
//       <main className="relative overflow-hidden select-none flex flex-col" style={{ width: "100vw", minHeight: "100dvh" }}>
//         {/* <MobileNavbar /> */}

//         {/* Background atas (55dvh) */}
//         <div className="relative flex-shrink-0" style={{ width: "100%", height: "55dvh", marginTop: 52, overflow: "hidden" }}>
//           <div
//             className="absolute inset-0"
//             style={{
//               backgroundImage: "url('/Background.png')",
//               backgroundSize: "cover",
//               backgroundPosition: "center center",
//               backgroundRepeat: "no-repeat",
//             }}
//           />
//           <Clouds />
//         </div>

//         {/* Cards section */}
//         <div className="relative z-10 flex-1" style={{ background: "linear-gradient(to bottom, #0f1140 0%, #1a1d60 100%)", padding: "20px 16px 32px" }}>
//           <motion.div className="text-center mb-5" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
//             <div
//               className="font-black leading-none"
//               style={{
//                 fontSize: 28,
//                 background: "linear-gradient(135deg, #FF6B00 0%, #FF3B30 100%)",
//                 WebkitBackgroundClip: "text",
//                 WebkitTextFillColor: "transparent",
//                 backgroundClip: "text",
//                 display: "inline",
//               }}
//             >
//               Mulia <span style={{ fontStyle: "italic", fontFamily: "Georgia, serif" }}>AI</span>
//             </div>
//             <div style={{ fontSize: 13, color: "rgba(255,255,255,0.6)", fontFamily: "Georgia, serif", fontStyle: "italic", marginTop: 2 }}>
//               Learning Center
//             </div>
//           </motion.div>

//           <div className="mx-auto mb-5" style={{ height: 1, background: "rgba(255,255,255,0.1)", maxWidth: 280 }} />

//           <div className="flex flex-col gap-3 max-w-sm mx-auto">
//             {infoBoxData.map((box, i) => (
//               <MobileInfoCard key={i} title={box.title} icon={box.icon} href={box.href} delay={0.15 + i * 0.12} />
//             ))}
//           </div>

//           <motion.p
//             className="text-center mt-6"
//             style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", letterSpacing: "0.08em" }}
//             initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}
//           >
//             PT. MULIA INDUSTRINDO — AI LEARNING PLATFORM
//           </motion.p>
//         </div>
//       </main>
//     );
//   }

//   // ── DESKTOP / TABLET LAYOUT ──
//   // ".scene" = viewport. ".stage" = kotak ber-AR sama dengan gambar, di-cover ke
//   // viewport. SEMUA elemen world ada di dalam .stage → terkunci ke fitur gambar
//   // di SEMUA ukuran layar.
//   return (
//     <main className="relative overflow-hidden select-none" style={{ width: "100vw", height: "100dvh" }}>
//       {/* <DesktopNavbar /> */}

//       <div className="relative" style={{ width: "100vw", height: "100dvh", overflow: "hidden" }}>
//         {/* STAGE — terkunci ke aspect ratio Background.png */}
//         <div
//           style={{
//             position: "absolute",
//             top: "50%",
//             left: "50%",
//             transform: "translate(-50%, -50%)",
//             width: `max(100vw, calc(100dvh * ${ar}))`,
//             height: `max(100dvh, calc(100vw / ${ar}))`,
//             backgroundImage: "url('/Background.png')",
//             backgroundSize: "100% 100%",
//             backgroundRepeat: "no-repeat",
//           }}
//         >
//           {/* Awan (tidak diubah) */}
//           <Clouds />

//           {/* Asap — tepat di ujung tiap cerobong */}
//           {/* Cerobong utama tengah (tinggi, merah-putih) */}
//           <ChimneySmoke left="49.5%" top="6.5%" scale={1.5} delay={0} />
//           {/* Cerobong kiri (merah-putih, lebih pendek) */}
//           <ChimneySmoke left="28.5%" top="33%" scale={0.85} delay={1.2} />
//           {/* Cerobong background kanan jauh */}
//           <ChimneySmoke left="80%" top="27%" scale={0.55} delay={0.6} />
//           <ChimneySmoke left="87%" top="25%" scale={0.45} delay={2.0} />

//           {/* Ikan menyelam & meloncat di kolam kanan bawah */}
//           <Fish />

//           {/* Pekerja jalan kaki naik-turun di jalan sebelah kolam (kanan) */}
//           <RoadWorkers />

//           {/* Pekerja diam & bekerja di dekat tangki */}
//           <FactoryWorkers />

//           {/* Info boxes */}
//           {infoBoxData.map((box, i) => (
//             <DesktopInfoBox
//               key={i}
//               title={box.title}
//               top={box.top}
//               left={box.left}
//               delay={box.delay}
//               showPin={box.showPin}
//               href={box.href}
//             />
//           ))}
//         </div>

//         {/* Logo — anchor ke viewport (selalu di pojok kanan atas layar) */}
//         <Logo />
//       </div>
//     </main>
//   );
// }
