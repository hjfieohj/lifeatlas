/** Prototype domain. All operations affect fictional browser-local data only. */
export type Category = 'promotion' | 'subscription' | 'action' | 'protected';
export type Mail = { id: string; sender: string; address: string; subject: string; preview: string; time: string; category: Category; reason: string; labels: string[]; revision: number };
export type ItemStatus = 'pending' | 'succeeded' | 'failed' | 'unknown';
export type TaskStatus = 'awaiting' | 'running' | 'succeeded' | 'partial' | 'failed' | 'unknown' | 'cancelled';
export type TaskItem = { mailId: string; subject: string; before: string[]; expectedRevision: number; afterRevision?: number; status: ItemStatus; detail: string };
export type Task = { id: string; owner: string; kind: 'archive' | 'restore'; originalId?: string; createdAt: number; expiresAt: number; status: TaskStatus; items: TaskItem[]; confirmedAt?: number };
export type Preferences = { time: string; timezone: string; quietStart: string; quietEnd: string; ai: boolean; news: boolean };
export type Store = { version: 1; owner: string; connected: boolean; writeEnabled: boolean; mails: Mail[]; tasks: Task[]; preferences: Preferences };
export type Scenario = 'success' | 'partial' | 'unknown';
export const OWNER = 'demo-owner';
export const isEligible = (mail: Mail) => ['promotion', 'subscription'].includes(mail.category) && mail.labels.includes('INBOX');
export const isProtected = (mail: Mail) => mail.category === 'protected' || mail.category === 'action';
const sameLabels = (a: string[], b: string[]) => [...a].sort().join('\0') === [...b].sort().join('\0');
export const defaultPreferences: Preferences = { time: '08:30', timezone: 'Asia/Shanghai', quietStart: '22:00', quietEnd: '08:00', ai: false, news: false };

export function seedStore(): Store {
  const rows: Array<[string, string, string, string, string, Category, string]> = [
    ['m1', '山间书店', 'letters@bookshop.example', '这一周，让好故事慢慢发生', '本周阅读推荐与线下活动，未包含个人订单信息。', 'subscription', '常规阅读订阅，没有发现需处理的事项。'],
    ['m2', '森野生活', 'news@forest.example', '周末好物，秋日特别企划', '秋季生活方式推广，本周新品与折扣介绍。', 'promotion', '商品推广，无订单或付款内容。'],
    ['m3', '设计拾光', 'weekly@design.example', '设计周刊 Vol. 42', '本期聊聊日常物件中的设计，供空闲时阅读。', 'subscription', '定期资讯订阅，可随时在全部邮件中找回。'],
    ['m4', '周末放映室', 'hello@cinema.example', '十月片单，留给一个安静的周末', '本月电影推荐合集，没有购票或预约记录。', 'subscription', '推荐类内容，没有需要回复或确认的事项。'],
    ['m5', '城市漫游', 'events@walk.example', '新的城市路线，等你来发现', '公开步行路线和推广活动，不是已确认的活动报名。', 'promotion', '公开活动推广，未发现个人行程。'],
    ['m6', '小岛商店', 'offers@island.example', '你的秋日灵感清单', '新品介绍与限时优惠，没有交易详情。', 'promotion', '营销信息，没有发现账户、资金或订单内容。'],
    ['m7', '林知远', 'lin@example.com', '周日一起散步？', '想约你周日下午去河边走走，方便的话回复一下。', 'action', '私人邀约，需要你决定，已排除批量归档。'],
    ['m8', '账户服务（演示）', 'security@account.example', '请确认你的新设备登录', '检测到一次新设备登录，请到原服务核实。此为虚构示例。', 'protected', '涉及账户安全，受保护，不进入整理建议。'],
    ['m9', '订单服务（演示）', 'orders@shop.example', '订单已发货，请留意配送', '包裹信息与订单记录。此为虚构示例。', 'protected', '涉及订单与财产，受保护，不进入整理建议。'],
    ['m10', '陈晓', 'chen@example.com', '下周方案，需要你的反馈', '请在周一前看一下方案，附件在真实产品中需单独处理。', 'action', '涉及他人请求与期限，保留在待处理区。'],
  ];
  return { version: 1, owner: OWNER, connected: true, writeEnabled: false, tasks: [], preferences: { ...defaultPreferences }, mails: rows.map((r, i) => ({ id: r[0], sender: r[1], address: r[2], subject: r[3], preview: r[4], category: r[5], reason: r[6], time: `${String(9 - Math.floor(i / 4)).padStart(2, '0')}:${String(42 - i * 3).padStart(2, '0')}`, labels: ['INBOX', ...(i % 2 ? ['UNREAD'] : [])], revision: 1 })) };
}

function authorize(s: Store, owner: string) {
  if (s.owner !== owner) throw new Error('此任务不属于当前用户。');
  if (!s.connected) throw new Error('演示邮箱已断开，请先在偏好设置中重新启用。');
}

export function prepare(s: Store, owner: string, ids: string[], now = Date.now()): Task {
  authorize(s, owner);
  const unique = [...new Set(ids)];
  if (!unique.length) throw new Error('请先选择要整理的邮件。');
  const items: TaskItem[] = unique.map(id => {
    const mail = s.mails.find(m => m.id === id);
    if (!mail || !isEligible(mail)) throw new Error('所选邮件包含受保护、待处理或状态已变化的项目，请重新选择。');
    return { mailId: id, subject: mail.subject, before: [...mail.labels], expectedRevision: mail.revision, status: 'pending', detail: '等待确认' };
  });
  const task: Task = { id: crypto.randomUUID(), owner, kind: 'archive', createdAt: now, expiresAt: now + 5 * 60_000, status: 'awaiting', items };
  s.tasks.unshift(task);
  return task;
}

