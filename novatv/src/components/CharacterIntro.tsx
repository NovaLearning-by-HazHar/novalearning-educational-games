import React from "react";
import { AbsoluteFill, Sequence, useCurrentFrame, useVideoConfig } from "remotion";
import { SceneBackground } from "./SceneBackground";
import { Character } from "./Character";
import { SpeechBubble } from "./SpeechBubble";
import { SignatureMoment } from "./SignatureMoment";
import { Subtitles } from "./Subtitles";
import type { Character as CharacterData, AudioLine } from "../types";
import { CHARACTER_COLORS, INTRO_BEATS } from "../types";
import { CHARACTER_BACKGROUNDS } from "../data/backgrounds";

export interface CharacterIntroProps {
  character: CharacterData;
  audioLine: AudioLine;
  index: number;
}

export const CharacterIntro: React.FC<CharacterIntroProps> = ({
  character,
  audioLine,
  index,
}) => {
  const frame = useCurrentFrame();
  const { width } = useVideoConfig();
  const colors = CHARACTER_COLORS[character.id] ?? {
    bg: "#FFF3E0",
    accent: character.color,
    text: "#333",
  };
  const enterFrom = index % 2 === 0 ? "left" : "right";
  const pointerSide = enterFrom === "left" ? "right" : "left";

  // Determine subtitle visibility
  const showSubtitle =
    frame >= INTRO_BEATS.BUBBLE_START && frame < INTRO_BEATS.BUBBLE_HIDE;

  return (
    <AbsoluteFill>
      {/* Background */}
      <SceneBackground
        color={colors.bg}
        seed={character.id}
        backgroundImage={CHARACTER_BACKGROUNDS[character.id]}
      />

      {/* Signature moment (behind character) */}
      <Sequence from={INTRO_BEATS.SIGNATURE_START} durationInFrames={INTRO_BEATS.TOTAL - INTRO_BEATS.SIGNATURE_START}>
        <SignatureMoment
          characterId={character.id}
          startFrame={0}
          durationFrames={INTRO_BEATS.TOTAL - INTRO_BEATS.SIGNATURE_START}
        />
      </Sequence>

      {/* Character */}
      <Character
        src={character.file}
        name={character.name}
        color={colors.accent}
        enterFrom={enterFrom}
        enterFrame={0}
        exitFrame={INTRO_BEATS.EXIT_START}
      />

      {/* Speech bubble */}
      <SpeechBubble
        text={audioLine.text}
        showAtFrame={INTRO_BEATS.BUBBLE_START}
        hideAtFrame={INTRO_BEATS.BUBBLE_HIDE}
        pointerSide={pointerSide}
      />

      {/* Subtitles */}
      <Subtitles text={audioLine.text} visible={showSubtitle} />

      {/* SA stripe at bottom */}
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
