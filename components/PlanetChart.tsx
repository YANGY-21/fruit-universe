'use client';

import { useMemo } from 'react';
import { FRUITS, FRUIT_KEYS, FRUIT_COLORS, type FruitKey } from '@/data/fruits';

const SIZE = 380;
const CENTER = SIZE / 2;
const R = 150;
const NODE_R = 22;

/** 第 i 个水果在圆上的位置（从正上方顺时针排开） */
function pos(i: number) {
  const a = (i / FRUIT_KEYS.length) * Math.PI * 2 - Math.PI / 2;
  return { x: CENTER + R * Math.cos(a), y: CENTER + R * Math.sin(a) };
}

interface Edge {
  a: FruitKey;
  b: FruitKey;
  good: boolean;
}

interface Props {
  selected: FruitKey | null;
  onSelect: (k: FruitKey | null) => void;
}

/** 星球相性图：14 种水果围成一圈，绿线=相性好，红线=相性紧张 */
export default function PlanetChart({ selected, onSelect }: Props) {
  const positions = useMemo(() => FRUIT_KEYS.map((_, i) => pos(i)), []);

  // 每条连线只画一次（按 FRUIT_KEYS 顺序 a 在前）
  const edges = useMemo<Edge[]>(() => {
    const out: Edge[] = [];
    FRUIT_KEYS.forEach((a, i) => {
      FRUIT_KEYS.forEach((b, j) => {
        if (j <= i) return;
        if (FRUITS[a].compat.good.includes(b)) out.push({ a, b, good: true });
        else if (FRUITS[a].compat.tense.includes(b)) out.push({ a, b, good: false });
      });
    });
    return out;
  }, []);

  const neighbors = useMemo(() => {
    if (!selected) return new Set<FruitKey>();
    return new Set<FruitKey>([
      selected,
      ...FRUITS[selected].compat.good,
      ...FRUITS[selected].compat.tense,
    ]);
  }, [selected]);

  return (
    <svg viewBox={`0 0 ${SIZE} ${SIZE}`} width="100%" role="img" aria-label="水果星球相性图">
      {/* 轨道与中心 */}
      <circle cx={CENTER} cy={CENTER} r={R} fill="none" stroke="#eee" strokeWidth={1} strokeDasharray="3 5" />
      <text x={CENTER} y={CENTER - 4} textAnchor="middle" fontSize={9} fill="#ddd" letterSpacing={4}>
        水 果 星 球
      </text>
      <text x={CENTER} y={CENTER + 12} textAnchor="middle" fontSize={9} fill="#ddd" letterSpacing={2}>
        相 性 图
      </text>

      {/* 连线 */}
      {edges.map((e, idx) => {
        const pa = positions[FRUIT_KEYS.indexOf(e.a)];
        const pb = positions[FRUIT_KEYS.indexOf(e.b)];
        const isSelectedEdge = selected !== null && (e.a === selected || e.b === selected);
        let stroke = e.good ? '#a5d6a7' : '#ef9a9a';
        let width = 2;
        let opacity = selected ? 0.08 : 0.5;
        if (selected && isSelectedEdge) {
          stroke = e.good ? '#4caf50' : '#e53935';
          width = 3.2;
          opacity = 0.9;
        }
        return (
          <line
            key={idx}
            x1={pa.x}
            y1={pa.y}
            x2={pb.x}
            y2={pb.y}
            stroke={stroke}
            strokeWidth={width}
            strokeOpacity={opacity}
            strokeLinecap="round"
          />
        );
      })}

      {/* 节点 */}
      {FRUIT_KEYS.map((k, i) => {
        const p = positions[i];
        const isSel = selected === k;
        const dim = selected !== null && !neighbors.has(k);
        const r = isSel ? NODE_R * 1.2 : NODE_R;
        return (
          <g
            key={k}
            onClick={() => onSelect(isSel ? null : k)}
            className={`planet-node${isSel ? ' selected' : ''}${dim ? ' dim' : ''}`}
            style={{ cursor: 'pointer' }}
          >
            {isSel && (
              <circle cx={p.x} cy={p.y} r={r + 5} fill="none" stroke={FRUIT_COLORS[k]} strokeWidth={2} opacity={0.5} />
            )}
            <circle cx={p.x} cy={p.y} r={r} fill={FRUIT_COLORS[k]} opacity={dim ? 0.3 : 1} />
            <text x={p.x} y={p.y + 6} textAnchor="middle" fontSize={19} opacity={dim ? 0.3 : 1}>
              {FRUITS[k].emoji}
            </text>
            <text
              x={p.x}
              y={p.y + r + 14}
              textAnchor="middle"
              fontSize={11}
              fill={isSel ? '#1a1a1a' : '#999'}
              fontWeight={isSel ? 700 : 400}
            >
              {FRUITS[k].name}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
