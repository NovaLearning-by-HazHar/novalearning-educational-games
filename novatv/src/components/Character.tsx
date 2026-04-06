import React from "react";
import {
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
  Img,
  staticFile,
} from "remotion";

export interface CharacterProps {
  src: string | null;
  name: string;
  color: string;
  enterFrom: "left" | "right";
  enterFrame: number;
  exitFrame?: number;
  scale?: number;
  position?: { x: string; y: string };
}

export const Character: React.FC<CharacterProps> = ({
  src,
  name,
  color,
  enterFrom,
  enterFrame,
  exitFrame,
  scale = 1,
  position = { x: "50%", y: "55%" },
}) => {
  const frame = useCurrentFrame();
  const { fps, width } = useVideoConfig();

  // Spring entrance
  const enterProgress = spring({
    frame: frame - enterFrame,
    fps,
    config: { damping: 12, mass: 0.8 },
  });

  // Exit animation
  const exitProgress = exitFrame
    ? spring({
        frame: frame - exitFrame,
        fps,
        config: { damping: 14, mass: 0.6 },
      })
    : 0;

  const enterX = enterFrom === "left" ? -120 : 120;
  const translateX =
    interpolate(enterProgress, [0, 1], [enterX, 0]) +
    interpolate(exitProgress, [0, 1], [0, enterFrom === "left" ? -120 : 120]);

  // Idle bob
  const bobY = Math.sin(frame * 0.05) * 8;

  const opacity = interpolate(exitProgress, [0, 1], [1, 0]);

  if (frame < enterFrame) return null;

  const charSize = Math.round(width * 0.18);
  const fontSize = Math.round(width * 0.022);

  return (
    <div
      style={{
        position: "absolute",
        left: position.x,
        top: position.y,
        transform: `translate(-50%, -50%) translateX(${translateX}%) translateY(${bobY}px) scale(${scale})`,
        opacity,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 8,
      }}
    >
      {src ? (
        <Img
          src={staticFile(src)}
          style={{
            height: charSize,
            objectFit: "contain",
            filter: "drop-shadow(0 4px 12px rgba(0,0,0,0.15))",
          }}
        />
      ) : (
        <div
          style={{
            width: charSize * 0.65,
            height: charSize * 0.65,
            borderRadius: "50%",
            background: `linear-gradient(135deg, ${color}, ${color}cc)`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: charSize * 0.3,
            fontFamily: "Nunito, sans-serif",
            fontWeight: 900,
            color: "white",
            boxShadow: `0 4px 20px ${color}66`,
          }}
        >
          {name[0]}
        </div>
      )}
      <div
        style={{
          fontFamily: "Nunito, sans-serif",
          fontWeight: 700,
          fontSize,
          color,
          textShadow: "0 1px 3px rgba(0,0,0,0.1)",
          textAlign: "center",
        }}
      >
        {name}
      </div>
    </div>
  );
};
