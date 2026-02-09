'use client';

import { useRef, useCallback, useEffect, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { BUDGETS } from '@/types/constants';

interface PerformanceMetrics {
  fps: number;
  avgFps: number;
  memoryMB: number | null;
  drawCalls: number;
  triangles: number;
  belowTarget: boolean;
}

/**
 * Performance profiling hook for R3F scenes.
 * Tracks FPS, memory, draw calls, and triangles.
 * Warns when below Galaxy A03 target of 30fps.
 *
 * Usage inside a Canvas child:
 *   const metrics = usePerformance();
 */
export function usePerformance(): PerformanceMetrics {
  const frameCount = useRef(0);
  const lastTime = useRef(performance.now());
  const fpsHistory = useRef<number[]>([]);
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    fps: 0,
    avgFps: 0,
    memoryMB: null,
    drawCalls: 0,
    triangles: 0,
    belowTarget: false,
  });

  useFrame(({ gl }) => {
    frameCount.current++;
    const now = performance.now();
    const elapsed = now - lastTime.current;

    // Update every 500ms
    if (elapsed >= 500) {
      const fps = Math.round((frameCount.current / elapsed) * 1000);
      frameCount.current = 0;
      lastTime.current = now;

      fpsHistory.current.push(fps);
      if (fpsHistory.current.length > 20) fpsHistory.current.shift();

      const avgFps = Math.round(
        fpsHistory.current.reduce((a, b) => a + b, 0) / fpsHistory.current.length
      );

      // Memory (Chrome only)
      const perf = performance as unknown as { memory?: { usedJSHeapSize: number } };
      const memoryMB = perf.memory
        ? Math.round(perf.memory.usedJSHeapSize / 1024 / 1024)
        : null;

      const info = gl.info;
      const drawCalls = info.render.calls;
      const triangles = info.render.triangles;

      const belowTarget = avgFps < BUDGETS.MIN_FPS;

      if (belowTarget) {
        console.warn(
          `[Perf] FPS: ${fps} (avg: ${avgFps}) — below ${BUDGETS.MIN_FPS} minimum`
        );
      }

      setMetrics({ fps, avgFps, memoryMB, drawCalls, triangles, belowTarget });
    }
  });

  return metrics;
}

/**
 * Standalone FPS monitor (works outside R3F Canvas).
 * Uses requestAnimationFrame.
 */
export function useFpsMonitor(): number {
  const [fps, setFps] = useState(0);
  const frames = useRef(0);
  const lastTime = useRef(performance.now());

  const tick = useCallback(() => {
    frames.current++;
    const now = performance.now();
    if (now - lastTime.current >= 1000) {
      setFps(frames.current);
      frames.current = 0;
      lastTime.current = now;
    }
  }, []);

  useEffect(() => {
    let rafId: number;
    const loop = () => {
      tick();
      rafId = requestAnimationFrame(loop);
    };
    rafId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafId);
  }, [tick]);

  return fps;
}
