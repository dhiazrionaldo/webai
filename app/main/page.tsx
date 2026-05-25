"use client";

import React, { useRef, useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Html, Torus, Cylinder } from "@react-three/drei";
import { motion } from "framer-motion";
import * as THREE from "three";

// ─── THEME TOKENS ──────────────────────────────────────────────────────────────
// Background:   #f7fdf9   (near-white, barely-green tint — soft, not glaring)
// Text primary: #1a1a1a   (near-black — crisp, readable on light bg)
// Text mid:     #4b5563   (neutral gray — for body text)
// Accent green: #22c55e   (green-500 — used sparingly for highlights/borders)
// Light green:  #bbf7d0   (green-200 — subtle tint accents)

const Spline = dynamic(() => import("@splinetool/react-spline"), {
  ssr: false,
  loading: () => (
    <div style={{ color: "#22c55e", fontFamily: "Courier New", fontSize: 9, letterSpacing: "0.2em" }} className="animate-pulse">[LOADING...]</div>
  ),
});

// ─── RESPONSIVE HOOK ───────────────────────────────────────────────────────────
function useBreakpoint() {
  const [bp, setBp] = useState<"mobile" | "tablet" | "laptop" | "desktop">("desktop");
  useEffect(() => {
    const update = () => {
      const w = window.innerWidth;
      if (w < 640) setBp("mobile");
      else if (w < 1024) setBp("tablet");
      else if (w < 1440) setBp("laptop");
      else setBp("desktop");
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);
  return bp;
}

// ─── NODE COMPONENT ────────────────────────────────────────────────────────────
function JarvisSplineNode({
  position, title, splineUrl, delay, isCenter = false, scale = 1,
}: {
  position: [number, number, number];
  title: string;
  splineUrl: string;
  delay: number;
  isCenter?: boolean;
  scale?: number;
}) {
  const groupRef   = useRef<THREE.Group>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.getElapsedTime();
    groupRef.current.position.y = position[1] + Math.sin(t * 1.2 + delay) * 0.08;

    if (wrapperRef.current) {
      const worldPos = new THREE.Vector3();
      groupRef.current.getWorldPosition(worldPos);
      const dist = state.camera.position.distanceTo(worldPos);
      const z = Math.round(Math.max(10, Math.min(200, 1000 / dist)));
      wrapperRef.current.style.zIndex = String(z);
    }
  });

  const ringRadius = (isCenter ? 1.4 : 0.9) * scale;
  const htmlSize   = (isCenter ? 320 : 220) * scale;

  return (
    <group ref={groupRef} position={position}>
      <Torus args={[ringRadius, 0.012 * scale, 16, 80]} rotation={[Math.PI / 2, 0, 0]}>
        <meshBasicMaterial color={hovered ? "#16a34a" : "#22c55e"} transparent opacity={hovered ? 0.45 : 0.22} />
      </Torus>
      {isCenter && (
        <Torus args={[0.65 * scale, 0.008 * scale, 16, 64]} rotation={[Math.PI / 2, 0, 0]}>
          <meshBasicMaterial color="#bbf7d0" transparent opacity={0.18} />
        </Torus>
      )}

      <Html center distanceFactor={8} zIndexRange={[200, 0]} style={{ pointerEvents: "none" }}>
        <div
          ref={wrapperRef}
          style={{ width: htmlSize, height: htmlSize, position: "relative" }}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
        >
          <div style={{
            width: htmlSize, height: htmlSize, pointerEvents: "auto",
            transition: "transform 0.3s ease",
            transform: hovered ? "scale(1.08)" : "scale(1)",
          }}>
            <Spline scene={splineUrl} style={{ width: "100%", height: "100%" }} />
          </div>

          {/* HUD label */}
          <div style={{
            position: "absolute", bottom: -28, left: "50%",
            transform: "translateX(-50%)", whiteSpace: "nowrap",
            background: "rgba(255,255,255,0.85)",
            backdropFilter: "blur(8px)",
            border: hovered ? "1px solid rgba(34,197,94,0.6)" : "1px solid rgba(34,197,94,0.2)",
            borderRadius: 4, padding: "3px 8px", textAlign: "center",
            transition: "border 0.25s, box-shadow 0.25s",
            boxShadow: hovered ? "0 2px 12px rgba(34,197,94,0.15)" : "0 1px 4px rgba(0,0,0,0.06)",
            pointerEvents: "none",
          }}>
            <p style={{ fontFamily:"Courier New", fontSize: 6, letterSpacing:"0.25em", color:"#22c55e", textTransform:"uppercase", marginBottom: 1 }}>
              MODULE
            </p>
            <p style={{ fontFamily:"Courier New", fontSize: 10, fontWeight: 700, color: "#1a1a1a", letterSpacing:"0.12em", textTransform:"uppercase" }}>
              {title}
            </p>
          </div>
        </div>
      </Html>
    </group>
  );
}

