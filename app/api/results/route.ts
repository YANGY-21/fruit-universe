import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { FRUIT_KEYS, type FruitKey } from '@/data/fruits';

/** 测试完成后前端上报结果 */
export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try {
    body = (await req.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ ok: false, error: 'bad_json' }, { status: 400 });
  }

  const { fruit, mode, province, scores } = body;
  if (typeof fruit !== 'string' || !FRUIT_KEYS.includes(fruit as FruitKey)) {
    return NextResponse.json({ ok: false, error: 'bad_fruit' }, { status: 400 });
  }
  if (mode !== 'classic' && mode !== 'ai') {
    return NextResponse.json({ ok: false, error: 'bad_mode' }, { status: 400 });
  }
  if (province !== undefined && (typeof province !== 'string' || province.length > 20)) {
    return NextResponse.json({ ok: false, error: 'bad_province' }, { status: 400 });
  }

  try {
    await sql`
      INSERT INTO results (fruit_type, mode, province, score_breakdown)
      VALUES (
        ${fruit},
        ${mode},
        ${typeof province === 'string' ? province : null},
        ${scores && typeof scores === 'object' ? scores : null}
      )
    `;
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('save result error:', err);
    return NextResponse.json({ ok: false, error: 'db' }, { status: 500 });
  }
}