export function prepareRestore(s: Store, owner: string, originalId: string, now = Date.now()): Task {
  authorize(s, owner);
  const original = s.tasks.find(t => t.id === originalId && t.owner === owner && t.kind === 'archive');
  if (!original) throw new Error('找不到对应的归档记录。');
  const alreadyRestored = new Set(s.tasks.filter(t => t.kind === 'restore' && t.originalId === originalId).flatMap(t => t.items.filter(i => i.status === 'succeeded').map(i => i.mailId)));
  const items: TaskItem[] = original.items.filter(i => i.status === 'succeeded' && !alreadyRestored.has(i.mailId)).map(i => {
    const mail = s.mails.find(m => m.id === i.mailId);
    if (!mail || mail.revision !== i.afterRevision || !sameLabels(mail.labels, i.before.filter(l => l !== 'INBOX'))) throw new Error('归档后的邮件状态发生变化，请查看详情后手动处理，避免覆盖新改动。');
    return { mailId: mail.id, subject: mail.subject, before: [...mail.labels], expectedRevision: mail.revision, status: 'pending', detail: '等待恢复确认' };
  });
  if (!items.length) throw new Error('此任务没有可恢复的邮件。');
  const task: Task = { id: crypto.randomUUID(), owner, kind: 'restore', originalId, createdAt: now, expiresAt: now + 5 * 60_000, status: 'awaiting', items };
  s.tasks.unshift(task);
  return task;
}

export function execute(s: Store, owner: string, taskId: string, now = Date.now(), scenario: Scenario = 'success'): Task {
  authorize(s, owner);
  const task = s.tasks.find(t => t.id === taskId && t.owner === owner);
  if (!task) throw new Error('找不到本次确认记录。');
  if (task.status !== 'awaiting') return task; // no replay; unknown requires reconciliation
  if (!s.writeEnabled) throw new Error('请先开启本地演示操作权限。');
  if (now > task.expiresAt) throw new Error('本次确认已过期，请重新选择邮件。');
  // Preflight the complete set before any mutation. Production also rechecks at provider boundary.
  for (const item of task.items) {
    const mail = s.mails.find(m => m.id === item.mailId);
    if (!mail || mail.revision !== item.expectedRevision || !sameLabels(mail.labels, item.before) || (task.kind === 'archive' && !isEligible(mail))) throw new Error('邮件状态发生变化，本次未执行。请重新查看并确认。');
  }
  task.status = 'running'; task.confirmedAt = now;
  task.items.forEach((item, index) => {
    if (scenario === 'partial' && index === 0) { item.status = 'failed'; item.detail = '模拟服务失败，未改变邮件'; return; }
    const mail = s.mails.find(m => m.id === item.mailId)!;
    mail.labels = task.kind === 'archive' ? mail.labels.filter(l => l !== 'INBOX') : [...new Set([...mail.labels, 'INBOX'])];
    mail.revision++;
    item.afterRevision = mail.revision;
    item.status = scenario === 'unknown' && index === 0 ? 'unknown' : 'succeeded';
    item.detail = item.status === 'unknown' ? '模拟操作后响应丢失，需要核对' : task.kind === 'archive' ? '已从演示收件箱移出' : '已放回演示收件箱';
  });
  summarize(task);
  return task;
}

export function cancel(s: Store, owner: string, taskId: string): void {
  const task = s.tasks.find(t => t.id === taskId && t.owner === owner && s.owner === owner);
  if (!task) throw new Error('找不到此用户的任务。');
  if (task.status === 'awaiting') { task.status = 'cancelled'; task.items.forEach(i => i.detail = '已取消，未执行'); }
}

function summarize(task: Task) {
  task.status = task.items.some(i => i.status === 'unknown') ? 'unknown' : task.items.every(i => i.status === 'succeeded') ? 'succeeded' : task.items.some(i => i.status === 'succeeded') ? 'partial' : 'failed';
}

export function reconcile(s: Store, owner: string, taskId: string): Task {
  authorize(s, owner);
  const task = s.tasks.find(t => t.id === taskId && t.owner === owner);
  if (!task) throw new Error('任务不存在。');
  for (const item of task.items.filter(i => i.status === 'unknown')) {
    const mail = s.mails.find(m => m.id === item.mailId);
    const target = task.kind === 'archive' ? item.before.filter(l => l !== 'INBOX') : [...new Set([...item.before, 'INBOX'])];
    if (mail && mail.revision === item.afterRevision && sameLabels(mail.labels, target)) { item.status = 'succeeded'; item.detail = '已核对本地演示状态，操作成功'; }
    else item.detail = '状态不一致，保留待核对，不重复操作';
  }
  summarize(task); return task;
}

export function quietNow(p: Preferences, now: Date): boolean {
  const parts = new Intl.DateTimeFormat('en-GB', { timeZone: p.timezone, hour: '2-digit', minute: '2-digit', hourCycle: 'h23' }).format(now);
  const mins = (v: string) => Number(v.slice(0, 2)) * 60 + Number(v.slice(3));
  const n = mins(parts), start = mins(p.quietStart), end = mins(p.quietEnd);
  return start === end ? false : start < end ? n >= start && n < end : n >= start || n < end;
}
