import {test} from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {DatabaseSync} from 'node:sqlite';
import {aiMode,aiPrompt,aiFingerprint} from '../src/ai-context.ts';
import {topicAIContext,momentAIContext} from '../src/growth-ai-context.ts';
import {initializeIntegrations,createIntegrations} from '../local/integrations.mjs';

test('empty input guides, meaningful input expands, and each domain keeps its own questions',async()=>{
 assert.equal(aiMode(' \n '),'guide');assert.equal(aiMode('我观察到一次变化'),'summary');
 assert.match(aiPrompt('investment','投资依据','guide'),/不要替用户编造/);
 assert.match(aiPrompt('investment','投资依据','summary'),/不要编造实时行情/);
 assert.match(aiPrompt('growth','家庭环境','summary'),/不做心理诊断/);
 assert.match(aiPrompt('knowledge','我的理解','guide'),/句式/);
 assert.notEqual(await aiFingerprint('版本一'),await aiFingerprint('版本二'));
});
test('growth source text is canonical across unsaved fields and persisted records, while real changes remain visible',()=>{
 const fields={title:'主题 B',baseline:' 当前处境 ',direction:''};
 const saved={id:'b',title:'主题 B',baseline:'当前处境',direction:'',environmentProfile:null};
 assert.equal(topicAIContext(fields),topicAIContext(saved));assert.ok(!topicAIContext(fields).includes('主题 A'));
 assert.notEqual(topicAIContext(saved),topicAIContext({...saved,title:'实际改过的标题'}));
 const m={occurredOn:'2026-11-03',kind:'experience',event:' 比较两份资料 ',observation:'不同样本',feedback:'',reflection:'',action:''};
 assert.equal(momentAIContext('主题 B',m),momentAIContext('主题 B',{...m,event:'比较两份资料'},null,''));
 assert.notEqual(momentAIContext('主题 B',m),momentAIContext('主题 B',{...m,event:'新增事件'}));
});
test('old analysis migrates without rewriting its original content and scoped history survives reopening',async t=>{
 const dir=fs.mkdtempSync(path.join(os.tmpdir(),'atlas-inline-ai-')),file=path.join(dir,'test.sqlite');
 let db=new DatabaseSync(file),calls=0;
 t.after(()=>{db.close();fs.rmSync(dir,{recursive:true,force:true});});
 db.exec('CREATE TABLE local_ai_runs(id TEXT PRIMARY KEY,prompt TEXT NOT NULL,context TEXT NOT NULL,answer TEXT NOT NULL,model TEXT NOT NULL,endpoint TEXT NOT NULL,created_at INTEGER NOT NULL)');
 db.prepare('INSERT INTO local_ai_runs VALUES (?,?,?,?,?,?,?)').run('old','旧问题','旧资料','旧结果','old-model','http://localhost:11434/v1',123);
 initializeIntegrations(db);initializeIntegrations(db);
 const make=()=>createIntegrations({getDb:()=>db,dataDir:dir,fetcher:async()=>{calls++;return new Response(JSON.stringify({choices:[{message:{content:'测试结果，未调用真实模型。'}}]}));}});
 let service=make();await service.handle('connections/ai','POST',{endpoint:'http://localhost:11434/v1',model:'fixture'});
 const old=(await service.handle('ai/history','POST',{scopeType:'legacy',scopeId:''})).items[0];
 assert.equal(old.context,'旧资料');assert.equal(old.answer,'旧结果');assert.equal(old.created_at,123);
 await assert.rejects(()=>service.handle('ai/analyze','POST',{prompt:'q',consent:true,scopeType:'growth',scopeId:'a',mode:'invalid'}));assert.equal(calls,0);
 const hash=await aiFingerprint('当前原文');
 const run=await service.handle('ai/analyze','POST',{prompt:aiPrompt('growth','观察','guide'),context:'当前原文',consent:true,scopeType:'growth',scopeId:'record-a:observation',scopeLabel:'观察',mode:'guide',sourceHash:hash});
 await service.handle('ai/analyze','POST',{prompt:'总结另一条',context:'另一条资料',consent:true,scopeType:'investment',scopeId:'record-b',mode:'summary'});
 assert.equal((await service.handle('ai/history','POST',{scopeType:'growth',scopeId:'record-b'})).items.length,0);
 db.close();db=new DatabaseSync(file);service=make();
 const history=(await service.handle('ai/history','POST',{scopeType:'growth',scopeId:'record-a:observation'})).items;
 assert.equal(history.length,1);assert.equal(history[0].id,run.id);assert.equal(history[0].source_hash,hash);assert.equal(history[0].mode,'guide');assert.equal(calls,2);
});
