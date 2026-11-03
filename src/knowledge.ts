// The independent knowledge engine shares this application's origin and navigation.
export function knowledgePage(){return `<section class="knowledge-module" aria-labelledby="knowledge-heading"><div class="knowledge-module-heading"><div><h1 id="knowledge-heading">知识宇宙</h1><p>从知识星系出发，给观察、思考与行动找到参照。</p></div><div class="knowledge-context-links"><a href="#growth">回到个人成长</a><a href="/knowledge-universe/index.html" target="_blank" rel="noopener">独立打开</a></div></div><iframe id="knowledge-universe-frame" title="交互式3D知识宇宙：股市、心理学、哲学、天文学、数学、物理、政治与资本" src="/knowledge-universe/index.html?embedded=1" allow="fullscreen" loading="eager"></iframe></section>`;}
export function mountKnowledge(host:HTMLElement,onEditing:(editing:boolean)=>void){
 const frame=host.querySelector<HTMLIFrameElement>('#knowledge-universe-frame');if(!frame)return()=>{};
 const node=location.hash.split(':')[1];if(node&&/^[a-z0-9-]{1,90}$/.test(node))frame.src='/knowledge-universe/index.html?embedded=1&node='+encodeURIComponent(node);
 const controller=new AbortController();
 function preferences(event?:Event){let appearance:Record<string,unknown>={};try{appearance=JSON.parse(localStorage.getItem('lifeatlas-appearance-v1')||'{}')||{};}catch{/* Default appearance. */}if(event instanceof CustomEvent&&event.type==='lifeatlas:appearance-change')appearance=event.detail;frame?.contentWindow?.postMessage({type:'lifeatlas:sky-preference',particles:appearance.particles!==false,appearance},location.origin);}
 frame.addEventListener('load',preferences,{signal:controller.signal});document.addEventListener('lifeatlas:appearance-change',preferences,{signal:controller.signal});
 window.addEventListener('message',e=>{if(e.origin!==location.origin||e.source!==frame.contentWindow)return;if(e.data?.type==='atlas:editing'&&typeof e.data.editing==='boolean')onEditing(e.data.editing);},{signal:controller.signal});
 return()=>{controller.abort();onEditing(false);};
}
