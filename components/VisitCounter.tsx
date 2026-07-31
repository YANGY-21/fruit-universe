'use client';

import { useEffect, useRef } from 'react';

declare global {
  interface Window {
    busuanzi?: { site_pv?: string };
  }
}

/** 不蒜子访客数：注入脚本后轮询 busuanzi.site_pv */
export default function VisitCounter() {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const script = document.createElement('script');
    script.src = 'https://busuanzi.icodeq.com/busuanzi.pure.mini.js';
    script.async = true;
    script.onload = () => {
      const update = () => {
        if (window.busuanzi) el.textContent = window.busuanzi.site_pv || '...';
      };
      update();
      setInterval(update, 5000);
    };
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return <span ref={ref}>0</span>;
}
