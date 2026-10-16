import { GmailError, READ_SCOPE } from './contracts.ts';
import type { Fetcher, StoredTokens } from './contracts.ts';
export type RealMail = { id: string; subject: string; from: string; date: string; snippet: string; category: 'protected' | 'suggested' | 'review'; reason: string; originalUrl: string };
export class GoogleClient {
  constructor(private request: Fetcher = fetch) {}
  private async json(url: string | URL, init: RequestInit = {}): Promise<Record<string, any>> {
    let response: Response;
    try { response = await this.request(url, { ...init, redirect: 'error', signal: AbortSignal.timeout(12_000) }); }
    catch { throw new GmailError('PROVIDER_UNAVAILABLE', 'Google 服务暂时不可达，请稍后重试。', 503); }
    if (!response.ok) {
      if (response.status === 429) throw new GmailError('RATE_LIMITED', 'Google 请求额度暂时受限，请稍后重试。', 429);
      if (response.status === 401) throw new GmailError('REAUTH_REQUIRED', '邮箱授权已失效，请重新连接。', 401);
      if (response.status === 403) throw new GmailError('ACCESS_DENIED', 'Google 拒绝访问，请检查只读授权和 Gmail API 配置。', 403);
      // Never return provider bodies, which can contain codes or credentials.
      if (response.status === 400 && String(url).startsWith('https://oauth2.googleapis.com/token')) throw new GmailError('REAUTH_REQUIRED', '授权已过期或配置不匹配，请重新连接。', 401);
      throw new GmailError('PROVIDER_ERROR', 'Google 请求未完成，请稍后重试。', 502);
    }
    try { return await response.json() as Record<string, any>; }
    catch { throw new GmailError('PROVIDER_FORMAT', 'Google 返回格式异常，请稍后重试。', 502); }
  }
  async exchange(code: string, verifier: string, config: { clientId: string; clientSecret: string; redirectUri: string }) {
    return this.json('https://oauth2.googleapis.com/token', { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: new URLSearchParams({ client_id: config.clientId, client_secret: config.clientSecret, redirect_uri: config.redirectUri, grant_type: 'authorization_code', code, code_verifier: verifier }) });
  }
  async refresh(refreshToken: string, clientId: string, clientSecret: string) {
    return this.json('https://oauth2.googleapis.com/token', { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: new URLSearchParams({ client_id: clientId, client_secret: clientSecret, grant_type: 'refresh_token', refresh_token: refreshToken }) });
  }
  async profile(accessToken: string): Promise<string> {
    const v = await this.json('https://gmail.googleapis.com/gmail/v1/users/me/profile', { headers: { Authorization: `Bearer ${accessToken}` } });
    if (typeof v.emailAddress !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.emailAddress)) throw new GmailError('PROFILE_INVALID', '无法核实连接的邮箱。', 502);
    return v.emailAddress;
  }
  async revoke(token: string): Promise<boolean> {
    try { const r = await this.request('https://oauth2.googleapis.com/revoke', { method: 'POST', body: new URLSearchParams({ token }), headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, signal: AbortSignal.timeout(12_000), redirect: 'error' }); return r.ok; } catch { return false; }
  }
  async scan(accessToken: string, email: string, now: number) {
    const since = now - 7 * 24 * 60 * 60_000;
    const url = new URL('https://gmail.googleapis.com/gmail/v1/users/me/messages');
    url.searchParams.set('labelIds', 'INBOX'); url.searchParams.set('q', `after:${Math.floor(since / 1000)}`); url.searchParams.set('maxResults', '100'); url.searchParams.set('fields', 'messages(id),nextPageToken');
    const headers = { Authorization: `Bearer ${accessToken}` };
    const list = await this.json(url, { headers });
    const ids = [...new Set((Array.isArray(list.messages) ? list.messages : []).map((v: any) => v.id).filter((id: unknown): id is string => typeof id === 'string' && /^[a-zA-Z0-9_-]{1,128}$/.test(id)))].slice(0, 100) as string[];
    const mails: RealMail[] = []; let failedCount = 0; let deferredAuth: GmailError | undefined;
    // Fixed concurrency, bounded by a server-owned window and count. No client-supplied query.
    for (let i = 0; i < ids.length; i += 4) {
      const results = await Promise.allSettled(ids.slice(i, i + 4).map(async id => {
        const endpoint = new URL(`https://gmail.googleapis.com/gmail/v1/users/me/messages/${id}`);
        endpoint.searchParams.set('format', 'metadata');
        for (const name of ['From', 'Subject', 'Date', 'List-Id', 'List-Unsubscribe']) endpoint.searchParams.append('metadataHeaders', name);
        endpoint.searchParams.set('fields', 'id,labelIds,internalDate,snippet,payload(headers)');
        const v = await this.json(endpoint, { headers });
        if (v.id !== id || !Array.isArray(v.labelIds) || !v.labelIds.includes('INBOX') || !Number.isFinite(Number(v.internalDate)) || Number(v.internalDate) < since || Number(v.internalDate) > now + 60_000) return null;
        const fields = Array.isArray(v.payload?.headers) ? v.payload.headers : [];
        const get = (name: string) => clean(fields.find((h: any) => typeof h.name === 'string' && h.name.toLowerCase() === name.toLowerCase())?.value, 250);
        const subject = get('Subject') || '（无主题）', from = get('From') || '未知发件人';
        const protectedMail = /订单|付款|账单|发票|账户|账号|安全|验证码|登录|密码|退款|支付|order|invoice|payment|receipt|security|password|verification|login|bank/i.test(subject + ' ' + from) || v.labelIds.some((l: string) => ['IMPORTANT', 'STARRED'].includes(l));
        const suggested = !protectedMail && (v.labelIds.includes('CATEGORY_PROMOTIONS') || !!get('List-Id') || !!get('List-Unsubscribe'));
        return { id, subject, from, date: new Date(Number(v.internalDate)).toISOString(), snippet: clean(v.snippet, 300), category: protectedMail ? 'protected' : suggested ? 'suggested' : 'review', reason: protectedMail ? '涉及敏感主题或重要标记，保留待核查。' : suggested ? '推广或订阅特征，仅供人工复核，当前不能执行归档。' : '未能可靠判断，保留人工复核。', originalUrl: `https://mail.google.com/mail/?authuser=${encodeURIComponent(email)}#all/${id}` } satisfies RealMail;
      }));
      for (const result of results) {
        if (result.status === 'fulfilled' && result.value) mails.push(result.value);
        else if (result.status === 'rejected') { failedCount++; if (result.reason instanceof GmailError && [401, 403, 429].includes(result.reason.status)) deferredAuth = result.reason; }
      }
      if (deferredAuth) throw deferredAuth;
    }
    return { mails, failedCount, truncated: !!list.nextPageToken, scannedAt: new Date(now).toISOString(), windowDays: 7, limit: 100, classification: 'rules-only', persisted: false };
  }
}
function clean(value: unknown, max: number) { return typeof value === 'string' ? Array.from(value.replace(/[\u0000-\u0008\u000b-\u001f]/g, '')).slice(0, max).join('') : ''; }
export function normalizeTokens(value: Record<string, any>, previous?: StoredTokens): { tokens: StoredTokens; expiresIn: number } {
  const scope = typeof value.scope === 'string' ? value.scope : previous?.scope || '';
  if (!scope.split(' ').includes(READ_SCOPE)) throw new GmailError('SCOPE_MISSING', '未授予 Gmail 只读权限，请重新连接。', 403);
  // Reject unexpectedly wider grants instead of silently accepting a previously broad grant.
  if (scope.split(' ').some(s => s && s !== READ_SCOPE)) throw new GmailError('SCOPE_TOO_BROAD', '此次授权包含额外权限，请在 Google 撤销该应用旧授权后重新连接。', 403);
  const refreshToken = typeof value.refresh_token === 'string' ? value.refresh_token : previous?.refreshToken;
  if (!refreshToken || typeof value.access_token !== 'string' || !value.access_token) throw new GmailError('TOKEN_INCOMPLETE', '未取得持续只读授权，请重新连接并同意授权。', 401);
  return { tokens: { accessToken: value.access_token, refreshToken, scope }, expiresIn: Math.min(86_400, Math.max(60, Number(value.expires_in) || 3600)) };
}
