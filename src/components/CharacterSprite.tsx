'use client';

import { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { useTexture } from '@react-three/drei';
import * as THREE from 'three';

type SpriteCharacter = 'chanel' | 'priya' | 'naledi';
type SpriteAnimation = 'idle' | 'bounce' | 'wave';

interface CharacterSpriteProps {
  character: SpriteCharacter;
  position?: [number, number, number];
  scale?: number;
  animation?: SpriteAnimation;
}

const _waveQuat = new THREE.Quaternion();
const _axis = new THREE.Vector3(0, 0, 1);

export default function CharacterSprite({
  character,
  position = [0, 0, 0],
  scale = 1,
  animation = 'idle',
}: CharacterSpriteProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const texture = useTexture(`/characters/${character}-front.png`);
  const { camera } = useThree();

  useFrame(({ clock }) => {
    const mesh = meshRef.current;
    if (!mesh) return;
    const t = clock.getElapsedTime();

    switch (animation) {
      case 'idle':
        mesh.position.y = position[1] + Math.sin(t * 1.2) * 0.03;
        mesh.quaternion.copy(camera.quaternion);
        break;

      case 'bounce':
        mesh.position.y = position[1] + THREE.MathUtils.lerp(
          mesh.position.y - position[1],
          Math.abs(Math.sin(t * 3)) * 0.2,
          0.1
        );
        mesh.quaternion.copy(camera.quaternion);
        break;

      case 'wave':
        mesh.quaternion.copy(camera.quaternion);
        _waveQuat.setFromAxisAngle(_axis, Math.sin(t * 1.5) * 0.1);
        mesh.quaternion.multiply(_waveQuat);
        mesh.position.y = position[1] + Math.sin(t * 1.2) * 0.03;
        break;
    }
  });

  return (
    <mesh ref={meshRef} position={position} scale={scale}>
      <planeGeometry args={[1, 1.5]} />
      <meshLambertMaterial
        map={texture}
        transparent
        alphaTest={0.1}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}
