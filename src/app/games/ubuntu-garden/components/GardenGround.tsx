'use client';

import { GRID_SIZE, CELL_SIZE, COLORS } from '../lib/constants';

/**
 * 3D ground grid — simple plane with visible grid lines.
 * meshBasicMaterial only. Low vertex count.
 */
export default function GardenGround() {
  const gridExtent = GRID_SIZE * CELL_SIZE;
  const halfExtent = gridExtent / 2;

  // Build grid line positions
  const lines: { start: [number, number, number]; end: [number, number, number] }[] = [];
  for (let i = 0; i <= GRID_SIZE; i++) {
    const pos = -halfExtent + i * CELL_SIZE;
    // Horizontal lines (along X)
    lines.push({ start: [-halfExtent, 0.01, pos], end: [halfExtent, 0.01, pos] });
    // Vertical lines (along Z)
    lines.push({ start: [pos, 0.01, -halfExtent], end: [pos, 0.01, halfExtent] });
  }

  return (
    <group>
      {/* Ground plane */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]}>
        <planeGeometry args={[12, 12]} />
        <meshBasicMaterial color={COLORS.ground} />
      </mesh>

      {/* Grid cell highlights — slightly different shade per cell */}
      {Array.from({ length: GRID_SIZE }, (_, row) =>
        Array.from({ length: GRID_SIZE }, (_, col) => {
          const offset = (GRID_SIZE - 1) / 2;
          const x = (col - offset) * CELL_SIZE;
          const z = (row - offset) * CELL_SIZE;
          const isEven = (col + row) % 2 === 0;
          return (
            <mesh
              key={`cell-${col}-${row}`}
              rotation={[-Math.PI / 2, 0, 0]}
              position={[x, 0.001, z]}
            >
              <planeGeometry args={[CELL_SIZE * 0.95, CELL_SIZE * 0.95]} />
              <meshBasicMaterial
                color={isEven ? COLORS.ground : COLORS.groundDark}
                transparent
                opacity={0.5}
              />
            </mesh>
          );
        })
      )}

      {/* Grid lines using thin box meshes (no LineSegments for Galaxy A03 compat) */}
      {lines.map((line, i) => {
        const mx = (line.start[0] + line.end[0]) / 2;
        const mz = (line.start[2] + line.end[2]) / 2;
        const isHorizontal = line.start[2] === line.end[2];
        const length = gridExtent;
        return (
          <mesh
            key={`line-${i}`}
            position={[mx, 0.005, mz]}
            rotation={[-Math.PI / 2, 0, isHorizontal ? 0 : Math.PI / 2]}
          >
            <planeGeometry args={[length, 0.02]} />
            <meshBasicMaterial color={COLORS.gridLine} transparent opacity={0.6} />
          </mesh>
        );
      })}
    </group>
  );
}
