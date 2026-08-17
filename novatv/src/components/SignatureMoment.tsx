import React from "react";
import { useCurrentFrame, useVideoConfig, interpolate, random } from "remotion";

export interface SignatureMomentProps {
  characterId: string;
  startFrame: number;
  durationFrames: number;
}

export const SignatureMoment: React.FC<SignatureMomentProps> = ({
  characterId,
  startFrame,
  durationFrames,
}) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const local = frame - startFrame;

  if (local < 0 || local > durationFrames) return null;
  const progress = local / durationFrames;

  switch (characterId) {
    case "sipho":
      return <SiphoCoinCascade local={local} width={width} height={height} />;
    case "aisha":
      return <AishaSteam local={local} width={width} height={height} />;
    case "jaedon":
      return <JaedonGoal local={local} width={width} height={height} progress={progress} />;
    case "emma":
      return <EmmaChickens local={local} width={width} height={height} />;
    case "priya":
      return <PriyaNotes local={local} width={width} height={height} />;
    case "danie":
      return <DanieBlocks local={local} width={width} height={height} />;
    case "naledi":
      return <NalediStars local={local} width={width} height={height} />;
    case "kagiso":
      return <KagisoPages local={local} width={width} height={height} />;
    default:
      return null;
  }
};

interface MomentProps {
  local: number;
  width: number;
  height: number;
  progress?: number;
}

// ── SIPHO: Coin Cascade ──────────────────────────────────────────────
const COIN_LABELS = ["10c", "20c", "50c", "R1", "R2", "10c", "50c", "R1", "20c", "R2"];
const COIN_COLORS = ["#FFB81C", "#C0C0C0", "#CD7F32", "#FFB81C", "#FFB81C"];

const SiphoCoinCascade: React.FC<MomentProps> = ({ local, width, height }) => (
  <div style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none" }}>
    {COIN_LABELS.map((label, i) => {
      const delay = i * 8;
      const t = Math.max(0, local - delay);
      const y = interpolate(t, [0, 90], [-60, height * 0.8], { extrapolateRight: "clamp" });
      const rotation = t * 8;
      const opacity = interpolate(t, [70, 90], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
      const x = random(`sipho-coin-${i}`) * width * 0.7 + width * 0.15;
      const coinColor = COIN_COLORS[i % COIN_COLORS.length];
      const size = 40 + random(`sipho-cs-${i}`) * 20;

      return (
        <div
          key={i}
          style={{
            position: "absolute",
            left: x,
            top: y,
            width: size,
            height: size,
            borderRadius: "50%",
            background: `radial-gradient(circle at 35% 35%, ${coinColor}ff, ${coinColor}aa)`,
            border: `2px solid ${coinColor}88`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: size * 0.3,
            fontWeight: 900,
            fontFamily: "Nunito, sans-serif",
            color: "#5D4037",
            transform: `rotate(${rotation}deg)`,
            opacity,
          }}
        >
          {label}
        </div>
      );
    })}
  </div>
);

// ── AISHA: Kitchen Steam ─────────────────────────────────────────────
const AishaSteam: React.FC<MomentProps> = ({ local, width, height }) => (
  <div style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none" }}>
    {/* Pot */}
    <div
      style={{
        position: "absolute",
        bottom: "15%",
        left: "50%",
        transform: "translateX(-50%)",
        width: 80,
        height: 50,
        borderRadius: "0 0 40px 40px",
        background: "#6D4C41",
      }}
    />
    {/* Steam lines */}
    {Array.from({ length: 7 }, (_, i) => {
      const delay = i * 10;
      const t = Math.max(0, local - delay);
      const y = interpolate(t, [0, 80], [0, -160], { extrapolateRight: "clamp" });
      const scaleX = interpolate(t, [0, 80], [1, 2], { extrapolateRight: "clamp" });
      const opacity = interpolate(t, [0, 40, 80], [0.6, 0.3, 0], { extrapolateRight: "clamp" });
      const xDrift = (random(`aisha-s-${i}`) - 0.5) * 60;

      return (
        <div
          key={i}
          style={{
            position: "absolute",
            bottom: "30%",
            left: `calc(50% + ${xDrift}px)`,
            width: 4,
            height: 40,
            borderRadius: 4,
            background: "rgba(255,255,255,0.8)",
            transform: `translateY(${y}px) scaleX(${scaleX})`,
            opacity,
          }}
        />
      );
    })}
  </div>
);

// ── JAEDON: Goal Bounce ──────────────────────────────────────────────
const JaedonGoal: React.FC<MomentProps> = ({ local, width, height, progress = 0 }) => {
  const ballX = interpolate(local, [0, 90], [-80, width + 80], { extrapolateRight: "clamp" });
  const bounceY = height * 0.55 - Math.abs(Math.sin(local * 0.07)) * 120;
  const showGoal = local > 40 && local < 80;
  const goalScale = showGoal
    ? interpolate(local, [40, 50, 70, 80], [0, 1.2, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })
    : 0;

  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none" }}>
      <div
        style={{
          position: "absolute",
          left: ballX,
          top: bounceY,
          width: 60,
          height: 60,
          borderRadius: "50%",
          background: "white",
          border: "3px solid #333",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 32,
        }}
      >
        &#9917;
      </div>
      {goalScale > 0 && (
        <div
          style={{
            position: "absolute",
            top: "25%",
            left: "50%",
            transform: `translate(-50%, -50%) scale(${goalScale})`,
            fontFamily: "Nunito, sans-serif",
            fontWeight: 900,
            fontSize: width * 0.06,
            color: "#FFB81C",
            textShadow: "0 3px 8px rgba(0,0,0,0.3)",
          }}
        >
          GOAL!
        </div>
      )}
    </div>
  );
};

