const fs = require('node:fs');
const path = require('node:path');
const file = name => path.join(__dirname,name);
const data = JSON.parse(fs.readFileSync(file('knowledge.json'),'utf8'));
if (!Array.isArray(data.nodes)||!Array.isArray(data.links)||!Array.isArray(data.domains)||!Array.isArray(data.routes)) throw new Error('Missing data arrays');
const ids = new Set(data.nodes.map(n=>n.id));
const domains = new Set(data.domains.map(d=>d.id));
if(ids.size!==data.nodes.length)throw new Error('Duplicate node id');
const byId=new Map(data.nodes.map(n=>[n.id,n]));
for(const n of data.nodes){
  if(!/^[a-z0-9-]+$/.test(n.id)||(!domains.has(n.domain)&&n.id!=='universe')||!n.title||!n.summary)throw new Error('Invalid node: '+n.id);
  if(n.id!=='universe'&&!ids.has(n.parent))throw new Error('Missing parent: '+n.id);
  let current=n,seen=new Set(),depth=0;
  while(current.parent){if(seen.has(current.id))throw new Error('Hierarchy cycle: '+n.id);seen.add(current.id);current=byId.get(current.parent);if(!current)throw new Error('Missing ancestor');depth++;}
  n.depth=depth;
}
for(const l of data.links)if(!ids.has(l.source)||!ids.has(l.target)||!l.reason)throw new Error('Invalid relationship');
for(const r of data.routes)if(!r.nodes.every(id=>ids.has(id)))throw new Error('Invalid route');
fs.writeFileSync(file('knowledge.json'),JSON.stringify(data,null,2)+'\n');
fs.writeFileSync(file('knowledge.js'),'window.KNOWLEDGE = '+JSON.stringify(data)+';\n');
console.log('Synchronized '+data.nodes.length+' nodes, '+data.links.length+' relationships.');
