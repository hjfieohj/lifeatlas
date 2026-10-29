import { test } from 'node:test';
import assert from 'node:assert/strict';
import { DatabaseSync } from 'node:sqlite';
import { readFileSync } from 'node:fs';
import { GrowthRepository } from '../server/growth-repository.ts';
import { GrowthService } from '../server/growth-service.ts';
import { validDay } from '../src/growth-model.ts';
import {blankGuidance} from '../src/environment-advisor.ts';
import {blankProfile} from '../src/environment-model.ts';
const origin='https://lifeatlas.test',owner={userId:'first'},other={userId:'second'};
function harness(){
  const sql=new DatabaseSync(':memory:');
  sql.exec(readFileSync(new URL('../drizzle/0001_thin_katie_power.sql',import.meta.url),'utf8'));
  sql.exec(readFileSync(new URL('../drizzle/0002_sloppy_star_brand.sql',import.meta.url),'utf8'));
  sql.exec(readFileSync(new URL('../drizzle/0003_polite_cloak.sql',import.meta.url),'utf8'));
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
test('history search spans pages, binds literal keywords, respects inclusive dates and account isolation',async()=>{
  const h=harness(),t=topic();await h.request('topic',t);
  for(let i=0;i<36;i++)await h.request('moment',{...moment(t.id,`2025-${i<28?'01':'02'}-${String(i<28?i+1:i-27).padStart(2,'0')}`),event:i===0?"边界 ' OR 1=1 --":'边界协商'});
  const path='moments?topic='+t.id+'&q='+encodeURIComponent('边界')+'&from=2025-01-01&to=2025-02-08';
  const first=(await h.request(path)).body,second=(await h.request(path+'&cursor='+encodeURIComponent(first.next))).body;
  assert.equal(first.items.length,30);assert.equal(second.items.length,6);assert.equal(new Set([...first.items,...second.items].map((m:any)=>m.id)).size,36);
  assert.equal(first.first.occurredOn,'2025-01-01');assert.equal(first.latest.occurredOn,'2025-02-08');
  assert.equal((await h.request('moments?topic='+t.id+'&q='+encodeURIComponent("' OR 1=1 --"))).body.items.length,1);
  const one=(await h.request('moments?topic='+t.id+'&from=2025-01-01&to=2025-01-01')).body;assert.equal(one.items.length,1);
  assert.equal((await h.request(path,undefined,other)).status,404);assert.equal((await h.request('attempts?topic='+t.id,undefined,other)).status,404);
  for(const suffix of ['&from=2025-02-30','&from=2026-01-01&to=2025-01-01','&q='+('a'.repeat(121))])assert.equal((await h.request('moments?topic='+t.id+suffix)).status,400);
});

test('feedback freezes its source; edits and archive do not rewrite evidence or invent follow-up',async()=>{
  const h=harness(),t=topic(),source=moment(t.id);await h.request('topic',t);await h.request('moment',source);
  const response={...moment(t.id,'2026-10-19'),feedback:'问清时间后，协商成功',sourceId:source.id,sourceVersion:1};
  const saved=await h.request('moment',response);assert.equal(saved.status,200);const context=JSON.parse(saved.body.item.context);
  assert.equal(context.source.action,source.action);assert.equal(context.source.version,1);
  const attempts=()=>h.request('attempts?topic='+t.id);assert.equal((await attempts()).body.items.find((m:any)=>m.id===source.id).feedbackCount,1);
  await h.request('moment',{...source,version:1,reflection:'现在有新理解'});assert.equal((await attempts()).body.items.find((m:any)=>m.id===source.id).feedbackCount,1);
  await h.request('moment',{...source,version:2,action:'下次提出两个方案'});assert.equal((await attempts()).body.items.find((m:any)=>m.id===source.id).feedbackCount,0);
  const updated=await h.request('moment',{...response,version:1,event:'补充这次反馈',context:{source:{action:'伪造'}}});assert.equal(updated.status,200);assert.deepEqual(JSON.parse(updated.body.item.context),context);
  const exported=(await h.request('export?topic='+t.id)).body.items.find((r:any)=>r.type==='moment'&&r.data.id===response.id);assert.deepEqual(exported.data.context,context);
  const revisions=(await h.request('revisions?id='+response.id+'&kind=moment')).body.items;assert.deepEqual(JSON.parse(JSON.parse(revisions[1].snapshot).context),context);
  await h.request('moment',{...source,version:3,action:source.action});assert.equal((await attempts()).body.items.find((m:any)=>m.id===source.id).feedbackCount,1);
  await h.request('archive',{id:response.id,kind:'moment',version:2,deleted:1});assert.equal((await attempts()).body.items.find((m:any)=>m.id===source.id).feedbackCount,0);
  await h.request('archive',{id:response.id,kind:'moment',version:3,deleted:0});assert.equal((await attempts()).body.items.find((m:any)=>m.id===source.id).feedbackCount,1);
});

test('linked feedback rejects stale, private, cross-topic, undated and empty results',async()=>{
  const h=harness(),t=topic(),t2=topic(),source=moment(t.id),foreign=moment(t2.id);await h.request('topic',t);await h.request('topic',t2);await h.request('moment',source);await h.request('moment',foreign);
  const reply=(extra={})=>({...moment(t.id,'2026-10-19'),sourceId:source.id,sourceVersion:1,...extra});
  for(const [extra,status] of [[{sourceVersion:0},409],[{sourceId:foreign.id},404],[{feedback:''},400],[{occurredOn:'2024-01-01'},400],[{id:source.id},409]] as const)assert.equal((await h.request('moment',reply(extra))).status,status);
  const privateTopic=topic();await h.request('topic',privateTopic,other);const privateMoment=moment(privateTopic.id);await h.request('moment',privateMoment,other);assert.equal((await h.request('moment',reply({sourceId:privateMoment.id}))).status,404);
  await h.request('moment',{...source,version:1,action:''});assert.equal((await h.request('moment',reply({sourceVersion:2}))).status,404);
  assert.equal((await h.request('moments?topic='+t.id)).body.items.length,1);
});

test('stage review freezes selected originals and preserves references through revision and export',async()=>{
  const h=harness(),t=topic(),source=moment(t.id);await h.request('topic',t);await h.request('moment',source);
  const review={...moment(t.id,'2026-10-19'),kind:'review',reviewFrom:'2025-01-01',reviewTo:'2025-12-31',reviewRefs:[{id:source.id,version:1}]};
  const saved=await h.request('moment',review);assert.equal(saved.status,200);const context=JSON.parse(saved.body.item.context);assert.equal(context.review.refs[0].reflection,source.reflection);
  await h.request('moment',{...source,version:1,reflection:'后来的理解'});
  const edited=await h.request('moment',{...review,version:1,event:'补充阶段理解',reviewRefs:[],context:{}});assert.deepEqual(JSON.parse(edited.body.item.context),context);
  const exported=(await h.request('export?topic='+t.id)).body.items.find((r:any)=>r.type==='moment'&&r.data.id===review.id);assert.deepEqual(exported.data.context,context);
  const revision=(await h.request('revisions?id='+review.id+'&kind=moment')).body.items.at(-1);assert.deepEqual(JSON.parse(JSON.parse(revision.snapshot).context),context);
});

test('review selections validate date, identity, topic, duplicates and current source version',async()=>{
  const h=harness(),t=topic(),t2=topic(),source=moment(t.id),foreign=moment(t2.id);await h.request('topic',t);await h.request('topic',t2);await h.request('moment',source);await h.request('moment',foreign);
  const review=(extra={})=>({...moment(t.id,'2026-10-19'),kind:'review',reviewFrom:'2025-01-01',reviewTo:'2025-12-31',reviewRefs:[{id:source.id,version:1}],...extra});
  for(const [extra,status] of [[{reviewFrom:'2026-01-01'},400],[{reviewFrom:'2025-11-01'},404],[{reviewRefs:[{id:source.id,version:0}]},409],[{reviewRefs:[{id:source.id,version:1},{id:source.id,version:1}]},400],[{reviewRefs:Array(21).fill({id:source.id,version:1})},400],[{reviewRefs:[{id:foreign.id,version:1}]},404]] as const)assert.equal((await h.request('moment',review(extra))).status,status);
  await h.request('archive',{id:source.id,kind:'moment',version:1,deleted:1});assert.equal((await h.request('moment',review())).status,404);
  assert.equal((await h.request('moments?topic='+t.id)).body.items.length,1);
});
const environment=(extra:Record<string,unknown>={})=>({asOf:'2025-01-01',family:'与家人共同生活，需要照顾长辈',work:'小型公司，同事之间常临时协调',place:'县城，通勤二十分钟',society:'当地政策尚待核实',culture:'亲身经历中比较重视人情往来',supports:'家人可以分担照护',constraints:'岗位选择有限',sources:'本人观察；政策未核实',...extra});

test('environment profiles are versioned, owner scoped, and preserved by older topic clients',async()=>{
  const h=harness(),t=topic();assert.equal((await h.request('topic',{...t,environmentProfile:environment()})).status,200);
  const oldClient=await h.request('topic',{...t,version:1,baseline:'补充起点'});assert.equal(JSON.parse(oldClient.body.item.environmentProfile).place,'县城，通勤二十分钟');
  const moved=await h.request('topic',{...t,version:2,environmentProfile:environment({asOf:'2026-01-01',place:'迁居城市'})});assert.equal(moved.status,200);
  assert.equal((await h.request('topic',{...t,version:2,environmentProfile:environment()})).status,409);
  assert.equal((await h.request('topic',{...t,version:3,environmentProfile:environment()},other)).status,404);
  const revisions=(await h.request('revisions?id='+t.id+'&kind=topic')).body.items;assert.equal(JSON.parse(JSON.parse(revisions.at(-1).snapshot).environmentProfile).place,'县城，通勤二十分钟');
  const legacy=topic();await h.request('topic',legacy);assert.deepEqual(JSON.parse((await h.repo.topic(owner.userId,legacy.id))!.environmentProfile!),{});
});

test('a moment explicitly freezes its own environment; later profile updates and export retain both periods',async()=>{
  const h=harness(),t=topic();await h.request('topic',{...t,environmentProfile:environment()});const m=moment(t.id);
  const saved=await h.request('moment',{...m,environment:environment(),environmentImpact:'照护责任限制了加班时间'});assert.equal(saved.status,200);
  await h.request('topic',{...t,version:1,environmentProfile:environment({asOf:'2026-01-01',place:'迁居城市'})});
  const stored=JSON.parse((await h.repo.moment(owner.userId,m.id))!.context!);assert.equal(stored.environment.place,'县城，通勤二十分钟');assert.equal(stored.environmentImpact,'照护责任限制了加班时间');
  const noSnapshot=moment(t.id,'2024-01-01');await h.request('moment',noSnapshot);assert.equal(JSON.parse((await h.repo.moment(owner.userId,noSnapshot.id))!.context!).environment,undefined);
  const exported=(await h.request('export?topic='+t.id)).body.items;assert.equal(exported.find((r:any)=>r.type==='topic').data.environmentProfile.place,'迁居城市');assert.equal(exported.find((r:any)=>r.type==='moment'&&r.data.id===m.id).data.context.environment.place,'县城，通勤二十分钟');
});

test('environment validates chronology, content, length and canonical fields before writing',async()=>{
  const h=harness(),t=topic();await h.request('topic',t);
  for(const value of [environment({asOf:'2025-02-30'}),environment({family:{private:true}}),environment({family:'x'.repeat(1501)})])assert.equal((await h.request('topic',{...t,version:1,environmentProfile:value})).status,400);
  assert.equal((await h.request('topic',{...t,version:1,environmentProfile:{asOf:'2025-01-01'}})).status,400);
  assert.equal((await h.request('moment',{...moment(t.id,'2024-12-31'),environment:environment()})).status,400);
  assert.equal((await h.request('moment',{...moment(t.id),environment:null,environmentImpact:'只有影响，没有环境'})).status,400);
  const m=moment(t.id);const result=await h.request('moment',{...m,environment:environment({owner:'second',privateFlag:true}),environmentImpact:'观察'});assert.equal(result.status,200);assert.equal(JSON.parse(result.body.item.context).environment.owner,undefined);
});

test('correcting or removing a moment environment keeps historical evidence and feedback source intact',async()=>{
  const h=harness(),t=topic(),source=moment(t.id);await h.request('topic',t);await h.request('moment',source);
  const m={...moment(t.id,'2026-10-25'),sourceId:source.id,sourceVersion:1,environment:environment(),environmentImpact:'家庭照护影响安排'};await h.request('moment',m);
  const edited=await h.request('moment',{...m,version:1,environment:environment({family:'更正照护分工'}),environmentImpact:'更正影响'});assert.equal(edited.status,200);assert.equal(JSON.parse(edited.body.item.context).source.id,source.id);
  const removed=await h.request('moment',{...m,version:2,environment:null,environmentImpact:''});assert.equal(removed.status,200);assert.equal(JSON.parse(removed.body.item.context).environment,undefined);assert.equal(JSON.parse(removed.body.item.context).source.id,source.id);
  const history=(await h.request('revisions?id='+m.id+'&kind=moment')).body.items;assert.equal(JSON.parse(JSON.parse(history.at(-1).snapshot).context).environment.family,environment().family);
});

test('review and feedback citations freeze bounded environmental excerpts with their original record',async()=>{
  const h=harness(),t=topic(),source=moment(t.id);await h.request('topic',t);await h.request('moment',{...source,environment:environment({family:'家'.repeat(800)}),environmentImpact:'家庭照护影响了选择'});
  const reply=await h.request('moment',{...moment(t.id,'2026-10-25'),sourceId:source.id,sourceVersion:1});assert.equal(reply.status,200);assert.equal(JSON.parse(reply.body.item.context).source.environment.family.length,300);
  const review=await h.request('moment',{...moment(t.id,'2026-10-25'),kind:'review',reviewFrom:'2025-01-01',reviewTo:'2026-10-25',reviewRefs:[{id:source.id,version:1}]});assert.equal(review.status,200);
  await h.request('moment',{...source,version:1,environment:environment({family:'后来的家庭情况'}),environmentImpact:''});
  assert.equal(JSON.parse((await h.repo.moment(owner.userId,review.body.item.id))!.context!).review.refs[0].environment.family,'家'.repeat(300));
});

test('environment search finds an older snapshot beyond the initially loaded page',async()=>{
  const h=harness(),t=topic();await h.request('topic',t);const old=moment(t.id,'2024-01-01');await h.request('moment',{...old,environment:environment({asOf:'2023-01-01',place:'山间县城'}),environmentImpact:'公共交通影响通勤'});
  for(let i=0;i<31;i++)await h.request('moment',moment(t.id,'2026-01-01'));
  assert.equal((await h.request('moments?topic='+t.id)).body.items.some((m:any)=>m.id===old.id),false);
  for(const q of ['山间县城','公共交通']){const found=(await h.request('moments?topic='+t.id+'&q='+encodeURIComponent(q))).body;assert.equal(found.items.length,1);assert.equal(found.items[0].id,old.id);}
});

test('structured personal stages, locality and new dimensions survive snapshots, validation and export',async()=>{
  const h=harness(),t=topic();const p={...blankProfile(),age:'16',stage:'secondary',settlement:'town',province:'示例省',city:'示例市',district:'示例县'};
  assert.equal((await h.request('topic',{...t,environmentProfile:{asOf:'2025-01-01',profile:p,school:'老师会逐项解释错题',strengths:'喜欢画图'}})).status,200);
  const saved=JSON.parse((await h.repo.topic(owner.userId,t.id))!.environmentProfile!);assert.deepEqual(saved.profile,p);assert.equal(saved.school,'老师会逐项解释错题');
  for(const profile of [[],{...p,age:'121'},{...p,stage:'infer'},{...p,settlement:'poor'},{...p,province:'x'.repeat(81)}])assert.equal((await h.request('topic',{...t,version:1,environmentProfile:{asOf:'2025-01-01',profile}})).status,400);
  const m=moment(t.id);await h.request('moment',{...m,environment:saved});await h.request('topic',{...t,version:1,environmentProfile:{asOf:'2026-01-01',profile:{...p,age:'17'},school:'转学后'}});
  const e=(await h.request('export?topic='+t.id)).body.items.find((i:any)=>i.type==='moment').data.context.environment;assert.equal(e.profile.age,'16');assert.equal(e.school,'老师会逐项解释错题');
});

test('advice is recomputed on server, frozen, owner scoped, searchable and preserved in feedback lineage',async()=>{
  const h=harness(),t=topic();await h.request('topic',t);const m=moment(t.id,'2026-10-29'),input={...blankGuidance(),story:'虚构：任务太多，想找一点学习时间',domain:'work',safety:'safe',constraints:'特殊岗位排班约束'};
  const saved=await h.request('moment',{...m,guidance:{input,selectedPlan:'preferred',report:{summary:'伪造的保证结论'}}});assert.equal(saved.status,200);
  const c=JSON.parse(saved.body.item.context);assert.equal(c.guidance.input.story,input.story);assert.notEqual(c.guidance.report.summary,'伪造的保证结论');assert.equal(saved.body.item.event,input.story);assert.equal(saved.body.item.action,c.guidance.report.plans[0].steps);
  assert.equal((await h.request('moments?topic='+t.id+'&q='+encodeURIComponent('特殊岗位排班约束'))).body.items[0].id,m.id);
  assert.equal((await h.request('revisions?id='+m.id+'&kind=moment',undefined,other)).status,404);
  const follow=await h.request('moment',{...moment(t.id,'2026-10-30'),sourceId:m.id,sourceVersion:1,feedback:'已试了一次'});assert.equal(follow.status,200);assert.equal(JSON.parse(follow.body.item.context).source.action,saved.body.item.action);
  await h.request('moment',{...m,version:1,event:input.story,feedback:'补记结果'});const now=JSON.parse((await h.repo.moment(owner.userId,m.id))!.context!);assert.deepEqual(now.guidance,c.guidance);
  const exported=(await h.request('export?topic='+t.id)).body.items;assert.deepEqual(exported.find((r:any)=>r.type==='moment'&&r.data.id===m.id).data.context.guidance,c.guidance);
});

test('server rejects unsafe, invalid or retrospective overwritten guidance without persisting a record',async()=>{
  const h=harness(),t=topic();await h.request('topic',t);const input={...blankGuidance(),story:'虚构：有安全担忧',safety:'danger'};
  for(const guidance of [null,{input,selectedPlan:'compromise'},{input,selectedPlan:'guaranteed'},{input:{...input,age:'200'},selectedPlan:'preferred'}])assert.equal((await h.request('moment',{...moment(t.id),guidance})).status,400);
  assert.equal((await h.request('moments?topic='+t.id)).body.items.length,0);
  const m=moment(t.id);await h.request('moment',{...m,guidance:{input,selectedPlan:'preferred'}});
  assert.equal((await h.request('moment',{...m,version:1,guidance:{input,selectedPlan:'pause'}})).status,400);
});