// ── EMMA: Chicken Scatter ────────────────────────────────────────────
const EmmaChickens: React.FC<MomentProps> = ({ local, width, height }) => (
  <div style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none" }}>
    {Array.from({ length: 7 }, (_, i) => {
      const delay = 5;
      const t = Math.max(0, local - delay);
      const angle = (i / 7) * Math.PI * 2 + random(`emma-a-${i}`) * 0.5;
      const dist = interpolate(t, [0, 60], [0, 150 + random(`emma-d-${i}`) * 100], {
        extrapolateRight: "clamp",
      });
      const cx = width * 0.5;
      const cy = height * 0.5;
      const x = cx + Math.cos(angle) * dist;
      const y = cy + Math.sin(angle) * dist;
      const rotation = (random(`emma-r-${i}`) - 0.5) * 30 * (t / 60);

      return (
        <div
          key={i}
          style={{
            position: "absolute",
            left: x,
            top: y,
            fontSize: 36,
            transform: `translate(-50%, -50%) rotate(${rotation}deg)`,
          }}
        >
          &#128020;
        </div>
      );
    })}
  </div>
);

// ── PRIYA: Musical Notes ─────────────────────────────────────────────
const NOTES = ["\u266A", "\u266B", "\u266C", "\uD83C\uDFB5", "\u266A", "\u266B", "\u266C", "\u266A", "\u266B", "\u266C", "\u266A", "\u266B"];
const NOTE_COLORS = ["#E91E63", "#FFB81C", "#9C27B0", "#E91E63", "#FFB81C"];

const PriyaNotes: React.FC<MomentProps> = ({ local, width, height }) => (
  <div style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none" }}>
    {NOTES.map((note, i) => {
      const delay = i * 6;
      const t = Math.max(0, local - delay);
      const x = random(`priya-nx-${i}`) * width * 0.8 + width * 0.1;
      const startY = height * 0.6;
      const y = startY - interpolate(t, [0, 80], [0, 200], { extrapolateRight: "clamp" });
      const rotation = (random(`priya-nr-${i}`) - 0.5) * 40;
      const opacity = interpolate(t, [50, 80], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
      const size = 20 + random(`priya-ns-${i}`) * 30;

      return (
        <div
          key={i}
          style={{
            position: "absolute",
            left: x,
            top: y,
            fontSize: size,
            color: NOTE_COLORS[i % NOTE_COLORS.length],
            transform: `rotate(${rotation}deg)`,
            opacity,
            fontWeight: 700,
          }}
        >
          {note}
        </div>
      );
    })}
  </div>
);

// ── DANIE: Block Tower ───────────────────────────────────────────────
const BLOCK_COLORS = ["#E65100", "#FF9800", "#D84315", "#FFC107", "#795548"];

const DanieBlocks: React.FC<MomentProps> = ({ local, width, height }) => (
  <div style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none" }}>
    {Array.from({ length: 5 }, (_, i) => {
      const delay = i * 15;
      const t = Math.max(0, local - delay);
      const yOffset = interpolate(t, [0, 20, 30], [100, -10, 0], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      });
      const opacity = interpolate(t, [0, 10], [0, 1], { extrapolateRight: "clamp" });
      const blockW = 60;
      const blockH = 36;
      const stackX = width * 0.72;
      const stackBase = height * 0.7;

      return (
        <div
          key={i}
          style={{
            position: "absolute",
            left: stackX - blockW / 2,
            top: stackBase - i * (blockH + 4) + yOffset,
            width: blockW,
            height: blockH,
            borderRadius: 8,
            background: BLOCK_COLORS[i % BLOCK_COLORS.length],
            opacity,
            boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
          }}
        />
      );
    })}
  </div>
);

