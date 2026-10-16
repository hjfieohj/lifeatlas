import { seedStore, prepare, prepareRestore, execute, reconcile, cancel, isEligible, isProtected, quietNow, OWNER } from './domain';
import type { Store, Mail, Task, Scenario } from './domain';
import { mountRealGmailPanel } from './real-gmail';

export function mountLifeAtlas() {
let realCleanup: (() => void) | undefined;
const lifetime = new AbortController();
function listen(target: EventTarget, type: string, handler: EventListener) { target.addEventListener(type, handler, { signal: lifetime.signal }); }

const key = 'lifeatlas-demo-v1';
let store: Store = seedStore();
let storageWarning = '';
try { const raw = localStorage.getItem(key); if (raw) { const saved = JSON.parse(raw); if (saved.version === 1 && saved.owner === OWNER && Array.isArray(saved.mails) && Array.isArray(saved.tasks)) store = saved; } } catch { storageWarning = '无法读取本地演示记录，已重新载入示例。'; }
let page = ['today', 'mail', 'history', 'settings'].includes(location.hash.slice(1)) ? location.hash.slice(1) : 'today';
let filter = 'suggested', search = '', selected = new Set<string>(), expanded: string | null = null;
let scenario: Scenario = 'success', processing = false, toastTimer: ReturnType<typeof setTimeout>;
const root = document.querySelector<HTMLDivElement>('#app')!;
const dialog = document.querySelector<HTMLDialogElement>('#modal')!;
const esc = (s: string | number) => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]!));
const icons: Record<string, string> = {
  sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.4 1.4m11.2 11.2L19 19M5 19l1.4-1.4M17.6 6.4 19 5"/>',
  mail: '<rect x="3" y="5" width="18" height="14" rx="3"/><path d="m3 7 9 6 9-6"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  settings: '<path d="M4 7h16M4 17h16"/><circle cx="9" cy="7" r="3"/><circle cx="15" cy="17" r="3"/>',
  arrow: '<path d="M5 12h14m-5-5 5 5-5 5"/>',
  shield: '<path d="m12 3 8 3v5c0 5-8 10-8 10S4 16 4 11V6z"/><path d="m8 12 3 3 5-6"/>',
  check: '<path d="m5 12 4 4L19 6"/>',
  archive: '<rect x="4" y="8" width="16" height="12" rx="2"/><path d="M3 4h18v4H3zM10 12h4"/>',
  search: '<circle cx="10" cy="10" r="6"/><path d="m15 15 5 5"/>',
  undo: '<path d="m8 4-5 5 5 5M3 9h10a6 6 0 0 1 0 12"/>',
  link: '<path d="m9 15 6-6M8 17l-1 1a4 4 0 0 1-6-6l4-4a4 4 0 0 1 6 0m2-1 1-1a4 4 0 0 1 6 6l-4 4a4 4 0 0 1-6 0" transform="translate(1 -1)"/>',
  close: '<path d="m6 6 12 12M6 18 18 6"/>',
  leaf: '<path d="M20 4C8 2 2 7 5 15c8 4 14-2 15-11ZM4 21 16 9"/>',
};
const icon = (name: string, cls = '') => `<svg class="icon ${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${icons[name] || icons.mail}</svg>`;
const statusText: Record<string, string> = { awaiting: '待确认', running: '执行中', succeeded: '已完成', partial: '部分成功', failed: '未完成', unknown: '待核对', cancelled: '已取消' };
const categoryText: Record<string, string> = { promotion: '推广', subscription: '订阅', action: '待处理', protected: '受保护' };
function save() { try { localStorage.setItem(key, JSON.stringify(store)); } catch { storageWarning = '当前浏览器无法保存演示记录，关闭页面后可能丢失。'; } }
function toast(text: string) { const el = document.querySelector<HTMLDivElement>('#toast')!; el.textContent = text; el.classList.add('show'); clearTimeout(toastTimer); toastTimer = setTimeout(() => el.classList.remove('show'), 4200); }
function date() { return new Intl.DateTimeFormat('zh-CN', { timeZone: store.preferences.timezone, month: 'long', day: 'numeric', weekday: 'long' }).format(new Date()); }
function nav(id: string, label: string, name: string) { return `<a href="#${id}" class="nav-item ${page === id ? 'active' : ''}" ${page === id ? 'aria-current="page"' : ''}>${icon(name)}<span>${label}</span>${id === 'mail' ? `<span class="nav-count">${store.connected ? store.mails.filter(isEligible).length : '—'}</span>` : ''}</a>`; }
function shell(content: string) {
  return `<aside class="sidebar"><a href="#today" class="brand"><span class="brand-mark"><svg viewBox="0 0 32 32" fill="none" aria-hidden="true"><path d="M8 5v22h17M17 5v14h8" stroke="currentColor" stroke-width="2"/></svg></span><span>LifeAtlas<small>生活全图</small></span></a><nav aria-label="主导航">${nav('today', '今日', 'sun')}${nav('mail', '邮箱整理', 'mail')}${nav('history', '任务记录', 'clock')}${nav('settings', '偏好设置', 'settings')}</nav><div class="sidebar-bottom"><div class="quiet">${icon('leaf')}<span>给重要的事，留一点空。</span></div><div class="profile"><span class="avatar">我</span><div>我的生活空间<small>个人试用 · 交互原型</small></div></div></div></aside><div class="workspace"><header class="topbar"><span class="breadcrumb">我的空间 <span>/</span> ${{ today: '今日', mail: '邮箱整理', history: '任务记录', settings: '偏好设置' }[page]}</span><span class="demo-badge"><span></span>演示数据</span></header><div class="prototype-notice">简报与归档仍为演示模式；真实邮箱可在设置中单独连接和只读预览。<a href="#settings">查看连接状态 ${icon('arrow')}</a></div>${storageWarning ? `<div role="alert" class="notice error">${esc(storageWarning)}</div>` : ''}<main id="main" tabindex="-1">${content}</main><footer>LifeAtlas · 生活全图<span>主动准备，由你决定。</span></footer></div>`;
}
function disconnected() { return `<div class="empty"><span class="empty-icon">${icon('link')}</span><h2>演示邮箱已断开</h2><p>重新启用虚构邮件，即可继续体验简报与整理流程。</p><button class="button primary" data-action="connect">启用演示邮箱 ${icon('arrow')}</button></div>`; }
function today() {
  const suggestions = store.connected ? store.mails.filter(isEligible) : [];
  const actions = store.connected ? store.mails.filter(m => m.category === 'action') : [];
  return `<div class="page-heading"><div><p class="date">${esc(date())}</p><h1>今天，轻一点。</h1><p class="intro">先看重要的，再决定什么值得花时间。</p></div><button class="button subtle" data-action="refresh">${icon('sun')} 重新查看简报</button></div><div class="today-grid"><div class="primary-column"><section class="brief-section"><div class="section-heading"><h2>你的今日简报</h2><span class="muted">来自虚构演示邮件</span></div>${!store.connected ? disconnected() : `<article class="brief-lead"><span class="round-icon">${icon('mail')}</span><div><h3>有 ${actions.length} 件事，值得你亲自决定</h3><p>私人邀约和方案反馈留在待处理区。订单与账户安全邮件受到保护，不进入批量整理。</p><button class="text-button" data-action="view-actions">查看待处理邮件 ${icon('arrow')}</button></div></article><div class="brief-list">${actions.map((m, i) => `<article class="brief-row"><span class="brief-index">${String(i + 1).padStart(2, '0')}</span><div><h3>${esc(m.subject)}</h3><p>${esc(m.preview)}</p><button class="source-link" data-detail="${m.id}">演示邮件 · ${esc(m.sender)} ${icon('arrow')}</button></div></article>`).join('')}</div><div class="source-note">${icon('link')}本页不展示实时新闻或 AI 进展。偏好设置中的栏目仅预览开关，不会抓取资讯。</div>`}</section><section class="prepare-panel"><div><h2>${suggestions.length ? '几封邮件，可以轻轻放下。' : '收件箱，清爽了一点。'}</h2><p>${suggestions.length ? `已准备 ${suggestions.length} 封推广与订阅建议。你可以先看理由，再决定是否归档。` : '目前没有待整理的演示邮件。已归档内容可在任务记录中恢复。'}</p><a class="button primary" href="#${suggestions.length ? 'mail' : 'history'}">${suggestions.length ? '查看整理建议' : '查看任务记录'} ${icon('arrow')}</a></div><div class="prepare-stack" aria-hidden="true"><div>${icon('mail')}<span>准备建议</span>${icon('check')}</div><div>${icon('shield')}<span>等你确认</span><span class="small-dot"></span></div><div>${icon('archive')}<span>逐项留痕</span></div></div></section></div><aside class="secondary-column"><section class="decision-section"><h2>今天的整理</h2><div class="decision-line"><span>建议归档</span><strong>${suggestions.length} <small>封</small></strong></div><div class="decision-line"><span>保留待处理</span><strong>${actions.length} <small>封</small></strong></div><div class="decision-line"><span>受保护邮件</span><strong>${store.connected ? store.mails.filter(m => m.category === 'protected').length : 0} <small>封</small></strong></div><p class="muted small">基于本次演示样本，非真实邮箱统计。</p></section><section class="connection-section"><div class="section-heading"><h2>连接与权限</h2>${icon('shield')}</div><span class="connection-label"><span class="status-dot ${!store.connected ? 'off' : ''}"></span>${store.connected ? '演示邮箱已启用' : '演示邮箱已断开'}</span><p>此处仅为演示邮箱。当前${store.writeEnabled ? '已开启本地演示操作' : '仅允许查看建议'}。</p><a class="text-button" href="#settings">管理连接 ${icon('arrow')}</a></section><section class="quiet-section">${icon('leaf')}<h2>不必把每一分钟填满</h2><p>简报时间 ${esc(store.preferences.time)}<br>免打扰 ${esc(store.preferences.quietStart)}—${esc(store.preferences.quietEnd)}</p><span class="muted small">原型不运行后台调度或发送通知。</span></section></aside></div>`;
}
function visibleMails() {
  return store.mails.filter(m => {
    const matches = filter === 'suggested' ? isEligible(m) : filter === 'protected' ? isProtected(m) : !m.labels.includes('INBOX');
    return matches && `${m.sender} ${m.subject} ${m.preview}`.toLowerCase().includes(search.toLowerCase());
  });
}
function mailRow(m: Mail) {
  const selectable = isEligible(m) && filter === 'suggested';
  return `<article class="mail-row ${selected.has(m.id) ? 'selected' : ''}"><div class="row-top">${selectable ? `<input type="checkbox" aria-label="选择 ${esc(m.subject)}" data-select="${m.id}" ${selected.has(m.id) ? 'checked' : ''}>` : `<span class="row-lock">${icon(isProtected(m) ? 'shield' : 'archive')}</span>`}<span class="sender-avatar tone-${m.category}">${esc(m.sender.slice(0, 1))}</span><button class="mail-main" data-expand="${m.id}" aria-expanded="${expanded === m.id}"><span class="sender-line"><strong>${esc(m.sender)}</strong><span>${esc(m.time)}</span></span><span class="subject">${esc(m.subject)}</span><span class="mail-preview">${esc(m.preview)}</span></button><span class="category ${m.category}">${categoryText[m.category]}</span></div><div class="reason-row">${icon(isProtected(m) ? 'shield' : 'leaf')}<span>${esc(m.reason)}</span><button class="source-link" data-detail="${m.id}">查看示例 ${icon('arrow')}</button></div>${expanded === m.id ? `<div class="mail-expanded"><p>${esc(m.preview)}</p><span>${esc(m.address)} · 仅为演示，不存在真实原邮件</span></div>` : ''}</article>`;
}
function mail() {
  const count = store.mails.filter(isEligible).length;
  const tabs: Array<[string, string, number]> = [['suggested', '建议归档', count], ['protected', '待处理与保护', store.mails.filter(isProtected).length], ['archived', '已归档', store.mails.filter(m => !m.labels.includes('INBOX')).length]];
  return `<div class="page-heading"><div><h1>邮箱整理</h1><p class="intro">看清理由，再把不急的事暂时放下。</p></div><span class="scope">虚构样本 · ${store.mails.length} 封</span></div>${!store.connected ? disconnected() : `<div class="mail-toolbar"><div class="tabs" role="tablist" aria-label="邮件分类">${tabs.map(([id, label, n]) => `<button role="tab" aria-selected="${filter === id}" class="tab ${filter === id ? 'active' : ''}" data-filter="${id}">${label}<span>${n}</span></button>`).join('')}</div><label class="search">${icon('search')}<input id="search" type="search" placeholder="搜索发件人或主题" aria-label="搜索发件人或主题" value="${esc(search)}"></label></div><div class="protection-note">${icon('shield')}账户安全、订单和待回复邮件不参与批量归档。归档仅移出收件箱，保留邮件及已读状态。</div><div id="mail-list">${mailList()}</div><div class="selection-bar"><label class="select-all"><input id="select-all" type="checkbox" ${visibleMails().filter(isEligible).length && visibleMails().filter(isEligible).every(m => selected.has(m.id)) ? 'checked' : ''} ${filter !== 'suggested' || !visibleMails().length ? 'disabled' : ''}>选择当前结果</label><span id="selection-count">已选 ${selected.size} 封</span><button id="review-button" class="button primary" data-action="review" ${!selected.size ? 'disabled' : ''}>查看并确认 ${icon('arrow')}</button></div>`}`;
}
function mailList() { const mails = visibleMails(); return mails.length ? mails.map(mailRow).join('') : `<div class="empty"><span class="empty-icon">${icon('check')}</span><h2>${search ? '没有找到匹配的邮件' : filter === 'suggested' ? '暂时没有需要整理的邮件' : '这里还没有邮件'}</h2><p>${search ? '试试更短的关键词，或清空搜索。' : '你可以切换分类，或在任务记录中查看之前的操作。'}</p>${search ? '<button class="button subtle" data-action="clear-search">清空搜索</button>' : '<a class="text-button" href="#history">查看任务记录</a>'}</div>`; }
function taskCard(t: Task) {
  const success = t.items.filter(i => i.status === 'succeeded').length;
  const restored = new Set(store.tasks.filter(x => x.kind === 'restore' && x.originalId === t.id).flatMap(x => x.items.filter(i => i.status === 'succeeded').map(i => i.mailId)));
  const recoverable = t.kind === 'archive' && t.items.some(i => i.status === 'succeeded' && !restored.has(i.mailId));
  return `<article class="task-row"><div class="task-title"><span class="task-symbol">${icon(t.kind === 'archive' ? 'archive' : 'undo')}</span><div><h2>${t.kind === 'archive' ? '归档演示邮件' : '恢复演示邮件'} · ${t.items.length} 封</h2><p>${new Intl.DateTimeFormat('zh-CN', { timeZone: store.preferences.timezone, month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit' }).format(new Date(t.createdAt))} · ${t.confirmedAt ? `成功 ${success} 封` : '尚未执行，不会改变邮件'}</p></div><span class="task-status ${t.status}">${statusText[t.status]}</span></div><ul class="task-items">${t.items.map(i => `<li><span>${esc(i.subject)}</span><small class="item-${i.status}">${esc(i.detail)}</small></li>`).join('')}</ul><div class="task-actions">${t.status === 'unknown' ? `<button class="button subtle" data-reconcile="${t.id}">核对演示结果</button>` : ''}${recoverable ? `<button class="button subtle" data-restore="${t.id}">${icon('undo')} 恢复已成功归档的邮件</button>` : ''}${restored.size ? '<span class="muted small">已有邮件通过关联任务恢复</span>' : ''}</div></article>`;
}
function history() { return `<div class="page-heading"><div><h1>任务记录</h1><p class="intro">每一次确认、执行与恢复，都有来处。</p></div><span class="scope">仅当前浏览器的演示记录</span></div>${store.tasks.length ? `<div class="task-list">${store.tasks.map(taskCard).join('')}</div>` : `<div class="empty spacious"><span class="empty-icon">${icon('clock')}</span><h2>还没有开始整理</h2><p>从一封演示邮件开始，看看建议如何变成可确认的行动。</p><a class="button primary" href="#mail">查看整理建议 ${icon('arrow')}</a></div>`}`; }
function settings() {
  const p = store.preferences;
  return `<div class="page-heading"><div><h1>偏好设置</h1><p class="intro">生活有自己的节奏，助手也应该有分寸。</p></div></div><div class="settings-grid"><div><section class="settings-section"><h2>邮箱连接</h2><div class="setting-line"><div><strong>演示邮箱</strong><p>虚构邮件保存在当前浏览器，不会使用真实邮箱数据。</p></div><button class="button subtle" data-action="${store.connected ? 'disconnect' : 'connect'}">${store.connected ? '断开演示邮箱' : '启用演示邮箱'}</button></div><div class="setting-line"><div><strong>本地演示操作权限</strong><p>仅用于体验归档与恢复；不会向 Google 请求权限。</p></div><label class="switch"><input type="checkbox" id="write-permission" aria-label="本地演示操作权限" ${store.writeEnabled ? 'checked' : ''} ${!store.connected ? 'disabled' : ''}><span></span></label></div><div class="real-connection"><span>${icon('link')}真实 Gmail</span><span class="muted">见上方真实邮箱设置</span></div><p class="muted small">真实连接需要独立的 Google OAuth 配置；应用内开关不会代替 Google 授权。</p></section><form id="preferences"><section class="settings-section"><h2>简报与安静时间</h2><p class="muted">可保存偏好，用于验证设置流程。原型不运行后台调度。</p><div class="form-grid"><label>简报时间<input name="time" type="time" required value="${esc(p.time)}"></label><label>时区<select name="timezone"><option value="Asia/Shanghai" ${p.timezone === 'Asia/Shanghai' ? 'selected' : ''}>中国标准时间 UTC+8</option><option value="UTC" ${p.timezone === 'UTC' ? 'selected' : ''}>协调世界时 UTC</option><option value="America/Los_Angeles" ${p.timezone === 'America/Los_Angeles' ? 'selected' : ''}>洛杉矶</option></select></label><label>免打扰开始<input name="quietStart" type="time" required value="${esc(p.quietStart)}"></label><label>免打扰结束<input name="quietEnd" type="time" required value="${esc(p.quietEnd)}"></label></div><p class="small muted">当前${quietNow(p, new Date()) ? '处于' : '不在'}免打扰时段；开始与结束相同表示关闭免打扰。</p><div class="setting-line"><div><strong>AI 进展栏目</strong><p>只保存展示偏好，尚未接入实时来源。</p></div><label class="switch"><input name="ai" type="checkbox" aria-label="AI 进展栏目" ${p.ai ? 'checked' : ''}><span></span></label></div><div class="setting-line"><div><strong>新闻栏目</strong><p>只保存展示偏好，当前不生成新闻摘要。</p></div><label class="switch"><input name="news" type="checkbox" aria-label="新闻栏目" ${p.news ? 'checked' : ''}><span></span></label></div><button class="button primary" type="submit">保存偏好 ${icon('check')}</button></section></form><section class="settings-section"><h2>演示数据</h2><p class="muted">导出或清除当前浏览器的虚构样本与操作记录。不会涉及真实邮件。</p><div class="inline-buttons"><button class="button subtle" data-action="export">导出演示记录</button><button class="button danger" data-action="reset">清除记录并重置示例</button></div></section></div><aside><section class="quiet-section">${icon('shield')}<h2>权限，说清楚</h2><p>当前只申请只读权限；后续若开放真实归档，需要另行授权。</p><p>正式产品必须通过服务端操作白名单约束执行，不能只靠界面开关。</p><a class="source-link" target="_blank" rel="noopener noreferrer" href="https://developers.google.com/workspace/gmail/api/auth/scopes">查看 Google 权限说明 ${icon('arrow')}</a></section><section class="test-section"><h2>体验异常结果</h2><p>只改变下一次本地演示操作的结果。</p><label>演示情景<select id="scenario"><option value="success" ${scenario === 'success' ? 'selected' : ''}>全部成功</option><option value="partial" ${scenario === 'partial' ? 'selected' : ''}>第一封失败，其余成功</option><option value="unknown" ${scenario === 'unknown' ? 'selected' : ''}>第一封响应丢失，需核对</option></select></label></section></aside></div>`;
}
function render() {
  realCleanup?.(); realCleanup = undefined;
  root.innerHTML = shell(page === 'today' ? today() : page === 'mail' ? mail() : page === 'history' ? history() : settings());
  if (page === 'settings') {
    const section = document.createElement('div'); section.id = 'real-gmail-panel';
    const grid = root.querySelector<HTMLElement>('#main .settings-grid');
    if (grid?.parentNode) grid.parentNode.insertBefore(section, grid);
    realCleanup = mountRealGmailPanel(section);
  }
}
function closeDialog() { if (!processing) dialog.close(); }
function modal(html: string) { dialog.innerHTML = `<div class="dialog-inner">${html}</div>`; if (!dialog.open) dialog.showModal(); }
function details(id: string) { const m = store.mails.find(m => m.id === id); if (!m) return; modal(`<div class="dialog-heading"><h2 id="dialog-title">演示邮件详情</h2><button class="icon-button" data-action="close" aria-label="关闭">${icon('close')}</button></div><span class="category ${m.category}">${categoryText[m.category]}</span><h3 class="detail-subject">${esc(m.subject)}</h3><p class="muted">${esc(m.sender)} &lt;${esc(m.address)}&gt;</p><p class="detail-body">${esc(m.preview)}</p><div class="protection-note">${icon('shield')}这是虚构内容，不存在可跳转的真实原邮件。</div><p>${esc(m.reason)}</p><div class="dialog-actions"><button class="button primary" data-action="close">知道了</button></div>`); }
function review(task: Task) {
  dialog.dataset.taskId = task.id;
  modal(`<div class="dialog-heading"><h2 id="dialog-title">${task.kind === 'archive' ? '确认归档这些演示邮件？' : '确认恢复这些演示邮件？'}</h2><button class="icon-button" data-action="close" aria-label="关闭">${icon('close')}</button></div><p>${task.kind === 'archive' ? '仅从演示收件箱移出，保留邮件与已读状态。完成后可在任务记录中恢复。' : '将下列邮件放回演示收件箱，其他标签保持不变。'}</p><ul class="confirm-list">${task.items.map(i => `<li>${icon(task.kind === 'archive' ? 'archive' : 'undo')}<span>${esc(i.subject)}</span></li>`).join('')}</ul><label class="permission-line"><input id="confirm-permission" type="checkbox" ${store.writeEnabled ? 'checked' : ''}>允许本次本地演示操作（不连接真实 Gmail）</label><p class="muted small">确认对上述 ${task.items.length} 封邮件有效，5 分钟后过期。</p><div id="execution-error" role="alert"></div><div class="dialog-actions"><button class="button subtle" data-action="close">再看看</button><button class="button primary" data-execute="${task.id}" ${!store.writeEnabled ? 'disabled' : ''}>${task.kind === 'archive' ? `确认归档 ${task.items.length} 封` : `确认恢复 ${task.items.length} 封`}</button></div>`);
}
function selectionUI() {
  document.querySelector('#selection-count')!.textContent = `已选 ${selected.size} 封`;
  (document.querySelector('#review-button') as HTMLButtonElement).disabled = !selected.size;
  const candidates = visibleMails().filter(isEligible);
  const all = document.querySelector('#select-all') as HTMLInputElement;
  all.disabled = filter !== 'suggested' || !candidates.length;
  all.checked = !!candidates.length && candidates.every(m => selected.has(m.id));
}
listen(root, 'input', ev => {
  const target = ev.target as HTMLInputElement;
  if (target.id === 'search') { search = target.value; selected.clear(); document.querySelector('#mail-list')!.innerHTML = mailList(); selectionUI(); }
});
listen(root, 'change', ev => {
  const el = ev.target as HTMLInputElement;
  if (el.dataset.select) { el.checked ? selected.add(el.dataset.select) : selected.delete(el.dataset.select); el.closest('.mail-row')?.classList.toggle('selected', el.checked); selectionUI(); }
  if (el.id === 'select-all') { const checked = el.checked; visibleMails().filter(isEligible).forEach(m => checked ? selected.add(m.id) : selected.delete(m.id)); document.querySelector('#mail-list')!.innerHTML = mailList(); selectionUI(); }
  if (el.id === 'write-permission') { store.writeEnabled = el.checked; save(); toast(el.checked ? '已开启本地演示操作' : '已关闭本地演示操作'); }
  if (el.id === 'scenario') { scenario = el.value as Scenario; toast('演示情景已更新'); }
});
listen(root, 'submit', ev => {
  if ((ev.target as HTMLFormElement).id !== 'preferences') return;
  ev.preventDefault(); const data = new FormData(ev.target as HTMLFormElement);
  store.preferences = { time: String(data.get('time')), timezone: String(data.get('timezone')), quietStart: String(data.get('quietStart')), quietEnd: String(data.get('quietEnd')), ai: data.has('ai'), news: data.has('news') };
  save(); render(); toast('偏好已保存；原型不会发送通知');
});
function error(err: unknown) { toast(err instanceof Error ? err.message : '操作未完成，请重试。'); }
listen(root, 'click', ev => {
  const el = (ev.target as Element).closest<HTMLElement>('button, a'); if (!el) return;
  try {
    if (el.dataset.filter) { filter = el.dataset.filter; selected.clear(); expanded = null; render(); }
    if (el.dataset.expand) { expanded = expanded === el.dataset.expand ? null : el.dataset.expand; const focusId = el.dataset.expand; document.querySelector('#mail-list')!.innerHTML = mailList(); document.querySelector<HTMLButtonElement>(`[data-expand="${focusId}"]`)?.focus(); }
    if (el.dataset.detail) details(el.dataset.detail);
    if (el.dataset.restore) { const t = prepareRestore(store, OWNER, el.dataset.restore); save(); review(t); }
    if (el.dataset.reconcile) { reconcile(store, OWNER, el.dataset.reconcile); save(); render(); toast('已核对演示状态，没有重复执行'); }
    if (el.dataset.action === 'view-actions') { filter = 'protected'; location.hash = 'mail'; }
    if (el.dataset.action === 'review') { const t = prepare(store, OWNER, [...selected]); save(); review(t); }
    if (el.dataset.action === 'refresh') { render(); toast('已重新读取演示样本；没有获取实时资讯'); }
    if (el.dataset.action === 'connect') { store.connected = true; store.writeEnabled = false; save(); render(); toast('演示邮箱已启用，真实连接保持独立'); }
    if (el.dataset.action === 'disconnect') { store.connected = false; store.writeEnabled = false; selected.clear(); save(); render(); toast('演示邮箱已断开，待确认任务不能执行'); }
    if (el.dataset.action === 'clear-search') { search = ''; selected.clear(); render(); document.querySelector<HTMLInputElement>('#search')?.focus(); }
    if (el.dataset.action === 'export') { const blob = new Blob([JSON.stringify({ ...store, warning: '仅为虚构演示数据' }, null, 2)], { type: 'application/json' }); const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; a.download = 'lifeatlas-demo.json'; a.click(); setTimeout(() => URL.revokeObjectURL(url), 1000); toast('已导出演示记录'); }
    if (el.dataset.action === 'reset') modal(`<div class="dialog-heading"><h2 id="dialog-title">清除演示记录？</h2></div><p>将删除当前浏览器中的演示任务与偏好，并重新载入 10 封虚构邮件。此操作无法恢复演示记录。</p><div class="dialog-actions"><button class="button subtle" data-action="close">保留记录</button><button class="button danger" data-action="confirm-reset">清除并重置</button></div>`);
  } catch (err) { error(err); }
});
listen(dialog, 'change', ev => { if ((ev.target as HTMLInputElement).id === 'confirm-permission') { const b = dialog.querySelector<HTMLButtonElement>('[data-execute]'); if (b) b.disabled = !(ev.target as HTMLInputElement).checked; } });
listen(dialog, 'click', async ev => {
  const el = (ev.target as Element).closest<HTMLElement>('button'); if (!el || processing) return;
  if (el.dataset.action === 'close') { closeDialog(); return; }
  if (el.dataset.action === 'confirm-reset') { store = seedStore(); selected.clear(); save(); closeDialog(); render(); toast('演示记录已清除，示例已重置'); return; }
  if (el.dataset.execute) {
    processing = true; const b = el as HTMLButtonElement; b.disabled = true; const label = b.textContent; b.textContent = '正在处理演示数据…';
    await new Promise(resolve => setTimeout(resolve, 450));
    try { store.writeEnabled = !!dialog.querySelector<HTMLInputElement>('#confirm-permission')?.checked; const t = execute(store, OWNER, el.dataset.execute, Date.now(), scenario); scenario = 'success'; save(); selected.clear(); processing = false; dialog.close(); location.hash = 'history'; page = 'history'; render(); document.querySelector('#main')?.scrollIntoView(); toast(t.status === 'succeeded' ? '演示操作已完成，可查看逐项结果' : '部分结果需要你查看，请勿重复操作'); }
    catch (err) { processing = false; b.disabled = false; b.textContent = label; const box = dialog.querySelector('#execution-error')!; box.textContent = err instanceof Error ? err.message : '执行失败，请重试。'; box.className = 'notice error'; }
  }
});
listen(dialog, 'cancel', ev => { if (processing) ev.preventDefault(); });
listen(dialog, 'close', () => { if (dialog.dataset.taskId) { cancel(store, OWNER, dialog.dataset.taskId); delete dialog.dataset.taskId; save(); } });
const skip = document.querySelector<HTMLAnchorElement>('.skip')!;
listen(skip, 'click', ev => { ev.preventDefault(); document.querySelector<HTMLElement>('#main')?.focus(); });
listen(window, 'hashchange', () => { page = ['today', 'mail', 'history', 'settings'].includes(location.hash.slice(1)) ? location.hash.slice(1) : 'today'; selected.clear(); render(); window.scrollTo(0, 0); document.querySelector<HTMLElement>('#main')?.focus({ preventScroll: true }); });
render();
return () => { lifetime.abort(); realCleanup?.(); clearTimeout(toastTimer); if (dialog.open) dialog.close(); };
}
