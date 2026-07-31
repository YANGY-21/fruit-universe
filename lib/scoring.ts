import { FRUIT_KEYS, type FruitKey } from '@/data/fruits';
import type { Question } from '@/data/questions';

export interface ScoreResult {
  /** 14 种水果的得分，key 与 FRUIT_KEYS 顺序一致 */
  scores: Record<FruitKey, number>;
  /** 最高分人格 */
  top: FruitKey;
}

/**
 * 经典评分：加权累加取最高分。
 * 与旧版保持一致：平分时按 FRUIT_KEYS 顺序先出现者胜，
 * 避免依赖对象遍历顺序导致结果漂移。
 */
export function scoreTest(questions: Question[], answers: (number | null)[]): ScoreResult {
  const sc: Record<FruitKey, number> = {} as Record<FruitKey, number>;
  for (const k of FRUIT_KEYS) sc[k] = 0;

  questions.forEach((q, i) => {
    const idx = answers[i];
    if (idx === null || idx === undefined) return;
    const opt = q.o[idx];
    if (!opt) return;
    for (const [k, v] of Object.entries(opt.s)) {
      sc[k as FruitKey] = (sc[k as FruitKey] || 0) + (v as number);
    }
  });

  let mx = 0;
  let top: FruitKey = 'apple';
  for (const k of FRUIT_KEYS) {
    if (sc[k] > mx) {
      mx = sc[k];
      top = k;
    }
  }

  return { scores: sc, top };
}

/** 按得分降序排列的水果 key，用于成分图 */
export function sortedByScore(scores: Record<FruitKey, number>): FruitKey[] {
  return [...FRUIT_KEYS].sort((a, b) => scores[b] - scores[a]);
}

export function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export const QUIZ_COUNT = 8;
