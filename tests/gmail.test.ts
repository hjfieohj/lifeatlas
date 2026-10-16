import { test } from 'node:test';
import assert from 'node:assert/strict';
import { DatabaseSync } from 'node:sqlite';
import { readFileSync } from 'node:fs';
import { D1Repository } from '../server/repository.ts';
import { GmailService } from '../server/service.ts';
import { GoogleClient } from '../server/google.ts';
import { READ_SCOPE } from '../server/contracts.ts';
import { seal, unseal } from '../server/crypto.ts';

const origin = 'https://lifeatlas.test', clock = 1_792_188_000_000;
const user = { userId: 'owner', email: 'owner@example.com' };
const key = Buffer.alloc(32, 7).toString('base64');
function database() {
  const sql = new DatabaseSync(':memory:');
  sql.exec(readFileSync(new URL('../drizzle/0000_striped_turbo.sql', import.meta.url),'utf8'));
  function statement(query: string, args: unknown[] = []) {
    return {
      bind(...values: unknown[]) { return statement(query, values); },
      async first() { return sql.prepare(query).get(...args as any[]) || null; },
      async run() { return { meta: { changes: Number(sql.prepare(query).run(...args as any[]).changes) } }; },
    };
  }
  const d1 = { prepare: statement, async batch(list: ReturnType<typeof statement>[]) { sql.exec('BEGIN'); try { const r=[]; for(const v of list) r.push(await v.run()); sql.exec('COMMIT'); return r; } catch(e) {sql.exec('ROLLBACK'); throw e;} } };
  return { repo: new D1Repository(d1 as any), sql };
}
function harness(options: { deniedRefresh?: boolean; partial?: boolean } = {}) {
  const { repo, sql } = database(); let calls: {url:string;init?:RequestInit}[] = [];
  const fetcher = async (input: string | URL, init?: RequestInit) => {
    const url = String(input); calls.push({url, init});
    if (url === 'https://oauth2.googleapis.com/token') {
      const refresh = new URLSearchParams(String(init?.body)).get('grant_type') === 'refresh_token';
      if (refresh && options.deniedRefresh) return Response.json({error:'invalid_grant', secret:'never return this'}, {status:400});
      return Response.json({access_token:'ACCESS_SECRET', ...(refresh ? {} : {refresh_token:'REFRESH_SECRET'}),scope:READ_SCOPE,expires_in:3600});
    }
    if (url.endsWith('/profile')) return Response.json({ emailAddress:'mail@example.com' });
    if (url.startsWith('https://oauth2.googleapis.com/revoke')) return new Response('', {status:200});
    const u = new URL(url);
    if (u.pathname.endsWith('/messages')) return Response.json({messages:[{id:'m1'},{id:'m2'}],nextPageToken:'DO_NOT_FOLLOW'});
    if (u.pathname.endsWith('/messages/m2') && options.partial) return Response.json({error:'internal'}, {status:500});
    if (u.pathname.includes('/messages/')) return Response.json({id:u.pathname.split('/').at(-1),internalDate:String(clock-1000),labelIds:['INBOX','CATEGORY_PROMOTIONS'],snippet:'<script>untrusted</script>',payload:{headers:[{name:'Subject',value:u.pathname.endsWith('m1')?'账户登录验证':'普通推广'},{name:'From',value:'sender@example.com'}]}});
    throw new Error('Unexpected provider target');
  };
  const service = new GmailService({origin,clientId:'CLIENT',clientSecret:'CLIENT_SECRET',encryptionKey:key,database:true},repo,new GoogleClient(fetcher),()=>clock);
  return {repo,sql,service,calls};
}
const post = (path: string, requestOrigin=origin) => new Request(origin+'/api/gmail/'+path,{method:'POST',headers:{Origin:requestOrigin}});
async function start(h: ReturnType<typeof harness>) {
  const r=await h.service.handle(post('connect'),user); assert.equal(r.status,303);
  const url=new URL(r.headers.get('Location')!); const cookie=r.headers.get('Set-Cookie')!.split(';')[0];
  return {url,cookie,callback:new Request(origin+'/api/gmail/callback?state='+url.searchParams.get('state')+'&code=CODE_SECRET',{headers:{Cookie:cookie}})};
}
async function connect(h: ReturnType<typeof harness>) { const a=await start(h); const r=await h.service.handle(a.callback,user); assert.equal(r.status,303); return a; }

