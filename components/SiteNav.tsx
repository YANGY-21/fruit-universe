'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const LINKS = [
  { href: '/quiz', label: '测试' },
  { href: '/judge', label: 'AI 考官' },
  { href: '/planet', label: '星球' },
];

/** 全局顶部导航：所有页面共享，当前页高亮 */
export default function SiteNav() {
  const pathname = usePathname();

  return (
    <nav className="site-nav">
      <div className="site-nav-inner">
        <Link href="/" className="site-nav-logo">
          🍉 水果星球
        </Link>
        <div className="site-nav-links">
          {LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`site-nav-link${pathname === l.href ? ' active' : ''}`}
            >
              {l.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
