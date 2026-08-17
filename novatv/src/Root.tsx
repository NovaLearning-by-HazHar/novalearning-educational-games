import React from "react";
import { Composition } from "remotion";
import { Episode1 } from "./components/Episode1";
import { CharacterIntro } from "./components/CharacterIntro";
import { GroupScene } from "./components/GroupScene";
import { TitleCard } from "./components/TitleCard";
import { CHARACTERS } from "./data/characters";
import { AUDIO_MANIFEST } from "./data/audio-manifest";
import { TOTAL_FRAMES } from "./data/script";
import { INTRO_BEATS } from "./types";

const FPS = 30;

export const RemotionRoot: React.FC = () => {
  const kids = CHARACTERS.filter((c) => c.role === "child");

  return (
    <>
      {/* ── Full Episode — 3 formats ─────────────────── */}
      <Composition
        id="Episode1"
        component={Episode1}
        durationInFrames={TOTAL_FRAMES}
        fps={FPS}
        width={1280}
        height={720}
      />
      <Composition
        id="Episode1-1080p"
        component={Episode1}
        durationInFrames={TOTAL_FRAMES}
        fps={FPS}
        width={1920}
        height={1080}
      />
      <Composition
        id="Episode1-Vertical"
        component={Episode1}
        durationInFrames={TOTAL_FRAMES}
        fps={FPS}
        width={1080}
        height={1920}
      />

      {/* ── Standalone Character Clips (Social) ──────── */}
      {kids.map((char, i) => {
        const audioLine = AUDIO_MANIFEST.find((a) => a.id === char.id);
        if (!audioLine) return null;

        const ClipComponent: React.FC = () => (
          <CharacterIntro character={char} audioLine={audioLine} index={i} />
        );

        return (
          <Composition
            key={char.id}
            id={`${char.name}Intro`}
            component={ClipComponent}
            durationInFrames={INTRO_BEATS.TOTAL}
            fps={FPS}
            width={1080}
            height={1920}
          />
        );
      })}

      {/* ── Standalone Group Scene ────────────────────── */}
      <Composition
        id="GroupScene"
        component={GroupScene}
        durationInFrames={300}
        fps={FPS}
        width={1080}
        height={1920}
      />

      {/* ── Title Card (thumbnail source) ────────────── */}
      <Composition
        id="TitleCard"
        component={TitleCard}
        durationInFrames={150}
        fps={FPS}
        width={1920}
        height={1080}
      />
    </>
  );
};
