'use client';

import { useMemo } from 'react';
import * as THREE from 'three';
import {
  LETTER_A_STROKES,
  COLORS,
  TRACE_TOLERANCE,
} from '../lib/constants';

interface LetterPathProps {
  /** Which strokes are completed */
  completedStrokes: boolean[];
  /** Index of the stroke currently being traced */
  currentStroke: number;
  /** Progress through the current stroke (0-1) */
  currentProgress: number;
}

/**
 * Renders the letter "A" guide path as 3D tube geometries.
 * - Completed strokes: green
 * - Current stroke: blue with progress fill
 * - Future strokes: grey guide
 *
 * Positioned on the easel board at z=0.01 (just in front of board).
 */
export default function LetterPath({
  completedStrokes,
  currentStroke,
  currentProgress,
}: LetterPathProps) {
  return (
    <group position={[0, 1.2, 0.02]}>
      {LETTER_A_STROKES.map((strokePoints, strokeIndex) => (
        <StrokePath
          key={strokeIndex}
          points={strokePoints}
          isCompleted={completedStrokes[strokeIndex]}
          isCurrent={strokeIndex === currentStroke}
          progress={strokeIndex === currentStroke ? currentProgress : 0}
        />
      ))}

      {/* Start dot for current stroke */}
      {currentStroke < LETTER_A_STROKES.length && !completedStrokes[currentStroke] && (
        <StartDot
          position={LETTER_A_STROKES[currentStroke][0]}
          pulsing
        />
      )}

      {/* Tolerance zone visualization (subtle) */}
      {currentStroke < LETTER_A_STROKES.length && (
        <ToleranceZone
          points={LETTER_A_STROKES[currentStroke]}
        />
      )}
    </group>
  );
}

function StrokePath({
  points,
  isCompleted,
  isCurrent,
  progress,
}: {
  points: [number, number, number][];
  isCompleted: boolean;
  isCurrent: boolean;
  progress: number;
}) {
  // Full guide curve (always visible)
  const guideCurve = useMemo(() => {
    const vectors = points.map((p) => new THREE.Vector3(...p));
    return new THREE.CatmullRomCurve3(vectors);
  }, [points]);

  // Progress curve (partial, for current stroke)
  const progressCurve = useMemo(() => {
    if (!isCurrent || progress <= 0) return null;
    const clampedProgress = Math.min(1, Math.max(0, progress));
    const vectors = points.map((p) => new THREE.Vector3(...p));
    const fullCurve = new THREE.CatmullRomCurve3(vectors);
    const sampledPoints = fullCurve.getPoints(50);
    const sliceEnd = Math.max(2, Math.ceil(sampledPoints.length * clampedProgress));
    const partial = sampledPoints.slice(0, sliceEnd);
    if (partial.length < 2) return null;
    return new THREE.CatmullRomCurve3(partial);
  }, [points, isCurrent, progress]);

  const guideColor = isCompleted
    ? COLORS.strokeComplete
    : isCurrent
    ? COLORS.strokeCurrent
    : COLORS.letterGuide;

  return (
    <group>
      {/* Guide outline — always visible */}
      <mesh>
        <tubeGeometry args={[guideCurve, 32, 0.06, 6, false]} />
        <meshBasicMaterial
          color={guideColor}
          transparent
          opacity={isCompleted ? 0.9 : isCurrent ? 0.5 : 0.3}
        />
      </mesh>

      {/* Progress fill — only for current stroke */}
      {progressCurve && (
        <mesh>
          <tubeGeometry args={[progressCurve, 32, 0.08, 6, false]} />
          <meshBasicMaterial color={COLORS.tracingActive} />
        </mesh>
      )}
    </group>
  );
}

function StartDot({
  position,
  pulsing,
}: {
  position: [number, number, number];
  pulsing: boolean;
}) {
  return (
    <mesh position={position}>
      <sphereGeometry args={[pulsing ? 0.15 : 0.1, 8, 8]} />
      <meshBasicMaterial
        color={COLORS.traceDot}
        transparent
        opacity={0.8}
      />
    </mesh>
  );
}

/** Subtle transparent cylinder showing the tolerance zone along the current stroke */
function ToleranceZone({
  points,
}: {
  points: [number, number, number][];
}) {
  const curve = useMemo(() => {
    const vectors = points.map((p) => new THREE.Vector3(...p));
    return new THREE.CatmullRomCurve3(vectors);
  }, [points]);

  return (
    <mesh>
      <tubeGeometry args={[curve, 32, TRACE_TOLERANCE, 6, false]} />
      <meshBasicMaterial
        color={COLORS.strokeCurrent}
        transparent
        opacity={0.08}
      />
    </mesh>
  );
}
