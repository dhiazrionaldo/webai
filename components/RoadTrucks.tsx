"use client";

import { useEffect, useRef } from "react";

// ─── ROAD TRUCK — 1 truk, bolak-balik di jalur diagonal scene Mulia ──────────
// Jalur: titik A (atas, jauh) ↔ titik B (bawah, dekat)
// Koordinat dikalibrasi ke background image scene.
//
// Aset di /public/trucks/:
//   truck-left.svg   → saat ke atas (menjauh)
//   truck-right.svg  → saat ke bawah (mendekat)

interface TruckConfig {
  aLeft: number;    // % left titik A (atas/jauh)
  aTop: number;     // % top  titik A
  bLeft: number;    // % left titik B (bawah/dekat)
  bTop: number;     // % top  titik B
  duration: number; // ms satu perjalanan A→B atau B→A
  delay: number;    // ms offset awal
  widthFar: number;  // px lebar truk di titik A
  widthNear: number; // px lebar truk di titik B
}
const TRUCK: TruckConfig = {
  // Titik A diturunin sedikit ke arah kiri-bawah
  aLeft: 22,   
  aTop: 46,    
  
  // Titik B dinaikin sedikit ke arah kanan-atas
  bLeft: 15,   
  bTop: 49,
  
  duration: 3000, 
  delay: 0,
  
  widthFar: 30,  
  widthNear: 30, 
};
// const TRUCK: TruckConfig = {
//   // Dikalibrasi ke jalur panah merah di scene
//   aLeft: 88,
//   aTop: 10,
//   bLeft: 10,
//   bTop: 94,
//   duration: 4000,
//   delay: 0,
//   widthFar: 12,
//   widthNear: 72,
// };

function easeInOut(t: number): number {
  return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
}

export function RoadTrucks() {
  const containerRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const img = document.createElement("img");
    img.src = "/trucks/truck-right.svg";
    img.alt = "";
    img.draggable = false;
    img.style.cssText = [
      "position:absolute",
      "top:0",
      "left:0",
      `width:${TRUCK.widthFar}px`,
      "height:auto",
      "will-change:transform,width",
      "user-select:none",
      "pointer-events:none",
    ].join(";");
    container.appendChild(img);

    let startTime: number | null = null;
    let lastAsset: "left" | "right" = "right";

    function animate(ts: number) {
      if (startTime === null) startTime = ts + TRUCK.delay;

      const elapsed = ts - startTime;
      const cycle = TRUCK.duration * 2;
      const raw = ((elapsed % cycle) + cycle) % cycle;
      const phase = raw / cycle;

      let t: number;
      let goingDown: boolean;

      if (phase < 0.5) {
        // A → B (atas ke bawah, mendekat)
        t = easeInOut(phase * 2);
        goingDown = true;
      } else {
        // B → A (bawah ke atas, menjauh)
        t = easeInOut((phase - 0.5) * 2);
        goingDown = false;
      }

      const W = container!.offsetWidth;
      const H = container!.offsetHeight;

      const [fromL, fromT, toL, toT] = goingDown
        ? [TRUCK.aLeft, TRUCK.aTop, TRUCK.bLeft, TRUCK.bTop]
        : [TRUCK.bLeft, TRUCK.bTop, TRUCK.aLeft, TRUCK.aTop];

      const leftPct = fromL + (toL - fromL) * t;
      const topPct  = fromT + (toT - fromT) * t;

      const x = (leftPct / 100) * W;
      const y = (topPct  / 100) * H;

      // Scale perspektif — 0=jauh(kecil), 1=dekat(besar)
      const tScale = goingDown ? t : 1 - t;
      const w = Math.round(
        TRUCK.widthFar + (TRUCK.widthNear - TRUCK.widthFar) * tScale
      );

      // Swap asset berdasar arah
      const asset = goingDown ? "right" : "left";
      if (asset !== lastAsset) {
        img.src = `/trucks/truck-${asset}.svg`;
        lastAsset = asset;
      }

      img.style.width = `${w}px`;
      // Offset -w/2 biar anchor di tengah truk
      img.style.transform = `translate(${Math.round(x - w / 2)}px, ${Math.round(y)}px)`;

      rafRef.current = requestAnimationFrame(animate);
    }

    rafRef.current = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(rafRef.current);
      img.remove();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 pointer-events-none z-10"
    />
  );
}

// "use client";

// import { useEffect, useRef } from "react";

