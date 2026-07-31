'use client';

import { useEffect, useState } from 'react';
import { FRUITS, FRUIT_COLORS, type FruitKey } from '@/data/fruits';
import { sortedByScore } from '@/lib/scoring';

type Tab = 'traits' | 'social' | 'stress' | 'chart';

interface Props {
  fruit: FruitKey;
  mode: 'classic' | 'ai';
  reason?: string;
}

/** 结果页：Hero 卡 + 四 tab 详情 + （可选）AI 推理横幅 */
export default function FruitResult({ fruit, mode, reason }: Props) {
  const f = FRUITS[fruit];
  const [tab, setTab] = useState<Tab>('traits');
  const [scores, setScores] = useState<Record<FruitKey, number> | null>(null);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem('fruit-universe:result');
      if (raw) {
        const data = JSON.parse(raw);
        if (data.mode === 'classic' && data.scores) setScores(data.scores);
      }
    } catch {
      // 直接打开链接时没有缓存数据，成分图显示空态
    }
  }, []);

  const chartKeys = scores ? sortedByScore(scores) : [];
  const maxScore = scores ? Math.max(...Object.values(scores)) : 0;

  const neutrals = Object.keys(FRUITS)
    .filter(
      (k) => k !== fruit && !f.compat.good.includes(k as FruitKey) && !f.compat.tense.includes(k as FruitKey)
    )
    .slice(0, 3);

  const chip = (k: FruitKey, cls: string) => (
    <span key={k} className={`comp-chip ${cls}`}>
      {FRUITS[k].emoji} {FRUITS[k].name}
    </span>
  );

  return (
    <div className="container">
      {/* 截图核心区 */}
      <div className="card r-card">
        <span className="r-emoji">{f.emoji}</span>
        <div className="r-name">{f.name}</div>
        <div className="r-sub">{f.sub}</div>
        <div className="r-tag">{f.tag}</div>
        <div className="r-diagnosis">
          {f.diagnosis.split('<br>').map((line, i) => (
            <span key={i}>
              {i > 0 && <br />}
              {line}
            </span>
          ))}
        </div>
        <div className="r-meta">
          <span>FBTI</span>
        </div>
      </div>

      {/* AI 推理横幅 */}
      {mode === 'ai' && reason && (
        <div className="card" style={{ padding: '16px 20px' }}>
          <div className="ai-reason">
            <h3>AI 考官的推理过程</h3>
            <div>{reason}</div>
          </div>
        </div>
      )}

      {/* 详细分析 */}
      <div className="card" style={{ padding: '20px 20px 24px' }}>
        <div className="detail-nav">
          {(
            [
              ['traits', '特质'],
              ['social', '社交'],
              ['stress', '压力'],
              ['chart', '成分'],
            ] as [Tab, string][]
          ).map(([key, label]) => (
            <div
              key={key}
              className={`detail-tab${tab === key ? ' active' : ''}`}
              onClick={() => setTab(key)}
            >
              {label}
            </div>
          ))}
        </div>

        <div className={`detail-panel${tab === 'traits' ? ' active' : ''}`}>
          <h3>核心特质</h3>
          <div className="trait-list">
            {f.traits.map((t) => (
              <div key={t.title} className="trait-item">
                <div className="trait-title">{t.title}</div>
                <div className="trait-desc">{t.desc}</div>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 14, padding: '12px 14px', background: '#fafafa', borderRadius: 10, fontSize: 13, color: '#aaa', lineHeight: 1.7 }}>
            ⚠️ {f.blindspot}
          </div>
        </div>

        <div className={`detail-panel${tab === 'social' ? ' active' : ''}`}>
          <h3>社交画像</h3>
          <div style={{ fontSize: 14, lineHeight: 1.9, color: '#555' }}>{f.social}</div>
          <h3 style={{ marginTop: 20 }}>相性匹配</h3>
          <div className="comp-list">
            {f.compat.good.map((k) => chip(k, 'good'))}
            {f.compat.tense.map((k) => chip(k, 'tense'))}
            {neutrals.map((k) => chip(k as FruitKey, ''))}
          </div>
        </div>

        <div className={`detail-panel${tab === 'stress' ? ' active' : ''}`}>
          <h3>压力应对</h3>
          <div style={{ fontSize: 14, lineHeight: 1.9, color: '#555' }}>{f.stress}</div>
        </div>

        <div className={`detail-panel${tab === 'chart' ? ' active' : ''}`}>
          <h3>水果成分</h3>
          {scores ? (
            <div className="chart-section">
              {chartKeys.map((k) => (
                <div key={k} className="detail-row">
                  <span className="fi">{FRUITS[k].emoji}</span>
                  <div className="bar-wrap">
                    <div
                      className="bar"
                      style={{
                        width: `${maxScore > 0 ? Math.round((scores[k] / maxScore) * 100) : 0}%`,
                        background: FRUIT_COLORS[k],
                      }}
                    />
                  </div>
                  <span className="score">{scores[k]}</span>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ fontSize: 13, color: '#bbb', lineHeight: 1.7 }}>
              {mode === 'ai'
                ? 'AI 考官直接诊断，不计算成分占比。'
                : '缺少成分数据，重新测一次试试。'}
            </div>
          )}
        </div>

        <div className="btn-row">
          <button className="btn btn-primary" onClick={() => (window.location.href = '/')}>
            重测
          </button>
        </div>
      </div>

      <div className="footer">FBTI</div>
    </div>
  );
}
