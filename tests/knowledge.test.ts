import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {knowledgePage} from '../src/knowledge.ts';

test('integrated knowledge distribution has six separate domains and an acyclic, reachable hierarchy',()=>{
 const data=JSON.parse(readFileSync(new URL('../public/knowledge-universe/knowledge.json',import.meta.url),'utf8'));
 const nodes=new Map<string,any>(data.nodes.map((n:any)=>[n.id,n]));
 assert.equal(data.domains.length,6);assert.equal(nodes.get('math').title,'数学');assert.equal(nodes.get('physics').title,'物理');
 for(const node of nodes.values()){
  const seen=new Set<string>();let current=node;
  while(current.parent){assert.ok(!seen.has(current.id));seen.add(current.id);assert.ok(nodes.has(current.parent));current=nodes.get(current.parent);}
  assert.equal(current.id,'universe');
 }
 assert.equal(nodes.get('moon').parent,'earth');assert.equal(nodes.get('earth').parent,'solar');assert.equal(nodes.get('solar').parent,'galaxy');
 for(const link of data.links){assert.ok(nodes.has(link.source));assert.ok(nodes.has(link.target));assert.ok(['relation','hierarchy'].includes(link.kind));}
});
test('knowledge module supplies an accessible same-origin frame and a separate reading entry',()=>{
 const html=knowledgePage();assert.match(html,/title="交互式3D知识宇宙/);assert.match(html,/src="\/knowledge-universe\/index.html\?embedded=1"/);assert.match(html,/href="#growth"/);
});