// // ─── ROAD TRUCKS — truk isometrik (kabin depan-kiri, bak panjang belakang-kanan) ───
// // Proyeksi isometrik 2:1. Wrapper hanya gerak di sumbu X (tanpa bounce).
// // Flip = scaleX(-1) untuk truk yang berjalan ke arah berlawanan.

// interface TruckColors {
//   cabTop: string;
//   cabSide: string;
//   cabFront: string;
//   glass: string;
//   grille: string;
//   boxTop: string;
//   boxSide: string;
//   boxRear: string;
//   stripe: string;
// }

// interface TruckConfig {
//   id: number;
//   lane: string;       // top % di dalam container
//   startPct: number;   // posisi awal (% lebar container, bisa >100)
//   endPct: number;     // posisi akhir
//   duration: number;   // ms
//   delay: number;      // ms (boleh negatif untuk offset awal)
//   scale: number;
//   colors: TruckColors;
// }

// // ─── Geometri isometrik ───────────────────────────────────────────────────────
// const S = 1.5;
// const cabLen = 18, gap = 1, boxLen = 50, W = 20;
// const cabH = 22, chassis = 5, boxH = 24;
// const x0 = 0, x1 = cabLen, x2 = cabLen + gap, x3 = x2 + boxLen;
// const zb = chassis, zt = chassis + boxH;

// type Pt = [number, number];

// function project(x: number, y: number, z: number, ox: number, oy: number): Pt {
//   return [ox + 3 * (x + y), oy + 1.5 * (-x + y - 2 * z)];
// }

// function poly(pts: Pt[], fill: string, extra = ""): string {
//   const p = pts.map((q) => q[0].toFixed(1) + "," + q[1].toFixed(1)).join(" ");
//   return `<polygon points="${p}" fill="${fill}" ${extra}/>`;
// }

// function seg(a: Pt, b: Pt, stroke: string, sw = 0.8): string {
//   return `<line x1="${a[0].toFixed(1)}" y1="${a[1].toFixed(1)}" x2="${b[0].toFixed(1)}" y2="${b[1].toFixed(1)}" stroke="${stroke}" stroke-width="${sw}"/>`;
// }

// function wheel(xc: number, ox: number, oy: number, r = 6.5): string {
//   const ring = (rad: number, fill: string) => {
//     const pts: Pt[] = [];
//     for (let i = 0; i < 18; i++) {
//       const a = (i / 18) * 2 * Math.PI;
//       pts.push(project(xc + rad * Math.cos(a), W, r + rad * Math.sin(a), ox, oy));
//     }
//     return poly(pts, fill);
//   };
//   return ring(r, "#141414") + ring(r * 0.66, "#2c2c2c") + ring(r * 0.28, "#555");
// }

// function buildTruckSVG(c: TruckColors, scale: number): string {
//   const ox = 25;
//   const oy = 190;
//   const VBW = 320;
//   const VBH = 230;

//   let s = "";

//   // Shadow
//   s += poly(
//     [
//       project(x0, 2, -1.5, ox, oy),
//       project(x3, 2, -1.5, ox, oy),
//       project(x3, W - 2, -1.5, ox, oy),
//       project(x0, W - 2, -1.5, ox, oy),
//     ],
//     "rgba(0,0,0,0.13)"
//   );

//   // Box top
//   s += poly(
//     [
//       project(x2, 0, zt, ox, oy),
//       project(x3, 0, zt, ox, oy),
//       project(x3, W, zt, ox, oy),
//       project(x2, W, zt, ox, oy),
//     ],
//     c.boxTop
//   );
//   for (let xx = x2 + 8; xx < x3; xx += 8) {
//     s += seg(project(xx, 0, zt, ox, oy), project(xx, W, zt, ox, oy), "rgba(0,0,0,0.05)", 0.7);
//   }

//   // Box rear + taillights
//   s += poly(
//     [
//       project(x3, 0, zb, ox, oy),
//       project(x3, W, zb, ox, oy),
//       project(x3, W, zt, ox, oy),
//       project(x3, 0, zt, ox, oy),
//     ],
//     c.boxRear
//   );
//   const tlL = project(x3, 1.5, zb + 4, ox, oy);
//   const tlR = project(x3, W - 3, zb + 4, ox, oy);
//   s += `<rect x="${tlL[0].toFixed(1)}" y="${tlL[1].toFixed(1)}" width="6" height="5" rx="1" fill="#FF2A2A" opacity="0.9"/>`;
//   s += `<rect x="${(tlR[0] - 6).toFixed(1)}" y="${tlR[1].toFixed(1)}" width="6" height="5" rx="1" fill="#FF2A2A" opacity="0.9"/>`;

