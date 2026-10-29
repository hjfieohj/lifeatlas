import {environmentLayers} from './environment-model';
export const growthModuleLabel='个人成长 / 环境感知';
const icon=(path:string)=>`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${path}</svg>`;
const compass=icon('<circle cx="12" cy="12" r="9"/><path d="m16 8-2.5 5.5L8 16l2.5-5.5L16 8Z"/>');
const choices=icon('<path d="M12 21V6m0 4H5L2 7l3-3h7m0 10h7l3-3-3-3h-7"/>');
const arrow=icon('<path d="M4 12h16m-6-6 6 6-6 6"/>');
export function growthPageHeader(){return `<header class="growth-page-head"><div class="growth-page-copy"><h1>个人成长 <span>/</span> 环境感知</h1><p class="growth-headline">看清自己的位置，也看见改变的余地。</p><ol class="growth-layer-map" aria-label="由近到远的五层环境">${environmentLayers.map(l=>`<li>${l.title}</li>`).join('')}</ol></div><div class="growth-cover" aria-hidden="true"><img src="/images/dawn-lake.webp" alt="" width="360" height="180"></div></header>`;}
export function growthPaths(deleted:boolean){return `<section class="growth-environment-paths" aria-label="环境感知的两个入口"><div class="growth-path-profile"><div class="growth-path-symbol">${compass}</div><h3>环境分析与成长</h3><p>从自己到大环境，整理处境，<br>理解影响，回看一路的变化。</p><button class="button subtle" data-growth="edit-environment" ${deleted?'disabled':''}>整理环境档案 ${arrow}</button></div><div class="growth-path-guide"><div class="growth-path-symbol">${choices}</div><h3>帮我看清局面</h3><p>一件困扰，从哪里开始？<br>看懂线索，找到目前可行的选择。</p><button class="button primary" data-growth="open-advisor" ${deleted?'disabled':''}>分析困扰与选择 ${arrow}</button></div></section>`;}
