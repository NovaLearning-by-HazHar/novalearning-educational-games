import { AUDIO_MANIFEST } from "./audio-manifest";

// Pacing constants
const PAUSE_FRAMES = 15; // 0.5s pause between segments
const TITLE_DURATION = 150; // 5 seconds
const GROUP_DURATION = 300; // 10 seconds

// Character intro duration: speech + entrance/exit/signature buffer
function getIntroFrames(audioId: string): number {
  const line = AUDIO_MANIFEST.find((a) => a.id === audioId);
  const speechFrames = line ? line.durationFrames : 240;
  // Add 60 frames (2s) for entrance + exit beyond speech
  return speechFrames + 60;
}

// Build timeline dynamically
interface Segment {
  start: number;
  end: number;
  duration: number;
}

function seg(start: number, duration: number): Segment {
  return { start, end: start + duration, duration };
}

let cursor = 0;

const titleCard = seg(cursor, TITLE_DURATION);
cursor = titleCard.end;

const missIntroDur = getIntroFrames("miss-vdm-intro") + 30;
const missIntro = seg(cursor, missIntroDur);
cursor = missIntro.end + PAUSE_FRAMES;

const characterIds = [
  "sipho",
  "aisha",
  "jaedon",
  "emma",
  "priya",
  "danie",
  "naledi",
  "kagiso",
] as const;

const characterSegments: Record<string, Segment> = {};
for (const id of characterIds) {
  const dur = getIntroFrames(id);
  characterSegments[id] = seg(cursor, dur);
  cursor = characterSegments[id].end + PAUSE_FRAMES;
}

const groupFinale = seg(cursor, GROUP_DURATION);
cursor = groupFinale.end;

const missOutroDur = getIntroFrames("miss-vdm-outro");
const missOutro = seg(cursor, missOutroDur);
cursor = missOutro.end;

export const TIMELINE: Record<string, Segment> = {
  titleCard,
  missIntro,
  ...characterSegments,
  groupFinale,
  missOutro,
};

export const CHARACTER_ORDER = characterIds;

export const TOTAL_FRAMES = cursor;
export const TOTAL_SECONDS = cursor / 30;
