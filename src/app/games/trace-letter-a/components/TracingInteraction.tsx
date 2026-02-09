'use client';

import { useRef, useMemo, useCallback } from 'react';
import { useThree } from '@react-three/fiber';
import * as THREE from 'three';
import {
  LETTER_A_STROKES,
  TRACE_TOLERANCE,
  STROKE_START_TOLERANCE,
} from '../lib/constants';

interface TracingInteractionProps {
  /** Index of the current stroke being traced */
  currentStroke: number;
  /** Whether the user is currently tracing */
  isTracing: boolean;
  /** Last matched checkpoint index */
  lastCheckpoint: number;
  /** Called when user starts tracing (finger down near stroke start) */
  onTraceStart: () => void;
  /** Called when user moves along the stroke path */
  onTraceProgress: (checkpoint: number, totalCheckpoints: number) => void;
  /** Called when stroke is complete (reached end) */
  onStrokeComplete: () => void;
  /** Called when user lifts finger */
  onTraceEnd: () => void;
  /** Called when user taps empty area */
  onEmptyTap: () => void;
}

/**
 * Invisible interaction plane that converts touch/pointer events
 * into tracing progress along the letter path.
 *
 * Positioned on the easel board at z=0.03.
 * Uses raycasting to project pointer onto the plane,
 * then measures distance to the nearest stroke path point.
 */
export default function TracingInteraction({
  currentStroke,
  isTracing,
  lastCheckpoint,
  onTraceStart,
  onTraceProgress,
  onStrokeComplete,
  onTraceEnd,
  onEmptyTap,
}: TracingInteractionProps) {
  const { camera, gl } = useThree();
  const planeRef = useRef<THREE.Mesh>(null);
  const raycaster = useMemo(() => new THREE.Raycaster(), []);
  const pointer = useMemo(() => new THREE.Vector2(), []);

  // Pre-compute stroke checkpoints as Vector3 arrays
  const strokePoints = useMemo(() => {
    return LETTER_A_STROKES.map((stroke) =>
      stroke.map((p) => new THREE.Vector3(p[0], p[1] + 1.2, p[2] + 0.03))
    );
  }, []);

  /** Convert a pointer event to a 3D point on the interaction plane */
  const getWorldPoint = useCallback(
    (event: { clientX: number; clientY: number }): THREE.Vector3 | null => {
      const rect = gl.domElement.getBoundingClientRect();
      pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(pointer, camera);

      if (!planeRef.current) return null;
      const intersects = raycaster.intersectObject(planeRef.current);
      if (intersects.length === 0) return null;

      return intersects[0].point;
    },
    [camera, gl, raycaster, pointer]
  );

  /**
   * Find the nearest checkpoint index on the current stroke
   * that is ahead of the lastCheckpoint.
   */
  const findNearestCheckpoint = useCallback(
    (worldPoint: THREE.Vector3): { index: number; distance: number } | null => {
      if (currentStroke >= strokePoints.length) return null;
      const points = strokePoints[currentStroke];

      let bestIndex = -1;
      let bestDist = Infinity;

      for (let i = 0; i < points.length; i++) {
        const dist = worldPoint.distanceTo(points[i]);
        if (dist < bestDist) {
          bestDist = dist;
          bestIndex = i;
        }
      }

      if (bestIndex === -1 || bestDist > TRACE_TOLERANCE) return null;
      return { index: bestIndex, distance: bestDist };
    },
    [currentStroke, strokePoints]
  );

  const handlePointerDown = useCallback(
    (event: THREE.Event & { clientX?: number; clientY?: number }) => {
      if (currentStroke >= LETTER_A_STROKES.length) return;

      // R3F click events have the native event as `nativeEvent` or in the event itself
      const nativeEvent = (event as unknown as { nativeEvent?: PointerEvent }).nativeEvent;
      if (!nativeEvent) return;

      const worldPoint = getWorldPoint(nativeEvent);
      if (!worldPoint) {
        onEmptyTap();
        return;
      }

      // Check if near the start of the current stroke
      const strokeStart = strokePoints[currentStroke][0];
      const nextCheckpointIdx = Math.max(0, lastCheckpoint + 1);
      const nextCheckpoint = strokePoints[currentStroke][nextCheckpointIdx];
      const distToStart = worldPoint.distanceTo(strokeStart);
      const distToNext = nextCheckpoint ? worldPoint.distanceTo(nextCheckpoint) : Infinity;

      if (distToStart < STROKE_START_TOLERANCE || distToNext < TRACE_TOLERANCE) {
        onTraceStart();
      } else {
        onEmptyTap();
      }
    },
    [currentStroke, strokePoints, lastCheckpoint, getWorldPoint, onTraceStart, onEmptyTap]
  );

  const handlePointerMove = useCallback(
    (event: THREE.Event & { clientX?: number; clientY?: number }) => {
      if (!isTracing || currentStroke >= LETTER_A_STROKES.length) return;

      const nativeEvent = (event as unknown as { nativeEvent?: PointerEvent }).nativeEvent;
      if (!nativeEvent) return;

      const worldPoint = getWorldPoint(nativeEvent);
      if (!worldPoint) return;

      const checkpoint = findNearestCheckpoint(worldPoint);
      if (!checkpoint) return;

      // Only accept forward progress (checkpoint must be ahead of last)
      if (checkpoint.index > lastCheckpoint) {
        // Check sequential: don't skip too many checkpoints
        const maxSkip = 3;
        if (checkpoint.index - lastCheckpoint <= maxSkip) {
          const totalCheckpoints = strokePoints[currentStroke].length;
          onTraceProgress(checkpoint.index, totalCheckpoints);

          // Check if stroke is complete (reached last point)
          if (checkpoint.index >= totalCheckpoints - 1) {
            onStrokeComplete();
          }
        }
      }
    },
    [
      isTracing,
      currentStroke,
      lastCheckpoint,
      strokePoints,
      getWorldPoint,
      findNearestCheckpoint,
      onTraceProgress,
      onStrokeComplete,
    ]
  );

  const handlePointerUp = useCallback(() => {
    if (isTracing) {
      onTraceEnd();
    }
  }, [isTracing, onTraceEnd]);

  return (
    <mesh
      ref={planeRef}
      position={[0, 1.2, 0.05]}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
    >
      <planeGeometry args={[3.5, 4.0]} />
      <meshBasicMaterial transparent opacity={0} />
    </mesh>
  );
}
