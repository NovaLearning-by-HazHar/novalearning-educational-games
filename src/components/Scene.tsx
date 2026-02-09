'use client';

import { Canvas } from '@react-three/fiber';
import { Suspense, type ReactNode } from 'react';
import { detectDeviceTier, isWebGLAvailable } from '@/lib/deviceDetect';

interface SceneProps {
  children: ReactNode;
}

/**
 * R3F Canvas wrapper configured for Galaxy A03.
 * WebGL 1.0, no shadows, flat shading, performance-constrained.
 */
export default function Scene({ children }: SceneProps) {
  if (typeof window !== 'undefined' && !isWebGLAvailable()) {
    return (
      <div className="flex items-center justify-center h-full bg-nova-sand text-nova-earth p-8 text-center">
        <p>This device does not support 3D games. Please try a different browser.</p>
      </div>
    );
  }

  const tier = typeof window !== 'undefined' ? detectDeviceTier() : 'low';

  return (
    <Canvas
      gl={{
        antialias: tier !== 'low',
        alpha: false,
        powerPreference: 'low-power',
        preserveDrawingBuffer: false,
      }}
      dpr={tier === 'low' ? 1 : Math.min(window.devicePixelRatio, 2)}
      frameloop="demand"
      flat
    >
      <Suspense fallback={null}>{children}</Suspense>
    </Canvas>
  );
}
