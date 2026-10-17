import { env } from 'cloudflare:workers';
import { getChatGPTUser } from '../app/chatgpt-auth';
import { GrowthRepository } from './growth-repository';
import { GrowthService } from './growth-service';
export async function handleGrowth(request:Request){
  const db=(env as unknown as {DB?:D1Database}).DB;
  return new GrowthService(db?new GrowthRepository(db):null).handle(request,await getChatGPTUser());
}
