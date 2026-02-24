'use client';

import { useCallback } from 'react';
import { PROVINCE_COLORS, PROVINCE_DEFAULT_OPACITY, PROVINCE_VISITED_OPACITY, PROVINCE_ACTIVE_OPACITY, TEXT_COLOR } from '../lib/constants';

interface SAMapProps {
  selectedProvince: string | null;
  visitedProvinces: string[];
  onSelectProvince: (id: string) => void;
}

/**
 * Simplified SVG map of South Africa with 9 clickable provinces.
 * HTML overlay (not 3D). Each province highlights on tap.
 * Touch targets >= 48px. Recognizable but not geographically perfect.
 */
export default function SAMap({ selectedProvince, visitedProvinces, onSelectProvince }: SAMapProps) {
  const getOpacity = useCallback(
    (id: string) => {
      if (id === selectedProvince) return PROVINCE_ACTIVE_OPACITY;
      if (visitedProvinces.includes(id)) return PROVINCE_VISITED_OPACITY;
      return PROVINCE_DEFAULT_OPACITY;
    },
    [selectedProvince, visitedProvinces]
  );

  const getStroke = useCallback(
    (id: string) => {
      if (id === selectedProvince) return '#FFFFFF';
      if (visitedProvinces.includes(id)) return '#FFFFFF';
      return TEXT_COLOR;
    },
    [selectedProvince, visitedProvinces]
  );

  const getStrokeWidth = useCallback(
    (id: string) => {
      if (id === selectedProvince) return 2.5;
      return 1;
    },
    [selectedProvince]
  );

  const provinces = [
    {
      id: 'limpopo',
      label: 'LP',
      // Top-center/right — northernmost province
      d: 'M 230,25 L 290,20 L 345,45 L 360,80 L 330,105 L 280,110 L 240,95 L 220,65 Z',
    },
    {
      id: 'north-west',
      label: 'NW',
      // Left-center, below Limpopo
      d: 'M 140,100 L 220,65 L 240,95 L 260,115 L 240,145 L 190,155 L 140,140 Z',
    },
    {
      id: 'gauteng',
      label: 'GP',
      // Small province center-right, between North West and Mpumalanga
      d: 'M 260,115 L 280,110 L 300,115 L 300,140 L 280,145 L 260,140 Z',
    },
    {
      id: 'mpumalanga',
      label: 'MP',
      // Right, east of Gauteng
      d: 'M 300,115 L 330,105 L 360,80 L 380,110 L 370,145 L 330,160 L 300,140 Z',
    },
    {
      id: 'free-state',
      label: 'FS',
      // Center of the country
      d: 'M 140,140 L 190,155 L 240,145 L 280,145 L 300,140 L 310,170 L 290,210 L 230,220 L 170,205 L 140,170 Z',
    },
    {
      id: 'kwazulu-natal',
      label: 'KZN',
      // East coast, right of Free State
      d: 'M 300,140 L 330,160 L 370,145 L 380,175 L 360,210 L 320,230 L 290,210 L 310,170 Z',
    },
    {
      id: 'northern-cape',
      label: 'NC',
      // Large western area
      d: 'M 20,120 L 80,80 L 140,100 L 140,140 L 140,170 L 170,205 L 150,245 L 105,270 L 60,250 L 20,200 Z',
    },
    {
      id: 'eastern-cape',
      label: 'EC',
      // Southern-east coast
      d: 'M 150,245 L 170,205 L 230,220 L 290,210 L 320,230 L 310,265 L 260,290 L 200,290 L 160,275 Z',
    },
    {
      id: 'western-cape',
      label: 'WC',
      // Southwestern tip
      d: 'M 20,200 L 60,250 L 105,270 L 150,245 L 160,275 L 140,300 L 95,315 L 50,300 L 20,260 Z',
    },
  ];

  return (
    <svg
      viewBox="0 0 400 340"
      className="w-full h-full max-w-[440px] max-h-[360px]"
      role="img"
      aria-label="Map of South Africa provinces"
    >
      {/* Province shapes */}
      {provinces.map((p) => (
        <g key={p.id}>
          <path
            d={p.d}
            fill={PROVINCE_COLORS[p.id] || '#CCCCCC'}
            fillOpacity={getOpacity(p.id)}
            stroke={getStroke(p.id)}
            strokeWidth={getStrokeWidth(p.id)}
            strokeLinejoin="round"
            className="cursor-pointer transition-all duration-200"
            onClick={() => onSelectProvince(p.id)}
            role="button"
            aria-label={`Select ${p.id.replace(/-/g, ' ')}`}
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onSelectProvince(p.id);
              }
            }}
          />
          {/* Province label */}
          <text
            x={getCentroid(p.d)[0]}
            y={getCentroid(p.d)[1]}
            textAnchor="middle"
            dominantBaseline="central"
            className="pointer-events-none select-none"
            fill={TEXT_COLOR}
            fontSize="11"
            fontWeight="bold"
          >
            {p.label}
          </text>
          {/* Visited checkmark */}
          {visitedProvinces.includes(p.id) && p.id !== selectedProvince && (
            <text
              x={getCentroid(p.d)[0] + 14}
              y={getCentroid(p.d)[1] - 8}
              textAnchor="middle"
              dominantBaseline="central"
              className="pointer-events-none select-none"
              fontSize="12"
            >
              {'*'}
            </text>
          )}
        </g>
      ))}
    </svg>
  );
}

/**
 * Simple centroid calculation from an SVG path's M/L coordinates.
 * Parses numeric pairs and averages them.
 */
function getCentroid(d: string): [number, number] {
  const nums = d.match(/[\d.]+/g);
  if (!nums || nums.length < 4) return [200, 170];
  let sumX = 0;
  let sumY = 0;
  let count = 0;
  for (let i = 0; i < nums.length - 1; i += 2) {
    sumX += parseFloat(nums[i]);
    sumY += parseFloat(nums[i + 1]);
    count++;
  }
  return [sumX / count, sumY / count];
}
