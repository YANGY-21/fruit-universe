'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ALL_QS, type Question } from '@/data/questions';
import { scoreTest, shuffle, QUIZ_COUNT } from '@/lib/scoring';
import { saveResult } from '@/lib/saveResult';

const RESULT_KEY = 'fruit-universe:result';

export default function QuizPage() {
  const router = useRouter();

  const [qs] = useState<Question[]>(() => shuffle(ALL_QS).slice(0, QUIZ_COUNT));
  const [ci, setCi] = useState(0);
  const [ans, setAns] = useState<(number | null)[]>(() => new Array(QUIZ_COUNT).fill(null));
  const [selected, setSelected] = useState<number | null>(null);

  const q = qs[ci];
  const done = ans.filter((a) => a !== null).length;

  function choose(i: number) {
    if (selected !== null) return;
    setSelected(i);

    const next = [...ans];
    next[ci] = i;
    setAns(next);

    const allDone = next.every((a) => a !== null);
    setTimeout(() => {
      if (allDone) {
        const { scores, top } = scoreTest(qs, next);
        sessionStorage.setItem(
          RESULT_KEY,
          JSON.stringify({ fruit: top, mode: 'classic', scores })
        );
        saveResult({ fruit: top, mode: 'classic', scores });
        router.push(`/result?fruit=${top}&mode=classic`);
      } else {
        setCi(ci + 1);
        setSelected(null);
      }
    }, 350);
  }

  function prev() {
    if (selected !== null || ci === 0) return;
    setCi(ci - 1);
  }

  return (
    <div className="container">
      <div className="card">
        <div className="progress-wrap">
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${Math.round((done / qs.length) * 100)}%` }} />
          </div>
          <span className="progress-text">{done}/8</span>
        </div>

        <div className="q-number">Q{ci + 1}</div>
        <div className="q-text">{q.q}</div>

        <div className="options">
          {q.o.map((opt, i) => (
            <div
              key={i}
              className={`option${selected === i ? ' selected' : ''}`}
              onClick={() => choose(i)}
            >
              <span className="key">{String.fromCharCode(65 + i)}</span>
              {opt.l}
            </div>
          ))}
        </div>

        <div className="btn-row">
          <button
            className="btn btn-secondary"
            onClick={prev}
            style={{ visibility: ci === 0 ? 'hidden' : 'visible' }}
          >
            ← 上一步
          </button>
        </div>
      </div>
      <div className="footer">FBTI</div>
    </div>
  );
}
