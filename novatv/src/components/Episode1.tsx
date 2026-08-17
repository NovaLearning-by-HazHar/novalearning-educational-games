import React from "react";
import { AbsoluteFill, Sequence } from "remotion";
import { TIMELINE, CHARACTER_ORDER } from "../data/script";
import { AUDIO_MANIFEST } from "../data/audio-manifest";
import { CHARACTERS } from "../data/characters";
import { TitleCard } from "./TitleCard";
import { MissVanDerMerwe } from "./MissVanDerMerwe";
import { CharacterIntro } from "./CharacterIntro";
import { GroupScene } from "./GroupScene";
import "../styles/global.css";

export const Episode1: React.FC = () => {
  const missIntroAudio = AUDIO_MANIFEST.find((a) => a.id === "miss-vdm-intro")!;
  const missOutroAudio = AUDIO_MANIFEST.find((a) => a.id === "miss-vdm-outro")!;

  return (
    <AbsoluteFill style={{ background: "#1a1a2e" }}>
      {/* Title Card */}
      <Sequence
        from={TIMELINE.titleCard.start}
        durationInFrames={TIMELINE.titleCard.duration}
        name="Title Card"
      >
        <TitleCard />
      </Sequence>

      {/* Miss van der Merwe Intro */}
      <Sequence
        from={TIMELINE.missIntro.start}
        durationInFrames={TIMELINE.missIntro.duration}
        name="Miss vdM Intro"
      >
        <MissVanDerMerwe segment="intro" audioLine={missIntroAudio} />
      </Sequence>

      {/* 8 Character Intros */}
      {CHARACTER_ORDER.map((charId, index) => {
        const segment = TIMELINE[charId];
        const character = CHARACTERS.find((c) => c.id === charId);
        const audioLine = AUDIO_MANIFEST.find((a) => a.id === charId);

        if (!character || !audioLine || !segment) return null;

        return (
          <Sequence
            key={charId}
            from={segment.start}
            durationInFrames={segment.duration}
            name={character.name}
          >
            <CharacterIntro
              character={character}
              audioLine={audioLine}
              index={index}
            />
          </Sequence>
        );
      })}

      {/* Group Finale */}
      <Sequence
        from={TIMELINE.groupFinale.start}
        durationInFrames={TIMELINE.groupFinale.duration}
        name="Group Scene"
      >
        <GroupScene />
      </Sequence>

      {/* Miss van der Merwe Outro */}
      <Sequence
        from={TIMELINE.missOutro.start}
        durationInFrames={TIMELINE.missOutro.duration}
        name="Miss vdM Outro"
      >
        <MissVanDerMerwe segment="outro" audioLine={missOutroAudio} />
      </Sequence>
    </AbsoluteFill>
  );
};
