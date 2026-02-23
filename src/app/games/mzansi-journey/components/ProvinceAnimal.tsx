'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { getProvince } from '../data/provinces';
import { BOB_AMPLITUDE, BOB_SPEED, SPIN_SPEED } from '../lib/constants';

interface ProvinceAnimalProps {
  /** Province ID to show its animal */
  provinceId: string;
  /** Whether the animal is visible */
  visible: boolean;
}

/**
 * Simple 3D animal display for the selected province.
 * <3K vertices. Slow rotation + bob. meshLambertMaterial only.
 * Each province animal gets a unique procedural shape.
 */
export default function ProvinceAnimal({ provinceId, visible }: ProvinceAnimalProps) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (!groupRef.current || !visible) return;
    const t = clock.elapsedTime;
    groupRef.current.rotation.y = t * SPIN_SPEED;
    groupRef.current.position.y = 1.2 + Math.sin(t * BOB_SPEED) * BOB_AMPLITUDE;
  });

  if (!visible) return null;

  const province = getProvince(provinceId);
  if (!province) return null;

  const { bodyColor, accentColor } = province.animal;

  // Determine animal shape type from province ID
  const animalType = getAnimalType(provinceId);

  return (
    <group ref={groupRef} position={[0, 1.2, 0]}>
      {animalType === 'quadruped' && (
        <QuadrupedAnimal bodyColor={bodyColor} accentColor={accentColor} />
      )}
      {animalType === 'bird' && (
        <BirdAnimal bodyColor={bodyColor} accentColor={accentColor} />
      )}
      {animalType === 'penguin' && (
        <PenguinAnimal bodyColor={bodyColor} accentColor={accentColor} />
      )}
      {animalType === 'standing' && (
        <StandingAnimal bodyColor={bodyColor} accentColor={accentColor} />
      )}
      {animalType === 'tree' && (
        <TreeAnimal bodyColor={bodyColor} accentColor={accentColor} />
      )}
    </group>
  );
}

function getAnimalType(provinceId: string): 'quadruped' | 'bird' | 'penguin' | 'standing' | 'tree' {
  switch (provinceId) {
    case 'western-cape': return 'penguin';
    case 'eastern-cape': return 'quadruped'; // elephant
    case 'northern-cape': return 'standing'; // meerkat
    case 'kwazulu-natal': return 'quadruped'; // rhino
    case 'free-state': return 'quadruped'; // springbok
    case 'gauteng': return 'bird'; // hadeda
    case 'mpumalanga': return 'quadruped'; // leopard
    case 'limpopo': return 'tree'; // baobab bird
    case 'north-west': return 'quadruped'; // wild dog
    default: return 'quadruped';
  }
}

/** Generic 4-legged animal (~400 verts) */
function QuadrupedAnimal({ bodyColor, accentColor }: { bodyColor: string; accentColor: string }) {
  return (
    <>
      {/* Body */}
      <mesh>
        <sphereGeometry args={[0.5, 8, 8]} />
        <meshLambertMaterial color={bodyColor} />
      </mesh>
      {/* Head */}
      <mesh position={[0.4, 0.3, 0]}>
        <sphereGeometry args={[0.25, 8, 8]} />
        <meshLambertMaterial color={bodyColor} />
      </mesh>
      {/* Eyes */}
      <mesh position={[0.55, 0.38, 0.15]}>
        <sphereGeometry args={[0.04, 4, 4]} />
        <meshBasicMaterial color="#333333" />
      </mesh>
      <mesh position={[0.55, 0.38, -0.15]}>
        <sphereGeometry args={[0.04, 4, 4]} />
        <meshBasicMaterial color="#333333" />
      </mesh>
      {/* Legs */}
      {([[-0.25, -0.5, 0.2], [-0.25, -0.5, -0.2], [0.2, -0.5, 0.2], [0.2, -0.5, -0.2]] as [number, number, number][]).map(
        (pos, i) => (
          <mesh key={i} position={pos}>
            <cylinderGeometry args={[0.06, 0.06, 0.3, 4]} />
            <meshLambertMaterial color={accentColor} />
          </mesh>
        ),
      )}
    </>
  );
}

