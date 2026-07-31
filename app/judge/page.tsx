'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import ChatBubble from '@/components/ChatBubble';
import { MAX_ROUNDS } from '@/lib/judge';
import { saveResult } from '@/lib/saveResult';

interface Msg {
  role: 'user' | 'assistant';
  content: string;
}

interface JudgeData {
  type: 'question' | 'verdict';
  question?: string;
  fruit?: string;
  reason?: string;
}

/** AI 考官聊天页：前端只发对话历史，模型逻辑和 key 都在服务端 */
export default function JudgePage() {
  const router = useRouter();
  const [messages, setMessages] = useState<Msg[]>([]);
  const [round, setRound] = useState(1);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);

  async function ask(history: Msg[], roundToSend: number) {
    setLoading(true);
    try {
      const res = await fetch('/api/judge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: history, round: roundToSend }),
      });
      const json = (await res.json()) as { ok: boolean; error?: string; round?: number; data?: JudgeData };
      if (!json.ok) throw new Error(json.error || 'judge failed');

      const data = json.data;
      const question = data?.question;
      if (data?.type === 'question' && question) {
        setMessages((m) => [...m, { role: 'assistant', content: question }]);
        setRound(json.round ?? 1);
      } else if (data?.type === 'verdict' && data.fruit) {
        sessionStorage.setItem(
          'fruit-universe:result',
          JSON.stringify({ fruit: data.fruit, mode: 'ai' })
        );
        saveResult({ fruit: data.fruit, mode: 'ai' });
        const reason = data.reason ? encodeURIComponent(data.reason) : '';
        router.push(`/result?fruit=${data.fruit}&mode=ai&reason=${reason}`);
      }
    } catch {
      setMessages((m) => [
        ...m,
        { role: 'assistant', content: '考官走神了，换个问题再试一次？' },
      ]);
    } finally {
      setLoading(false);
    }
  }

  // 首次进入：让考官先开口
  useEffect(() => {
    ask([{ role: 'user', content: '开始吧' }], 1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 新消息或加载时自动滚到底部
  useEffect(() => {
    const el = listRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages, loading]);

  function submit() {
    const text = input.trim();
    if (!text || loading) return;
    setInput('');
    const next = [...messages, { role: 'user' as const, content: text }];
    setMessages(next);
    ask(next, round);
  }

  return (
    <div className="container">
      <div className="card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px' }}>
        <div>
          <div style={{ fontWeight: 700 }}>AI 考官</div>
          <div style={{ fontSize: 12, color: '#bbb', marginTop: 2 }}>
            {round > MAX_ROUNDS ? `第 ${MAX_ROUNDS}/${MAX_ROUNDS} 轮` : `第 ${round}/${MAX_ROUNDS} 轮`} · 聊几句就能锁定你的水果人格
          </div>
        </div>
        <a href="/" className="btn btn-outline" style={{ width: 'auto', padding: '8px 14px', fontSize: 13, textDecoration: 'none' }}>
          返回
        </a>
      </div>

      <div className="card" style={{ padding: '16px 16px 20px' }}>
        <div className="chat-list" ref={listRef}>
          {messages.map((m, i) => (
            <ChatBubble key={i} role={m.role}>
              {m.content}
            </ChatBubble>
          ))}
          {loading && <div className="chat-typing">考官思考中…</div>}
        </div>

        <div className="chat-input-row">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && submit()}
            placeholder="自由回答，想说什么都行…"
            disabled={loading}
          />
          <button className="btn btn-primary" onClick={submit} disabled={loading} style={{ width: 'auto', padding: '12px 18px' }}>
            发送
          </button>
        </div>
      </div>

      <div className="footer">FBTI · AI 考官</div>
    </div>
  );
}
