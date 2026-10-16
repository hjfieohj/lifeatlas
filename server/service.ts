import { GmailError, READ_SCOPE } from './contracts.ts';
import type { Repository, StoredTokens } from './contracts.ts';
import { randomSecret, hash, seal, unseal, validKey } from './crypto.ts';
import { GoogleClient, normalizeTokens } from './google.ts';

export type GmailConfig = { origin?: string; clientId?: string; clientSecret?: string; encryptionKey?: string; database: boolean };
export type User = { userId: string; email: string };
const cookieName = '__Host-lifeatlas_oauth';
export function missingConfig(c: GmailConfig): string[] {
  const missing: string[] = [];
  if (!c.origin || !validOrigin(c.origin)) missing.push('APP_ORIGIN');
  if (!c.clientId) missing.push('GOOGLE_CLIENT_ID');
  if (!c.clientSecret) missing.push('GOOGLE_CLIENT_SECRET');
  if (!c.encryptionKey || !validKey(c.encryptionKey)) missing.push('TOKEN_ENCRYPTION_KEY');
  if (!c.database) missing.push('DB');
  return missing;
}
function validOrigin(origin: string) { try { const u = new URL(origin); return u.origin === origin && (u.protocol === 'https:' || (u.protocol === 'http:' && ['localhost', '127.0.0.1'].includes(u.hostname))); } catch { return false; } }
const headers = { 'Cache-Control': 'private, no-store', 'Pragma': 'no-cache', 'Referrer-Policy': 'no-referrer', 'X-Content-Type-Options': 'nosniff' };
function json(data: unknown, status = 200) { return Response.json(data, { status, headers }); }
function redirect(url: string, cookie?: string) { return new Response(null, { status: 303, headers: { ...headers, Location: url, ...(cookie ? { 'Set-Cookie': cookie } : {}) } }); }

