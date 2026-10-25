import {blankEnvironment,environmentFields,environmentLabels,environmentPrompts,environmentOf,type LifeEnvironment} from './environment-model';
const esc=(s:unknown)=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]!));
export function environmentInputs(env:LifeEnvironment,prefix:string){
  const field=(k:typeof environmentFields[number])=>`<div><label for="${prefix}-${k}">${environmentLabels[k]}</label><textarea id="${prefix}-${k}" name="env_${k}" rows="3" maxlength="1500" placeholder="${environmentPrompts[k]}">${esc(env[k])}</textarea></div>`;
  return `<label for="${prefix}-asOf">环境起始日期</label><input id="${prefix}-asOf" name="env_asOf" type="date" required min="1900-01-01" max="2100-12-31" value="${esc(env.asOf)}"><p class="growth-help">这份描述从什么时候起适用？补记旧经历时，请使用当时的日期和条件。</p><div class="growth-environment-fields">${environmentFields.slice(0,5).map(field).join('')}</div><div class="growth-form-pair">${(['supports','constraints'] as const).map(field).join('')}</div>${field('sources')}`;
}
export function readEnvironment(form:HTMLFormElement):LifeEnvironment{
  const value=(name:string)=>form.querySelector<HTMLInputElement|HTMLTextAreaElement>(`[name="${name}"]`)?.value||'';
  return {asOf:value('env_asOf'),...Object.fromEntries(environmentFields.map(k=>[k,value('env_'+k)]))} as LifeEnvironment;
}
export function environmentReading(raw:unknown,impact='',label='当时的环境'){
  const env=environmentOf(raw);if(!env)return '';
  return `<details class="growth-environment-summary"><summary>${esc(label)} · ${esc(env.asOf)} 起</summary><p class="growth-help">本人记录的环境观察；来源和核实情况见下方。环境变化不等于个人能力的变化。</p><dl>${environmentFields.filter(k=>env[k]).map(k=>`<dt>${environmentLabels[k]}</dt><dd>${esc(env[k])}</dd>`).join('')}${impact?`<dt>这些条件如何影响这次选择</dt><dd>${esc(impact)}</dd>`:''}</dl></details>`;
}
export function environmentRecordEditor(env:LifeEnvironment,enabled:boolean,impact:string,hasProfile:boolean){
  return `<details class="growth-environment-editor" ${enabled?'open':''}><summary>这次经历的环境${enabled?' · 已附上':''}</summary><p class="growth-help">记录当时的家庭、组织和社会条件，以及它们如何影响选择。保存后随这条经历保留；主题环境以后更新也不会改写它。</p><label class="growth-environment-toggle"><input type="checkbox" id="growth-attach-environment" ${enabled?'checked':''}>保留本次环境描述</label>${hasProfile?'<button class="button subtle" type="button" data-growth="use-topic-environment">使用主题环境作为起点</button>':'<p class="growth-help">也可以先在主题的“环境感知”中建立一份环境描述。</p>'}<fieldset id="growth-environment-fields" ${enabled?'':'disabled'}>${environmentInputs(env,'moment-env')}<label for="moment-env-impact">这些条件如何影响这次选择？</label><textarea id="moment-env-impact" name="environmentImpact" rows="3" maxlength="2000" placeholder="哪些是自己的选择，哪些受外部条件影响？哪些可以协商或改变？">${esc(impact)}</textarea></fieldset></details>`;
}
