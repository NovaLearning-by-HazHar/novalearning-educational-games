'use client';

import { COLORS, MANGO_TREE_POSITIONS, BASKET_POSITION } from '../lib/constants';
import Mango from './Mango';
import Basket from './Basket';

interface MangoTreeProps {
  pickedMangoes: boolean[];
  arrivedMangoes: boolean[];
  onPickMango: (id: number) => void;
  onMangoArrive: (id: number) => void;
}

/**
 * Mango tree with trunk, canopy, 5 interactive mangoes, and collection basket.
 */
export default function MangoTree({
  pickedMangoes,
  arrivedMangoes,
  onPickMango,
  onMangoArrive,
}: MangoTreeProps) {
  const arrivedCount = arrivedMangoes.filter(Boolean).length;

  return (
    <group>
      {/* Tree trunk */}
      <mesh position={[0, 1.0, 0]}>
        <cylinderGeometry args={[0.15, 0.25, 2.0, 8]} />
        <meshBasicMaterial color={COLORS.treeTrunk} />
      </mesh>

      {/* Tree canopy */}
      <mesh position={[0, 2.8, 0]}>
        <sphereGeometry args={[1.8, 12, 10]} />
        <meshBasicMaterial color={COLORS.treeCanopy} transparent opacity={0.85} />
      </mesh>

      {/* 5 interactive mangoes */}
      {MANGO_TREE_POSITIONS.map((pos, i) => (
        <Mango
          key={i}
          id={i}
          treePosition={pos}
          picked={pickedMangoes[i]}
          onPick={onPickMango}
          onArriveAtBasket={onMangoArrive}
        />
      ))}

      {/* Collection basket */}
      <Basket position={BASKET_POSITION} collectedCount={arrivedCount} />
    </group>
  );
}