// ─── ROTATING GROUP (corner nodes only) ───────────────────────────────────────
function RotatingGroup({ spread, nodeScale, groupX }: { spread: number; nodeScale: number; groupX: number }) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.18; // slow steady rotation
    }
  });

  const modules = [
    { id: 1, title: "INTRO TO AI",      pos: [-spread, 1.0, -spread] as [number,number,number], delay: 0,   url: "https://prod.spline.design/rXLiCykCpF-3VHLL/scene.splinecode" },
    { id: 2, title: "PROMPTING MATRIX", pos: [-spread, 1.0,  spread] as [number,number,number], delay: 0.5, url: "https://prod.spline.design/632PDn-dVBnm4xup/scene.splinecode" },
    { id: 3, title: "AI TOOLS LAB",     pos: [ spread, 1.0, -spread] as [number,number,number], delay: 1.0, url: "https://prod.spline.design/LBAgdJxb-gzxXJ8p/scene.splinecode" },
    { id: 4, title: "AI GOVERNANCE",    pos: [ spread, 1.0,  spread] as [number,number,number], delay: 1.5, url: "https://prod.spline.design/632PDn-dVBnm4xup/scene.splinecode" },
  ];

  // Connector lines from center [0,0,0] to each corner
  const connectors = [
    [-spread, -spread], [-spread, spread],
    [ spread, -spread], [ spread,  spread],
  ] as [number, number][];

  return (
    <group ref={groupRef} position={[groupX, 0, 0]}>
      {/* Connector lines */}
      {connectors.map(([nx, nz], i) => {
        const len = Math.sqrt(nx * nx + nz * nz);
        const angle = Math.atan2(nx, nz);
        return (
          <Cylinder key={i} args={[0.010, 0.010, len]}
            position={[nx / 2, -0.4, nz / 2]}
            rotation={[Math.PI / 2, 0, -angle]}>
            <meshBasicMaterial color="#22c55e" transparent opacity={0.18} />
          </Cylinder>
        );
      })}

      {/* Corner nodes */}
      {modules.map((mod) => (
        <JarvisSplineNode key={mod.id} position={mod.pos} title={mod.title}
          delay={mod.delay} scale={nodeScale} splineUrl={mod.url} />
      ))}
    </group>
  );
}