test('status is authenticated, reports missing config, never exposes secret values', async()=>{
  const service=new GmailService({database:false},null);
  assert.equal((await service.handle(new Request(origin+'/api/gmail/status'),null)).status,401);
  const r=await service.handle(new Request(origin+'/api/gmail/status'),user); const b=await r.json() as any;
  assert.equal(b.ready,false); assert.ok(b.missing.includes('DB')); assert.equal(r.headers.get('Cache-Control'),'private, no-store');
});
test('OAuth uses exact readonly scope, PKCE, expiring HttpOnly cookie; cross-origin and GET cannot start',async()=>{
  const h=harness(); assert.equal((await h.service.handle(post('connect','https://evil.test'),user)).status,403);
  assert.equal((await h.service.handle(new Request(origin+'/api/gmail/connect'),user)).status,405);
  const a=await start(h); assert.equal(a.url.searchParams.get('scope'),READ_SCOPE); assert.equal(a.url.searchParams.get('code_challenge_method'),'S256');
  assert.ok(a.cookie.startsWith('__Host-')); assert.equal(h.calls.length,0);
  assert.equal(h.sql.prepare('SELECT encrypted_verifier FROM gmail_oauth_states').get()!.encrypted_verifier.toString().includes(a.url.searchParams.get('state')!),false);
});
test('callback requires matching owner and browser nonce; callback cannot be replayed',async()=>{
  const h=harness(), a=await start(h);
  assert.equal((await h.service.handle(new Request(a.callback.url),user)).status,403);
  assert.equal((await h.service.handle(a.callback,{...user,userId:'other'})).status,403);
  assert.equal(h.calls.length,0);
  assert.equal((await h.service.handle(a.callback,user)).status,303);
  assert.equal((await h.service.handle(a.callback,user)).status,403);
  const c=await h.repo.getConnection(user.userId); assert.ok(c); assert.ok(!c.encryptedTokens.includes('SECRET'));
  assert.equal(await h.repo.getConnection('other'),null);
});
test('denied and expired OAuth attempts cannot connect',async()=>{
  const h=harness(), a=await start(h);
  const denied=new Request(a.callback.url.replace('code=CODE_SECRET','error=access_denied'),{headers:{Cookie:a.cookie}});
  assert.equal((await h.service.handle(denied,user)).status,303); assert.equal(h.calls.length,0); assert.equal(await h.repo.getConnection(user.userId),null);
  const b=await start(h); h.sql.exec('UPDATE gmail_oauth_states SET expires_at=0'); assert.equal((await h.service.handle(b.callback,user)).status,403);
});
test('AES-GCM binds encrypted values to owner; tampering and wrong keys fail',async()=>{
  const cipher=await seal({refreshToken:'SECRET'},key,'a'); assert.equal((await unseal<any>(cipher,key,'a')).refreshToken,'SECRET');
  await assert.rejects(unseal(cipher,key,'b')); await assert.rejects(unseal(cipher,Buffer.alloc(32,8).toString('base64'),'a'));
  await assert.rejects(unseal(cipher.slice(0,-5)+'AAAAA',key,'a'));
});
test('scan stays read-only, bounded to 7 days/100; no body/attachments and no pagination replay',async()=>{
  const h=harness(); await connect(h); const r=await h.service.handle(post('scan'),user); const body=await r.json() as any;
  assert.equal(r.status,200); assert.equal(body.mails.length,2); assert.equal(body.mails[0].category,'protected'); assert.equal(body.truncated,true); assert.equal(body.persisted,false);
  const list=h.calls.find(c=>new URL(c.url).pathname.endsWith('/messages'))!; const u=new URL(list.url);
  assert.equal(u.searchParams.get('maxResults'),'100'); assert.equal(u.searchParams.get('labelIds'),'INBOX'); assert.ok(u.searchParams.get('q')!.startsWith('after:'));
  assert.ok(h.calls.filter(c=>c.url.includes('/messages/')).every(c=>new URL(c.url).searchParams.get('format')==='metadata'));
  assert.ok(!JSON.stringify(body).includes('SECRET')); assert.equal((await h.service.handle(post('archive'),user)).status,404);
});
test('partial reads are labeled, not turned into an empty success',async()=>{
  const h=harness({partial:true}); await connect(h); const body=await (await h.service.handle(post('scan'),user)).json() as any;
  assert.equal(body.mails.length,1); assert.equal(body.failedCount,1);
});
test('expired access token refreshes without losing refresh token; invalid_grant requires reconnect',async()=>{
  const h=harness(); await connect(h); h.sql.exec('UPDATE gmail_connections SET expires_at=0');
  assert.equal((await h.service.handle(post('scan'),user)).status,200);
  const c=(await h.repo.getConnection(user.userId))!; assert.equal((await unseal<any>(c.encryptedTokens,key,user.userId)).refreshToken,'REFRESH_SECRET');
  const bad=harness({deniedRefresh:true}); await connect(bad); bad.sql.exec('UPDATE gmail_connections SET expires_at=0'); const r=await bad.service.handle(post('scan'),user);
  assert.equal(r.status,401); assert.ok(!(await r.text()).includes('never return')); assert.equal(await bad.repo.getConnection(user.userId),null);
});
test('disconnect removes pending callbacks and conditional refresh cannot resurrect a connection',async()=>{
  const h=harness(); await connect(h); const old=(await h.repo.getConnection(user.userId))!; const a=await start(h);
  assert.equal((await h.service.handle(post('disconnect'),user)).status,200);
  assert.equal((await h.service.handle(a.callback,user)).status,403);
  assert.equal(await h.repo.refreshConnection(old,old.encryptedTokens),false); assert.equal(await h.repo.getConnection(user.userId),null);
});
test('claimed callback cancelled during exchange cannot finalize after disconnect',async()=>{
  const h=harness(), a=await start(h); const state=await import('../server/crypto.ts');
  const stateHash=await state.hash(a.url.searchParams.get('state')!); const nonce=a.cookie.split('=')[1];
  assert.ok(await h.repo.claimAttempt(stateHash,user.userId,await state.hash(nonce),clock));
  await h.repo.disconnect(user.userId);
  assert.equal(await h.repo.finishAttempt(stateHash,{owner:user.userId,email:'mail@example.com',encryptedTokens:'cipher',expiresAt:clock+1000,updatedAt:clock},clock),false);
});
test('unexpected broad scopes are revoked and never stored',async()=>{
  const {repo}=database(); let revoked=false;
  const client=new GoogleClient(async (url)=>{
    if(String(url).endsWith('/revoke')) {revoked=true;return new Response('',{status:200});}
    return Response.json({access_token:'SECRET',refresh_token:'SECRET_REFRESH',scope:READ_SCOPE+' https://www.googleapis.com/auth/gmail.modify',expires_in:3600});
  });
  const service=new GmailService({origin,clientId:'CLIENT',clientSecret:'SECRET',encryptionKey:key,database:true},repo,client,()=>clock);
  const h={service} as ReturnType<typeof harness>; const a=await start(h);
  assert.equal((await service.handle(a.callback,user)).status,403); assert.equal(revoked,true); assert.equal(await repo.getConnection(user.userId),null);
});
test('disconnect during scan discards all in-flight mail results',async()=>{
  const h=harness(); await connect(h);
  const c=(await h.repo.getConnection(user.userId))!;
  const google=new GoogleClient(async (url)=>{
    if(new URL(url).pathname.endsWith('/messages')) {await h.repo.disconnect(user.userId); return Response.json({messages:[]});}
    throw new Error('Unexpected request');
  });
  const service=new GmailService({origin,clientId:'CLIENT',clientSecret:'SECRET',encryptionKey:key,database:true},h.repo,google,()=>clock);
  const r=await service.handle(post('scan'),user); assert.equal(r.status,409); assert.ok(!(await r.text()).includes('mails'));
});
