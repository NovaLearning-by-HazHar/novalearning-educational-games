'use client';

import {
  SHOP_COUNTER,
  BACK_SHELF,
  GROUND_PLANE,
  SHOP_COLORS,
  ASSET_DISPLAY_POSITIONS,
} from '../lib/constants';
import { useMoneyState } from '../hooks/useMoneyState';

/**
 * 3D shop environment: counter, back shelf, ground plane, and owned asset displays.
 * Simple box geometries with flat colors for Galaxy A03 performance.
 */
export default function ShopEnvironment() {
  const purchases = useMoneyState((s) => s.purchases);
  const assets = purchases.filter((p) => p.type === 'asset');

  return (
    <group>
      {/* Shop counter */}
      <mesh position={SHOP_COUNTER.position}>
        <boxGeometry args={SHOP_COUNTER.dimensions} />
        <meshBasicMaterial color={SHOP_COLORS.counterWood} />
      </mesh>

      {/* Back shelf */}
      <mesh position={BACK_SHELF.position}>
        <boxGeometry args={BACK_SHELF.dimensions} />
        <meshBasicMaterial color={SHOP_COLORS.shelfWood} />
      </mesh>

      {/* Ground plane */}
      <mesh position={GROUND_PLANE.position} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[GROUND_PLANE.dimensions[0], GROUND_PLANE.dimensions[2]]} />
        <meshBasicMaterial color={SHOP_COLORS.ground} />
      </mesh>

      {/* Display owned assets on back shelf */}
      {assets.map((asset, idx) => {
        const displayPos = ASSET_DISPLAY_POSITIONS[asset.id];
        if (!displayPos) return null;

        return (
          <mesh key={`${asset.id}-${idx}`} position={displayPos}>
            <boxGeometry args={[0.3, 0.3, 0.1]} />
            <meshBasicMaterial color={SHOP_COLORS.assetBorder} />
          </mesh>
        );
      })}
    </group>
  );
}