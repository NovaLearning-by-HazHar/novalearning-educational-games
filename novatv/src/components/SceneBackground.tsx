import React from "react";
import {
  AbsoluteFill,
  interpolateColors,
  useCurrentFrame,
  random,
} from "remotion";

export interface SceneBackgroundProps {
  color: string;
  nextColor?: string;
  transitionStart?: number;
  transitionDuration?: number;
  seed?: string;
}

export const SceneBackground: React.FC<SceneBackgroundProps> = ({
  color,
  nextColor,
  transitionStart = 0,
  transitionDuration = 30,
  seed = "bg",
}) => {
  const frame = useCurrentFrame();

  const bgColor =
    nextColor && frame >= transitionStart
      ? interpolateColors(
          frame,
          [transitionStart, transitionStart + transitionDuration],
          [color, nextColor],
        )
      : color;

  // 3 large faint circles for depth
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