/** Bird shape (~300 verts) */
function BirdAnimal({ bodyColor, accentColor }: { bodyColor: string; accentColor: string }) {
  return (
    <>
      {/* Body */}
      <mesh>
        <sphereGeometry args={[0.35, 8, 8]} />
        <meshLambertMaterial color={bodyColor} />
      </mesh>
      {/* Head */}
      <mesh position={[0, 0.4, 0.1]}>
        <sphereGeometry args={[0.2, 8, 8]} />
        <meshLambertMaterial color={bodyColor} />
      </mesh>
      {/* Beak */}
      <mesh position={[0, 0.35, 0.3]} rotation={[0.3, 0, 0]}>
        <coneGeometry args={[0.06, 0.2, 4]} />
        <meshLambertMaterial color={accentColor} />
      </mesh>
      {/* Eyes */}
      <mesh position={[0.1, 0.45, 0.2]}>
        <sphereGeometry args={[0.03, 4, 4]} />
        <meshBasicMaterial color="#333333" />
      </mesh>
      <mesh position={[-0.1, 0.45, 0.2]}>
        <sphereGeometry args={[0.03, 4, 4]} />
        <meshBasicMaterial color="#333333" />
      </mesh>
      {/* Wings */}
      <mesh position={[0.3, 0.05, 0]} rotation={[0, 0, -0.5]}>
        <boxGeometry args={[0.3, 0.05, 0.2]} />
        <meshLambertMaterial color={accentColor} />
      </mesh>
      <mesh position={[-0.3, 0.05, 0]} rotation={[0, 0, 0.5]}>
        <boxGeometry args={[0.3, 0.05, 0.2]} />
        <meshLambertMaterial color={accentColor} />
      </mesh>
      {/* Legs */}
      <mesh position={[0.08, -0.35, 0]}>
        <cylinderGeometry args={[0.03, 0.03, 0.25, 4]} />
        <meshLambertMaterial color={accentColor} />
      </mesh>
      <mesh position={[-0.08, -0.35, 0]}>
        <cylinderGeometry args={[0.03, 0.03, 0.25, 4]} />
        <meshLambertMaterial color={accentColor} />
      </mesh>
    </>
  );
}

/** Penguin shape (~350 verts) */
function PenguinAnimal({ bodyColor, accentColor }: { bodyColor: string; accentColor: string }) {
  return (
    <>
      {/* Body */}
      <mesh>
        <cylinderGeometry args={[0.25, 0.3, 0.7, 8]} />
        <meshLambertMaterial color={bodyColor} />
      </mesh>
      {/* Belly (white front) */}
      <mesh position={[0, 0, 0.2]}>
        <cylinderGeometry args={[0.15, 0.2, 0.5, 8]} />
        <meshLambertMaterial color={accentColor} />
      </mesh>
      {/* Head */}
      <mesh position={[0, 0.5, 0]}>
        <sphereGeometry args={[0.2, 8, 8]} />
        <meshLambertMaterial color={bodyColor} />
      </mesh>
      {/* Eyes */}
      <mesh position={[0.08, 0.53, 0.16]}>
        <sphereGeometry args={[0.04, 4, 4]} />
        <meshBasicMaterial color="#FFFFFF" />
      </mesh>
      <mesh position={[-0.08, 0.53, 0.16]}>
        <sphereGeometry args={[0.04, 4, 4]} />
        <meshBasicMaterial color="#FFFFFF" />
      </mesh>
      <mesh position={[0.08, 0.53, 0.19]}>
        <sphereGeometry args={[0.02, 4, 4]} />
        <meshBasicMaterial color="#333333" />
      </mesh>
      <mesh position={[-0.08, 0.53, 0.19]}>
        <sphereGeometry args={[0.02, 4, 4]} />
        <meshBasicMaterial color="#333333" />
      </mesh>
      {/* Beak */}
      <mesh position={[0, 0.45, 0.22]} rotation={[0.3, 0, 0]}>
        <coneGeometry args={[0.05, 0.12, 4]} />
        <meshLambertMaterial color="#FF8C00" />
      </mesh>
      {/* Flippers */}
      <mesh position={[0.3, 0.05, 0]} rotation={[0, 0, -0.4]}>
        <boxGeometry args={[0.15, 0.4, 0.06]} />
        <meshLambertMaterial color={bodyColor} />
      </mesh>
      <mesh position={[-0.3, 0.05, 0]} rotation={[0, 0, 0.4]}>
        <boxGeometry args={[0.15, 0.4, 0.06]} />
        <meshLambertMaterial color={bodyColor} />
      </mesh>
      {/* Feet */}
      <mesh position={[0.1, -0.4, 0.1]}>
        <boxGeometry args={[0.1, 0.06, 0.15]} />
        <meshLambertMaterial color="#FF8C00" />
      </mesh>
      <mesh position={[-0.1, -0.4, 0.1]}>
        <boxGeometry args={[0.1, 0.06, 0.15]} />
        <meshLambertMaterial color="#FF8C00" />
      </mesh>
    </>
  );
}

