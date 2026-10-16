import { env } from 'cloudflare:workers';
import { getChatGPTUser } from '../app/chatgpt-auth';
import { GmailService } from './service';
import { D1Repository } from './repository';

export async function handleGmail(request: Request) {
  const user = await getChatGPTUser();
  const runtime = env as unknown as { DB?: D1Database; APP_ORIGIN?: string; GOOGLE_CLIENT_ID?: string; GOOGLE_CLIENT_SECRET?: string; TOKEN_ENCRYPTION_KEY?: string };
  const service = new GmailService({ origin: runtime.APP_ORIGIN, clientId: runtime.GOOGLE_CLIENT_ID, clientSecret: runtime.GOOGLE_CLIENT_SECRET, encryptionKey: runtime.TOKEN_ENCRYPTION_KEY, database: !!runtime.DB }, runtime.DB ? new D1Repository(runtime.DB) : null);
  return service.handle(request, user);
}
