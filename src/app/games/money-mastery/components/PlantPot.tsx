'use client';

import { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { animate } from 'animejs';
import * as THREE from 'three';
import { SHOP_COLORS, GAME_SETTINGS } from '../lib/constants';
import { audioManager } from '@/lib/audio';
import { useTouchInput } from '@/lib/useTouchInput';

interface PlantPotProps {
  position: [number, number, number];
  watered: boolean;
  coinSpawned: boolean;
  coinCollected: boolean;
  onWater: () => void;
  onCollect: () => void;
}

/**
 * Single plant pot with water interaction, plant growth animation, and coin collection.
 * Uses anime.js v4 for scale animations.
 */
export default function PlantPot({
  position,
  watered,
  coinSpawned,
  coinCollected,
  onWater,
  onCollect,
}: PlantPotProps) {
  const potRef = useRef<THREE.Mesh>(null);
  const plantRef = useRef<THREE.Mesh>(null);
  const coinRef = useRef<THREE.Mesh>(null);

  // Animation proxy refs for anime.js
  const plantScaleProxy = useRef({ value: 0 });
  const coinScaleProxy = useRef({ value: 0 });

  // Handle pot tap for watering
  const { onTap: handlePotTap } = useTouchInput(() => {
    if (!watered) {
      onWater();
      audioManager.play('water-splash');
    }
  });

  // Handle coin tap for collection
  const { onTap: handleCoinTap } = useTouchInput(() => {
    if (coinSpawned && !coinCollected) {
      onCollect();
      audioManager.play('coin-pop');
    }
  });

  // Animate plant growth when watered
  useEffect(() => {
    if (watered && plantRef.current) {
      animate(plantScaleProxy.current, {
        value: 1,
        duration: GAME_SETTINGS.plantGrowDuration,
        ease: 'outElastic(1, 0.5)',
      });
    }
  }, [watered]);

  // Animate coin spawn
  useEffect(() => {
    if (coinSpawned && !coinCollected && coinRef.current) {
      animate(coinScaleProxy.current, {
        value: 1,
        duration: GAME_SETTINGS.coinPopDuration,
        ease: 'outBack(3)',
      });
    }
  }, [coinSpawned, coinCollected]);

  // Sync proxy values to Three.js meshes
  useFrame(() => {
    if (plantRef.current) {
      const scale = plantScaleProxy.current.value;
      plantRef.current.scale.set(scale, scale, scale);
    }
    if (coinRef.current) {
      const scale = coinScaleProxy.current.value;
      coinRef.current.scale.set(scale, scale, scale);
      // Gentle rotation for coin
      coinRef.current.rotation.y += 0.02;
    }
  });

  return (
    <group position={position}>
      {/* Pot base */}
      <mesh
        ref={potRef}
        position={[0, 0, 0]}
        onClick={handlePotTap}
        onPointerDown={handlePotTap}
      >
        <cylinderGeometry args={[0.2, 0.15, 0.3, 12]} />
        <meshBasicMaterial color={SHOP_COLORS.potBrown} />
      </mesh>

      {/* Pot rim */}
      <mesh position={[0, 0.15, 0]}>
        <torusGeometry args={[0.2, 0.02, 8, 12]} />
        <meshBasicMaterial color={SHOP_COLORS.potRim} />
      </mesh>

      {/* Plant (visible after watering) */}
      {watered && (
        <mesh ref={plantRef} position={[0, 0.25, 0]}>
          <coneGeometry args={[0.12, 0.4, 6]} />
          <meshBasicMaterial color={SHOP_COLORS.plantGreen} />
        </mesh>
      )}

      {/* Coin (spawns after plant grows) */}
      {coinSpawned && !coinCollected && (
        <mesh
          ref={coinRef}
          position={[0, 0.5, 0]}
          onClick={handleCoinTap}
          onPointerDown={handleCoinTap}
        >
          <cylinderGeometry args={[0.08, 0.08, 0.02, 16]} />
          <meshBasicMaterial color={SHOP_COLORS.coinGold} />
        </mesh>
      )}
    </group>
  );
}