// ─── 3D SCENE ─────────────────────────────────────────────────────────────────
function Scene({ bp }: { bp: "mobile" | "tablet" | "laptop" | "desktop" }) {
  const isMobile = bp === "mobile";
  const isTablet = bp === "tablet";
  const isLaptop = bp === "laptop";

  const nodeScale = isMobile ? 0.6 : isTablet ? 0.75 : isLaptop ? 0.65 : 0.85;
  const spread    = isMobile ? 2.0  : isTablet ? 2.6  : 2.8;

  // Camera zoomed to match the screenshot view — higher & further back
  const camPos: [number, number, number] = isMobile
    ? [8, 7, 8]
    : isTablet
    ? [9, 7.5, 9]
    : isLaptop
    ? [0.5, 2.0, 3]  // <-- Diubah: Y lebih rendah (5.5), X & Z dilebarkan (12)
    : [14, 6.0, 14]; // <-- Diubah: Skala yang sama untuk layar desktop besar

  const camFov = isMobile ? 55 : isTablet ? 50 : 52;

  // Target: look at center node position (groupX, 0, 0) — not shifted
  const groupX = isMobile ? 0 : isTablet ? 1 : isLaptop ? 3.0 : 3.5;
  const target: [number, number, number] = [groupX, 0.5, 0];
//   const groupX = isMobile ? 0 : isTablet ? 1 : isLaptop ? 3.0 : 3.5;
//   const target: [number, number, number] = [groupX, 1.5, spread * 0.9];

  return (
    <Canvas camera={{ position: camPos, fov: camFov }} dpr={[1, 2]}>
      <ambientLight intensity={1.0} />
      <pointLight position={[0, 5, 0]} intensity={0.8} color="#22c55e" />
      <pointLight position={[-4, 3, -4]} intensity={0.3} color="#dcfce7" />

      {/* No autoRotate — rotation is handled manually on corner group only */}
      <OrbitControls
        enableZoom={!isMobile}
        maxPolarAngle={Math.PI / 2.1}
        minDistance={isMobile ? 3 : 9}
        maxDistance={isMobile ? 3 : 9}
        autoRotate={false}
        target={target}
        enablePan={false}
      />

      <fog attach="fog" args={["#f7fdf9", isMobile ? 12 : 18, isMobile ? 26 : 38]} />

      {/* Grid + center node — static, never rotates */}
      <group position={[groupX, 0, 0]}>
        <gridHelper
          args={[isMobile ? 16 : 24, isMobile ? 16 : 24, "#86efac", "#d1fae5"]}
          position={[0, -0.5, 0]}
        />
        {/* MULIA AI CORE — fixed in front, does NOT rotate */}
        <JarvisSplineNode
          position={[0, 1.1, spread * 0.7]}
          title="MULIA AI CORE"
          delay={0}
          isCenter
          scale={nodeScale}
          splineUrl="https://prod.spline.design/LUL6rg1zC9XXNgxF/scene.splinecode"
        />
      </group>

      {/* Corner nodes rotate around the same center */}
      <RotatingGroup spread={spread} nodeScale={nodeScale} groupX={groupX} />
    </Canvas>
  );
}

// ─── HUD PANEL (shared between layouts) ───────────────────────────────────────
function HudPanel({ mobile = false }: { mobile?: boolean }) {
  return (
    <motion.div
      initial={{ x: mobile ? 0 : -50, y: mobile ? -20 : 0, opacity: 0 }}
      animate={{ x: 0, y: 0, opacity: 1 }}
      transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* Badge */}
      <div className="flex items-center gap-2 mb-4">
        <div className="animate-pulse w-2 h-2 rounded-full" style={{ background: "#22c55e", boxShadow: "0 0 8px rgba(34,197,94,0.5)" }} />
        <p className="font-mono tracking-[0.3em] uppercase font-semibold"
          style={{ fontSize: 10, color: "#16a34a" }}>
          @ MULIA AI CENTER
        </p>
      </div>

      {/* Heading — "MULIA" black, subtitle green accent */}
      <h1 className={`font-black uppercase tracking-tight leading-none mb-5 ${mobile ? "text-4xl" : "text-5xl lg:text-6xl"}`}>
        <span style={{ color: "#111827" }}>MULIA</span>
        <br />
        <span style={{ color: "#111827" }}>AI </span>
        <span style={{
          color: "#22c55e",
          textShadow: "0 0 20px rgba(34,197,94,0.20)",
        }}>
          LEARNING
        </span>
        <br />
        <span style={{ color: "#111827" }}>CENTER</span>
      </h1>

      {/* Body */}
      <p className="font-sans text-sm leading-relaxed mb-8 max-w-xs"
        style={{ color: "#6b7280", borderLeft: "2px solid #bbf7d0", paddingLeft: 12 }}>
        Initialize enterprise capability protocols. Engage with the core modules to access
        strategic AI learning pathways.
      </p>

      {/* CTA */}
      <button
        className="font-mono tracking-[0.18em] uppercase transition-all duration-250"
        style={{
          fontSize: 11, padding: "10px 28px",
          border: "1px solid #22c55e",
          color: "#15803d",
          background: "rgba(34,197,94,0.06)",
          borderRadius: 2,
        }}
        onMouseEnter={e => {
          const el = e.currentTarget;
          el.style.background = "#22c55e";
          el.style.color = "#fff";
          el.style.boxShadow = "0 0 18px rgba(34,197,94,0.25)";
        }}
        onMouseLeave={e => {
          const el = e.currentTarget;
          el.style.background = "rgba(34,197,94,0.06)";
          el.style.color = "#15803d";
          el.style.boxShadow = "none";
        }}
      >
        Start Your AI Journey!
      </button>
    </motion.div>
  );
}

