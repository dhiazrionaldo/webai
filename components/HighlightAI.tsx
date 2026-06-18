import React from "react";

// ─── HIGHLIGHT HELPER ─────────────────────────────────────────────────────────
export function HighlightAI({ text }: { text: string }) {
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
