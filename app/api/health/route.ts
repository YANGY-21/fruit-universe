import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';

/** 健康检查：报告环境变量与数据库连通性。只暴露布尔值，不泄露任何密钥。 */
export async function GET() {
  const hasPostgresUrl = !!process.env.POSTGRES_URL;
  const hasDeepseekKey = !!process.env.DEEPSEEK_API_KEY;

  let db: 'ok' | 'missing_env' | 'error' = 'missing_env';
  if (hasPostgresUrl) {
    try {
      await sql`SELECT 1`;
      db = 'ok';
    } catch (err) {
      console.error('health db error:', err);
      db = 'error';
    }
  }

  return NextResponse.json({
    ok: db === 'ok',
    env: { postgres_url: hasPostgresUrl, deepseek_key: hasDeepseekKey },
    db,
  });
}
