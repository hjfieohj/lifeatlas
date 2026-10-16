const bytes = (s: string) => new TextEncoder().encode(s);
export function base64url(value: Uint8Array): string { return btoa(String.fromCharCode(...value)).replaceAll('+', '-').replaceAll('/', '_').replace(/=+$/, ''); }
function decode(s: string): Uint8Array<ArrayBuffer> { return Uint8Array.from(atob(s.replaceAll('-', '+').replaceAll('_', '/')), c => c.charCodeAt(0)); }
export const randomSecret = () => base64url(crypto.getRandomValues(new Uint8Array(32)));
export async function hash(s: string) { return base64url(new Uint8Array(await crypto.subtle.digest('SHA-256', bytes(s)))); }
export function validKey(secret: string) { try { return decode(secret).length === 32; } catch { return false; } }
async function key(secret: string) { if (!validKey(secret)) throw new Error('Invalid token encryption key'); return crypto.subtle.importKey('raw', decode(secret), 'AES-GCM', false, ['encrypt', 'decrypt']); }
export async function seal(value: unknown, secret: string, owner: string): Promise<string> {
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const encrypted = await crypto.subtle.encrypt({ name: 'AES-GCM', iv, additionalData: bytes(`lifeatlas:${owner}`) }, await key(secret), bytes(JSON.stringify(value)));
  return `v1.${base64url(iv)}.${base64url(new Uint8Array(encrypted))}`;
}
export async function unseal<T>(value: string, secret: string, owner: string): Promise<T> {
  const [version, iv, encrypted] = value.split('.');
  if (version !== 'v1' || !iv || !encrypted) throw new Error('Invalid encrypted record');
  const plain = await crypto.subtle.decrypt({ name: 'AES-GCM', iv: decode(iv), additionalData: bytes(`lifeatlas:${owner}`) }, await key(secret), decode(encrypted));
  return JSON.parse(new TextDecoder().decode(plain));
}