// ─── PAGE ──────────────────────────────────────────────────────────────────────
export default function MuliaAiCenterPage() {
  const bp       = useBreakpoint();
  const isMobile = bp === "mobile";
  const isTablet = bp === "tablet";

  return (
    <main className="relative overflow-hidden font-sans select-none"
      style={{ minHeight: "100dvh", background: "#f7fdf9" }}>

      {/* Mobile / Tablet — stacked */}
      {(isMobile || isTablet) && (
        <div className="relative z-10 flex flex-col" style={{ height: "100dvh" }}>
          <div className="px-6 pt-8 pb-4" style={{ flexShrink: 0 }}>
            <HudPanel mobile />
          </div>
          <div className="relative flex-1 cursor-move" style={{ minHeight: 0 }}>
            <Scene bp={bp} />
          </div>
        </div>
      )}

      {/* Laptop / Desktop — side-by-side */}
      {!isMobile && !isTablet && (
        <>
          <div className="absolute top-0 left-0 lg:w-[38%] h-full z-10 flex flex-col justify-center px-10 lg:px-16 pointer-events-none">
            <div className="pointer-events-auto">
              <HudPanel />
            </div>
          </div>
          <div className="absolute inset-0 w-full h-full z-0 cursor-move">
            <Scene bp={bp} />
          </div>
        </>
      )}
    </main>
  );
}

// "use client";

// import React, { useRef, useState } from "react";
// import dynamic from "next/dynamic";
// import { Canvas, useFrame } from "@react-three/fiber";
// import { OrbitControls, Html, Torus, Cylinder } from "@react-three/drei";
// import { motion } from "framer-motion";
// import * as THREE from "three";

// const Spline = dynamic(() => import("@splinetool/react-spline"), {
//   ssr: false,
//   loading: () => (
//     <div className="text-cyan-500 font-mono text-[9px] animate-pulse tracking-widest">[LOADING...]</div>
//   ),
// });

// // ─── NODE COMPONENT ────────────────────────────────────────────────────────────
// function JarvisSplineNode({
//   position,
//   title,
//   splineUrl,
//   delay,
//   isCenter = false,
// }: {
//   position: [number, number, number];
//   title: string;
//   splineUrl: string;
//   delay: number;
//   isCenter?: boolean;
// }) {
//   const groupRef = useRef<THREE.Group>(null);
//   const [hovered, setHovered] = useState(false);

//   useFrame((state) => {
//     if (groupRef.current) {
//       const t = state.clock.getElapsedTime();
//       groupRef.current.position.y = position[1] + Math.sin(t * 1.2 + delay) * 0.1;
//     }
//   });

//   // Sizes tuned so Spline fills the ring nicely at distanceFactor=8
//   const ringRadius   = isCenter ? 1.4 : 0.9;
//   const htmlSize   = isCenter ? 350 : 250;   // px — bounding box Html overlay
//   const splineSize = isCenter ? 350 : 250;  // px — Spline canvas (1:1, no double-scale trick)

//   return (
//     <group ref={groupRef} position={position}>
//       {/* Hologram ring */}
//       <Torus args={[ringRadius, 0.012, 16, 80]} rotation={[Math.PI / 2, 0, 0]}>
//         <meshBasicMaterial color={hovered ? "#00ffee" : "#00eeff"} transparent opacity={hovered ? 0.45 : 0.22} />
//       </Torus>
//       {/* Second inner ring for center node */}
//       {isCenter && (
//         <Torus args={[0.65, 0.008, 16, 64]} rotation={[Math.PI / 2, 0, 0]}>
//           <meshBasicMaterial color="#00eeff" transparent opacity={0.15} />
//         </Torus>
//       )}

//       <Html
//         center
//         distanceFactor={8}
//         zIndexRange={[100, 0]}
//         style={{ pointerEvents: "none" }}
//       >
//         <div
//           style={{ width: htmlSize, height: htmlSize, position: "relative" }}
//           onMouseEnter={() => setHovered(true)}
//           onMouseLeave={() => setHovered(false)}
//         >
//           {/* Spline — full size, no scaling tricks */}
//           <div
//             style={{
//               width: splineSize,
//               height: splineSize,
//               pointerEvents: "auto",
//               transition: "transform 0.3s ease",
//               transform: hovered ? "scale(1.08)" : "scale(1)",
//             }}
//           >
//             <Spline scene={splineUrl} style={{ width: "100%", height: "100%" }} />
//           </div>

