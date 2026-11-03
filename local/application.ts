import {mountAppearance,appearanceSettings} from '../src/appearance';
import {moduleStorageKey,parseModulePreferences,moduleEnabled,moduleRoute,moduleSettings} from '../src/module-preferences';
import {mountGrowth} from '../src/growth';
import {knowledgePage,mountKnowledge} from '../src/knowledge';
import {lifeAtlasWordmark} from '../src/wordmark';
import {workspacePage,mountWorkspace,workspaceCanLeave,disposeWorkspace} from './workspace';
import {version} from '../package.json';

const icons:Record<string,string>={today:'<circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.4 1.4m11.2 11.2L19 19M5 19l1.4-1.4M17.6 6.4 19 5"/>',growth:'<path d="M20 4C8 2 2 7 5 15c8 4 14-2 15-11ZM4 21 16 9"/>',knowledge:'<circle cx="12" cy="12" r="3"/><ellipse cx="12" cy="12" rx="11" ry="5" transform="rotate(-35 12 12)"/>',investment:'<path d="M4 4v16h16M7 14l4-4 4 3 5-7"/>',life:'<circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.4 1.4m11.2 11.2L19 19M5 19l1.4-1.4M17.6 6.4 19 5"/>',mail:'<rect x="3" y="5" width="18" height="14" rx="3"/><path d="m3 7 9 6 9-6"/>',history:'<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',settings:'<path d="M4 7h16M4 17h16"/><circle cx="9" cy="7" r="3"/><circle cx="15" cy="17" r="3"/>'};
const routes=[['today','今日'],['growth','个人成长 / 环境感知'],['knowledge','知识宇宙'],['investment','投资研究'],['life','人生丰富度'],['mail','邮箱'],['history','任务记录'],['settings','偏好设置']];
const icon=(name:string)=>`<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${icons[name]}</svg>`;

/** Installed application shell. No sample mail, simulated operations or prototype controllers. */
export function mountLocalApplication(onRender:()=>void){
 const root=document.querySelector<HTMLElement>('#app')!,lifetime=new AbortController(),appearance=mountAppearance();
 let preferences=parseModulePreferences(localStorage.getItem(moduleStorageKey)),page=moduleRoute(location.hash.slice(1),preferences),growth:ReturnType<typeof mountGrowth>|undefined,knowledgeCleanup=()=>{};
 root.classList.add('local-workspace');
 const canLeave=()=>!growth||growth.canLeave();
 function syncModules(){root.querySelectorAll<HTMLElement>('[data-route]').forEach(el=>el.hidden=!moduleEnabled(el.dataset.route!,preferences));root.querySelectorAll<HTMLInputElement>('[data-module]').forEach(el=>el.checked=preferences[el.dataset.module as 'investment'|'life']);const count=6+Number(preferences.investment)+Number(preferences.life);root.style.setProperty('--nav-count',String(count));root.style.setProperty('--nav-phone-columns',String(count>=7?4:3));}
 function render(){
  growth?.destroy();growth=undefined;knowledgeCleanup();knowledgeCleanup=()=>{};disposeWorkspace();
  if(!moduleEnabled(page,preferences))page='settings';
  const nav=routes.map(([id,label])=>`<a href="#${id}" data-route="${id}" class="nav-item ${page===id?'active':''}" ${page===id?'aria-current="page"':''} aria-label="${label}">${icon(id)}<span class="nav-title">${id==='growth'?'<span class="nav-title-primary">个人成长</span><span class="nav-title-detail">环境感知</span>':id==='life'?'<span class="nav-title-primary">人生</span><span class="nav-title-detail">丰富度</span>':label}</span></a>`).join('');
  const content=page==='growth'?'<div id="growth-panel"></div>':page==='knowledge'?knowledgePage():workspacePage(page)!;
  root.innerHTML=`<aside class="sidebar"><a href="#today" class="brand" aria-label="LifeAtlas · 生活全图，回到今日">${lifeAtlasWordmark}<small>生活全图</small></a><nav aria-label="主导航">${nav}</nav><div class="sidebar-bottom"><div class="quiet">${icon('growth')}<span>给重要的事，留一点空。</span></div><div class="profile"><span class="avatar">我</span><div>我的生活空间<small data-local-status>本机资料</small></div></div></div></aside><div class="workspace"><main id="main" tabindex="-1">${content}</main><footer>LifeAtlas · v${version}<span>主动准备，由你决定。</span></footer></div>`;
  root.dataset.page=page;
  if(page==='settings'){root.querySelector('.settings-grid>div')?.insertAdjacentHTML('afterbegin',appearanceSettings());root.querySelector('.appearance-section')?.setAttribute('id','preferences-appearance');root.querySelector('.appearance-section')?.insertAdjacentHTML('beforeend',moduleSettings());}
  appearance.sync();syncModules();
  if(page==='growth')growth=mountGrowth(root.querySelector<HTMLElement>('#growth-panel')!);
  if(page==='knowledge')knowledgeCleanup=mountKnowledge(root,editing=>appearance.setModuleEditing(editing));
  mountWorkspace();onRender();
 }
 window.addEventListener('hashchange',()=>{if(!canLeave()||!workspaceCanLeave()){history.replaceState(null,'','#'+page);return;}page=moduleRoute(location.hash.slice(1),preferences);render();window.scrollTo(0,0);root.querySelector<HTMLElement>('#main')?.focus({preventScroll:true});},{signal:lifetime.signal});
 root.addEventListener('change',e=>{const input=e.target as HTMLInputElement;if(!input.dataset.module)return;preferences[input.dataset.module as 'investment'|'life']=input.checked;try{localStorage.setItem(moduleStorageKey,JSON.stringify(preferences));const message=root.querySelector('[data-module-status]');if(message)message.textContent='模块选择已保存。';}catch{const message=root.querySelector('[data-module-status]');if(message)message.textContent='选择未能保存，请稍后重试。';}syncModules();},{signal:lifetime.signal});
 window.addEventListener('storage',e=>{if(e.key===moduleStorageKey){preferences=parseModulePreferences(e.newValue);if(!moduleEnabled(page,preferences)){page='settings';history.replaceState(null,'','#settings');render();}else syncModules();}},{signal:lifetime.signal});
 window.addEventListener('beforeunload',e=>{if(!workspaceCanLeave(false)){e.preventDefault();e.returnValue='';}},{signal:lifetime.signal});
 document.querySelector('.skip')?.addEventListener('click',e=>{e.preventDefault();root.querySelector<HTMLElement>('#main')?.focus();},{signal:lifetime.signal});
 render();return()=>{lifetime.abort();growth?.destroy();knowledgeCleanup();disposeWorkspace();appearance.destroy();};
}
