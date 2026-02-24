'use client';

import { useGardenState } from '../hooks/useGardenState';
import { gridToWorld } from '../lib/constants';
import GardenItem from './GardenItem';

/**
 * Renders all placed items on the grid.
 * Each PlacedItem has a col/row that maps to world coordinates.
 */
export default function GardenScene() {
  const placedItems = useGardenState((s) => s.placedItems);

  return (
    <group>
      {placedItems.map((placed) => {
        const worldPos = gridToWorld(placed.col, placed.row);
        return (
          <GardenItem
            key={`${placed.itemId}-${placed.col}-${placed.row}`}
            itemId={placed.itemId}
            position={worldPos}
          />
        );
      })}
    </group>
  );
}
