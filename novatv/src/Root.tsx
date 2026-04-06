import React from "react";
import { Composition } from "remotion";
import { Episode1 } from "./components/Episode1";

const FPS = 30;
const DURATION_SECONDS = 10;
const DURATION_FRAMES = FPS * DURATION_SECONDS;

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="Episode1"
        component={Episode1}
        durationInFrames={DURATION_FRAMES}
        fps={FPS}
        width={1280}
        height={720}
      />
      <Composition
        id="Episode1-1080p"
        component={Episode1}
        durationInFrames={DURATION_FRAMES}
        fps={FPS}
        width={1920}
        height={1080}
      />
      <Composition
        id="Episode1-Vertical"
        component={Episode1}
        durationInFrames={DURATION_FRAMES}
        fps={FPS}
        width={1080}
        height={1920}
      />
    </>
  );
};
