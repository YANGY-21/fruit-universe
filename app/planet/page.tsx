'use client';

import { useState } from 'react';
import { FRUITS, type FruitKey } from '@/data/fruits';
import PlanetChart from '@/components/PlanetChart';
import PersonaCard from '@/components/PersonaCard';

export default function PlanetPage() {
  const [selected, setSelected] = useState<FruitKey | null>(null);

  return (
    <div className="container">
      <div className="card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px' }}>
        <div>
          <div style={{ fontWeight: 700 }}>星球相性图 🪐</div>
          <div style={{ fontSize: 12, color: '#bbb', marginTop: 2 }}>绿线相性好 · 红线相性紧张 · 点水果看公民证</div>
        </div>
        <a href="/" className="btn btn-outline" style={{ width: 'auto', padding: '8px 14px', fontSize: 13, textDecoration: 'none' }}>
          返回
        </a>
      </div>

      <div className="card" style={{ padding: '12px 12px 8px' }}>
        <PlanetChart selected={selected} onSelect={setSelected} />
      </div>

      {selected ? (
        <div className="card" style={{ padding: '20px 20px 24px' }}>
          <div style={{ fontSize: 17, fontWeight: 700, marginBottom: 14 }}>
            {FRUITS[selected].emoji} {FRUITS[selected].name} · 公民证
          </div>
          <div style={{ borderRadius: 18, overflow: 'hidden' }}>
            <PersonaCard fruit={selected} />
          </div>
        </div>
      ) : (
        <div className="card" style={{ padding: '18px 20px', fontSize: 13, color: '#aaa', lineHeight: 1.8 }}>
          点一个水果，会亮起它的相性关系（绿线=合得来，红线=合不来），下方会出现它的「星球公民证」。
        </div>
      )}

      <div className="footer">FBTI · 星球相性图</div>
    </div>
  );
}
