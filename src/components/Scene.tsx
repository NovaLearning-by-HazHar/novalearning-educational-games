'use client';

import { Canvas } from '@react-three/fiber';
import { Suspense, useState, useEffect, type ReactNode } from 'react';
import { getDeviceConfig, isWebGLAvailable } from '@/lib/deviceDetect';
import type { DeviceConfig } from '@/lib/deviceDetect';

interface SceneProps {
  children: ReactNode;
  /** Override frameloop — defaults to 'always' for animations */
  frameloop?: 'always' | 'demand' | 'never';
  /** Camera position — defaults to [0, 2, 5] */
  cameraPosition?: [number, number, number];
  /** Camera FOV — defaults to 50 */
  cameraFov?: number;
  /** Background color — defaults to nova sky gradient base */
  backgroundColor?: string;
}

function LoadingFallback() {
  return (
    <mesh>
      <planeGeometry args={[2, 0.3]} />
      <meshBasicMaterial color="#FFB800" opacity={0.5} transparent />
    </mesh>
  );
}

function WebGLFallback() {
  return (
    <div className="flex flex-col items-center justify-center h-full bg-nova-sand text-nova-earth p-8 text-center gap-4">
      <div className="text-5xl" aria-hidden="true">🌍</div>
      <p className="text-lg font-display">
        This device needs a newer browser to play 3D games.
      </p>
      <p className="text-sm text-nova-earth/60">
        Try updating Chrome or using a different browser.
      </p>
    </div>
  );
}

/**
 * R3F Canvas wrapper configured for Galaxy A03.
 * WebGL 1.0, no shadows, flat/toon shading, performance-constrained.
 * Uses getDeviceConfig() for tier-aware rendering settings.
 */
export default function Scene({
  children,
  frameloop = 'always',
  cameraPosition = [0, 2, 5],
  cameraFov = 50,
  backgroundColor = '#87CEEB',
}: SceneProps) {
  const [config, setConfig] = useState<DeviceConfig | null>(null);
  const [webglOk, setWebglOk] = useState(true);

  useEffect(() => {
    setWebglOk(isWebGLAvailable());
    setConfig(getDeviceConfig());
  }, []);

  // SSR and initial render — show nothing until client detects
  if (config === null) {
    return (
      <div className="flex items-center justify-center h-full bg-nova-sand">
        <div className="text-3xl animate-pulse" aria-hidden="true">🌍</div>
      </div>
    );
  }

  if (!webglOk) {
    return <WebGLFallback />;
  }

  return (
    <Canvas
      gl={{
        antialias: config.antialias,
        alpha: false,
        powerPreference: 'low-power',
        preserveDrawingBuffer: false,
        // Force WebGL 1.0 context — do not request WebGL2
        // R3F/Three.js will use WebGLRenderer with WebGL1 context
      }}
      dpr={config.dpr}
      frameloop={frameloop}
      flat
      camera={{
        position: cameraPosition,
        fov: cameraFov,
        near: 0.1,
        far: 100,
      }}
      onCreated={({ gl, scene }) => {
        // Force toneMapping off for flat look
        gl.toneMapping = 0; // NoToneMapping
        scene.background = null; // let CSS background show, or set color
      }}
    >
      <color attach="background" args={[backgroundColor]} />
      <ambientLight intensity={0.9} />
      <directionalLight position={[5, 8, 3]} intensity={0.6} />
      <Suspense fallback={<LoadingFallback />}>{children}</Suspense>
    </Canvas>
  );
}