// ── NALEDI: Star Field ───────────────────────────────────────────────
const STAR_CHARS = ["\u2605", "\u2726", "\u2727", "\u2B50", "\u2605", "\u2726", "\u2605", "\u2727", "\u2726", "\u2605", "\u2727", "\u2B50", "\u2605", "\u2726", "\u2605"];

const NalediStars: React.FC<MomentProps> = ({ local, width, height }) => (
  <div style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none" }}>
    {STAR_CHARS.map((star, i) => {
      const x = random(`naledi-sx-${i}`) * width * 0.9 + width * 0.05;
      const y = random(`naledi-sy-${i}`) * height * 0.55 + height * 0.05;
      const delay = random(`naledi-sd-${i}`) * 60;
      const period = 30 + random(`naledi-sp-${i}`) * 30;
      const t = Math.max(0, local - delay);
      const scale = 0.3 + Math.sin((t / period) * Math.PI * 2) * 0.5 + 0.5;
      const opacity = 0.2 + Math.sin((t / period) * Math.PI * 2) * 0.4 + 0.4;
      const color = i % 3 === 0 ? "#FFFFFF" : i % 3 === 1 ? "#FFF9C4" : "#BBDEFB";

      return (
        <div
          key={i}
          style={{
            position: "absolute",
            left: x,
            top: y,
            fontSize: 16 + random(`naledi-ss-${i}`) * 20,
            color,
            transform: `scale(${scale})`,
            opacity,
          }}
        >
          {star}
        </div>
      );
    })}
  </div>
);

// ── KAGISO: Story Pages ──────────────────────────────────────────────
const KagisoPages: React.FC<MomentProps> = ({ local, width, height }) => (
  <div style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none" }}>
    {Array.from({ length: 4 }, (_, i) => {
      const delay = i * 18;
      const t = Math.max(0, local - delay);
      const rotateY = interpolate(t, [0, 25], [-90, 0], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      });
      const opacity = interpolate(t, [0, 10], [0, 1], { extrapolateRight: "clamp" });
      const pageW = width * 0.08;
      const pageH = pageW * 1.35;
      const baseX = width * 0.25 + i * (pageW + 10);
      const baseY = height * 0.35;
      const isLast = i === 3;

      return (
        <div
          key={i}
          style={{
            position: "absolute",
            left: baseX,
            top: baseY,
            width: pageW,
            height: pageH,
            background: "white",
            borderRadius: 4,
            boxShadow: isLast
              ? `0 0 16px #FFB81C88, 0 2px 8px rgba(0,0,0,0.1)`
              : "0 2px 8px rgba(0,0,0,0.1)",
            transform: `perspective(800px) rotateY(${rotateY}deg)`,
            opacity,
            display: "flex",
            flexDirection: "column",
            gap: 4,
            padding: 6,
            justifyContent: "center",
          }}
        >
          {/* Fake text lines */}
          {Array.from({ length: 4 }, (_, j) => (
            <div
              key={j}
              style={{
                height: 3,
                borderRadius: 2,
                background: `hsl(${260 + i * 20}, 30%, ${75 + j * 5}%)`,
                width: `${60 + random(`kagiso-l-${i}-${j}`) * 35}%`,
              }}
            />
          ))}
        </div>
      );
    })}
  </div>
);