/** Standing animal (meerkat) (~300 verts) */
function StandingAnimal({ bodyColor, accentColor }: { bodyColor: string; accentColor: string }) {
  return (
    <>
      {/* Body (tall cylinder) */}
      <mesh position={[0, 0.1, 0]}>
        <cylinderGeometry args={[0.15, 0.2, 0.6, 8]} />
        <meshLambertMaterial color={bodyColor} />
      </mesh>
      {/* Head */}
      <mesh position={[0, 0.55, 0]}>
        <sphereGeometry args={[0.18, 8, 8]} />
        <meshLambertMaterial color={bodyColor} />
      </mesh>
      {/* Eyes */}
      <mesh position={[0.06, 0.6, 0.14]}>
        <sphereGeometry args={[0.04, 4, 4]} />
        <meshBasicMaterial color="#333333" />
      </mesh>
      <mesh position={[-0.06, 0.6, 0.14]}>
        <sphereGeometry args={[0.04, 4, 4]} />
        <meshBasicMaterial color="#333333" />
      </mesh>
      {/* Nose */}
      <mesh position={[0, 0.52, 0.16]}>
        <sphereGeometry args={[0.03, 4, 4]} />
        <meshBasicMaterial color={accentColor} />
      </mesh>
      {/* Arms */}
      <mesh position={[0.18, 0.2, 0]}>
        <cylinderGeometry args={[0.04, 0.04, 0.25, 4]} />
        <meshLambertMaterial color={bodyColor} />
      </mesh>
      <mesh position={[-0.18, 0.2, 0]}>
        <cylinderGeometry args={[0.04, 0.04, 0.25, 4]} />
        <meshLambertMaterial color={bodyColor} />
      </mesh>
      {/* Tail */}
      <mesh position={[0, -0.1, -0.2]} rotation={[0.5, 0, 0]}>
        <cylinderGeometry args={[0.03, 0.02, 0.35, 4]} />
        <meshLambertMaterial color={accentColor} />
      </mesh>
      {/* Legs */}
      <mesh position={[0.07, -0.25, 0]}>
        <cylinderGeometry args={[0.05, 0.05, 0.2, 4]} />
        <meshLambertMaterial color={bodyColor} />
      </mesh>
      <mesh position={[-0.07, -0.25, 0]}>
        <cylinderGeometry args={[0.05, 0.05, 0.2, 4]} />
        <meshLambertMaterial color={bodyColor} />
      </mesh>
    </>
  );
}

/** Tree-based creature (Limpopo baobab) (~250 verts) */
function TreeAnimal({ bodyColor, accentColor }: { bodyColor: string; accentColor: string }) {
  return (
    <>
      {/* Trunk */}
      <mesh position={[0, -0.1, 0]}>
        <cylinderGeometry args={[0.2, 0.3, 0.6, 6]} />
        <meshLambertMaterial color={bodyColor} />
      </mesh>
      {/* Canopy */}
      <mesh position={[0, 0.35, 0]}>
        <sphereGeometry args={[0.45, 8, 8]} />
        <meshLambertMaterial color={accentColor} />
      </mesh>
      {/* Small bird on top */}
      <mesh position={[0.15, 0.7, 0]}>
        <sphereGeometry args={[0.1, 6, 6]} />
        <meshLambertMaterial color="#FF7043" />
      </mesh>
      {/* Bird beak */}
      <mesh position={[0.25, 0.68, 0]} rotation={[0, 0, -Math.PI / 2]}>
        <coneGeometry args={[0.03, 0.08, 4]} />
        <meshLambertMaterial color="#FFD54F" />
      </mesh>
      {/* Bird eye */}
      <mesh position={[0.18, 0.73, 0.06]}>
        <sphereGeometry args={[0.02, 4, 4]} />
        <meshBasicMaterial color="#333333" />
      </mesh>
    </>
  );
}
