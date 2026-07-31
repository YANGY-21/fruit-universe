import 'server-only';

const BASE_URL = 'https://api.deepseek.com';

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

/**
 * 调用 DeepSeek（OpenAI 兼容接口），返回模型输出的文本。
 * 只在服务端被调用：key 从环境变量读，绝不会进浏览器。
 */
export async function chatDeepSeek(
  messages: ChatMessage[],
  opts?: { max_tokens?: number }
): Promise<string> {
  const key = process.env.DEEPSEEK_API_KEY;
  if (!key) {
    throw new Error('DEEPSEEK_API_KEY 未配置');
  }

  const res = await fetch(`${BASE_URL}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${key}`,
    },
    body: JSON.stringify({
      model: 'deepseek-chat',
      messages,
      response_format: { type: 'json_object' },
      max_tokens: opts?.max_tokens ?? 300,
      temperature: 0.7,
    }),
  });

  if (!res.ok) {
    throw new Error(`DeepSeek HTTP ${res.status}: ${await res.text()}`);
  }

  const data = await res.json();
  const content: unknown = data?.choices?.[0]?.message?.content;
  if (typeof content !== 'string') {
    throw new Error('DeepSeek 未返回内容');
  }
  return content;
}
