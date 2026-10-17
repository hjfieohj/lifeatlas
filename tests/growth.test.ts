import { test } from 'node:test';
import assert from 'node:assert/strict';
import { DatabaseSync } from 'node:sqlite';
import { readFileSync } from 'node:fs';
import { GrowthRepository } from '../server/growth-repository.ts';
import { GrowthService } from '../server/growth-service.ts';
import { validDay } from '../src/growth-model.ts';
const origin='https://lifeatlas.test',owner={userId:'first'},other={userId:'second'};
function harness(){
  const sql=new DatabaseSync(':memory:');
  sql.exec(readFileSync(new URL('../drizzle/0001_thin_katie_power.sql',import.meta.url),'utf8'));
  function prepare(query:string,args:unknown[]=[]):any{return {bind(...v:unknown[]){return prepare(query,v);},async first(){return sql.prepare(query).get(...args as any[])||null;},async all(){return {results:sql.prepare(query).all(...args as any[])};},async run(){return {meta:{changes:Number(sql.prepare(query).run(...args as any[]).changes)}};}};}
  const db={prepare,async batch(queries:any[]){sql.exec('BEGIN');try{const rows=[];for(const q of queries)rows.push(await q.run());sql.exec('COMMIT');return rows;}catch(e){sql.exec('ROLLBACK');throw e;}}};
  let clock=1_792_188_000_000;
  const repo=new GrowthRepository(db as any),service=new GrowthService(repo,()=>++clock);
  async function request(path:string,data?:unknown,user:typeof owner|null=owner,extra:Record<string,string>={}){const r=await service.handle(new Request(origin+'/api/growth/'+path,{method:data?'POST':'GET',headers:data?{Origin:origin,'Content-Type':'application/json',...extra}:extra,body:data?JSON.stringify(data):undefined}),user);return {status:r.status,body:await r.json() as any,headers:r.headers};}
  return {repo,sql,request};
}
const topic=(id=crypto.randomUUID())=>({id,version:0,title:'工作与生活的边界',baseline:'总是临时接下所有事情',direction:'把重要的时间留给自己'});
const moment=(topicId:string,day='2025-10-17',id=crypto.randomUUID())=>({id,topicId,version:0,occurredOn:day,kind:'experience',event:'临时收到新的工作请求',observation:'我立刻答应了',feedback:'尚未尝试',reflection:'我担心拒绝会影响关系',action:'下次先问清时间安排'});
test('growth requires app identity, isolates both accounts, and never caches private records',async()=>{
  const h=harness();assert.equal((await h.request('topics',undefined,null)).status,401);
  const t=topic();assert.equal((await h.request('topic',t)).status,200);
  const mine=await h.request('topics');assert.equal(mine.body.items.length,1);assert.equal(mine.headers.get('Cache-Control'),'private, no-store');
  assert.deepEqual((await h.request('topics',undefined,other)).body.items,[]);
  for(const path of ['moments?topic='+t.id,'export?topic='+t.id,'revisions?id='+t.id+'&kind=topic'])assert.equal((await h.request(path,undefined,other)).status,404);
  assert.equal((await h.request('topic',{...t,version:1},other)).status,404);
});
test('growth writes reject cross-origin, invalid dates, invalid types and oversized fields',async()=>{
  const h=harness(),t=topic();assert.equal((await h.request('topic',t,owner,{Origin:'https://evil.test'})).status,403);
  assert.equal((await h.request('topic',t,owner,{'Sec-Fetch-Site':'cross-site'})).status,403);
  assert.equal((await h.request('topic',{...t,title:' '})).status,400);await h.request('topic',t);
  assert.equal((await h.request('moment',moment(t.id,'2025-02-30'))).status,400);
  assert.equal((await h.request('moment',{...moment(t.id),kind:'diagnosis'})).status,400);
  assert.equal((await h.request('moment',{...moment(t.id),reflection:'a'.repeat(6001)})).status,400);
  assert.equal(validDay('2024-02-29'),true);assert.equal(validDay('2025-02-29'),false);
});
test('cross-year timeline preserves occurrence date separately from actual recording time',async()=>{
  const h=harness(),t=topic();await h.request('topic',t);const a=moment(t.id,'2024-12-20'),b=moment(t.id,'2026-01-10');
  await h.request('moment',b);await h.request('moment',a);
  const page=(await h.request('moments?topic='+t.id)).body;
  assert.equal(page.first.id,a.id);assert.equal(page.latest.id,b.id);assert.deepEqual(page.items.map((r:any)=>r.occurredOn),['2026-01-10','2024-12-20']);assert.ok(page.first.createdAt>new Date(a.occurredOn).getTime());
});
test('each content edit preserves original words; stale version cannot overwrite or add a revision',async()=>{
  const h=harness(),t=topic();await h.request('topic',t);const m=moment(t.id);await h.request('moment',m);
  await h.request('moment',{...m,version:1,reflection:'现在理解：可以协商，而不是立即答应'});
  const stale=await h.request('moment',{...m,version:1,reflection:'旧页面覆盖'});assert.equal(stale.status,409);
  const history=(await h.request('revisions?id='+m.id+'&kind=moment')).body.items;
  assert.equal(history.length,2);assert.equal(JSON.parse(history[1].snapshot).reflection,m.reflection);assert.equal(JSON.parse(history[0].snapshot).reflection,'现在理解：可以协商，而不是立即答应');
  assert.equal((await h.request('revisions?id='+m.id+'&kind=moment',undefined,other)).status,404);
});
test('topic baseline edits have immutable versions and stale writes are rejected',async()=>{
  const h=harness(),t=topic();await h.request('topic',t);await h.request('topic',{...t,version:1,baseline:'开始尝试先问清任务的优先级'});
  assert.equal((await h.request('topic',{...t,version:1})).status,409);
  const rows=(await h.request('revisions?id='+t.id+'&kind=topic')).body.items;assert.equal(rows.length,2);assert.equal(JSON.parse(rows[1].snapshot).baseline,t.baseline);
});
test('reversible archive retains words; topic archive blocks new and stale moment writes',async()=>{
  const h=harness(),t=topic(),m=moment(t.id);await h.request('topic',t);await h.request('moment',m);
  await h.request('archive',{id:m.id,kind:'moment',version:1,deleted:1});assert.equal((await h.repo.moment(owner.userId,m.id))!.deleted,1);
  assert.equal((await h.request('moments?topic='+t.id)).body.first,null);
  await h.request('archive',{id:m.id,kind:'moment',version:2,deleted:0});assert.equal((await h.repo.moment(owner.userId,m.id))!.event,m.event);
  await h.request('archive',{id:t.id,kind:'topic',version:1,deleted:1});assert.equal((await h.request('moment',moment(t.id))).status,404);
  assert.equal((await h.request('archive',{id:m.id,kind:'moment',version:3,deleted:1})).status,409);
  await h.request('archive',{id:t.id,kind:'topic',version:2,deleted:0});assert.equal((await h.request('moment',moment(t.id))).status,200);
});
test('pagination reaches all cross-year moments without duplicates; bounds include unloaded oldest record',async()=>{
  const h=harness(),t=topic();await h.request('topic',t);for(let n=0;n<34;n++)await h.request('moment',moment(t.id,`${2020+Math.floor(n/12)}-${String(n%12+1).padStart(2,'0')}-01`));
  const p=(await h.request('moments?topic='+t.id)).body;assert.equal(p.items.length,30);assert.equal(p.first.occurredOn,'2020-01-01');
  const q=(await h.request('moments?topic='+t.id+'&cursor='+encodeURIComponent(p.next))).body;assert.equal(q.items.length,4);assert.equal(q.next,null);assert.equal(new Set([...p.items,...q.items].map(x=>x.id)).size,34);
});
test('export contains archived data and immutable history, scoped to selected topic and owner',async()=>{
  const h=harness(),t=topic(),second=topic();await h.request('topic',t);await h.request('topic',second);const m=moment(t.id);await h.request('moment',m);await h.request('moment',{...m,version:1,event:'之后补充的事实'});await h.request('archive',{id:m.id,kind:'moment',version:2,deleted:1});await h.request('moment',moment(second.id));
  const result=(await h.request('export?topic='+t.id)).body;assert.equal(result.items.filter((x:any)=>x.type==='topic').length,1);assert.equal(result.items.filter((x:any)=>x.type==='moment').length,1);assert.equal(result.items.find((x:any)=>x.type==='moment').data.deleted,1);assert.equal(result.items.filter((x:any)=>x.type==='revision').length,3);assert.equal(result.next,null);
  assert.equal((await h.request('export?topic='+t.id,undefined,other)).status,404);
});
test('repeated creation id does not create duplicate moments after a lost response',async()=>{
  const h=harness(),t=topic();await h.request('topic',t);const m=moment(t.id);assert.equal((await h.request('moment',m)).status,200);assert.equal((await h.request('moment',m)).status,409);assert.equal((await h.request('moments?topic='+t.id)).body.items.length,1);
});
