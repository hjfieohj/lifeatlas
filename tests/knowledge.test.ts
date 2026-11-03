import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {knowledgePage} from '../src/knowledge.ts';

test('integrated knowledge distribution keeps math/physics separate and includes politics/capital in a reachable hierarchy',()=>{
 const data=JSON.parse(readFileSync(new URL('../public/knowledge-universe/knowledge.json',import.meta.url),'utf8'));
 const nodes=new Map<string,any>(data.nodes.map((n:any)=>[n.id,n]));
 assert.equal(data.domains.length,7);assert.equal(nodes.get('math').title,'数学');assert.equal(nodes.get('physics').title,'物理');assert.equal(nodes.get('politics-capital').title,'政治与资本');
 for(const node of nodes.values()){
  const seen=new Set<string>();let current=node;
  while(current.parent){assert.ok(!seen.has(current.id));seen.add(current.id);assert.ok(nodes.has(current.parent));current=nodes.get(current.parent);}
  assert.equal(current.id,'universe');
 }
 assert.equal(nodes.get('moon').parent,'earth');assert.equal(nodes.get('earth').parent,'solar');assert.equal(nodes.get('solar').parent,'galaxy');
 for(const link of data.links){assert.ok(nodes.has(link.source));assert.ok(nodes.has(link.target));assert.ok(['relation','hierarchy'].includes(link.kind));}
});

test('politics and capital covers the requested six branches, linked study routes and node-specific sources',()=>{
 const data=JSON.parse(readFileSync(new URL('../public/knowledge-universe/knowledge.json',import.meta.url),'utf8'));
 const added=data.nodes.filter((n:any)=>n.domain==='politics-capital');
 assert.equal(added.length,42);assert.equal(data.nodes.filter((n:any)=>n.domain!=='politics-capital').length,113);
 assert.deepEqual(added.filter((n:any)=>n.parent==='politics-capital').map((n:any)=>n.id),['pc-politicians','pc-capitalists','pc-relations','pc-daily-life','pc-psychology','pc-research']);
 for(const n of added){assert.ok(n.detail.length>60);assert.ok(n.example);assert.ok(n.sources.length>0);for(const s of n.sources){assert.ok(s.title);assert.equal(new URL(s.url).protocol,'https:');}}
 for(const id of ['pc-political-goals','pc-capital-goals','pc-political-means','pc-capital-means','pc-political-benefits-risks','pc-capital-benefits-risks','pc-political-worldview','pc-capital-worldview','pc-political-values','pc-capital-values'])assert.ok(added.some((n:any)=>n.id===id));
 assert.equal(data.routes.filter((r:any)=>r.domain==='politics-capital').length,3);
 assert.ok(data.links.some((l:any)=>l.source==='pc-motive-evidence'&&l.target==='causality'));
 const root=added.find((n:any)=>n.id==='politics-capital');assert.match(root.detail,/个体|人格/);
 assert.match(added.find((n:any)=>n.id==='pc-psychology').detail,/差异|不同/);
 const runtime=readFileSync(new URL('../public/knowledge-universe/app.js',import.meta.url),'utf8');assert.match(runtime,/Array\.isArray\(n\.sources\)/);
});
test('knowledge module supplies an accessible same-origin frame and a separate reading entry',()=>{
 const html=knowledgePage();assert.match(html,/title="交互式3D知识宇宙/);assert.match(html,/src="\/knowledge-universe\/index.html\?embedded=1"/);assert.match(html,/href="#growth"/);
});
