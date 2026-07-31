import Link from 'next/link';
import VisitCounter from '@/components/VisitCounter';

export default function Home() {
  return (
    <div className="container">
      <div className="card start">
        <span className="start-emoji">🍉</span>
        <div className="start-title">水果人格测试</div>
        <div className="start-sub">Fruit Big Personality Inventory</div>
        <div className="start-meta">
          8 道题 · 不科学 · 已被 <VisitCounter /> 人测试
        </div>
        <Link href="/quiz" className="btn btn-primary" style={{ textDecoration: 'none' }}>
          开始测试
        </Link>
      </div>

      <div className="card" style={{ padding: '22px 24px' }}>
        <div style={{ fontSize: 17, fontWeight: 700 }}>AI 考官 🤖</div>
        <div style={{ fontSize: 13, color: '#aaa', lineHeight: 1.8, margin: '8px 0 16px' }}>
          不答题，跟 AI 聊几句。它根据你的回答实时追问，最后推理出你是哪种水果——更像真人面试，结果更稳。
        </div>
        <Link href="/judge" className="btn btn-secondary" style={{ textDecoration: 'none' }}>
          和 AI 考官聊聊
        </Link>
      </div>
      <div className="footer">FBTI</div>
    </div>
  );
}
