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
      <div className="footer">FBTI</div>
    </div>
  );
}
