import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
} from "remotion";

export const Episode1: React.FC = () => {
  const frame = useCurrentFrame();
  const { width, fps } = useVideoConfig();

  const titleOpacity = interpolate(frame, [0, fps * 0.5], [0, 1], {
    extrapolateRight: "clamp",
  });

  const subtitleOpacity = interpolate(frame, [fps * 0.5, fps * 1], [0, 1], {
    extrapolateRight: "clamp",
  });

  const scale = interpolate(frame, [0, fps * 0.3], [0.8, 1], {
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#1A1A2E",
        justifyContent: "center",
        alignItems: "center",
        fontFamily: "Nunito, sans-serif",
      }}
    >
      <div
        style={{
          textAlign: "center",
          transform: `scale(${scale})`,
        }}
      >
        <h1
          style={{
            color: "#FFB612",
            fontSize: Math.round(width * 0.06),
            margin: 0,
            opacity: titleOpacity,
            fontWeight: 800,
            letterSpacing: 2,
          }}
        >
          NovaTV
        </h1>
        <p
          style={{
            color: "#FFFFFF",
            fontSize: Math.round(width * 0.025),
            marginTop: 16,
            opacity: subtitleOpacity,
            fontWeight: 600,
          }}
        >
          Episode 1: Meet the Crew
        </p>
        <p
          style={{
            color: "#666666",
            fontSize: Math.round(width * 0.014),
            marginTop: 8,
            opacity: subtitleOpacity,
          }}
        >
          Placeholder — components built in Task 4
        </p>
      </div>
    </AbsoluteFill>
  );
};
