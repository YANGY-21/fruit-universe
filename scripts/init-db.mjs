// 一次性脚本：建 results + ai_usage 两张表
// 运行：node --env-file=.env.local scripts/init-db.mjs
import { neon } from '@neondatabase/serverless';

const url = process.env.POSTGRES_URL;
if (!url) {
  console.error('❌ 缺少 POSTGRES_URL，请先配到 .env.local');
  process.exit(1);
}

const sql = neon(url);

async function main() {
  await sql`
    CREATE TABLE IF NOT EXISTS results (
      id BIGSERIAL PRIMARY KEY,
      fruit_type TEXT NOT NULL,
      mode TEXT NOT NULL DEFAULT 'classic',
      province TEXT,
      score_breakdown JSONB,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now()
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS ai_usage (
      day DATE PRIMARY KEY,
      calls INTEGER NOT NULL DEFAULT 0
    )
  `;

  console.log('✅ 建表完成');
  const tables = await sql`
    SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'
  `;
  console.log('当前表:', tables.map((r) => r.table_name).join(', '));
}

main().catch((e) => {
  console.error('❌ 建表失败:', e?.message || e);
  process.exit(1);
});
