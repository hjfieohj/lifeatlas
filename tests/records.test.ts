import {test} from 'node:test';
import assert from 'node:assert/strict';
import {filterRecords,emptyFilter,validateEntries,type Entry} from '../local/records.ts';
import {growthPageHeader} from '../src/growth-presentation.ts';
const entry=(id:string,body:string,extra:Partial<Entry>={}):Entry=>({id,kind:'investment',title:'资料 '+id,body,category:'股票',date:'2026-11-03',done:false,created:1,updated:1,...extra});
test('records search intersects query/category/status and excludes recycled rows without changing originals',()=>{
 const items=[entry('a','Bayes 新证据'),entry('b','bayes 比较',{category:'基金 / ETF',done:true}),entry('c','Bayes 已移出',{deleted:100})],f=emptyFilter();f.query=' BAYES ';
 assert.deepEqual(filterRecords(items,f).map(e=>e.id),['a','b']);f.category='基金 / ETF';f.status='done';assert.deepEqual(filterRecords(items,f).map(e=>e.id),['b']);f.status='pending';assert.equal(filterRecords(items,f).length,0);assert.equal(items[2].deleted,100);delete items[2].deleted;assert.equal(filterRecords(items,emptyFilter()).length,3);
});
test('record validation accepts existing v1 rows and rejects malformed values before rendering',()=>{assert.ok(validateEntries([entry('a','保留原文')]));assert.ok(validateEntries([entry('a','',{deleted:123})]));assert.ok(!validateEntries([entry('a','',{created:NaN})]));assert.ok(!validateEntries([{...entry('a',''),done:'yes'}]));assert.ok(!validateEntries([{...entry('a',''),kind:'demo'}]));});
test('growth local storage disclosure describes local data and intentional AI sending accurately',()=>{const html=growthPageHeader('moment',true);assert.match(html,/这台电脑，无需登录/);assert.match(html,/主动预览并发送/);assert.ok(!html.includes('本机测试数据库'));assert.ok(!html.includes('保存于当前生活空间的云端'));});
