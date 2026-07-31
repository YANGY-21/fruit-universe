export interface SaveResultPayload {
  fruit: string;
  mode: 'classic' | 'ai';
  province?: string;
  scores?: Record<string, number>;
}

/** 测试完成后上报结果；失败静默，不影响跳转和体验 */
export async function saveResult(payload: SaveResultPayload): Promise<void> {
  try {
    await fetch('/api/results', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
  } catch {
    // 网络异常或服务器错误：忽略
  }
}
