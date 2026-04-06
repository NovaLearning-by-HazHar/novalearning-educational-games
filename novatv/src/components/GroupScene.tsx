import React from "react";
import {
  AbsoluteFill,
  Img,
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
  random,
  staticFile,
} from "remotion";
import { KIDS } from "../data/characters";
import { CHARACTER_COLORS } from "../types";
import { Subtitles } from "./Subtitles";

export const GroupScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  const isPortrait = height > width;

  // Layout positions: 2 rows (or stacked in portrait)
  const positions = KIDS.map((kid, i) => {
    const row = i < 4 ? 0 : 1;
    const col = i % 4;
    if (isPortrait) {
      return {
        x: `${20 + col * 20}%`,
        y: `${28 + row * 25}%`,
        scale: row === 0 ? 0.7 : 0.8,
      };
    }
    return {
      x: `${15 + col * 22}%`,
      y: row === 0 ? "38%" : "62%",
      scale: row === 0 ? 0.75 : 0.85,
    };
  });

  // "Come learn with us!" text
  const showText = frame >= 120;
  const textSpring = showText
    ? spring({ frame: frame - 120, fps, config: { damping: 10, mass: 0.7 } })
    : 0;

  // Confetti (after frame 180)
  const showConfetti = frame >= 180;
  const confettiColors = [
    "#007749", "#FFB81C", "#DE3831", "#002395",
    "#FF9800", "#E91E63", "#4CAF50", "#9C27B0",
  ];

  return (
    <AbsoluteFill
      style={{
        background: "linear-gradient(180deg, #FFF3E0 0%, #FFE0B2 100%)",
      }}
    >
      {/* Characters entering with stagger */}
      {KIDS.map((kid, i) => {
        const enterFrame = i * 12;
        const enterProgress = spring({
          frame: frame - enterFrame,
          fps,
          config: { damping: 12, mass: 0.8 },
        });
        if (frame < enterFrame) return null;

        const pos = positions[i];
        const colors = CHARACTER_COLORS[kid.id];
        const bobPhase = i * 0.7;
        const bobY = Math.sin((frame + bobPhase * 20) * 0.05) * 6;

        // Group bounce at frame 140
        const bounceScale =
          frame >= 140
            ? 1 +
              interpolate(
                spring({ frame: frame - 140, fps, config: { damping: 8, mass: 0.5 } }),
                [0, 1],
                [0.08, 0],
              )
            : 1;

        const charSize = Math.round(width * (pos.scale * 0.14));

        return (
          <div
            key={kid.id}
            style={{
              position: "absolute",
              left: pos.x,
              top: pos.y,
              transform: `translate(-50%, -50%) scale(${enterProgress * bounceScale}) translateY(${bobY}px)`,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 4,
            }}
          >
            {kid.file ? (
              <Img
                src={staticFile(kid.file)}
                style={{ height: charSize, objectFit: "contain" }}
              />
            ) : (
              <div
                style={{
                  width: charSize * 0.7,
                  height: charSize * 0.7,
                  borderRadius: "50%",
                  background: colors
                    ? `linear-gradient(135deg, ${colors.accent}, ${colors.accent}cc)`
                    : kid.color,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: charSize * 0.3,
                  fontWeight: 900,
                  fontFamily: "Nunito, sans-serif",
                  color: "white",
                  boxShadow: `0 3px 12px ${kid.color}44`,
                }}
              >
                {kid.name[0]}
              </div>
            )}
            <div
              style={{
                fontFamily: "Nunito, sans-serif",
                fontWeight: 700,
                fontSize: Math.round(width * 0.014),
                color: colors?.text ?? kid.color,
              }}
            >
              {kid.name}
            </div>
          </div>
        );
      })}

      {/* "Come learn with us!" */}
      {textSpring > 0 && (
        <div
          style={{
            position: "absolute",
            top: isPortrait ? "12%" : "10%",
            left: "50%",
            transform: `translate(-50%, -50%) scale(${textSpring})`,
            fontFamily: "Nunito, sans-serif",
            fontWeight: 900,
            fontSize: width * 0.045,
            color: "white",
            textShadow: "0 3px 12px rgba(0,0,0,0.25)",
            textAlign: "center",
            whiteSpace: "nowrap",
          }}
        >
          Come learn with us!
        </div>
      )}

      {/* Confetti */}
      {showConfetti &&
        Array.from({ length: 30 }, (_, i) => {
          const x = random(`conf-x-${i}`) * 100;
          const speed = 40 + random(`conf-sp-${i}`) * 60;
          const delay = random(`conf-d-${i}`) * 40;
          const t = Math.max(0, frame - 180 - delay);
          const y = interpolate(t, [0, speed], [-5, 110], {
            extrapolateRight: "clamp",
          });
          const rot = t * (5 + random(`conf-r-${i}`) * 10);

          return (
            <div
              key={i}
              style={{
                position: "absolute",
                left: `${x}%`,
                top: `${y}%`,
                width: 10,
                height: 10,
                borderRadius: 2,
                background: confettiColors[i % confettiColors.length],
                transform: `rotate(${rot}deg)`,
                opacity: interpolate(y, [90, 110], [1, 0], {
                  extrapolateLeft: "clamp",
                  extrapolateRight: "clamp",
                }),
              }}
            />
          );
        })}

      {/* Subtitle */}
      <Subtitles text="Come learn with us!" visible={showText && frame < 270} />

      {/* SA stripe */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: 6,
          background:
            "linear-gradient(90deg, #007749 0% 20%, #FFB81C 20% 40%, #DE3831 40% 60%, #002395 60% 80%, #000000 80% 100%)",
        }}
      />
    </AbsoluteFill>
  );
};
