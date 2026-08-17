import React from "react";
import {
  AbsoluteFill,
  Img,
  interpolate,
  interpolateColors,
  staticFile,
  useCurrentFrame,
  random,
} from "remotion";

export interface SceneBackgroundProps {
  color: string;
  nextColor?: string;
  transitionStart?: number;
  transitionDuration?: number;
  seed?: string;
  backgroundImage?: string;
}

export const SceneBackground: React.FC<SceneBackgroundProps> = ({
  color,
  nextColor,
  transitionStart = 0,
  transitionDuration = 30,
  seed = "bg",
  backgroundImage,
}) => {
  const frame = useCurrentFrame();

  if (backgroundImage) {
    const scale = interpolate(frame, [0, 300], [1.05, 1.12], {
      extrapolateRight: "clamp",
    });
    const translateX = interpolate(frame, [0, 300], [0, -1.5], {
      extrapolateRight: "clamp",
    });

    return (
      <AbsoluteFill>
        <Img
          src={staticFile(backgroundImage)}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            transform: `scale(${scale}) translateX(${translateX}%)`,
          }}
        />
        <AbsoluteFill
          style={{
            background:
              "linear-gradient(180deg, transparent 60%, rgba(0,0,0,0.3) 100%)",
          }}
        />
      </AbsoluteFill>
    );
  }

  const bgColor =
    nextColor && frame >= transitionStart
      ? interpolateColors(
          frame,
          [transitionStart, transitionStart + transitionDuration],
          [color, nextColor],
        )
      : color;

  const circles = Array.from({ length: 3 }, (_, i) => ({
    x: random(`${seed}-cx-${i}`) * 80 + 10,
    y: random(`${seed}-cy-${i}`) * 60 + 10,
    size: random(`${seed}-cs-${i}`) * 200 + 150,
    opacity: 0.06 + random(`${seed}-co-${i}`) * 0.04,
  }));

  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(ellipse at 50% 40%, ${bgColor}, ${bgColor}dd)`,
      }}
    >
      {circles.map((c, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: `${c.x}%`,
            top: `${c.y}%`,
            width: c.size,
            height: c.size,
            borderRadius: "50%",
            background: "white",
            opacity: c.opacity,
            transform: "translate(-50%, -50%)",
          }}
        />
      ))}
    </AbsoluteFill>
  );
};
