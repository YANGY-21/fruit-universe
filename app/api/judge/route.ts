import { NextResponse } from 'next/server';
import { chatDeepSeek, type ChatMessage } from '@/lib/deepseek';
import {
  buildSystemPrompt,
  parseJudgeResponse,
  fallbackVerdict,
  MAX_ROUNDS,
  type JudgeResult,
} from '@/lib/judge';

// 简易内存日预算（MVP 妥协：serverless 冷启动会清零，上生产换成 DB 计数，见 ai_usage 表）
const DAY_MS = 24 * 60 * 60 * 1000;
const DAILY_LIMIT = 800;
let budget = { day: new Date().toDateString(), calls: 0 };

function takeFromBudget(): boolean {
  const today = new Date().toDateString();
  if (budget.day !== today) budget = { day: today, calls: 0 };
  budget.calls++;
  return budget.calls <= DAILY_LIMIT;
}

interface JudgeBody {
  messages: ChatMessage[];
  round: number;
}

export async function POST(req: Request) {
  if (!takeFromBudget()) {
    return NextResponse.json({ ok: false, error: 'rate_limit' }, { status: 429 });
  }

  let body: JudgeBody;
  try {
    body = (await req.json()) as JudgeBody;
  } catch {
    return NextResponse.json({ ok: false, error: 'bad_json' }, { status: 400 });
  }

  const { messages, round } = body;
  if (!Array.isArray(messages) || messages.length === 0 || messages.length > 16) {
    return NextResponse.json({ ok: false, error: 'bad_messages' }, { status: 400 });
  }
  if (!Number.isInteger(round) || round < 1 || round > MAX_ROUNDS) {
    return NextResponse.json({ ok: false, error: 'bad_round' }, { status: 400 });
  }

  const system: ChatMessage = { role: 'system', content: buildSystemPrompt() };

  let result: JudgeResult;
  try {
    let out = parseJudgeResponse(await chatDeepSeek([system, ...messages]));

    // 兜底链路①：解析失败 → 追加一条提示重试一次
    if (out.type === 'invalid') {
      out = parseJudgeResponse(
        await chatDeepSeek([
          system,
          ...messages,
          { role: 'user', content: '请只输出合法 JSON，fruit 必须是 14 个 key 之一。' },
        ])
      );
    }

    // 兜底链路②：已到轮数上限还在追问 → 强制要求下诊断
    if (out.type === 'question' && round >= MAX_ROUNDS) {
      out = parseJudgeResponse(
        await chatDeepSeek([
          system,
          ...messages,
          { role: 'user', content: '你现在必须给出最终判断，只输出 verdict JSON。' },
        ])
      );
    }

    // 兜底链路③：仍失败 → 直接发兜底结果
    if (out.type === 'invalid') out = fallbackVerdict();
    result = out;
  } catch (err) {
    // 网络异常 / key 未配置：绝不把报错抛给玩家
    console.error('judge error:', err);
    result = fallbackVerdict();
  }

  return NextResponse.json({ ok: true, round: round + 1, data: result });
}