//   // Box side + panel lines + stripe
//   s += poly(
//     [
//       project(x2, W, zb, ox, oy),
//       project(x3, W, zb, ox, oy),
//       project(x3, W, zt, ox, oy),
//       project(x2, W, zt, ox, oy),
//     ],
//     c.boxSide
//   );
//   for (let xx = x2 + 6; xx < x3; xx += 6) {
//     s += seg(project(xx, W, zb, ox, oy), project(xx, W, zt, ox, oy), "rgba(0,0,0,0.07)", 0.7);
//   }
//   s += poly(
//     [
//       project(x2, W, zb, ox, oy),
//       project(x3, W, zb, ox, oy),
//       project(x3, W, zb + 2.5, ox, oy),
//       project(x2, W, zb + 2.5, ox, oy),
//     ],
//     c.stripe,
//     'opacity="0.5"'
//   );

//   // Rear wheels (tandem)
//   s += wheel(x3 - 7, ox, oy);
//   s += wheel(x3 - 17, ox, oy);

//   // Cab top
//   s += poly(
//     [
//       project(x0, 0, cabH, ox, oy),
//       project(x1, 0, cabH, ox, oy),
//       project(x1, W, cabH, ox, oy),
//       project(x0, W, cabH, ox, oy),
//     ],
//     c.cabTop
//   );

//   // Cab side + small window
//   s += poly(
//     [
//       project(x0, W, 0, ox, oy),
//       project(x1, W, 0, ox, oy),
//       project(x1, W, cabH, ox, oy),
//       project(x0, W, cabH, ox, oy),
//     ],
//     c.cabSide
//   );
//   s += poly(
//     [
//       project(x0 + 2, W, cabH * 0.5, ox, oy),
//       project(x0 + 9, W, cabH * 0.5, ox, oy),
//       project(x0 + 9, W, cabH * 0.85, ox, oy),
//       project(x0 + 2, W, cabH * 0.85, ox, oy),
//     ],
//     "rgba(190,225,255,0.75)"
//   );

//   // Front wheel
//   s += wheel(x0 + 4, ox, oy);

//   // Cab front: face + windshield + grille + headlights
//   s += poly(
//     [
//       project(x0, 0, 0, ox, oy),
//       project(x0, W, 0, ox, oy),
//       project(x0, W, cabH, ox, oy),
//       project(x0, 0, cabH, ox, oy),
//     ],
//     c.cabFront
//   );
//   s += poly(
//     [
//       project(x0, 2.5, cabH * 0.46, ox, oy),
//       project(x0, W - 2.5, cabH * 0.46, ox, oy),
//       project(x0, W - 2.5, cabH * 0.92, ox, oy),
//       project(x0, 2.5, cabH * 0.92, ox, oy),
//     ],
//     c.glass
//   );
//   s += poly(
//     [
//       project(x0, 2.5, cabH * 0.46, ox, oy),
//       project(x0, W - 2.5, cabH * 0.46, ox, oy),
//       project(x0, W - 2.5, cabH * 0.92, ox, oy),
//       project(x0, 2.5, cabH * 0.92, ox, oy),
//     ],
//     "none",
//     'stroke="rgba(0,0,0,0.25)" stroke-width="0.7"'
//   );
//   s += poly(
//     [
//       project(x0, 2, 1, ox, oy),
//       project(x0, W - 2, 1, ox, oy),
//       project(x0, W - 2, cabH * 0.4, ox, oy),
//       project(x0, 2, cabH * 0.4, ox, oy),
//     ],
//     c.grille
//   );
//   s += seg(project(x0, 2, cabH * 0.22, ox, oy), project(x0, W - 2, cabH * 0.22, ox, oy), "rgba(0,0,0,0.25)", 0.8);
//   const hlL = project(x0, 3.5, 3, ox, oy);
//   const hlR = project(x0, W - 3.5, 3, ox, oy);
//   s += `<ellipse cx="${hlL[0].toFixed(1)}" cy="${hlL[1].toFixed(1)}" rx="2.6" ry="2" fill="#FFF3A8"/>`;
//   s += `<ellipse cx="${hlR[0].toFixed(1)}" cy="${hlR[1].toFixed(1)}" rx="2.6" ry="2" fill="#FFF3A8"/>`;

//   const w = Math.round(VBW * scale);
//   const h = Math.round(VBH * scale);
//   return `<svg width="${w}" height="${h}" viewBox="0 0 ${VBW} ${VBH}" fill="none" xmlns="http://www.w3.org/2000/svg">${s}</svg>`;
// }

