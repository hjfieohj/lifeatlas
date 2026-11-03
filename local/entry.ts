import '../src/style.css';
import '../src/growth.css';
import '../src/skins.css';
import '../src/growth-presentation.css';
import '../src/reading-room.css';
import '../src/guidance-integration.css';
import '../src/uiverse-system.css';
import '../src/investment.css';
import '../src/optional-modules.css';
import '../src/cosmic-integration.css';
import './workspace.css';
import '../src/inline-ai.css';
import {workspacePage,mountWorkspace,initializeWorkspace} from './workspace';
import {mountLifeAtlas} from '../src/main';
import {initializeStorage,download} from './storage';
const esc=(s:string)=>s.replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]!));
function updateStatus(){const bridge=window.lifeAtlasLocal;if(!bridge)return;const statuses=[bridge.status(),...Array.from(document.querySelectorAll('iframe')).map(f=>{try{return f.contentWindow?.lifeAtlasLocal?.status()||'已保存到本机';}catch{return '已保存到本机';}})];const text=statuses.find(s=>!['已保存到本机','正在保存或等待重试'].includes(s))||statuses.find(s=>s!=='已保存到本机')||'已保存到本机';document.querySelectorAll('[data-local-status]').forEach(el=>el.textContent=text);const profile=document.querySelector('.profile small');if(profile)profile.textContent='本机资料 · '+text;const root=document.querySelector('#main');let alert=document.querySelector('#local-save-error');const failed=!['已保存到本机','正在保存或等待重试'].includes(text);if(failed&&!alert&&root){alert=document.createElement('div');alert.id='local-save-error';alert.className='notice error';alert.setAttribute('role','alert');root.insertBefore(alert,root.firstChild);}if(alert){alert.textContent=failed?text:'';if(!failed)alert.remove();}}
async function flushAll(){await window.lifeAtlasLocal!.flush();for(const f of Array.from(document.querySelectorAll('iframe'))){try{await f.contentWindow?.lifeAtlasLocal?.flush();}catch(error){throw error;}}}
function mountLocalSettings(){
 const main=document.querySelector('#main'),bridge=window.lifeAtlasLocal;if(!main||!bridge)return;
 if(document.querySelector('#app')?.getAttribute('data-page')==='settings'){
 const panel=document.createElement('section');panel.className='settings-section';panel.id='local-data-panel';panel.innerHTML=`<h2>本地资料与备份</h2><p data-local-status role="status"></p><p>成长记录、知识笔记、收藏与设置保存在这台电脑。关闭窗口后可从桌面再次打开。</p><p class="muted small">资料目录：<span style="overflow-wrap:anywhere">${esc(bridge.dataDir)}</span><br>每次启动自动备份；完整备份包含个人记录，请妥善保管。</p><div class="inline-buttons"><button type="button" class="button primary" data-local-backup>备份全部资料</button><button type="button" class="button subtle" data-local-restore>从备份恢复</button><button type="button" class="button subtle" data-local-drafts>导出本窗口草稿</button></div><input type="file" accept=".json,application/json" data-local-file hidden><p class="small muted">旧知识页面的笔记，请在旧页面导出，再到知识宇宙中导入。外部资料和真实邮箱仍需联网。</p>`;
 const target=main.querySelector('.settings-grid>div');target?.insertBefore(panel,target.firstChild);
 panel.querySelector('[data-local-drafts]')!.addEventListener('click',()=>bridge.exportDrafts());
 const report=(message:string)=>{panel.querySelector('[data-local-status]')!.textContent=message;};
 const backupButton=panel.querySelector<HTMLButtonElement>('[data-local-backup]')!,restoreButton=panel.querySelector<HTMLButtonElement>('[data-local-restore]')!,file=panel.querySelector<HTMLInputElement>('[data-local-file]')!;
 backupButton.onclick=async()=>{backupButton.disabled=true;try{await flushAll();const r=await fetch('/api/local/backup',{method:'POST',headers:{'Content-Type':'application/json'},body:'{}'});const data=await r.json() as any;if(!r.ok)throw new Error(data.error?.message||'备份未完成。');download('LifeAtlas-完整备份-'+new Date().toISOString().slice(0,10)+'.json',data);report('已生成完整备份，资料目录中的 backups 文件夹也保留了一份。');}catch(e){report((e as Error).message);}finally{backupButton.disabled=false;}};
 restoreButton.onclick=()=>file.click();file.onchange=async()=>{const selected=file.files?.[0];if(!selected)return;if(selected.size>140*1024*1024){report('备份文件过大，未恢复。');return;}if(!confirm('恢复会替换当前全部个人资料。恢复前会自动备份现有资料。确定使用这个备份吗？')){file.value='';return;}restoreButton.disabled=true;try{await flushAll();const text=await selected.text();JSON.parse(text);const r=await fetch('/api/local/restore',{method:'POST',headers:{'Content-Type':'application/json'},body:text});const data=await r.json() as any;if(!r.ok)throw new Error(data.error?.message||'恢复未完成，原资料已保留。');location.reload();}catch(e){report((e as Error).message);restoreButton.disabled=false;file.value='';}};
 }
 updateStatus();
}
try{await initializeStorage();initializeWorkspace();mountLifeAtlas({local:true,renderPage:workspacePage,onRender:()=>{mountWorkspace();mountLocalSettings();}});window.addEventListener('lifeatlas-local-status',updateStatus);window.addEventListener('message',e=>{if(e.origin===location.origin&&e.source===document.querySelector<HTMLIFrameElement>('#knowledge-universe-frame')?.contentWindow&&e.data?.type==='lifeatlas:local-status')updateStatus();});}catch(error){document.querySelector('#app')!.innerHTML='<main style="padding:40px"><h1>本地资料暂不可用</h1><p>'+esc((error as Error).message)+'</p><p>请先启动桌面程序，再刷新此窗口。现有资料没有被清除。</p><button onclick="location.reload()">重试</button></main>';}
