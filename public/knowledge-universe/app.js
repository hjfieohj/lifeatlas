'use strict';
(async () => {
  await window.LIFEATLAS_LOCAL_READY;
  const K = window.KNOWLEDGE;
  const $ = (s, p = document) => p.querySelector(s);
  const $$ = (s, p = document) => [...p.querySelectorAll(s)];
  const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const icon = name => `<svg class="icon" aria-hidden="true"><use href="#i-${name}"/></svg>`;
  const domainInfo = id => K.domains.find(d => d.id === id)||{id:'universe',name:'知识宇宙',color:'#b9deeb'};
  const color = id => domainInfo(id).color;
  const dot = id => `<i class="dot" style="--domain-color:${color(id)}" aria-hidden="true"></i>`;
  const embedded=new URLSearchParams(location.search).get('embedded')==='1';
  const storageKey = 'atlas-knowledge-universe-v1';
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const duration = reduced ? 0 : 650;
  const baseIds = new Set(K.nodes.map(n => n.id));
  const domainIds = new Set(K.domains.map(d => d.id));
  const baseDomains=K.domains.map(d=>({...d}));
  let saved = {galaxies:[],custom:[],favorites:[],learned:[],notes:{}};
  let storageAvailable = true;
  let importWarning = '';
  const safeURL = value => {
    try { const u = new URL(value); return ['https:','http:'].includes(u.protocol) ? u.href : ''; }
    catch { return ''; }
  };
  function validateBackup(raw) {
    if (!raw || typeof raw !== 'object' || Array.isArray(raw)) throw new Error('这不是有效的宇宙备份。');
    if (raw.format && raw.format !== 'atlas-knowledge-universe') throw new Error('备份格式不受支持。');
    if (raw.version !== undefined && ![1,2].includes(raw.version)) throw new Error('备份版本不受支持，请使用第1版或第2版备份。');
    const custom = raw.custom ?? [];
    const galaxies=raw.galaxies??[];
    if(!Array.isArray(galaxies)||galaxies.length>24)throw new Error('最多可以创建24个独立星云。');
    const galaxyIds=new Set();
    const cleanGalaxies=galaxies.map(g=>{if(!g||typeof g.id!=='string'||!/^nebula-[a-z0-9-]{1,70}$/.test(g.id)||galaxyIds.has(g.id)||typeof g.name!=='string'||!g.name.trim()||g.name.length>80||typeof g.description!=='string'||g.description.length>300||!/^#[0-9a-fA-F]{6}$/.test(g.color))throw new Error('星云名称、编号或颜色格式无效。');galaxyIds.add(g.id);return {id:g.id,name:g.name.trim(),description:g.description,color:g.color};});
    const validDomains=new Set([...domainIds,...galaxyIds]);
    if (!Array.isArray(custom) || custom.length > 500) throw new Error('自定义节点最多可导入500个。');
    const ids = new Set([...baseIds,...galaxyIds]);
    const cleaned = custom.map(n => {
      if (!n || typeof n !== 'object' || typeof n.id !== 'string' || !/^custom-[a-z0-9-]{1,70}$/.test(n.id) || ids.has(n.id)) throw new Error('节点编号无效或重复。');
      if (!validDomains.has(n.domain) || typeof n.title !== 'string' || !n.title.trim() || n.title.length > 80 || typeof n.summary !== 'string' || !n.summary.trim() || n.summary.length > 300) throw new Error('节点名称、说明或所属领域无效。');
      if (n.detail != null && (typeof n.detail !== 'string' || n.detail.length > 8000)) throw new Error('节点详细内容超出限制。');
      if (n.url && (typeof n.url !== 'string' || n.url.length > 1200 || !safeURL(n.url))) throw new Error('参考链接需要使用 http 或 https。');
      if (n.related != null && (!Array.isArray(n.related) || n.related.length > 600 || n.related.some(id => typeof id !== 'string'))) throw new Error('关联节点格式不正确。');
      ids.add(n.id);
      return {id:n.id,title:n.title.trim(),domain:n.domain,parent:typeof n.parent==='string'?n.parent:n.domain,summary:n.summary.trim(),detail:n.detail || '',url:n.url ? safeURL(n.url) : '',documentId:typeof n.documentId==='string'&&/^doc-[a-f0-9-]{36}$/.test(n.documentId)?n.documentId:'',related:[...new Set(n.related || [])]};
    });
    for (const n of cleaned) if (n.related.some(id => !ids.has(id) || id === n.id)) throw new Error('备份中有不存在或指向自身的关联节点。');
    const structure=new Map(K.nodes.concat(cleanGalaxies.map(g=>({id:g.id,domain:g.id,parent:'universe'})),cleaned).map(n=>[n.id,n]));
    for(const n of cleaned){
      if(!ids.has(n.parent)||n.parent===n.id||structure.get(n.parent)?.domain!==n.domain)throw new Error('父级框架需要属于同一星系，并且不能是节点本身。');
      let current=n,seen=new Set();while(current?.parent){if(seen.has(current.id))throw new Error('包含层级不能循环。');seen.add(current.id);current=structure.get(current.parent);if(seen.size>32)throw new Error('自定义层级不能超过32层。');}
    }

    function idList(list) {
      if (list === undefined) return [];
      if (!Array.isArray(list) || list.length > 2000 || list.some(x => typeof x !== 'string')) throw new Error('收藏或探索记录格式不正确。');
      return [...new Set(list.filter(id => ids.has(id)))];
    }
    const notes = Object.create(null);
    if (raw.notes != null && (typeof raw.notes !== 'object' || Array.isArray(raw.notes))) throw new Error('笔记格式不正确。');
    for (const [id, note] of Object.entries(raw.notes || {})) {
      if (!ids.has(id)) continue;
      if (typeof note !== 'string' || note.length > 20000) throw new Error('单条笔记最多20,000字。');
      notes[id] = note;
    }
    return {galaxies:cleanGalaxies,custom:cleaned,favorites:idList(raw.favorites),learned:idList(raw.learned),notes};
  }
  try { const raw = localStorage.getItem(storageKey); if (raw) saved = validateBackup(JSON.parse(raw)); }
  catch (error) { importWarning = `本地记录暂时无法读取：${error.message}。可尝试导入导出的JSON备份。`; }
  let nodes = [], links = [], byId = new Map(), neighbors = new Map();
  let graph, selected = null, activeDomain = 'all', scope = 'all', view = 'map', routeId = null, hovered = null, editingId = null;
  let toastTimer;
  let focusId='universe';
  function exploreLayout(value){document.body.classList.toggle('nebula-explore',value);$('#toggle-reading')?.setAttribute('aria-pressed',String(!value));requestAnimationFrame(()=>{const space=$('#workspace');graph?.width(space.clientWidth).height(space.clientHeight);});}
  const childrenOf = id => nodes.filter(n=>n.parent===id);
  const pathOf = id => {const path=[];let n=byId.get(id),seen=new Set();while(n&&!seen.has(n.id)){seen.add(n.id);path.unshift(n);n=byId.get(n.parent);}return path;};
  const descendantOf = (id,parent) => pathOf(id).some(n=>n.id===parent);
  function rebuild() {
    K.domains.splice(0,K.domains.length,...baseDomains,...saved.galaxies);
    const roots=saved.galaxies.map(g=>({id:g.id,title:g.name,summary:g.description||'我的独立知识星云',detail:g.description,parent:'universe',domain:g.id,depth:1,root:true,kind:'我的星云',wiki:''}));
    nodes=K.nodes.map(n=>({...n})).concat(roots,saved.custom.map(n=>({...n,parent:n.parent||n.domain,kind:'我的知识',root:false,custom:true,example:''})));
    byId=new Map(nodes.map(n=>[n.id,n]));
    for(const n of nodes)if(n.custom)n.depth=pathOf(n.id).length-1;
    links=K.links.map(l=>({...l}));
    for(const g of saved.galaxies)links.push({source:'universe',target:g.id,kind:'hierarchy',reason:'你创建的独立星云'});
    for(const n of saved.custom){links.push({source:n.parent||n.domain,target:n.id,kind:'hierarchy',reason:'你建立的包含层级'});for(const id of n.related)links.push({source:n.id,target:id,kind:'relation',reason:'你建立的知识联系'});}
    neighbors=new Map(nodes.map(n=>[n.id,new Set()]));
    for(const l of links){neighbors.get(l.source)?.add(l.target);neighbors.get(l.target)?.add(l.source);}
    if(graph)graph.setData(nodes,links);
    $('#domain-nav').innerHTML=K.domains.map(d=>`<button class="nav-item" data-domain="${d.id}">${dot(d.id)}<span>${esc(d.name)}</span><small></small></button>`).join('');
    $('#domain-nav').querySelectorAll('[data-domain]').forEach(b=>b.onclick=()=>setDomain(b.dataset.domain));
    if($('#embed-domain'))$('#embed-domain').innerHTML='<option value="all">全部星云</option>'+K.domains.map(d=>`<option value="${d.id}">${esc(d.name)}</option>`).join('');
    updateCounters();
  }

  const idOf = node => typeof node === 'object' ? node.id : node;
  function toast(message) {
    $('#toast').textContent=message; $('#toast').hidden=false;
    clearTimeout(toastTimer);toastTimer=setTimeout(() => $('#toast').hidden=true,4500);
  }
  function persist() {
    try {localStorage.setItem(storageKey,JSON.stringify(saved));storageAvailable=true;}
    catch {storageAvailable=false;toast('浏览器未能保存记录。请立即导出备份，避免关闭后丢失。');}
    updateCounters();
    return storageAvailable;
  }
  function updateCounters() {
    $('#total-count').textContent=nodes.filter(n=>n.id!=='universe').length;
    $('#favorite-count').textContent=saved.favorites.length;
    $('#learned-count').textContent=saved.learned.length;
    for (const d of K.domains) {
      const counter=$(`[data-domain="${d.id}"] small`);
      if (counter) counter.textContent=nodes.filter(n=>n.domain===d.id&&!n.root).length;
    }
    const visible=visibleNodes();
    $('#map-count').textContent=`${visible.length} 个节点 · ${links.filter(l=>isVisible(byId.get(idOf(l.source)))&&isVisible(byId.get(idOf(l.target)))).length} 条联系`;
  }
  function isVisible(n) {
    if (!n || n.id==='universe') return false;
    if (scope === 'favorites') return saved.favorites.includes(n.id);
    if (scope === 'learned') return saved.learned.includes(n.id);
    return activeDomain === 'all' || n.domain === activeDomain;
  }
  const visibleNodes = () => nodes.filter(isVisible);
  function setNav() {
    $$('.nav-item').forEach(b=>b.classList.remove('active'));
    const selector=scope==='favorites'?'#show-favorites':scope==='learned'?'#show-learned':scope==='routes'?'#show-routes':`[data-domain="${activeDomain}"]`;
    $(selector)?.classList.add('active');
  }
  function setHeading() {
    const d=K.domains.find(x=>x.id===activeDomain);
    if (scope==='favorites') {$('#map-title').textContent='我的收藏';$('#map-description').textContent='那些让你好奇，也值得再次回来的知识。';}
    else if (scope==='learned') {$('#map-title').textContent='已经探索';$('#map-description').textContent='每一个理解，都是你走过的距离。';}
    else if (scope==='routes') {$('#map-title').textContent='给好奇心一条路线';$('#map-description').textContent='从一个问题出发，让理解逐步相连。';}
    else if (d) {$('#map-title').textContent=d.name;$('#map-description').textContent=d.description;}
    else {$('#map-title').textContent='知识星云';$('#map-description').textContent='拖动翻转星云，放大后显示名称。';}
  }
  function setView(next) {
    if(next==='map'&&!graph)next='list';
    view=next;$('#catalog').hidden=next!=='list';$('#graph').style.opacity=next==='map'?'1':'.12';
    $('#map-view').classList.toggle('selected',next==='map');$('#list-view').classList.toggle('selected',next==='list');
    $('#map-view').setAttribute('aria-pressed',String(next==='map'));$('#list-view').setAttribute('aria-pressed',String(next==='list'));
    if(next==='list'){renderCatalog();graph?.pauseAnimation();}else{graph?.resumeAnimation();}
  }
  function updateHierarchyUI(){
    const path=pathOf(focusId);
    if($('#embed-domain'))$('#embed-domain').value=activeDomain;
    $('#hierarchy-path').innerHTML=path.map((n,i)=>`${i?'<span class="path-separator" aria-hidden="true">/</span>':''}<button data-focus="${n.id}" ${i===path.length-1?'aria-current="location"':''}>${esc(n.id==='universe'?'知识全景':n.title)}</button>`).join('');
    $('#up-level').disabled=focusId==='universe';
    $('#level-count').textContent=focusId==='universe'?'宇宙总览':`第 ${path.length-1} 层 · ${childrenOf(focusId).length} 个下级节点`;
  }
  function enterSystem(id,read=true){
    const n=byId.get(id);if(!n)return;
    scope='all';activeDomain=n.domain==='universe'?'all':n.domain;focusId=childrenOf(id).length?id:n.parent||'universe';
    setNav();setHeading();updateCounters();setView('map');
    if(id==='universe'){selected=null;renderWelcome();}else if(read)renderNode(id,false);
    graph?.focus(id,selected,true);updateHierarchyUI();
    if(id!=='universe'){$('#map-title').textContent=byId.get(focusId)?.title||n.title;$('#map-description').textContent=byId.get(focusId)?.summary||n.summary;}
  }
  function setDomain(id){routeId=null;selected=null;hovered=null;enterSystem(id==='all'?'universe':id,id!=='all');}
  function resetMap(){graph?.fit(true);}

  function showCollection(type) {
    scope=type;activeDomain='all';routeId=null;selected=null;setNav();setHeading();setView('list');updateCounters();
    renderWelcome(type==='favorites'?'收藏里的星光':'你已经走过的地方',type==='favorites'?'打开任意节点，点击“收藏”，就能把它留在这里。':'在知识节点中点击“标记已读”，记录自己的探索。');
    graph?.setCollection(visibleNodes().map(n=>n.id));
  }
  function renderCatalog() {
    if(scope==='routes') {
      $('#catalog').innerHTML=`<div class="catalog-header"><span>${K.routes.length} 条学习路线</span><span>按你的节奏探索</span></div>`+K.routes.map(route=>{
        const done=route.nodes.filter(id=>saved.learned.includes(id)).length;
        return `<article class="route-card"><h3>${dot(route.domain)}${esc(route.title)}</h3><p>${esc(route.description)}</p><div class="route-meta"><span>${route.nodes.length} 个节点 · 已探索 ${done}</span><button class="text-button" data-route="${route.id}">查看路线 ${icon('arrow')}</button></div></article>`;
      }).join('');
      return;
    }
    if(scope==='all'){
      const roots=activeDomain==='all'?K.domains.map(d=>byId.get(d.id)):[byId.get(activeDomain)];
      const tree=(n,level)=>{const children=childrenOf(n.id);return children.length?`<li><details ${level<1?'open':''}><summary>${dot(n.domain)}<span>${esc(n.title)}</span><small>${children.length} 个下级</small></summary><div class="tree-tools"><button class="text-button" data-focus="${n.id}">进入3D系统 ${icon('arrow')}</button><button class="text-button" data-node="${n.id}">阅读框架</button></div><ul>${children.map(x=>tree(x,level+1)).join('')}</ul></details></li>`:`<li><button class="tree-leaf" data-node="${n.id}">${dot(n.domain)}<span>${esc(n.title)}</span><small>${saved.learned.includes(n.id)?'已读':esc(n.kind)}</small></button></li>`;};
      $('#catalog').innerHTML=`<div class="catalog-header"><span>包含层级 · 点击箭头展开</span><span>${visibleNodes().length} 个节点</span></div><ul class="hierarchy-tree">${roots.map(n=>tree(n,0)).join('')}</ul>`;return;
    }
    const list=visibleNodes();
    $('#catalog').innerHTML=`<div class="catalog-header"><span>${list.length} 个知识节点</span><span>点击开始阅读</span></div>`+(list.length?list.map(n=>`<button class="catalog-row" data-node="${n.id}">${dot(n.domain)}<div><strong>${esc(n.title)}</strong><p>${esc(n.summary)}</p></div><small>${saved.learned.includes(n.id)?'已读':esc(n.kind)}</small>${icon('arrow')}</button>`).join(''):`<div class="empty-state"><strong>这里还有无限可能。</strong>${scope==='favorites'?'点击节点里的“收藏”，把想深入的知识留在这里。':'阅读一个节点，标记已读，记录你的第一步。'}<br><br><button class="button" data-home>去探索星系 ${icon('arrow')}</button></div>`);
  }
  let cleanupNoteAI=()=>{};
  function setReader(html) {cleanupNoteAI();cleanupNoteAI=()=>{};$('#reader-content').innerHTML=window.lifeAtlasLocal?html.replaceAll('此浏览器','本机数据库'):html;$('#reader').scrollTop=0;}
  function openMobileReader() {if(innerWidth<=620){$('#reader').classList.add('open');$('#mobile-reader').setAttribute('aria-expanded','true');$('#toggle-reading').setAttribute('aria-pressed','true');}}
  function mobileLabel(text='展开阅读面板') {$('#mobile-reader').innerHTML=esc(text)+icon('arrow');}
  function renderWelcome(title='今天，向哪里出发？',intro='让知识成为星球，让好奇成为航线。选择一个节点，看看它如何连接更大的世界。') {
    selected=null;exploreLayout(true);
    setReader(`<div class="reader-inner"><div class="welcome-art" aria-hidden="true"><svg viewBox="0 0 250 140"><ellipse cx="125" cy="70" rx="99" ry="36" transform="rotate(-25 125 70)"/><ellipse cx="125" cy="70" rx="99" ry="36" transform="rotate(35 125 70)"/><ellipse cx="125" cy="70" rx="48" ry="60" transform="rotate(-25 125 70)"/><circle cx="125" cy="70" r="10" class="center-star"/><circle cx="207" cy="23" r="4" class="orbit-star"/><circle cx="51" cy="102" r="3" class="center-star"/><path d="M18 37h8m-4-4v8m192 62h8m-4-4v8"/></svg></div><h2>${esc(title)}</h2><p class="intro">${esc(intro)}</p><h3>从一份好奇开始</h3><button class="suggestion" data-route="quant-path">${icon('route')}<span><strong>从概率到量化</strong><small>让交易想法经得起检验 · 8 个节点</small></span>${icon('arrow')}</button><button class="suggestion" data-route="cosmos-path">${icon('orbit')}<span><strong>从太阳系到宇宙</strong><small>在时空中找到我们的位置 · 7 个节点</small></span>${icon('arrow')}</button><button class="suggestion" data-route="mind-path">${icon('spark')}<span><strong>更清醒地认识自己</strong><small>理解判断、记忆与学习 · 6 个节点</small></span>${icon('arrow')}</button><div class="connection-feature"><h3>一条意想不到的联系</h3><div class="pair">${dot('math')}贝叶斯定理 ${icon('arrow')} ${dot('philosophy')}认识论</div><p>当新的证据到来，我们应该怎样改变自己的相信？一个数学公式，也是一种思考方式。</p><button class="text-button" data-node="bayes">沿着这条联系出发 ${icon('arrow')}</button></div><p class="reader-footer">ATLAS 2.0 · 3D · 知识内容可离线阅读<br>外部资料需要联网。<br>你的笔记与轨迹保存在此浏览器，建议定期导出。<br><button class="text-button" data-backup>导出备份</button> · <button class="text-button" data-import>导入备份</button><br><a href="https://github.com/mrdoob/three.js" target="_blank" rel="noopener noreferrer">由开源 Three.js 驱动</a></p></div>`);
    mobileLabel();
  }
  function connected(id) {
    return links.filter(l=>idOf(l.source)===id||idOf(l.target)===id).map(l=>({node:byId.get(idOf(l.source)===id?idOf(l.target):idOf(l.source)),reason:l.reason,kind:l.kind})).filter(x=>x.node);
  }
  function renderNode(id, mobile=true) {
    const n=byId.get(id);if(!n)return;
    exploreLayout(false);selected=id;const d=domainInfo(n.domain);const route=K.routes.find(r=>r.id===routeId);const step=route?.nodes.indexOf(id)??-1;
    const favorite=saved.favorites.includes(id), learned=saved.learned.includes(id);
    let related=connected(id).filter(x=>x.kind==='relation').sort((a,b)=>Number(a.node.root)-Number(b.node.root)||Number(a.node.domain===n.domain)-Number(b.node.domain===n.domain));
    const wikiURL=n.wiki?`https://en.wikipedia.org/wiki/${n.wiki}`:'';
    const sources=n.custom?(n.url?[{title:'你添加的参考资料',url:n.url}]:[]):(Array.isArray(n.sources)?n.sources:(K.sources[n.domain]||[]));
    setReader(`<article class="reader-inner" style="--domain-color:${d.color}"><div class="reader-topline"><span>${dot(n.domain)}${esc(d.name)}</span><button class="text-button" data-home>回到全景 ${icon('close')}</button></div>${route&&step>=0?`<div class="route-context"><button class="text-button" data-route="${route.id}">${esc(route.title)}</button> · ${step+1}/${route.nodes.length}<div>${step>0?`<button class="button" data-step="${route.nodes[step-1]}">上一个</button>`:''}${step<route.nodes.length-1?`<button class="button" data-step="${route.nodes[step+1]}">下一个 ${icon('arrow')}</button>`:'<span>你到达了路线终点</span>'}</div></div>`:''}<div class="node-location">${pathOf(id).map(x=>`<button data-focus="${x.id}">${esc(x.id==='universe'?'宇宙':x.title)}</button>`).join('<span>/</span>')}</div><h2>${esc(n.title)}</h2><p class="node-summary">${esc(n.summary)}</p><div class="node-actions"><button class="button ${favorite?'on':''}" id="toggle-favorite" aria-pressed="${favorite}">${icon('bookmark')}${favorite?'已收藏':'收藏'}</button><button class="button ${learned?'on':''}" id="toggle-learned" aria-pressed="${learned}">${icon('check')}${learned?'已经探索':'标记已读'}</button></div>${childrenOf(id).length?`<section class="subsystems"><h3>这个系统包含</h3>${childrenOf(id).map(c=>`<button data-node="${c.id}" class="subsystem-row">${dot(c.domain)}<span><strong>${esc(c.title)}</strong><small>${childrenOf(c.id).length?childrenOf(c.id).length+' 个下级节点':'知识恒星'}</small></span>${icon('arrow')}</button>`).join('')}</section>`:''}<div class="node-detail">${esc(n.detail||n.summary)}</div>${n.example?`<div class="example"><strong>用一个例子理解</strong>${esc(n.example)}</div>`:''}<h3>跨系统与概念联系 <span class="relation-label">${related.length} 条</span></h3>${related.map(x=>`<button class="related-item" data-node="${x.node.id}"><span class="related-title">${dot(x.node.domain)}${esc(x.node.title)} ${icon('arrow')}</span><small>${esc(x.reason)}</small></button>`).join('')||'<p class="muted">添加一个关联，让这颗星和其他知识相遇。</p>'}<h3>我的理解</h3><textarea class="note-area" id="node-note" maxlength="20000" placeholder="试着不用原文，写一句自己的理解…" aria-label="${esc(n.title)}的个人笔记">${esc(saved.notes[id]||'')}</textarea><span id="note-status" class="note-status">${saved.notes[id]?'已保存在此浏览器':'输入后自动保存在此浏览器'}</span><h3>继续阅读</h3>${wikiURL?`<a class="source-link" href="${esc(wikiURL)}" target="_blank" rel="noopener noreferrer"><span>Wikipedia · ${esc(n.wiki.replaceAll('_',' '))}${['chan','fractal','zhongshu','divergence'].includes(id)?'（技术分析背景）':''}</span>${icon('external')}</a>`:''}${sources.map(s=>`<a class="source-link" href="${esc(safeURL(s.url))}" target="_blank" rel="noopener noreferrer"><span>${esc(s.title)}</span>${icon('external')}</a>`).join('')}<p class="reference-note">外部链接是延伸阅读，需联网；并非每个链接都对应本节点的全部表述。节点内容为本地原创入门摘要。${n.domain==='market'?'交易方法的效果需要独立检验，历史表现不能保证未来结果。':''}</p>${n.custom?'<div class="node-edit-actions"><button class="text-button" id="edit-node">编辑知识</button><button class="text-button danger" id="delete-node">删除此节点</button></div>':''}</article>`);
    $('#toggle-favorite').onclick=()=>toggleRecord('favorites',id);
    $('#toggle-learned').onclick=()=>toggleRecord('learned',id);
    if(window.lifeAtlasAI){const host=document.createElement('div');$('#note-status').insertAdjacentElement('afterend',host);const note=$('#node-note');cleanupNoteAI=window.lifeAtlasAI(host,{type:'knowledge',kind:'knowledge',id,label:n.title+' · 我的理解',read:()=>`知识：${n.title}\n入门资料：${n.detail||n.summary}\n我的理解：${note.value}`,content:()=>note.value,watch:note});}
    $('#node-note').addEventListener('input',e=>{saved.notes[id]=e.target.value;const success=persist();$('#note-status').textContent=success?'已保存在此浏览器':'保存失败，请立即导出备份';});
    if(n.custom){$('#edit-node').onclick=()=>openEditor(id);$('#delete-node').onclick=()=>deleteNode(id);}
    graph?.select(id);
    mobileLabel(n.title+' · 点击收起 / 展开');
    if(mobile)openMobileReader();
    if(view==='list'&&scope!=='routes')renderCatalog();
  }
  function toggleRecord(key,id) {
    saved[key]=saved[key].includes(id)?saved[key].filter(x=>x!==id):saved[key].concat(id);persist();renderNode(id,false);if(view==='list')renderCatalog();
  }
  function selectNode(id,keepRoute=false){
    if(!byId.has(id))return;if(!keepRoute)routeId=null;
    const n=byId.get(id);scope='all';activeDomain=n.domain==='universe'?'all':n.domain;focusId=childrenOf(id).length?id:n.parent||'universe';
    setNav();setHeading();setView('map');updateCounters();renderNode(id);
    graph?.focus(id,id,true);updateHierarchyUI();
    $('#map-title').textContent=byId.get(focusId)?.title||n.title;$('#map-description').textContent=byId.get(focusId)?.summary||n.summary;
    $('#search-results').hidden=true;$('#search').setAttribute('aria-expanded','false');
  }

  function showRoutes() {
    routeId=null;scope='routes';activeDomain='all';selected=null;setNav();setHeading();setView('list');updateCounters();renderWelcome('一个问题，一段旅程。','选择一条路线，从基础走到关联。标记已读之后，进度会保存在这里。');
  }
  function renderRoute(id) {
    exploreLayout(false);
    const r=K.routes.find(x=>x.id===id);if(!r)return;
    routeId=id;selected=null;
    const done=r.nodes.filter(x=>saved.learned.includes(x)).length;
    setReader(`<div class="reader-inner"><div class="reader-topline"><span>${dot(r.domain)}学习路线</span><button class="text-button" data-routes>全部路线 ${icon('arrow')}</button></div><h2>${esc(r.title)}</h2><p class="intro">${esc(r.description)}</p><div class="route-progress"><span style="width:${done/r.nodes.length*100}%"></span></div><p class="reference-note">${r.nodes.length} 个节点 · 已探索 ${done} 个</p><ol class="route-list">${r.nodes.map((id,i)=>{const n=byId.get(id);const done=saved.learned.includes(id);return `<li><span class="route-step ${done?'done':''}">${done?icon('check'):i+1}</span><button data-step="${id}">${esc(n.title)}<small>${esc(n.summary)}</small></button></li>`;}).join('')}</ol><button class="button primary" data-step="${r.nodes.find(id=>!saved.learned.includes(id))||r.nodes[0]}">${done===r.nodes.length?'重新探索':'开始 / 继续探索'} ${icon('arrow')}</button></div>`);
    mobileLabel(r.title);openMobileReader();
  }
  function renderHelp() {
    exploreLayout(false);
    setReader(`<div class="reader-inner"><div class="reader-topline"><span>使用指南</span><button class="text-button" data-home>回到探索 ${icon('close')}</button></div><h2>这是你的知识宇宙。</h2><p class="intro">内置星系和多层框架只是一个起点。让它慢慢长成你自己的知识版图。</p><ol class="help-list"><li>左键拖动自由翻转星云，滚轮或双指缩放，右键拖动平移。点击有下级的恒星进入系统；点击具体知识阅读。顶部路径与“上一层”可返回。</li><li>按 <kbd>/</kbd> 搜索。搜索框支持上下方向键和回车；“目录”提供所有节点的键盘入口。</li><li>点左侧星系进入大框架，再逐层进入子系统。“目录”保留完整包含树。弥散的星尘云雾表示概念联系，跨系入口可跃迁到另一系统。</li><li>收藏、已读和笔记会自动保存在此浏览器。请定期导出JSON备份；清理浏览器数据或换浏览器时，需要重新导入。</li><li>点击“添加知识”创建节点，选择它与已有知识的联系。自建节点可以编辑或删除。</li><li>核心内容、图谱和字体已放在本机，断网可以使用。外部链接只在点击时访问。</li></ol><h3>运行与复用</h3><p class="node-detail">双击 index.html 即可使用。如果希望固定浏览器存储地址，可运行工程内的 启动本地服务.cmd，再访问 http://127.0.0.1:8765。不同访问地址的浏览器记录相互独立，迁移时使用导出和导入。</p><h3>内容说明</h3><p class="node-detail">这是带原创摘要与参考入口的知识索引。连线表示所写明的概念联系；未标注因果的连线不代表因果、等价或证实。当前版本不接实时行情，也不自动生成投资建议。</p><div class="backup-actions"><button data-backup>${icon('download')}导出我的数据</button><button data-import>${icon('upload')}导入备份</button></div><p class="reader-footer">本地依赖：Three.js（MIT）、Space Grotesk（OFL）。许可与来源在工程文件中。<br>版本 2.0 · 内容整理于 ${K.updated}</p></div>`);
    mobileLabel('使用指南');openMobileReader();
  }
  let searchList=[],searchIndex=-1;
  function renderSearch() {
    const query=$('#search').value.trim().toLowerCase();searchIndex=-1;
    if(!query){$('#search-results').hidden=true;$('#search').setAttribute('aria-expanded','false');return;}
    const terms=query.split(/\s+/);
    searchList=nodes.map(n=>({n,score:terms.every(t=>`${n.title} ${n.summary} ${n.detail} ${n.wiki||''} ${domainInfo(n.domain).name}`.toLowerCase().includes(t))?(n.title.toLowerCase().includes(query)?2:1):0})).filter(x=>x.score).sort((a,b)=>b.score-a.score).map(x=>x.n).slice(0,15);
    $('#search-results').innerHTML=searchList.length?searchList.map((n,i)=>`<button class="search-result" role="option" aria-selected="false" id="search-option-${i}" data-node="${n.id}">${dot(n.domain)}<span><strong>${esc(n.title)}</strong><small>${esc(n.summary)}</small></span></button>`).join(''):'<div class="search-empty">没有找到匹配知识。换个关键词，或添加你自己的节点。</div>';
    $('#search-results').hidden=false;$('#search').setAttribute('aria-expanded','true');$('#search').removeAttribute('aria-activedescendant');
  }
  $('#search').addEventListener('input',renderSearch);
  $('#search').addEventListener('keydown',e=>{
    if(e.key==='Escape'){$('#search-results').hidden=true;$('#search').setAttribute('aria-expanded','false');return;}
    if(e.key==='ArrowDown'||e.key==='ArrowUp') {e.preventDefault();if(!searchList.length)return;searchIndex=(searchIndex+(e.key==='ArrowDown'?1:-1)+searchList.length)%searchList.length;$$('.search-result').forEach((el,i)=>{el.classList.toggle('keyboard-active',i===searchIndex);el.setAttribute('aria-selected',String(i===searchIndex));});const el=$(`#search-option-${searchIndex}`);el?.scrollIntoView({block:'nearest'});$('#search').setAttribute('aria-activedescendant',`search-option-${searchIndex}`);}
    if(e.key==='Enter'&&searchList.length){e.preventDefault();selectNode(searchList[Math.max(searchIndex,0)].id);$('#reader').focus();}
  });
  document.addEventListener('keydown',e=>{if(e.key==='/'&&!/INPUT|TEXTAREA|SELECT/.test(document.activeElement.tagName)&&!$('#node-dialog').open){e.preventDefault();$('#search').focus();}if(e.key==='Escape'&&!$('#node-dialog').open){$('#reader').classList.remove('open');$('#mobile-reader').setAttribute('aria-expanded','false');$('#toggle-reading').setAttribute('aria-pressed','false');}});
  document.addEventListener('click',e=>{
    const b=e.target.closest('button');
    if(!e.target.closest('.search-wrap')){$('#search-results').hidden=true;$('#search').setAttribute('aria-expanded','false');}
    if(!b)return;
    if(b.dataset.focus)enterSystem(b.dataset.focus);
    else if(b.dataset.node)selectNode(b.dataset.node);
    else if(b.dataset.step)selectNode(b.dataset.step,true);
    else if(b.dataset.route)renderRoute(b.dataset.route);
    else if(b.hasAttribute('data-home')){setDomain('all');$('#reader').classList.remove('open');$('#mobile-reader').setAttribute('aria-expanded','false');$('#toggle-reading').setAttribute('aria-pressed','false');}
    else if(b.hasAttribute('data-routes'))showRoutes();
    else if(b.hasAttribute('data-backup'))exportData();
    else if(b.hasAttribute('data-import'))$('#import-file').click();
  });
  function openEditor(id=null) {
    editingId=id;const form=$('#node-form');form.reset();$('#form-error').textContent='';
    $('#node-dialog-title').textContent=id?'编辑我的知识':'点亮一颗新星';
    $('#node-domain').innerHTML=K.domains.map(d=>`<option value="${d.id}">${esc(d.name)}</option>`).join('');
    $('#node-related').innerHTML=nodes.filter(n=>n.id!==id).map(n=>`<option value="${n.id}">${esc(n.title)}</option>`).join('');
    const n=saved.custom.find(x=>x.id===id);
    const chooseParent=()=>{const domain=form.elements.domain.value;const allowed=nodes.filter(x=>x.domain===domain&&x.id!==id&&(!id||!descendantOf(x.id,id)));$('#node-parent').innerHTML=allowed.map(x=>`<option value="${x.id}">${esc('　'.repeat(Math.max(0,(x.depth||1)-1))+x.title)}</option>`).join('');form.elements.parent.value=(n&&allowed.some(x=>x.id===n.parent))?n.parent:allowed.some(x=>x.id===focusId)?focusId:domain;};
    form.elements.domain.onchange=chooseParent;
    if(n){for(const key of ['title','domain','summary','detail','url'])form.elements[key].value=n[key]||'';for(const opt of form.elements.related.options)opt.selected=n.related.includes(opt.value);}
    else if(activeDomain!=='all')form.elements.domain.value=activeDomain;
    chooseParent();$('#node-dialog').showModal();
  }
  $('#node-form').addEventListener('submit',e=>{
    e.preventDefault();const f=e.target;
    const n={id:editingId||`custom-${Date.now().toString(36)}-${Math.random().toString(36).slice(2,8)}`,title:f.elements.title.value.trim(),domain:f.elements.domain.value,parent:f.elements.parent.value,summary:f.elements.summary.value.trim(),detail:f.elements.detail.value.trim(),url:f.elements.url.value.trim(),related:[...f.elements.related.selectedOptions].map(o=>o.value)};
    try{
      if(!n.title||!n.summary)throw new Error('名称和一句话理解不能只包含空格。');
      if(n.url&&!safeURL(n.url))throw new Error('参考链接请使用 http 或 https。');
      const custom=editingId?saved.custom.map(x=>x.id===editingId?n:x):saved.custom.concat(n);
      validateBackup({...saved,custom});saved.custom=custom;persist();rebuild();$('#node-dialog').close();setDomain('all');selectNode(n.id);toast(editingId?'知识已更新':'新星已加入你的宇宙');
    }catch(error){$('#form-error').textContent=error.message;}
  });
  function deleteNode(id) {
    if(!confirm('删除这个自建知识节点及其笔记和个人关联？它的下级节点会移到上一层，内置节点不会受影响。'))return;
    const parent=byId.get(id)?.parent;
    saved.custom=saved.custom.filter(n=>n.id!==id).map(n=>({...n,parent:n.parent===id?parent:n.parent,related:n.related.filter(x=>x!==id)}));
    saved.favorites=saved.favorites.filter(x=>x!==id);saved.learned=saved.learned.filter(x=>x!==id);delete saved.notes[id];persist();rebuild();setDomain('all');toast('自建节点已删除');
  }
  function exportData() {
    const payload={format:'atlas-knowledge-universe',version:2,exportedAt:new Date().toISOString(),...saved};
    const url=URL.createObjectURL(new Blob([JSON.stringify(payload,null,2)],{type:'application/json'}));
    const a=document.createElement('a');a.href=url;a.download=`知识宇宙-备份-${new Date().toISOString().slice(0,10)}.json`;a.click();setTimeout(()=>URL.revokeObjectURL(url),1500);toast('已导出收藏、笔记、阅读记录和自建知识');
  }
  $('#import-file').addEventListener('change',async e=>{
    const file=e.target.files[0];if(!file)return;
    try{
      if(file.size>4*1024*1024)throw new Error('文件太大，请选择4MB以内的宇宙JSON备份。');
      const incoming=validateBackup(JSON.parse(await file.text()));
      const current=new Map(saved.custom.map(n=>[n.id,n]));incoming.custom.forEach(n=>current.set(n.id,n));
      const galaxies=new Map(saved.galaxies.map(g=>[g.id,g]));incoming.galaxies.forEach(g=>galaxies.set(g.id,g));
      const next={galaxies:[...galaxies.values()],custom:[...current.values()],favorites:[...new Set([...saved.favorites,...incoming.favorites])],learned:[...new Set([...saved.learned,...incoming.learned])],notes:{...saved.notes,...incoming.notes}};
      validateBackup(next);saved=next;persist();rebuild();setDomain('all');toast('备份已合并；同编号的节点和笔记使用导入版本');
    }catch(error){toast('导入失败：'+error.message);}
    e.target.value='';
  });
  $('#domain-nav').innerHTML=K.domains.map(d=>`<button class="nav-item" data-domain="${d.id}">${dot(d.id)}<span>${esc(d.name)}</span><small></small></button>`).join('');
  $$('[data-domain]').forEach(b=>b.onclick=()=>setDomain(b.dataset.domain));
  $('#home').onclick=()=>{setView('map');setDomain('all');$('#reader').classList.remove('open');$('#mobile-reader').setAttribute('aria-expanded','false');$('#toggle-reading').setAttribute('aria-pressed','false');};
  $('#show-routes small').textContent=K.routes.length;
  $('#show-routes').onclick=showRoutes;$('#show-favorites').onclick=()=>showCollection('favorites');$('#show-learned').onclick=()=>showCollection('learned');
  $('#map-view').onclick=()=>{if(scope==='routes'){scope='all';setNav();setHeading();}setView('map');if(scope==='all')graph?.focus(focusId,selected,true);else graph?.setCollection(visibleNodes().map(n=>n.id));};$('#list-view').onclick=()=>setView('list');
  $('#add-node').onclick=()=>openEditor();$('#close-dialog').onclick=()=>$('#node-dialog').close();
  $('#help').onclick=renderHelp;$('#toggle-reading').onclick=()=>{if(innerWidth<=620){const open=$('#reader').classList.toggle('open');$('#mobile-reader').setAttribute('aria-expanded',String(open));$('#toggle-reading').setAttribute('aria-pressed',String(open));}else exploreLayout(!document.body.classList.contains('nebula-explore'));};$('#export-data').onclick=exportData;$('#import-data').onclick=()=>$('#import-file').click();
  $('#zoom-in').onclick=()=>graph?.zoomBy(1.35);$('#zoom-out').onclick=()=>graph?.zoomBy(1/1.35);$('#reset-map').onclick=resetMap;
  $('#up-level').onclick=()=>enterSystem(byId.get(focusId)?.parent||'universe');
  $('#show-bridges').onchange=e=>graph?.setBridges(e.target.checked);
  $('#auto-orbit').onchange=e=>graph?.setAutoRotate(e.target.checked);
  $('#mobile-reader').onclick=()=>{const open=$('#reader').classList.toggle('open');$('#mobile-reader').setAttribute('aria-expanded',String(open));$('#toggle-reading').setAttribute('aria-pressed',String(open));};
  if(embedded){
    const tools=document.createElement('div');tools.className='embed-tools';tools.innerHTML=`<label class="embed-domain-label">星系<select id="embed-domain" aria-label="选择知识星系"><option value="all">全部星云</option>${K.domains.map(d=>`<option value="${d.id}">${esc(d.name)}</option>`).join('')}</select></label><button id="embed-routes">学习路线</button><button id="embed-favorites">收藏</button><button id="embed-backup">导出</button><button id="embed-import">导入</button>`;$('.topbar').appendChild(tools);
    $('#embed-domain').onchange=e=>setDomain(e.target.value);$('#embed-routes').onclick=showRoutes;$('#embed-favorites').onclick=()=>showCollection('favorites');$('#embed-backup').onclick=exportData;$('#embed-import').onclick=()=>$('#import-file').click();
    const notifyEditing=()=>{const el=document.activeElement;graph?.setMotionPaused(el instanceof HTMLElement&&el.matches('input:not([type=checkbox]),textarea,select'));parent.postMessage({type:'atlas:editing',editing:el instanceof HTMLElement&&el.matches('input:not([type=checkbox]),textarea,select')},location.origin);};
    window.addEventListener('message',e=>{if(e.source===parent&&e.origin===location.origin&&e.data?.type==='lifeatlas:sky-preference'&&typeof e.data.particles==='boolean')graph?.setMotionAllowed(e.data.particles);});
    document.addEventListener('focusin',notifyEditing);document.addEventListener('focusout',()=>queueMicrotask(notifyEditing));
  }
  let skyController;
  if(!embedded||parent===window){const host=document.createElement('div');host.className='space-backdrop';host.setAttribute('aria-hidden','true');document.body.prepend(host);skyController=new AbortController();const sky=CosmicSkyRuntime.createCosmicSky(host,skyController.signal);const syncSky=()=>sky.update({enabled:true,paused:document.hidden||document.activeElement?.matches('input:not([type=checkbox]),textarea')||false,skin:'island'});document.addEventListener('focusin',syncSky);document.addEventListener('focusout',()=>queueMicrotask(syncSky));syncSky();}
  rebuild();renderWelcome();
  function initGraph(){
    try{
      graph=new Universe3D($('#graph'),{domains:K.domains,onSelect:id=>selectNode(id),onFocus:id=>{focusId=id;updateHierarchyUI();}});
      graph.setData(nodes,links).focus('universe',null,false);$('#webgl-status').hidden=true;
    }catch(error){console.error(error);$('#webgl-status').textContent='当前浏览器未能启动3D。可切换目录继续阅读，或用支持WebGL的浏览器打开。';setView('list');}
    updateHierarchyUI();
  }
  initGraph();
  document.addEventListener("focusin",()=>graph?.setMotionPaused(!!document.activeElement?.matches("input:not([type=checkbox]),textarea,select")));document.addEventListener("focusout",()=>queueMicrotask(()=>graph?.setMotionPaused(!!document.activeElement?.matches("input:not([type=checkbox]),textarea,select"))));
  const initialNode=new URLSearchParams(location.search).get("node");if(initialNode&&byId.has(initialNode))selectNode(initialNode);

  let resizeTimer;
  addEventListener('resize',()=>{clearTimeout(resizeTimer);resizeTimer=setTimeout(()=>{const s=$('#workspace');graph?.width(s.clientWidth).height(s.clientHeight);if(!selected)resetMap();},120);});
  document.fonts?.ready.then(()=>graph?.refresh?.());
  document.addEventListener('visibilitychange',()=>{if(document.hidden)graph?.pauseAnimation();else if(view==='map')graph?.resumeAnimation();});
  if(importWarning)toast(importWarning);
  window.ATLAS={get nodes(){return nodes;},get links(){return links;},get saved(){return saved;},get domains(){return K.domains;},validateBackup,selectNode,enterSystem,get focusId(){return focusId;},childrenOf,get graph(){return graph;},async updateSaved(next){const cleaned=validateBackup(next);if(JSON.stringify(cleaned).length>3_800_000)throw new Error('宇宙记录已接近容量上限，请先导出并整理。');saved=cleaned;if(!persist())throw new Error('保存失败，请立即导出备份。');rebuild();setDomain('all');await window.lifeAtlasLocal?.flush();}};
  window.mountAtlasLibrary?.(window.ATLAS);
})();
