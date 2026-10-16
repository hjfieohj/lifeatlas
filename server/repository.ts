import type { Connection, OAuthAttempt, Repository } from './contracts.ts';
export class D1Repository implements Repository {
  constructor(private db: D1Database) {}
  async insertAttempt(v: OAuthAttempt) {
    await this.db.batch([
      this.db.prepare('DELETE FROM gmail_oauth_states WHERE expires_at <= ?').bind(Date.now()),
      this.db.prepare('DELETE FROM gmail_oauth_states WHERE owner = ?').bind(v.owner),
      this.db.prepare('INSERT INTO gmail_oauth_states (state_hash,owner,cookie_hash,encrypted_verifier,expires_at,claimed) VALUES (?,?,?,?,?,0)').bind(v.stateHash, v.owner, v.cookieHash, v.encryptedVerifier, v.expiresAt),
    ]);
  }
  async claimAttempt(hash: string, owner: string, cookieHash: string, now: number) {
    const row = await this.db.prepare('UPDATE gmail_oauth_states SET claimed = 1 WHERE state_hash = ? AND owner = ? AND cookie_hash = ? AND expires_at > ? AND claimed = 0 RETURNING *').bind(hash, owner, cookieHash, now).first<Record<string, string | number>>();
    return row ? { stateHash: String(row.state_hash), owner: String(row.owner), cookieHash: String(row.cookie_hash), encryptedVerifier: String(row.encrypted_verifier), expiresAt: Number(row.expires_at) } : null;
  }
  async finishAttempt(hash: string, v: Connection, now: number) {
    const results = await this.db.batch([
      this.db.prepare('INSERT INTO gmail_connections (owner,email,encrypted_tokens,expires_at,updated_at) SELECT ?,?,?,?,? FROM gmail_oauth_states WHERE state_hash = ? AND owner = ? AND claimed = 1 AND expires_at > ? ON CONFLICT(owner) DO UPDATE SET email=excluded.email, encrypted_tokens=excluded.encrypted_tokens, expires_at=excluded.expires_at, updated_at=excluded.updated_at').bind(v.owner, v.email, v.encryptedTokens, v.expiresAt, v.updatedAt, hash, v.owner, now),
      this.db.prepare('DELETE FROM gmail_oauth_states WHERE state_hash = ? AND owner = ?').bind(hash, v.owner),
    ]);
    return results[0].meta.changes === 1;
  }
  async getConnection(owner: string) {
    const row = await this.db.prepare('SELECT * FROM gmail_connections WHERE owner = ?').bind(owner).first<Record<string, string | number>>();
    return row ? { owner: String(row.owner), email: String(row.email), encryptedTokens: String(row.encrypted_tokens), expiresAt: Number(row.expires_at), updatedAt: Number(row.updated_at) } : null;
  }
  async refreshConnection(v: Connection, old: string) {
    const result = await this.db.prepare('UPDATE gmail_connections SET encrypted_tokens = ?,expires_at = ?,updated_at = ? WHERE owner = ? AND encrypted_tokens = ?').bind(v.encryptedTokens, v.expiresAt, v.updatedAt, v.owner, old).run();
    return result.meta.changes === 1;
  }
  async removeConnection(owner: string, old?: string) {
    if (old) await this.db.prepare('DELETE FROM gmail_connections WHERE owner = ? AND encrypted_tokens = ?').bind(owner, old).run();
    else await this.db.prepare('DELETE FROM gmail_connections WHERE owner = ?').bind(owner).run();
  }
  async disconnect(owner: string) {
    await this.db.batch([this.db.prepare('DELETE FROM gmail_oauth_states WHERE owner = ?').bind(owner), this.db.prepare('DELETE FROM gmail_connections WHERE owner = ?').bind(owner)]);
  }
}
