import React from "react";
import { useCurrentFrame, useVideoConfig, interpolate } from "remotion";

export interface SubtitlesProps {
  text: string | null;
  visible: boolean;
}

export const Subtitles: React.FC<SubtitlesProps> = ({ text, visible }) => {
  const frame = useCurrentFrame();
  const { width } = useVideoConfig();

  if (!text || !visible) return null;

  const fontSize = Math.round(width * 0.025);

  return (
    <div
      style={{
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        height: "12%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: `0 ${width * 0.05}px`,
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "rgba(0, 0, 0, 0.65)",
          borderRadius: "12px 12px 0 0",
        }}
      />
      <p
        style={{
          position: "relative",
          fontFamily: "Nunito, sans-serif",
          fontWeight: 700,
          fontSize,
          color: "white",
          textAlign: "center",
          lineHeight: 1.3,
          maxWidth: "90%",
        }}
      >
        {text}
      </p>
    </div>
  );
};
