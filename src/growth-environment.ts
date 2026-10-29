import {environmentFields,environmentLabels,environmentPrompts,environmentOf,blankProfile,profileKeys,lifeStages,settlements,type LifeEnvironment,type EnvironmentField} from './environment-model';
const esc=(s:unknown)=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]!));
const options=(values:Record<string,string>,selected:string)=>Object.entries(values).map(([v,label])=>`<option value="${v}" ${v===selected?'selected':''}>${label}</option>`).join('');
export function environmentInputs(env:LifeEnvironment,prefix:string){
  const p=env.profile||blankProfile();
  const field=(k:EnvironmentField)=>`<div class="growth-env-field"><label for="${prefix}-${k}">${environmentLabels[k]}</label><p class="growth-help" id="${prefix}-${k}-help">${environmentPrompts[k]}</p><textarea id="${prefix}-${k}" name="env_${k}" rows="3" maxlength="1500" aria-describedby="${prefix}-${k}-help" placeholder="写下你实际观察到的情况；不适用的部分可以留空。">${esc(env[k])}</textarea></div>`;
  const input=(k:'age'|'province'|'city'|'district',label:string)=>`<div><label for="${prefix}-${k}">${label}</label><input id="${prefix}-${k}" name="env_profile_${k}" ${k==='age'?'type="number" min="0" max="120" step="1"':'type="text" maxlength="80"'} value="${esc(p[k])}"></div>`;
  const group=(title:string,content:string,open=false)=>`<details class="growth-environment-group" ${open?'open':''}><summary>${title}</summary><div>${content}</div></details>`;
  return `<label for="${prefix}-asOf">这份环境从什么时候起适用？</label><input id="${prefix}-asOf" name="env_asOf" type="date" required min="1900-01-01" max="2100-12-31" value="${esc(env.asOf)}"><p class="growth-help">补记旧经历时，使用当时的年龄、阶段和环境。按需展开，不必全部填完；无需真实姓名、学校公司全名或详细住址。</p><div class="growth-environment-fields">`+
    group('个人阶段与特点',`<div class="growth-form-pair">${input('age','当时的年龄（可选）')}<div><label for="${prefix}-stage">当时的阶段</label><select id="${prefix}-stage" name="env_profile_stage">${options(lifeStages,p.stage)}</select></div></div>${field('personal')}${field('strengths')}`,true)+
    group('地域与可接触的机会',`<label for="${prefix}-settlement">居住形态</label><select id="${prefix}-settlement" name="env_profile_settlement">${options(settlements,p.settlement)}</select><div class="growth-env-location">${input('province','省 / 自治区（可选）')}${input('city','城市 / 地区（可选）')}${input('district','区 / 县（可选）')}</div>${field('place')}<p class="growth-help">地区用于描述可接触的条件，不根据城乡或地名给人、学校或机会打分。</p>`)+
    group('家庭与父母',field('family'))+group('学校与老师',field('school'))+group('邻里、同伴与亲密关系',field('neighborhood'))+group('行业与职场',field('work'))+group('社会制度与文化',field('society')+field('culture'))+group('生活保障与信息环境',field('living')+field('digital'))+
    `</div><div class="growth-form-pair growth-env-resources">${field('supports')}${field('constraints')}</div>${field('sources')}`;
}
export function readEnvironment(form:HTMLFormElement):LifeEnvironment{
  const value=(name:string)=>(form.querySelector(`[name="${name}"]`) as unknown as {value:string}|null)?.value||'';
  const profile=Object.fromEntries(profileKeys.map(k=>[k,value('env_profile_'+k)])) as ReturnType<typeof blankProfile>;
  return {asOf:value('env_asOf'),...Object.fromEntries(environmentFields.map(k=>[k,value('env_'+k)])),...(profileKeys.some(k=>profile[k])?{profile}:{})} as LifeEnvironment;
}
export function environmentReading(raw:unknown,impact='',label='当时的环境'){
  const env=environmentOf(raw);if(!env)return '';const p=env.profile;
  const personal=p?[p.age?`${p.age} 岁`:'',lifeStages[p.stage as keyof typeof lifeStages]||'',settlements[p.settlement as keyof typeof settlements]||'',[p.province,p.city,p.district].filter(Boolean).join(' / ')].filter(s=>s&&s!=='暂不填写').join(' · '):'';
  return `<details class="growth-environment-summary"><summary>${esc(label)} · ${esc(env.asOf)} 起</summary><p class="growth-help">本人记录的环境观察；来源和核实情况见下方。环境变化不等于个人能力的变化。</p><dl>${personal?`<dt>当时的阶段与地域</dt><dd>${esc(personal)}</dd>`:''}${environmentFields.filter(k=>env[k]).map(k=>`<dt>${environmentLabels[k]}</dt><dd>${esc(env[k])}</dd>`).join('')}${impact?`<dt>这些条件如何影响这次选择</dt><dd>${esc(impact)}</dd>`:''}</dl></details>`;
}
export function environmentRecordEditor(env:LifeEnvironment,enabled:boolean,impact:string,hasProfile:boolean){
  return `<details class="growth-environment-editor" ${enabled?'open':''}><summary>这次经历的环境${enabled?' · 已附上':''}</summary><p class="growth-help">保存当时的个人阶段、家庭、学校、职场和地域条件；后来更新主题环境也不会改写这份记录。</p><label class="growth-environment-toggle"><input type="checkbox" id="growth-attach-environment" ${enabled?'checked':''}>保留本次环境描述</label>${hasProfile?'<button class="button subtle" type="button" data-growth="use-topic-environment">使用主题环境作为起点</button>':'<p class="growth-help">也可以先在“环境分析与成长”中建立一份环境描述。</p>'}<fieldset id="growth-environment-fields" ${enabled?'':'disabled'}>${environmentInputs(env,'moment-env')}<label for="moment-env-impact">这些条件如何影响这次选择？</label><textarea id="moment-env-impact" name="environmentImpact" rows="3" maxlength="2000" placeholder="哪些是自己的选择，哪些受外部条件影响？哪些可以协商或改变？">${esc(impact)}</textarea></fieldset></details>`;
}
