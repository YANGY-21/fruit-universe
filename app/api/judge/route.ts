import { NextResponse } from 'next/server';
import { chatDeepSeek, type ChatMessage } from '@/lib/deepseek';
import {
  buildSystemPrompt,
  parseJudgeResponse,
  fallbackVerdict,
  MAX_ROUNDS,
  type JudgeResult,
} from '@/lib/judge';
import { sql } from '@/lib/db';

// 日预算存 DB（ai_usage 表），重启/冷启动不清零
const DAILY_LIMIT = 800;

async function takeFromBudget(): Promise<boolean> {
  try {
    // 用北京时间算"今天"，这样预算在凌晨零点重置，而不是 UTC 零点
    const today = new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Shanghai' });
    await sql`
      INSERT INTO ai_usage (day, calls)
      VALUES (${today}, 1)
      ON CONFLICT (day) DO UPDATE SET calls = ai_usage.calls + 1
    `;
    const rows = await sql`SELECT calls FROM ai_usage WHERE day = ${today}`;
    return Number(rows[0]?.calls ?? 0) <= DAILY_LIMIT;
  } catch (err) {
    // 计数连不上 DB 时放行，别让考官因为预算表挂掉
    console.error('budget error:', err);
    return true;
  }
}

interface JudgeBody {
  messages: ChatMessage[];
  round: number;
}

export async function POST(req: Request) {
  if (!(await takeFromBudget())) {
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
