const keys=['atlas-knowledge-universe-v1','lifeatlas-demo-v1','lifeatlas-appearance-v1','lifeatlas-modules-v1','lifeatlas-workspace-v1'];
type Item={key:string;value:string|null;version:number};
type Pending={value:string|null;version:number;mutation:string};
type Snapshot={epoch:string;initialized:boolean;items:Item[];dataDir?:string};
export type LocalStorageBridge={flush:()=>Promise<void>;status:()=>string;dataDir:string;exportDrafts:()=>void};
declare global{interface Window{LIFEATLAS_LOCAL_READY?:Promise<LocalStorageBridge>;lifeAtlasLocal?:LocalStorageBridge;}}
const epochKey='lifeatlas-local-epoch-v1';
export async function initializeStorage():Promise<LocalStorageBridge>{
 const nativeSet=Storage.prototype.setItem,nativeRemove=Storage.prototype.removeItem,nativeClear=Storage.prototype.clear;
 let tab=sessionStorage.getItem('lifeatlas-local-tab');if(!tab){tab=crypto.randomUUID();sessionStorage.setItem('lifeatlas-local-tab',tab);}
 const journalKey='lifeatlas-local-pending-v1:'+tab+':'+(location.pathname.startsWith('/knowledge-universe/')?'knowledge':'app');
 let pending:Record<string,Pending>={},failure='',recoveryNotice='',running:Promise<void>|null=null;const versions:Record<string,number>={};
 const put=(key:string,value:string)=>nativeSet.call(localStorage,key,value),remove=(key:string)=>nativeRemove.call(localStorage,key);
 async function api(path:string,body?:unknown){const r=await fetch('/api/local/'+path,{method:body===undefined?'GET':'POST',credentials:'same-origin',cache:'no-store',headers:body===undefined?undefined:{'Content-Type':'application/json'},body:body===undefined?undefined:JSON.stringify(body),keepalive:body!==undefined&&JSON.stringify(body).length<60000});let b:any;try{b=await r.json();}catch{throw new Error('本地服务没有响应。草稿仍保存在此浏览器，请重新启动程序后重试。');}if(!r.ok)throw new Error(r.status===409?'另一窗口已修改资料。当前草稿已留存，请导出草稿并刷新后继续。':b.error?.message||'本地保存未完成，请检查程序是否运行。');return b;}
 let snapshot:Snapshot=await api('state');
 const previousEpoch=localStorage.getItem(epochKey),changed=!!previousEpoch&&previousEpoch!==snapshot.epoch;
 if(!snapshot.initialized){const values:Record<string,string>={};for(const key of keys){const value=localStorage.getItem(key);if(value!==null){try{JSON.parse(value);values[key]=value;}catch{/* Keep invalid legacy data in its original browser. */}}}try{snapshot=await api('initialize',{values});}catch{snapshot=await api('state');if(!snapshot.initialized)throw new Error('本地资料初始化失败，请重试。');}}
 if(!changed){for(const oldKey of Object.keys(localStorage).filter(k=>k.startsWith('lifeatlas-local-pending-v1:'))){const raw=localStorage.getItem(oldKey);try{const envelope=JSON.parse(raw||'{}');if(envelope.epoch&&envelope.epoch!==snapshot.epoch)continue;const drafts=envelope.pending||envelope;for(const [key,value] of Object.entries(drafts)){const entry=value as Pending;if(!keys.includes(key)||!entry||typeof entry.mutation!=='string')continue;try{await api('state',{key,...entry});}catch(error){if(!(error as Error).message.includes('另一窗口'))throw error;put(oldKey.replace('pending','recovery'),raw||'{}');recoveryNotice='发现未合并的草稿，已留存。可在设置中导出草稿查看；当前显示磁盘资料。';}}if(localStorage.getItem(oldKey)===raw)remove(oldKey);}catch(error){if(error instanceof SyntaxError)continue;throw error;}}snapshot=await api('state');}
 for(const key of keys){const item=snapshot.items.find(v=>v.key===key);versions[key]=item?.version||0;if(item?.value!=null)put(key,item.value);else remove(key);}
 const journal=()=>put(journalKey,JSON.stringify({epoch:snapshot.epoch,pending}));
 put(epochKey,snapshot.epoch);journal();
 function changedStatus(){window.dispatchEvent(new CustomEvent('lifeatlas-local-status'));try{if(window!==parent)parent.postMessage({type:'lifeatlas:local-status'},location.origin);}catch{}}
 function status(){return Object.keys(pending).length?'正在保存或等待重试':recoveryNotice||'已保存到本机';}
 async function drain(){
  if(!Object.keys(pending).length)return;
  if(running){await running;return;}
  running=(async()=>{failure='';try{while(Object.keys(pending).length){const key=Object.keys(pending)[0],entry=pending[key];const result=await api('state',{key,...entry});versions[key]=result.version;if(pending[key]?.mutation===entry.mutation)delete pending[key];else if(pending[key])pending[key].version=result.version;journal();changedStatus();}}catch(error){failure=error instanceof Error?error.message:'保存未完成。';changedStatus();throw error;}finally{running=null;}})();await running;
 }
 function queue(key:string,value:string|null){pending[key]={value,version:versions[key]||0,mutation:crypto.randomUUID()};journal();changedStatus();void drain().catch(()=>{});}
 Storage.prototype.setItem=function(key,value){nativeSet.call(this,key,value);if(this===localStorage&&keys.includes(String(key)))queue(String(key),String(value));};
 Storage.prototype.removeItem=function(key){nativeRemove.call(this,key);if(this===localStorage&&keys.includes(String(key)))queue(String(key),null);};
 Storage.prototype.clear=function(){if(this!==localStorage){nativeClear.call(this);return;}const tracked=keys.filter(k=>localStorage.getItem(k)!==null);for(let i=localStorage.length-1;i>=0;i--){const key=localStorage.key(i)!;if(key!==epochKey&&!key.startsWith('lifeatlas-local-pending-v1:'))nativeRemove.call(this,key);}for(const key of tracked)queue(key,null);};
 const bridge:LocalStorageBridge={dataDir:snapshot.dataDir||'',status:()=>failure||status(),flush:async()=>{await drain();if(failure||Object.keys(pending).length)throw new Error(failure||'资料仍在保存，请稍后再试。');},exportDrafts:()=>download('LifeAtlas-本窗口草稿.json',{format:'lifeatlas-local-drafts',createdAt:new Date().toISOString(),values:Object.fromEntries(keys.map(k=>[k,localStorage.getItem(k)])),pending:Object.fromEntries(Object.keys(localStorage).filter(k=>/^lifeatlas-local-(pending|recovery)-v1:/.test(k)).map(k=>[k,localStorage.getItem(k)]))})};
 window.lifeAtlasLocal=bridge;window.addEventListener('online',()=>void drain().catch(()=>{}));document.addEventListener('visibilitychange',()=>{if(document.hidden)void drain().catch(()=>{});});window.addEventListener('beforeunload',e=>{if(Object.keys(pending).length){e.preventDefault();e.returnValue='';}});
 setInterval(()=>{if(Object.keys(pending).length&&!failure.includes('另一窗口'))void drain().catch(()=>{});},5000);
 window.addEventListener('storage',e=>{if(e.key===journalKey&&!Object.keys(pending).length){try{const other=JSON.parse(e.newValue||'{}');if(Object.keys(other).length)changedStatus();}catch{}}});
 if(Object.keys(pending).length)void drain().catch(()=>{});changedStatus();return bridge;
}
export function download(name:string,data:unknown){const url=URL.createObjectURL(new Blob([JSON.stringify(data,null,2)],{type:'application/json'})),a=document.createElement('a');a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),2000);}
