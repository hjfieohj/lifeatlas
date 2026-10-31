import '../src/style.css';
import '../src/growth.css';
import '../src/skins.css';
import '../src/growth-presentation.css';
import '../src/reading-room.css';
import '../src/guidance-integration.css';
import '../src/uiverse-system.css';
import '../src/investment.css';
import '../src/optional-modules.css';
export const metadata = { title: 'LifeAtlas · 生活全图', description: '每日简报、邮箱整理与个人成长：持续观察、反思与回看生活中的变化。', icons: { icon: '/favicon.svg' } };
export default function Layout({ children }: { children: React.ReactNode }) {
  return <html lang="zh-CN"><body>{children}</body></html>;
}
