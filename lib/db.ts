import 'server-only';
import { neon } from '@neondatabase/serverless';

let client: ReturnType<typeof neon> | null = null;

/** 惰性连接：只在真正查询时才检查 env 并建连接。
 *  构建期不会执行查询，所以缺 POSTGRES_URL 时构建不会崩（运行时才报错）。 */
function getClient() {
  if (!client) {
    const url = process.env.POSTGRES_URL;
    if (!url) throw new Error('POSTGRES_URL 未配置');
    client = neon(url);
  }
  return client;
}

export async function sql(
  strings: TemplateStringsArray,
  ...values: unknown[]
): Promise<Record<string, unknown>[]> {
  const rows = (await getClient()(strings, ...values)) as unknown;
  return rows as Record<string, unknown>[];
}
