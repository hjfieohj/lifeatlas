type Status = { authenticated?: boolean; ready?: boolean; missing?: string[]; connected?: boolean; email?: string; signInUrl?: string };
type Scan = { mails: { id: string; subject: string; from: string; date: string; snippet: string; category: string; reason: string; originalUrl: string }[]; failedCount: number; truncated: boolean; scannedAt: string };
const escape = (s: unknown) => String(s ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]!));
class ReadError extends Error { constructor(message: string, public status: number) { super(message); } }
export function mountRealGmailPanel(panel: HTMLElement): () => void {
  const controller = new AbortController();
  let status: Status | null = null, scan: Scan | null = null, busy = true, message = '', stale = false;
  async function request<T>(path: string, method = 'GET'): Promise<T> {
    const r = await fetch(`/api/gmail/${path}`, { method, credentials: 'same-origin', cache: 'no-store', redirect: 'error', signal: controller.signal });
    let data: { signInUrl?: string; error?: { message?: string } };
    try { data = await r.json() as typeof data; }
    catch { throw new Error('服务端返回异常，请刷新或登录后重试。'); }
    if (!r.ok) {
      if (data.signInUrl) status = { authenticated: false, signInUrl: data.signInUrl };
      if ([401,403].includes(r.status)) scan = null;
      throw new ReadError(data.error?.message || '请求未完成，请稍后重试。', r.status);
    }
    return data as T;
  }
  function render() {
    if (controller.signal.aborted) return;
    const labels: Record<string,string> = { APP_ORIGIN:'应用回调地址', GOOGLE_CLIENT_ID:'Google 客户端 ID', GOOGLE_CLIENT_SECRET:'Google 客户端密钥', TOKEN_ENCRYPTION_KEY:'服务端加密密钥', DB:'服务端数据库' };
    const connected = status?.connected;
    panel.innerHTML = `<section class="settings-section real-panel" aria-label="真实 Gmail 只读连接"><div class="section-heading"><h2>真实 Gmail · 只读接入</h2><span class="category">${busy ? '正在检查' : connected ? '已连接 · 只读' : status?.ready ? '待连接' : '配置尚未完成'}</span></div><p class="muted">演示与真实邮箱分开。Google 只读权限覆盖邮箱，本产品将读取限制在最近 7 天收件箱、最多 100 封的主题与摘要；不读取附件，不发送给 AI，不执行归档。</p>${status && !status.ready && status.authenticated !== false ? `<p class="real-config-note">还需配置：${(status.missing || []).map(k => escape(labels[k] || k)).join('、')}。代码已就绪，配置完成后才会出现可用的连接入口。</p>` : ''}${connected ? `<p class="real-email">连接账户：${escape(status?.email)}</p><div class="inline-buttons"><button class="button primary" data-real="scan" ${busy ? 'disabled' : ''}>${busy ? '正在读取…' : '读取最近 7 天（最多 100 封）'}</button><button class="button subtle" data-real="disconnect" ${busy ? 'disabled' : ''}>断开真实邮箱</button></div>` : status?.authenticated === false ? '<a class="button primary" href="/signin-with-chatgpt?return_to=%2F%23settings" target="_top">登录生活空间</a>' : `<form method="post" action="/api/gmail/connect" target="_top"><button class="button primary" type="submit" ${!status?.ready || busy ? 'disabled' : ''}>连接 Gmail（只读）</button></form>`}<div class="real-feedback" role="status">${escape(message || (busy ? '正在检查服务端连接状态…' : ''))}</div>${scan ? `<div class="real-results"><h3>真实邮件预览 · ${scan.mails.length} 封 ${stale ? '（上次结果，已过时）' : ''}</h3><p class="muted small">${escape(scan.scannedAt)} · 仅本页内存，不写入演示缓存${scan.truncated ? ' · 已达到本次上限，仍有未读取内容' : ''}${scan.failedCount ? ` · ${scan.failedCount} 封读取失败，可稍后重试` : ''}</p>${scan.mails.length ? scan.mails.map(m => `<article class="real-mail"><div class="section-heading"><h3>${escape(m.subject)}</h3><span class="category ${m.category === 'protected' ? 'protected' : ''}">${m.category === 'protected' ? '受保护' : m.category === 'suggested' ? '规则初筛' : '待复核'}</span></div><p class="muted small">${escape(m.from)} · ${escape(m.date)}</p><p>${escape(m.snippet)}</p><p class="muted small">${escape(m.reason)}</p><a class="source-link" href="${safeMailUrl(m.originalUrl)}" target="_blank" rel="noopener noreferrer">在 Gmail 查看原邮件</a></article>`).join('') : '<p class="real-config-note">本次范围没有可显示的邮件，不会用演示数据填充。</p>'}</div>` : ''}</section>`;
  }
  panel.addEventListener('click', async event => {
    const action = (event.target as Element).closest<HTMLElement>('[data-real]')?.dataset.real;
    if (!action || busy) return;
    busy = true; message = ''; if (action === 'disconnect') scan = null; render();
    try {
      if (action === 'scan') { stale = !!scan; const data = await request<Scan>('scan','POST'); scan = data; stale = false; message = '只读预览已更新。分类仅为保守规则初筛，请核查原邮件。'; }
      if (action === 'disconnect') { const data = await request<{message:string}>('disconnect','POST'); scan = null; status = await request<Status>('status'); message = data.message; }
    } catch (err) {
      if (controller.signal.aborted) return;
      message = err instanceof Error ? err.message : '请求未完成。'; if (scan) stale = true;
      if (err instanceof ReadError && [401,403].includes(err.status)) { try { status = await request<Status>('status'); } catch { /* retain the explicit sign-in or error state */ } }
    }
    finally { busy = false; render(); }
  });
  render();
  request<Status>('status').then(data => { status = data; const result = new URL(location.href).searchParams.get('gmail'); if (result === 'connected') message = '只读授权已完成，点击读取才会获取邮件。'; if (result === 'denied') message = '此次授权已取消，未连接真实邮箱。'; }).catch(err => { if (!controller.signal.aborted) message = err instanceof Error ? err.message : '服务状态检查失败。'; }).finally(() => { busy = false; render(); });
  return () => { controller.abort(); scan = null; panel.replaceChildren(); };
}
function safeMailUrl(url: string) { try { const u = new URL(url); return u.protocol === 'https:' && u.hostname === 'mail.google.com' ? escape(u.href) : '#'; } catch { return '#'; } }
