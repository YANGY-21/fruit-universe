'use client';

import type { CSSProperties } from 'react';
import { FRUITS, FRUIT_KEYS, FRUIT_COLORS, FRUIT_RARITY, type FruitKey } from '@/data/fruits';

interface Props {
  fruit: FruitKey;
}

/** 星球公民证：身份证式卡片，供截图/导出分享 */
export default function PersonaCard({ fruit }: Props) {
  const f = FRUITS[fruit];
  const color = FRUIT_COLORS[fruit];
  const no = String(FRUIT_KEYS.indexOf(fruit) + 1).padStart(2, '0');

  return (
    <div className="citizen-card" style={{ '--accent': color } as CSSProperties}>
      <div className="cc-stripe" style={{ background: color }} />
      <div className="cc-head">
        <span className="cc-logo">🪐</span>
        <div className="cc-head-text">
          <div className="cc-title">水果星球 · 公民证</div>
          <div className="cc-sub">FRUIT PLANET PASSPORT · 第 {no} 号</div>
        </div>
      </div>

      <div className="cc-body">
        <div className="cc-avatar" style={{ background: color }}>
          {f.emoji}
        </div>
        <div className="cc-id">
          <div className="cc-name">{f.name}</div>
          <div className="cc-tag">{f.tag}</div>
          <div className="cc-sub2">{f.sub}</div>
        </div>
        <div className="cc-stamp" style={{ color }}>
          {f.emoji}
        </div>
      </div>

      <div className="cc-grid">
        <div className="cc-cell">
          <label>人格占比</label>
          <span>全人类仅 {FRUIT_RARITY[fruit]}% 是{f.name}型</span>
        </div>
        <div className="cc-cell">
          <label>诊断</label>
          <span>{f.diagnosis.split('<br>')[1] ?? f.diagnosis}</span>
        </div>
        <div className="cc-cell">
          <label>相性好</label>
          <span>{f.compat.good.map((k) => `${FRUITS[k].emoji}${FRUITS[k].name}`).join(' · ')}</span>
        </div>
        <div className="cc-cell">
          <label>相性紧张</label>
          <span>{f.compat.tense.map((k) => `${FRUITS[k].emoji}${FRUITS[k].name}`).join(' · ')}</span>
        </div>
      </div>

      <div className="cc-foot">FBTI · 水果人格测评 · 不科学但有点准</div>
    </div>
  );
}