//           {/* HUD label */}
//           <div
//             style={{
//               position: "absolute",
//               bottom: -32,
//               left: "50%",
//               transform: "translateX(-50%)",
//               whiteSpace: "nowrap",
//               background: "rgba(2,6,23,0.88)",
//               backdropFilter: "blur(8px)",
//               border: hovered ? "1px solid rgba(0,238,255,0.7)" : "1px solid rgba(0,238,255,0.25)",
//               borderRadius: 4,
//               padding: "4px 10px",
//               textAlign: "center",
//               transition: "border 0.25s",
//               boxShadow: hovered ? "0 0 14px rgba(0,238,255,0.25)" : "none",
//               pointerEvents: "none",
//             }}
//           >
//             <p style={{ fontFamily:"Courier New", fontSize: 7, letterSpacing:"0.25em", color:"rgba(0,238,255,0.6)", textTransform:"uppercase", marginBottom: 2 }}>
//               SEC_PROTOCOL
//             </p>
//             <p style={{ fontFamily:"Courier New", fontSize: 11, fontWeight: 700, color: "#fff", letterSpacing:"0.15em", textTransform:"uppercase" }}>
//               {title}
//             </p>
//           </div>
//         </div>
//       </Html>
//     </group>
//   );
// }

// // ─── PAGE ──────────────────────────────────────────────────────────────────────
// export default function MuliaAiCenterPage() {
//   const modules = [
//     {
//       id: 1, title: "INTRO TO AI",
//       // Corners pulled closer: ±3.2 instead of ±4 so they're visually proportional
//       pos: [-3.2, 1.0, -3.2] as [number, number, number],
//       delay: 0,
//       url: "https://prod.spline.design/rXLiCykCpF-3VHLL/scene.splinecode",
//     },
//     {
//       id: 2, title: "PROMPTING MATRIX",
//       pos: [-3.2, 1.0, 3.2] as [number, number, number],
//       delay: 0.5,
//       url: "https://prod.spline.design/632PDn-dVBnm4xup/scene.splinecode",
//     },
//     {
//       id: 3, title: "AI TOOLS LAB",
//       pos: [3.2, 1.0, -3.2] as [number, number, number],
//       delay: 1.0,
//       url: "https://prod.spline.design/632PDn-dVBnm4xup/scene.splinecode",
//     },
//     {
//       id: 4, title: "AI GOVERNANCE",
//       pos: [3.2, 1.0, 3.2] as [number, number, number],
//       delay: 1.5,
//       url: "https://prod.spline.design/632PDn-dVBnm4xup/scene.splinecode",
//     },
//   ];

//   return (
//     <main className="relative h-screen w-full bg-slate-950 overflow-hidden font-sans select-none">
//       {/* Scanlines */}
//       <div
//         className="absolute inset-0 pointer-events-none z-20 opacity-[0.04]"
//         style={{
//           backgroundImage: "linear-gradient(rgba(0,238,255,0.15) 1px, transparent 1px)",
//           backgroundSize: "100% 3px",
//         }}
//       />

//       {/* ── LEFT HUD PANEL ── */}
//       <div className="absolute top-0 left-0 w-full lg:w-[38%] h-full z-10 flex flex-col justify-center px-8 sm:px-16 pointer-events-none">
//         <motion.div
//           initial={{ x: -50, opacity: 0 }}
//           animate={{ x: 0, opacity: 1 }}
//           transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
//           className="pointer-events-auto"
//         >
//           <div className="flex items-center gap-3 mb-4">
//             <div className="animate-pulse w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_10px_#00eeff]" />
//             <p className="font-mono text-xs tracking-[0.3em] text-cyan-400 uppercase font-bold">
//               @ MULIA AI CENTER
//             </p>
//           </div>

//           <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white uppercase tracking-tighter leading-none mb-6">
//             MULIA <br />
//             <span
//               className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-white to-blue-500"
//               style={{ textShadow: "0 0 30px rgba(0,238,255,0.3)" }}
//             >
//               AI Learning <br /> Center
//             </span>
//           </h1>

//           <p className="text-slate-400 text-xs sm:text-sm leading-relaxed mb-8 max-w-sm font-mono border-l-2 border-cyan-800 pl-4">
//             Initialize enterprise capability protocols. Engage with the core modules to access
//             strategic AI learning pathways.
//           </p>

