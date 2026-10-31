export const moduleStorageKey='lifeatlas-modules-v1';
export const optionalModules={investment:'投资',life:'人生丰富多彩'} as const;
export type ModulePreferences={version:1;investment:boolean;life:boolean};
export function parseModulePreferences(raw:string|null):ModulePreferences{
  const defaults:ModulePreferences={version:1,investment:true,life:true};
  try{const value=JSON.parse(raw||'null');if(value?.version===1&&!Array.isArray(value))return {version:1,investment:typeof value.investment==='boolean'?value.investment:true,life:typeof value.life==='boolean'?value.life:true};}catch{/* Corrupt settings use the visible initial modules. */}
  return defaults;
}
export function moduleEnabled(route:string,prefs:ModulePreferences){return route==='investment'?prefs.investment:route==='life'?prefs.life:true;}
export function moduleRoute(route:string,prefs:ModulePreferences){return !['today','growth','investment','life','mail','history','settings'].includes(route)?'today':moduleEnabled(route,prefs)?route:'settings';}
export function moduleSettings(){return `<div class="module-settings"><h3>选择主模块</h3><p class="growth-help">打开后显示在主导航，关闭后隐藏入口。选择会记在这台浏览器，不会删除已有记录。</p>${Object.entries(optionalModules).map(([key,label])=>`<div class="setting-line"><div><strong>${label}</strong><p>${key==='investment'?'国际市场的基金、债券与股票研究。':'兴趣、创作、体验与人与人的连接。'}</p></div><label class="switch"><input type="checkbox" data-module="${key}" aria-label="显示${label}板块"><span aria-hidden="true"></span></label></div>`).join('')}<p class="growth-help" role="status" data-module-status></p></div>`;}
