import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
  random,
} from "remotion";

export const TitleCard: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width } = useVideoConfig();

  // "NovaTV" spring entrance
  const titleScale = spring({ frame, fps, config: { damping: 10, mass: 0.8 } });

  // "presents" fade
  const presentsOpacity = interpolate(frame, [30, 50], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // "Meet the Crew" slide up
  const meetSpring = spring({
    frame: frame - 60,
    fps,
    config: { damping: 12, mass: 0.7 },
  });
  const meetY = interpolate(meetSpring, [0, 1], [40, 0]);
  const meetOpacity = meetSpring;

  // SA stripe
  const stripeOpacity = interpolate(frame, [75, 90], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        background: "linear-gradient(180deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {/* Sparkles */}
      {Array.from({ length: 15 }, (_, i) => {
        const x = random(`spark-x-${i}`) * 90 + 5;
        const y = random(`spark-y-${i}`) * 80 + 5;
        const delay = random(`spark-d-${i}`) * 90;
        const period = 45 + random(`spark-p-${i}`) * 45;
        const t = Math.max(0, frame - delay);
        const sparkScale = Math.sin((t / period) * Math.PI * 2) * 0.5 + 0.5;
        const sparkOpacity = sparkScale * 0.7;
        const colors = ["#FFFFFF", "#FFB81C", "#BBDEFB"];

        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: `${x}%`,
              top: `${y}%`,
              fontSize: 12 + random(`spark-s-${i}`) * 12,
              color: colors[i % 3],
              transform: `scale(${sparkScale}) rotate(${t * 3}deg)`,
              opacity: sparkOpacity,
            }}
          >
            &#10022;
          </div>
        );
      })}

      {/* NovaTV */}
      <div
        style={{
          transform: `scale(${titleScale})`,
          fontFamily: "Nunito, sans-serif",
          fontWeight: 900,
          fontSize: width * 0.08,
          color: "white",
          textShadow: "0 4px 20px rgba(255,184,28,0.4)",
          marginBottom: 8,
        }}
      >
        NovaTV
      </div>

      {/* presents */}
      <div
        style={{
          fontFamily: "Nunito, sans-serif",
          fontWeight: 400,
          fontSize: width * 0.02,
          color: "#FFB81C",
          opacity: presentsOpacity,
          marginBottom: 16,
        }}
      >
        presents
      </div>

      {/* Meet the Crew */}
      <div
        style={{
          fontFamily: "Nunito, sans-serif",
          fontWeight: 700,
          fontSize: width * 0.04,
          color: "white",
          opacity: meetOpacity,
          transform: `translateY(${meetY}px)`,
        }}
      >
        Meet the Crew
      </div>

      {/* SA Flag Stripe */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: 6,
          opacity: stripeOpacity,
          background:
            "linear-gradient(90deg, #007749 0% 20%, #FFB81C 20% 40%, #DE3831 40% 60%, #002395 60% 80%, #000000 80% 100%)",
        }}
      />
    </AbsoluteFill>
  );
};