//           <button className="relative group overflow-hidden border border-cyan-400 text-cyan-400 bg-cyan-950/20 px-8 py-3.5 font-mono text-xs tracking-[0.2em] uppercase hover:bg-cyan-400 hover:text-slate-950 transition-all duration-300 shadow-[0_0_15px_rgba(0,238,255,0.2)]">
//             Start Your AI Journey!
//           </button>
//         </motion.div>
//       </div>

//       {/* ── 3D CANVAS ── */}
//       <div className="absolute inset-0 w-full h-full z-0 cursor-move">
//         <Canvas
//           /*
//             Camera tweaks:
//             - position closer: [10, 8, 10] instead of [14,11,14]
//             - fov 45 (wider than 40) so nodes don't get clipped at edges
//             - The group is shifted +2 on X so 3D content sits in the right half
//           */
//           camera={{ position: [10, 8, 10], fov: 45 }}
//           dpr={[1, 2]}
//         >
//           <ambientLight intensity={0.5} />
//           <pointLight position={[0, 5, 0]} intensity={1.8} color="#00ffff" />
//           <pointLight position={[-4, 3, -4]} intensity={0.4} color="#0044ff" />

//           <OrbitControls
//             enableZoom={true}
//             maxPolarAngle={Math.PI / 2.1}
//             minDistance={7}
//             maxDistance={22}
//             autoRotate={true}
//             autoRotateSpeed={0.25}
//             target={[2.5, 0.5, 0]}  // orbit around the group center
//           />

//           <fog attach="fog" args={["#020617", 14, 32]} />

//           <group position={[2, 0, 0]}>
//             {/* Grid floor */}
//             <gridHelper args={[22, 22, "#00eeff", "#001e2e"]} position={[0, -0.5, 0]} />

//             {/* Center node */}
//             <JarvisSplineNode
//               position={[0, 1.1, 0]}
//               title="MULIA AI CORE"
//               delay={0}
//               isCenter={true}
//               splineUrl="https://prod.spline.design/LUL6rg1zC9XXNgxF/scene.splinecode"
//             />

//             {/* Connector lines — length matches corner distance (√2 × 3.2 ≈ 4.52, add a bit) */}
//             <group position={[0, -0.4, 0]}>
//               {[
//                 { pos: [-1.6, 0, -1.6] as [number,number,number], rot: [Math.PI/2, 0,  Math.PI/4] as [number,number,number] },
//                 { pos: [-1.6, 0,  1.6] as [number,number,number], rot: [Math.PI/2, 0, -Math.PI/4] as [number,number,number] },
//                 { pos: [ 1.6, 0, -1.6] as [number,number,number], rot: [Math.PI/2, 0, -Math.PI/4] as [number,number,number] },
//                 { pos: [ 1.6, 0,  1.6] as [number,number,number], rot: [Math.PI/2, 0,  Math.PI/4] as [number,number,number] },
//               ].map((c, i) => (
//                 <Cylinder key={i} args={[0.012, 0.012, 4.7]} position={c.pos} rotation={c.rot}>
//                   <meshBasicMaterial color="#00ffee" transparent opacity={0.2} />
//                 </Cylinder>
//               ))}
//             </group>

//             {/* Corner nodes */}
//             {modules.map((mod) => (
//               <JarvisSplineNode
//                 key={mod.id}
//                 position={mod.pos}
//                 title={mod.title}
//                 delay={mod.delay}
//                 splineUrl={mod.url}
//               />
//             ))}
//           </group>
//         </Canvas>
//       </div>
//     </main>
//   );
// }
// "use client";

// import React, { useState } from "react";
// import Spline from "@splinetool/react-spline";
// import { motion, AnimatePresence } from "framer-motion";

// // --- KOMPONEN: Node Spline Individual + Label J.A.R.V.I.S ---
// function SplineHoloNode({ title, desc, delay, top, left, splineUrl }: any) {
//   const [hovered, setHovered] = useState(false);

//   return (
//     <motion.div
//       className="absolute w-32 h-32 sm:w-48 sm:h-48 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center z-20"
//       style={{ top, left }}
//       initial={{ scale: 0, opacity: 0 }}
//       animate={{ scale: 1, opacity: 1 }}
//       transition={{ delay, duration: 0.8, type: "spring" }}
//       onMouseEnter={() => setHovered(true)}
//       onMouseLeave={() => setHovered(false)}
//     >
//       {/* Container untuk Spline 3D Model */}
//       <motion.div 
//         className="w-full h-full cursor-pointer relative z-10"
//         animate={{ y: [0, -10, 0] }}
//         transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay }}
//         whileHover={{ scale: 1.15 }}
//       >
//         {/* Placeholder Spline URL. Ganti dengan URL Spline 3D Anda! */}
//         <Spline scene={splineUrl} className="pointer-events-none" />
//       </motion.div>