export class GmailService {
  constructor(private config: GmailConfig, private repo: Repository | null, private google = new GoogleClient(), private now: () => number = Date.now) {}
  async handle(request: Request, user: User | null): Promise<Response> {
    const path = new URL(request.url).pathname;
    try {
      if (!user) return json({ error: { code: 'SIGN_IN_REQUIRED', message: '请先登录生活空间，再连接真实邮箱。' }, signInUrl: '/signin-with-chatgpt?return_to=%2F%23settings' }, 401);
      const missing = missingConfig(this.config);
      if (path === '/api/gmail/status' && request.method === 'GET') {
        const connected = !missing.length && this.repo ? await this.repo.getConnection(user.userId) : null;
        return json({ authenticated: true, ready: !missing.length, missing, connected: !!connected, email: connected?.email || null, mode: 'readonly', scope: READ_SCOPE, redirectUri: this.config.origin ? `${this.config.origin}/api/gmail/callback` : null });
      }
      if (path !== '/api/gmail/callback') {
        if (request.method !== 'POST') throw new GmailError('METHOD_NOT_ALLOWED', '此操作需要明确提交。', 405);
        if (!this.config.origin || request.headers.get('Origin') !== this.config.origin || new URL(request.url).origin !== this.config.origin || request.headers.get('Sec-Fetch-Site') === 'cross-site') throw new GmailError('ORIGIN_REJECTED', '请求来源不匹配，请回到生活空间重试。', 403);
      } else if (request.method !== 'GET') throw new GmailError('METHOD_NOT_ALLOWED', '授权回调方法不正确。', 405);
      if (missing.length || !this.repo) return json({ error: { code: 'NOT_CONFIGURED', message: '真实邮箱尚未配置，演示模式仍可使用。' }, missing }, 503);
      const config = this.config as Required<GmailConfig>, repo = this.repo;
      const cb = `${config.origin}/api/gmail/callback`;
      const secure = config.origin.startsWith('https:');
      const name = secure ? cookieName : 'lifeatlas_oauth_local';
      const cookie = (value: string, seconds: number) => `${name}=${value}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${seconds}${secure ? '; Secure' : ''}`;
      if (path === '/api/gmail/connect') {
        const state = randomSecret(), nonce = randomSecret(), verifier = randomSecret();
        await repo.insertAttempt({ stateHash: await hash(state), owner: user.userId, cookieHash: await hash(nonce), encryptedVerifier: await seal(verifier, config.encryptionKey, user.userId), expiresAt: this.now() + 5 * 60_000 });
        const url = new URL('https://accounts.google.com/o/oauth2/v2/auth');
        for (const [key, value] of Object.entries({ client_id: config.clientId, redirect_uri: cb, response_type: 'code', scope: READ_SCOPE, access_type: 'offline', prompt: 'consent select_account', state, code_challenge: await hash(verifier), code_challenge_method: 'S256', include_granted_scopes: 'false' })) url.searchParams.set(key, value);
        return redirect(url.toString(), cookie(nonce, 300));
      }
      if (path === '/api/gmail/callback') {
        const params = new URL(request.url).searchParams;
        const state = params.get('state'), code = params.get('code');
        const values = (request.headers.get('Cookie') || '').split(';').map(s => s.trim()).filter(s => s.startsWith(`${name}=`));
        if (!state || state.length > 100 || values.length !== 1) throw new GmailError('STATE_REJECTED', '授权会话无效或已过期，请重新连接。', 403);
        const nonce = values[0].slice(name.length + 1);
        const stateHash = await hash(state);
        const attempt = await repo.claimAttempt(stateHash, user.userId, await hash(nonce), this.now());
        if (!attempt) throw new GmailError('STATE_REJECTED', '授权会话无效、已使用或已过期，请重新连接。', 403);
        if (params.has('error')) return redirect(`${config.origin}/?gmail=denied#settings`, cookie('', 0));
        if (!code || code.length > 4096) throw new GmailError('CODE_INVALID', 'Google 未返回有效授权码，请重新连接。');
        const verifier = await unseal<string>(attempt.encryptedVerifier, config.encryptionKey, user.userId);
        const raw = await this.google.exchange(code, verifier, { clientId: config.clientId, clientSecret: config.clientSecret, redirectUri: cb });
        let tokens: StoredTokens;
        let expiresIn: number;
        try { ({ tokens, expiresIn } = normalizeTokens(raw)); }
        catch (err) { if (typeof raw.refresh_token === 'string' || typeof raw.access_token === 'string') await this.google.revoke(raw.refresh_token || raw.access_token); throw err; }
        try {
          const email = await this.google.profile(tokens.accessToken);
          const time = this.now();
          const complete = await repo.finishAttempt(stateHash, { owner: user.userId, email, encryptedTokens: await seal(tokens, config.encryptionKey, user.userId), expiresAt: time + expiresIn * 1000, updatedAt: time }, time);
          if (!complete) throw new GmailError('CONNECTION_CANCELLED', '连接过程已取消或过期，请重新连接。', 409);
        } catch (err) { await this.google.revoke(tokens.refreshToken); throw err; }
        return redirect(`${config.origin}/?gmail=connected#settings`, cookie('', 0));
      }
      if (path === '/api/gmail/disconnect') {
        const connection = await repo.getConnection(user.userId);
        // Remove local authority first. A delayed callback/refresh cannot recreate it.
        await repo.disconnect(user.userId);
        let revoked = true;
        if (connection) {
          try { const tokens = await unseal<StoredTokens>(connection.encryptedTokens, config.encryptionKey, user.userId); revoked = await this.google.revoke(tokens.refreshToken); }
          catch { revoked = false; }
        }
        return json({ connected: false, remoteRevocationConfirmed: revoked, message: revoked ? '已断开真实邮箱并清除本产品保存的授权。' : '本产品已断开并清除授权；Google 撤销状态未确认，请在 Google 账户中检查第三方访问权限。' });
      }
      if (path === '/api/gmail/scan') {
        let connection = await repo.getConnection(user.userId);
        if (!connection) throw new GmailError('NOT_CONNECTED', '请先连接真实邮箱。', 409);
        let tokens = await unseal<StoredTokens>(connection.encryptedTokens, config.encryptionKey, user.userId);
        if (connection.expiresAt <= this.now() + 60_000) {
          try {
            const refreshed = normalizeTokens(await this.google.refresh(tokens.refreshToken, config.clientId, config.clientSecret), tokens);
            tokens = refreshed.tokens;
            const next = { ...connection, encryptedTokens: await seal(tokens, config.encryptionKey, user.userId), expiresAt: this.now() + refreshed.expiresIn * 1000, updatedAt: this.now() };
            if (!await repo.refreshConnection(next, connection.encryptedTokens)) throw new GmailError('CONNECTION_CHANGED', '连接状态已变化，请重新查看。', 409);
            connection = next;
          } catch (err) { if (err instanceof GmailError && err.code === 'REAUTH_REQUIRED') await repo.removeConnection(user.userId, connection.encryptedTokens); throw err; }
        }
        let result;
        try { result = await this.google.scan(tokens.accessToken, connection.email, this.now()); }
        catch (err) { if (err instanceof GmailError && err.code === 'REAUTH_REQUIRED') await repo.removeConnection(user.userId, connection.encryptedTokens); throw err; }
        // Discard an in-flight read if the user disconnected or replaced the connection.
        const current = await repo.getConnection(user.userId);
        if (!current || current.encryptedTokens !== connection.encryptedTokens) throw new GmailError('CONNECTION_CHANGED', '读取期间连接发生变化，结果已丢弃。', 409);
        return json({ ...result, email: connection.email, mode: 'readonly' });
      }
      throw new GmailError('NOT_FOUND', '接口不存在。', 404);
    } catch (err) {
      const safe = err instanceof GmailError ? err : new GmailError('SERVICE_UNAVAILABLE', '邮箱服务暂不可用，请稍后重试或查看配置状态。', 503);
      return json({ error: { code: safe.code, message: safe.message } }, safe.status);
    }
  }
}
