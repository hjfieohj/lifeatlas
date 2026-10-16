import '../src/style.css';
export const metadata = { title: 'LifeAtlas · 生活全图', description: '每日简报与可确认邮箱整理。真实 Gmail 接入先从只读开始。', icons: { icon: '/favicon.svg' } };
export default function Layout({ children }: { children: React.ReactNode }) {
  return <html lang="zh-CN"><body>{children}</body></html>;
}
