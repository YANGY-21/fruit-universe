import type { Metadata } from 'next';
import './globals.css';
import SiteNav from '@/components/SiteNav';

export const metadata: Metadata = {
  title: '水果人格测试 FBTI',
  description: '水果星球 · Fruit Big Personality Inventory —— 不科学但有点准',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body>
        <SiteNav />
        {children}
      </body>
    </html>
  );
}
