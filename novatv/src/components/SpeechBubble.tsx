import React from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";

export interface SpeechBubbleProps {
  text: string;
  showAtFrame: number;
  hideAtFrame?: number;
  pointerSide: "left" | "right";
  typewriterSpeed?: number;
}

export const SpeechBubble: React.FC<SpeechBubbleProps> = ({
  text,
  showAtFrame,
  hideAtFrame,
  pointerSide,
  typewriterSpeed = 4,
}) => {
  const frame = useCurrentFrame();
  const { fps, width } = useVideoConfig();

  if (frame < showAtFrame) return null;

  // Pop-in spring
  const popIn = spring({
    frame: frame - showAtFrame,
    fps,
    config: { damping: 10, mass: 0.6 },
  });

  // Pop-out
  const popOut =
    hideAtFrame && frame >= hideAtFrame
      ? spring({
          frame: frame - hideAtFrame,
          fps,
          config: { damping: 14, mass: 0.5 },
        })
      : 0;

  const scale = interpolate(popIn, [0, 1], [0, 1]) * (1 - popOut);
  if (scale < 0.01) return null;

  // Typewriter effect
  const words = text.split(" ");
  const elapsed = frame - showAtFrame;
  const visibleCount = Math.min(
    Math.floor(elapsed / typewriterSpeed) + 1,
    words.length,
  );
  const displayText = words.slice(0, visibleCount).join(" ");

  const bubbleFontSize = Math.round(width * 0.02);
  const maxWidth = width * 0.55;

  return (
    <div
      style={{
        position: "absolute",
        top: "18%",
        left: pointerSide === "left" ? "35%" : "15%",
        maxWidth,
        transform: `scale(${scale})`,
        transformOrigin: pointerSide === "left" ? "bottom left" : "bottom right",
      }}
    >
      <div
        style={{
          background: "white",
          borderRadius: 20,
          padding: `${width * 0.015}px ${width * 0.02}px`,
          boxShadow: "0 4px 16px rgba(0,0,0,0.1)",
          fontFamily: "Nunito, sans-serif",
          fontWeight: 700,
          fontSize: bubbleFontSize,
          color: "#333",
          lineHeight: 1.4,
        }}
      >
        {displayText}
      </div>
      {/* Triangle pointer */}
      <div
        style={{
          position: "absolute",
          bottom: -12,
          [pointerSide === "left" ? "left" : "right"]: 24,
          width: 0,
          height: 0,
          borderLeft: "12px solid transparent",
          borderRight: "12px solid transparent",
          borderTop: "14px solid white",
        }}
      />
    </div>
  );
};
