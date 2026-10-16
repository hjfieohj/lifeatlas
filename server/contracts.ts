export type StoredTokens = { accessToken: string; refreshToken: string; scope: string };
export type Connection = { owner: string; email: string; encryptedTokens: string; expiresAt: number; updatedAt: number };
export type OAuthAttempt = { stateHash: string; owner: string; cookieHash: string; encryptedVerifier: string; expiresAt: number };
export interface Repository {
  insertAttempt(value: OAuthAttempt): Promise<void>;
  claimAttempt(hash: string, owner: string, cookieHash: string, now: number): Promise<OAuthAttempt | null>;
  finishAttempt(hash: string, value: Connection, now: number): Promise<boolean>;
  getConnection(owner: string): Promise<Connection | null>;
  refreshConnection(value: Connection, oldCipher: string): Promise<boolean>;
  removeConnection(owner: string, expectedCipher?: string): Promise<void>;
  disconnect(owner: string): Promise<void>;
}
export class GmailError extends Error {
  constructor(public code: string, message: string, public status = 400) { super(message); }
}
export type Fetcher = (input: string | URL, init?: RequestInit) => Promise<Response>;
export const READ_SCOPE = 'https://www.googleapis.com/auth/gmail.readonly';
