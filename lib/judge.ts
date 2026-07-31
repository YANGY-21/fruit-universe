import { FRUITS, FRUIT_KEYS, type Fruit, type FruitKey } from '@/data/fruits';

/** 最多追问到第几轮；第 6 轮时若还在问，服务端会强制要求下诊断 */
export const MAX_ROUNDS = 6;

/** 收敛三层保险：① JSON 模式 ② prompt 显式枚举 ③ 这里代码校验+兜底 */

export type JudgeResult =
  | { type: 'question'; question: string; reason: string }
  | { type: 'verdict'; fruit: FruitKey; reason: string; confidence: number }
  | { type: 'invalid' };

/** 把一个水果压成一行精简人设：人格要点 + 水果象征（让 verdict 能解释「为什么是它」） */
export function buildPersona(f: Fruit): string {
  const firstLine = f.diagnosis.replace(/<br>/g, '').split(/[。！？]/)[0];
  return `${f.emoji} ${f.name}（${f.tag}）：${f.traits.map((t) => t.title).join(' / ')}；${firstLine}；象征：${f.why}`;
}

export function buildSystemPrompt(): string {
  const personaLines = FRUIT_KEYS.map((k) => buildPersona(FRUITS[k])).join('\n');
  return [
    '你是「水果星球」的AI考官，负责通过对话判断对方属于 14 种水果人格中的哪一种。',
    '人格清单（用于判断依据）：',
    personaLines,
    '',
    '判定规则：',
    '1. 每轮只问一个问题，根据回答逐渐收窄；问题要口语化、贴近中国大学生、带一点"确诊式"戏谑感。',
    '2. 每次调用只输出一个严格 JSON 对象，不要输出任何其他文字。',
    '3. 如果还需追问，输出：{"type":"question","question":"追问的话","reason":"为什么这样问"}',
    '4. 如果已能判断，输出：{"type":"verdict","fruit":"<水果key>","reason":"完整的推理过程：先列出对方哪些回答指向这种人格，再结合该水果的象征，明确写出「你之所以是[水果名]，是因为[象征]」，把对方的行为和水果寓意连起来","confidence":0.85}',
    '5. fruit 字段只能是以下之一：' + FRUIT_KEYS.join(', '),
    `6. 最多追问到累计 ${MAX_ROUNDS} 轮就必须给出 verdict。`,
  ].join('\n');
}

/** 容忍模型返回中文名（如 "苹果" → apple），或返回未知内容 */
export function normalizeFruitKey(raw: unknown): FruitKey | null {
  if (typeof raw !== 'string') return null;
  const key = raw.trim().toLowerCase() as FruitKey;
  if ((FRUIT_KEYS as string[]).includes(key)) return key;
  const byName = Object.values(FRUITS).find((f) => raw.trim() === f.name || raw.includes(f.name));
  return byName ? byName.key : null;
}

/** 解析模型返回文本 → 结构化结果；解析失败返回 invalid（触发重试/兜底） */
export function parseJudgeResponse(text: string): JudgeResult {
  try {
    const cleaned = text
      .trim()
      .replace(/^```(?:json)?\s*/, '')
      .replace(/```$/, '')
      .trim();
    const obj: unknown = JSON.parse(cleaned);

    if (obj && typeof obj === 'object') {
      const o = obj as Record<string, unknown>;
      if (o.type === 'verdict') {
        const fruit = normalizeFruitKey(o.fruit);
        if (fruit) {
          return {
            type: 'verdict',
            fruit,
            reason: String(o.reason ?? ''),
            confidence: typeof o.confidence === 'number' ? o.confidence : 0.5,
          };
        }
        return { type: 'invalid' };
      }
      if (o.type === 'question' && typeof o.question === 'string' && o.question.trim().length > 0) {
        return { type: 'question', question: o.question.trim(), reason: String(o.reason ?? '') };
      }
    }
    return { type: 'invalid' };
  } catch {
    return { type: 'invalid' };
  }
}

/** 最后兜底：绝不把报错抛给玩家 */
export function fallbackVerdict(): JudgeResult {
  return {
    type: 'verdict',
    fruit: 'apple',
    reason: '本次推理没能完全锁定，先给你发了最稳的一张牌：苹果。',
    confidence: 0.1,
  };
}