//       {/* Label HTML J.A.R.V.I.S (Muncul saat di-hover/di dekatnya) */}
//       <AnimatePresence>
//         <motion.div 
//           className={`absolute top-full mt-2 transition-all duration-300 pointer-events-none z-30 ${hovered ? "scale-110" : "scale-100 opacity-60"}`}
//         >
//           <div className="bg-[#020a14]/80 backdrop-blur-md border-t border-l border-cyan-400 p-3 sm:p-4 rounded-xl whitespace-nowrap shadow-[0_0_20px_rgba(0,238,255,0.2)] relative">
//             <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-cyan-400 opacity-50"></div>
//             <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-cyan-400 opacity-50"></div>
            
//             <h3 className="text-white font-black text-sm sm:text-lg font-mono tracking-wider uppercase" style={{ textShadow: "0 0 10px rgba(0,238,255,0.7)" }}>
//               {title}
//             </h3>
            
//             {/* Deskripsi memanjang saat di hover */}
//             <motion.div
//               initial={{ height: 0, opacity: 0 }}
//               animate={hovered ? { height: "auto", opacity: 1, marginTop: 8 } : { height: 0, opacity: 0, marginTop: 0 }}
//               className="overflow-hidden"
//             >
//               <p className="text-cyan-100 text-[10px] sm:text-xs w-48 sm:w-56 text-wrap font-sans leading-relaxed border-t border-cyan-800 pt-2">
//                 {desc}
//               </p>
//               <p className="font-mono text-[8px] sm:text-[9px] text-emerald-400 mt-2">SYS_STATUS: [ ACTIVE ]</p>
//             </motion.div>
//           </div>
//         </motion.div>
//       </AnimatePresence>
//     </motion.div>
//   );
// }

// // --- KOMPONEN UTAMA HALAMAN ---
// export default function SplineJarvisPage() {
//   // Data Node dengan Persentase Posisi
//   const modules = [
//     { id: 1, title: "Intro to AI", desc: "Core concepts & transformation data.", top: "15%", left: "15%", delay: 0.2, url: "https://prod.spline.design/6Wq1Q7YGyM-iab9i/scene.splinecode" },
//     { id: 2, title: "Prompting Matrix", desc: "Advanced prompt engineering protocols.", top: "15%", left: "85%", delay: 0.4, url: "https://prod.spline.design/6Wq1Q7YGyM-iab9i/scene.splinecode" },
//     { id: 3, title: "AI Tools Lab", desc: "Agentic workflows and LLM deployment.", top: "85%", left: "15%", delay: 0.6, url: "https://prod.spline.design/6Wq1Q7YGyM-iab9i/scene.splinecode" },
//     { id: 4, title: "AI Governance", desc: "Corporate guardrails & data security.", top: "85%", left: "85%", delay: 0.8, url: "https://prod.spline.design/6Wq1Q7YGyM-iab9i/scene.splinecode" },
//   ];

//   return (
//     <main className="relative h-screen w-full bg-[#020610] overflow-hidden font-sans select-none flex">
      
//       {/* Efek Scanlines */}
//       <div className="absolute inset-0 pointer-events-none z-20 opacity-20" style={{
//         backgroundImage: "linear-gradient(rgba(0, 238, 255, 0.1) 1px, transparent 1px)",
//         backgroundSize: "100% 3px"
//       }} />

//       {/* --- KIRI: UI HUD OVERLAY --- */}
//       <div className="relative z-30 w-full lg:w-1/3 h-full flex flex-col justify-center px-8 sm:px-12 pointer-events-none">
//         <motion.div initial={{ x: -60, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ duration: 1 }} className="pointer-events-auto">
//           <div className="flex items-center gap-3 mb-6">
//             <div className="animate-pulse w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_15px_#00eeff]" />
//             <p className="font-mono text-xs tracking-[0.4em] text-cyan-400 uppercase font-bold" style={{ textShadow: "0 0 10px #00eeff" }}>
//               MULIA AI Core / Online
//             </p>
//           </div>

