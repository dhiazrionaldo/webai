import { useState, useEffect } from "react";

// ─── IMAGE ASPECT RATIO HOOK ──────────────────────────────────────────────────
// Mengukur AR asli Background.png agar "stage" punya rasio yang TEPAT sama dengan
// gambar. Dengan begini semua elemen (asap, ikan, truk, orang, box) nempel ke
// fitur gambar di SEMUA ukuran layar — tidak perlu adjust manual lagi.
export function useImageAR(src: string, fallback = 2.11) {
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
