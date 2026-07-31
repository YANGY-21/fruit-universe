import 'server-only';
import { neon } from '@neondatabase/serverless';

const url = process.env.POSTGRES_URL;
if (!url) throw new Error('POSTGRES_URL 未配置');
export const sql = neon(url);
