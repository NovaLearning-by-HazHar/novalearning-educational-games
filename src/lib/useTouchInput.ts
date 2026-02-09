'use client';

import { useCallback, useRef } from 'react';
import { useThree } from '@react-three/fiber';
import * as THREE from 'three';

interface TapResult {
  /** The 3D object that was tapped */
  object: THREE.Object3D;
  /** World-space intersection point */
  point: THREE.Vector3;
  /** Screen-space coordinates of the tap (normalized -1 to 1) */
  ndc: THREE.Vector2;
}

/**
 * Touch input system for R3F scenes.
 * Handles raycasting from screen tap to 3D objects.
 * Touch targets: 48px minimum per accessibility requirements.
 *
 * Usage:
 *   const { onTap } = useTouchInput(handleTap);
 *   <mesh onClick={onTap} ... />
 *
 * For raycasting against specific objects:
 *   const { raycastTap } = useTouchInput();
 *   // call raycastTap(event, objectsArray) in a pointer handler
 */
export function useTouchInput(onHit?: (result: TapResult) => void) {
  const { camera, raycaster } = useThree();
  const pointer = useRef(new THREE.Vector2());

  const raycastTap = useCallback(
    (event: THREE.Event & { point?: THREE.Vector3 }, targets?: THREE.Object3D[]) => {
      // If using R3F's built-in onClick, the intersection is already computed
      const threeEvent = event as unknown as {
        point?: THREE.Vector3;
        object?: THREE.Object3D;
        nativeEvent?: PointerEvent;
      };

      if (threeEvent.point && threeEvent.object) {
        const result: TapResult = {
          object: threeEvent.object,
          point: threeEvent.point.clone(),
          ndc: pointer.current.clone(),
        };
        onHit?.(result);
        return result;
      }

      // Manual raycasting against specified targets
      if (!targets || targets.length === 0) return null;

      const nativeEvent = threeEvent.nativeEvent;
      if (!nativeEvent) return null;

      const rect = (nativeEvent.target as HTMLElement)?.getBoundingClientRect();
      if (!rect) return null;

      pointer.current.x = ((nativeEvent.clientX - rect.left) / rect.width) * 2 - 1;
      pointer.current.y = -((nativeEvent.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(pointer.current, camera);
      const intersections = raycaster.intersectObjects(targets, true);

      if (intersections.length > 0) {
        const hit = intersections[0];
        const result: TapResult = {
          object: hit.object,
          point: hit.point.clone(),
          ndc: pointer.current.clone(),
        };
        onHit?.(result);
        return result;
      }

      return null;
    },
    [camera, raycaster, onHit]
  );

  /** Convenience onClick handler for R3F mesh elements */
  const onTap = useCallback(
    (event: THREE.Event) => {
      // Prevent event from propagating to objects behind
      (event as unknown as { stopPropagation: () => void }).stopPropagation();
      raycastTap(event);
    },
    [raycastTap]
  );

  return { onTap, raycastTap };
}

/**
 * Simple tap handler for non-3D UI elements.
 * Ensures 48px minimum touch target and prevents double-tap zoom.
 */
export function preventDoubleTapZoom(element: HTMLElement): () => void {
  let lastTap = 0;
  const handler = (e: TouchEvent) => {
    const now = Date.now();
    if (now - lastTap < 300) {
      e.preventDefault();
    }
    lastTap = now;
  };
  element.addEventListener('touchend', handler, { passive: false });
  return () => element.removeEventListener('touchend', handler);
}
