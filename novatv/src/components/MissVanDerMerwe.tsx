import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { SceneBackground } from "./SceneBackground";
import { Character } from "./Character";
import { SpeechBubble } from "./SpeechBubble";
import { Subtitles } from "./Subtitles";
import type { AudioLine } from "../types";

export interface MissVanDerMerweProps {
  segment: "intro" | "outro";
  audioLine: AudioLine;
}

export const MissVanDerMerwe: React.FC<MissVanDerMerweProps> = ({
  segment,
  audioLine,
}) => {
  const frame = useCurrentFrame();
  const { width } = useVideoConfig();

  const duration = segment === "intro" ? 180 : 150;
  const bubbleStart = 20;
  const bubbleHide = duration - 30;
  const showSubtitle = frame >= bubbleStart && frame < bubbleHide;

  return (
    <AbsoluteFill>
      <SceneBackground color="#FFF8E1" seed={`miss-vdm-${segment}`} />

      <Character
        src={null}
        name="Miss van der Merwe"
        color="#8B5CF6"
        enterFrom={segment === "intro" ? "left" : "right"}
        enterFrame={0}
        exitFrame={duration - 20}
        scale={1.15}
        position={{ x: segment === "intro" ? "38%" : "50%", y: "52%" }}
      />

      <SpeechBubble
        text={audioLine.text}
        showAtFrame={bubbleStart}
        hideAtFrame={bubbleHide}
        pointerSide="right"
      />

      <Subtitles text={audioLine.text} visible={showSubtitle} />

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