//           <h1 className="text-5xl lg:text-7xl font-black text-white uppercase tracking-tighter leading-none mb-6 drop-shadow-2xl">
//             MULIA <br />
//             <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-white to-cyan-500" style={{ textShadow: "0 0 40px rgba(0,238,255,0.4)" }}>
//               Artificial <br /> Intelligence
//             </span>
//           </h1>

//           <p className="text-slate-400 text-sm sm:text-base leading-relaxed mb-10 max-w-sm border-l-2 border-cyan-800 pl-4 font-mono">
//             Execute synchronization protocol. Initialize interaction with holographic data nodes to download learning sequences.
//           </p>

//           <button className="relative group overflow-hidden border border-cyan-400 text-cyan-400 px-8 py-3 font-mono text-xs tracking-[0.3em] uppercase hover:bg-cyan-400 hover:text-slate-950 transition-all duration-300 shadow-[0_0_15px_rgba(0,238,255,0.3)] hover:shadow-[0_0_40px_rgba(0,238,255,0.7)] group">
//             <span className="absolute inset-0 w-1/2 h-full bg-white/20 -skew-x-12 -translate-x-full group-hover:translate-x-[200%] transition-transform duration-700"></span>
//             Start Your AI Journey
//           </button>
//         </motion.div>
//       </div>

//       {/* --- KANAN: JARINGAN NODE SPLINE --- */}
//       <div className="absolute right-0 top-0 w-full lg:w-2/3 h-full flex items-center justify-center p-10 z-10">
        
//         {/* Kotak Virtual untuk menahan Node agar rapi */}
//         <div className="relative w-full max-w-[600px] aspect-square">
          
//           {/* Garis Koneksi Motherboard (SVG) */}
//           <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-40 z-0">
//             {/* Garis ke Sudut Kiri Atas */}
//             <line x1="50%" y1="50%" x2="15%" y2="15%" stroke="#00eeff" strokeWidth="1" strokeDasharray="4 4" />
//             {/* Garis ke Sudut Kanan Atas */}
//             <line x1="50%" y1="50%" x2="85%" y2="15%" stroke="#00eeff" strokeWidth="1" strokeDasharray="4 4" />
//             {/* Garis ke Sudut Kiri Bawah */}
//             <line x1="50%" y1="50%" x2="15%" y2="85%" stroke="#00eeff" strokeWidth="1" strokeDasharray="4 4" />
//             {/* Garis ke Sudut Kanan Bawah */}
//             <line x1="50%" y1="50%" x2="85%" y2="85%" stroke="#00eeff" strokeWidth="1" strokeDasharray="4 4" />
            
//             {/* Lingkaran Dekoratif di tengah SVG */}
//             <circle cx="50%" cy="50%" r="20%" fill="none" stroke="#00eeff" strokeWidth="1" opacity="0.3" />
//             <circle cx="50%" cy="50%" r="35%" fill="none" stroke="#00eeff" strokeWidth="0.5" strokeDasharray="2 6" opacity="0.5" />
//           </svg>

//           {/* NODE TENGAH (M.A.I.N CORE) */}
//           <motion.div 
//             className="absolute top-[50%] left-[50%] w-48 h-48 sm:w-64 sm:h-64 -translate-x-1/2 -translate-y-1/2 z-10"
//             initial={{ scale: 0 }}
//             animate={{ scale: 1 }}
//             transition={{ duration: 1, type: "spring" }}
//           >
//             {/* Bola Energi Utama */}
//             <Spline scene="https://prod.spline.design/632PDn-dVBnm4xup/scene.splinecode" className="pointer-events-auto cursor-grab active:cursor-grabbing" />
//             <div className="absolute top-[85%] left-1/2 -translate-x-1/2 bg-cyan-950/80 border border-cyan-400 px-3 py-1 rounded text-cyan-400 font-mono text-[10px] tracking-widest whitespace-nowrap pointer-events-none">
//               MULIA AI CORE
//             </div>
//           </motion.div>

//           {/* 4 NODE MODUL DI SUDUT */}
//           {modules.map((mod) => (
//             <SplineHoloNode 
//               key={mod.id}
//               title={mod.title}
//               desc={mod.desc}
//               top={mod.top}
//               left={mod.left}
//               delay={mod.delay}
//               splineUrl={mod.url} 
//             />
//           ))}

//         </div>
//       </div>
//     </main>
//   );
// }