// // ─── Palet warna ───────────────────────────────────────────────────────────────
// const BLUE: TruckColors = {
//   cabTop: "#6AA8EE", cabSide: "#4E8FDD", cabFront: "#3D7ECC",
//   glass: "#2E3A44", grille: "#2C5896",
//   boxTop: "#F2F2F2", boxSide: "#DEDEDE", boxRear: "#CFCFCF", stripe: "#3A7FD4",
// };
// const WHITE: TruckColors = {
//   cabTop: "#FAFAFA", cabSide: "#E6E6E6", cabFront: "#D6D6D6",
//   glass: "#2E3A44", grille: "#9AA0A4",
//   boxTop: "#F4F4F4", boxSide: "#E2E2E2", boxRear: "#D2D2D2", stripe: "#B8C0C6",
// };
// const GREEN: TruckColors = {
//   cabTop: "#52C07A", cabSide: "#3DA866", cabFront: "#2E9156",
//   glass: "#243A30", grille: "#1F6B40",
//   boxTop: "#F2F2F2", boxSide: "#DEDEDE", boxRear: "#CFCFCF", stripe: "#58D68D",
// };
// const ORANGE: TruckColors = {
//   cabTop: "#F0A04B", cabSide: "#E08830", cabFront: "#D2761E",
//   glass: "#3A2A18", grille: "#9A5410",
//   boxTop: "#F2F2F2", boxSide: "#DEDEDE", boxRear: "#CFCFCF", stripe: "#FFD27F",
// };

// const TRUCKS_DATA: TruckConfig[] = [
//   { id: 1, lane: "50%", startPct: 80,  endPct: 30,  duration: 11000, delay: 0,     scale: 0.62, colors: BLUE },
//   { id: 2, lane: "56%", startPct: 25,  endPct: 78,  duration: 13000, delay: -4000, scale: 0.55, colors: WHITE },
//   { id: 3, lane: "60%", startPct: 85,  endPct: 35,  duration: 10000, delay: -7000, scale: 0.50, colors: GREEN },
//   { id: 4, lane: "54%", startPct: 30,  endPct: 82,  duration: 12000, delay: -2000, scale: 0.58, colors: ORANGE },
// ];

// function easeInOut(t: number): number {
//   return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
// }

// export function RoadTrucks() {
//   const containerRef = useRef<HTMLDivElement>(null);
//   const rafRef = useRef<number>(0);

//   useEffect(() => {
//     const container = containerRef.current;
//     if (!container) return;

//     const instances = TRUCKS_DATA.map((cfg) => {
//       const el = document.createElement("div");
//       el.style.cssText = `position:absolute; top:${cfg.lane}; left:0; will-change:transform;`;
//       el.innerHTML = buildTruckSVG(cfg.colors, cfg.scale);
//       container.appendChild(el);
//       return { el, cfg, startTime: null as number | null };
//     });

//     function animate(ts: number) {
//       const sceneW = container!.offsetWidth;

//       for (const f of instances) {
//         if (f.startTime === null) f.startTime = ts + f.cfg.delay;

//         const elapsed = ts - f.startTime;
//         const dur = f.cfg.duration;
//         const raw = ((elapsed % dur) + dur) % dur;
//         const phase = raw / dur;

//         const halfPhase = phase < 0.5 ? phase * 2 : (phase - 0.5) * 2;
//         const eased = easeInOut(halfPhase);
//         const pct =
//           phase < 0.5
//             ? f.cfg.startPct + (f.cfg.endPct - f.cfg.startPct) * eased
//             : f.cfg.endPct + (f.cfg.startPct - f.cfg.endPct) * eased;

//         const x = (pct / 100) * sceneW;
//         // Pergi vs balik: tentukan arah dari beda posisi sesaat
//         const goingRight = phase < 0.5 ? f.cfg.endPct > f.cfg.startPct : f.cfg.startPct > f.cfg.endPct;

//         // Wrapper: X only — tanpa bounce vertikal
//         f.el.style.transform = `translateX(${Math.round(x)}px) scaleX(${goingRight ? -1 : 1})`;
//       }

//       rafRef.current = requestAnimationFrame(animate);
//     }

//     rafRef.current = requestAnimationFrame(animate);

//     return () => {
//       cancelAnimationFrame(rafRef.current);
//       instances.forEach((f) => f.el.remove());
//     };
//   }, []);

//   return <div ref={containerRef} className="absolute inset-0 pointer-events-none z-10" />;
// }