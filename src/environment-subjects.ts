import type {GuidanceInput,GuidanceSignal} from './environment-advisor.ts';
import {lifeStages,environmentLayers,environmentLabels,type LifeEnvironment} from './environment-model.ts';
import {validDay} from './growth-model.ts';

export const subjectKinds={person:'人',organization:'组织',condition:'制度或环境条件'};
export const subjectLayers={personal:'个人',family:'家庭',social:'身边社会',regional:'地域与制度',macro:'宏观与外部环境'};
export const sourceKinds={unknown:'还不清楚',observed:'自己的观察',reported:'他人转述',public:'公开资料'};
export const relationshipKinds={unknown:'关系还不清楚',reinforce:'要求或压力叠加',support:'提供支持或缓冲',conflict:'规则或目标冲突'};
export const relationshipCertainty={possible:'可能如此，尚待验证',observed:'已观察到这种联系',unknown:'还不清楚'};
export const maxSubjects=6,maxRelationships=6;
export const subjectSignalKeys=['listening','help','humiliation','control','threat','violence','overload','unclear','isolation'] as const;
export type GuidanceSubject={id:string;label:string;kind:keyof typeof subjectKinds;layer:keyof typeof subjectLayers;relation:string;facts:string;characteristics:string;resources:string;observedImpact:string;possibleImpact:string;source:keyof typeof sourceKinds;sourceNote:string;signals:GuidanceSignal[]};
export type GuidanceRelationship={id:string;from:string;to:string;kind:keyof typeof relationshipKinds;description:string;impact:string;certainty:keyof typeof relationshipCertainty;source:string};
export type SubjectCue={id:string;signal:GuidanceSignal;quote:string};
export type SubjectReading={id:string;label:string;kind:string;layer:string;facts:string;source:string;sourceNote:string;relation:string;resources:string;characteristics:{label:string;basis:string;status:string;influence:string}[];observedImpact:string;possibleImpact:string;response:string;uncertainty:string[]};
export type GuidanceIntegration={overview:string;position:{label:string;value:string}[];subjects:SubjectReading[];relationships:{from:string;to:string;kind:string;description:string;impact:string;certainty:string;source:string;reading:string}[];actionSpace:string[];reviewQuestions:string[];watchFor:string};
export const integratedSections=[
  '我和周围的环境，分别是什么样的？',
  '这些特点相遇，会形成怎样的处境？',
  '在这个处境中，我有哪些行动空间？',
  '行动和变化发生后，我该怎样更新认识？'
] as const;
export function blankSubject(id:string):GuidanceSubject{return {id,label:'',kind:'person',layer:'family',relation:'',facts:'',characteristics:'',resources:'',observedImpact:'',possibleImpact:'',source:'unknown',sourceNote:'',signals:[]};}
export function blankRelationship(id:string,from:string,to:string):GuidanceRelationship{return {id,from,to,kind:'unknown',description:'',impact:'',certainty:'possible',source:''};}
const excerpt=(value:string,max:number)=>value.length>max?value.slice(0,max-6)+'…（摘录）':value;
export function importGuidanceEnvironment(input:GuidanceInput,env:LifeEnvironment,day:string){
  if(!validDay(day))throw new Error('请先填写这次经历的有效日期。');
  if(env.asOf>day)throw new Error('主题环境的起始日期晚于这次经历。请先选择当时适用的日期或手动填写主体。');
  const result:GuidanceInput={...input,subjects:[...(input.subjects||[])],relationships:[...(input.relationships||[])]};
  const own=[env.personal,env.strengths,env.living,env.digital,...['occupation','major','industry'].map(k=>env.profile?.[k as 'occupation'|'major'|'industry']||'')].filter(Boolean).join('\n');
  if(!result.self)result.self=excerpt(own,1000);if(!result.age)result.age=env.profile?.age||'';if(!result.stage)result.stage=env.profile?.stage||'';
  if(!result.resources)result.resources=excerpt(env.supports,1000);if(!result.constraints)result.constraints=excerpt(env.constraints,1000);
  let added=0,skipped=0;
  for(const layer of environmentLayers.filter(l=>l.id!=='personal')){
    const facts=layer.fields.filter(f=>env[f]).map(f=>environmentLabels[f]+'：'+env[f]).join('\n');
    if(!facts||result.subjects!.some(s=>s.id==='env_'+layer.id))continue;
    if(result.subjects!.length===maxSubjects){skipped++;continue;}
    result.subjects!.push({...blankSubject('env_'+layer.id),label:layer.title+'（档案摘录）',kind:'condition',layer:layer.id,facts:excerpt(facts,1000),sourceNote:excerpt('本主题环境档案，起始日 '+env.asOf+'。这是层次摘录，请按需拆成具体主体并核对来源。\n'+env.sources,400)});added++;
  }
  return {input:result,added,skipped};
}
const isObject=(v:unknown):v is Record<string,unknown>=>!!v&&typeof v==='object'&&!Array.isArray(v);
function string(v:unknown,max:number,label:string,required=false){const text=v??'';if(typeof text!=='string'||text.length>max||(required&&!text.trim()))throw new Error('请检查'+label+'的内容和长度。');return text.trim();}
function choice<T extends Record<string,string>>(v:unknown,options:T,label:string):keyof T{if(typeof v!=='string'||!Object.hasOwn(options,v))throw new Error('请选择有效的'+label+'。');return v;}
function id(v:unknown){if(typeof v!=='string'||!/^[A-Za-z0-9_-]{1,64}$/.test(v))throw new Error('主体或关系编号无效，请重新添加。');return v;}
export function validateSubjects(value:unknown):GuidanceSubject[]{
  if(value===undefined)return [];
  if(!Array.isArray(value)||value.length>maxSubjects)throw new Error('每次最多整理 6 个关键主体，可以分次补充。');
  const seen=new Set<string>();return value.map(raw=>{
    if(!isObject(raw))throw new Error('主体资料格式无效。');
    const key=id(raw.id);if(seen.has(key))throw new Error('主体编号重复，请重新添加。');seen.add(key);
    const result=blankSubject(key);result.label=string(raw.label,80,'主体称呼',true);result.kind=choice(raw.kind,subjectKinds,'主体类型');result.layer=choice(raw.layer,subjectLayers,'环境层次');result.source=choice(raw.source,sourceKinds,'信息来源');
    for(const [field,max] of Object.entries({relation:500,facts:1000,characteristics:600,resources:500,observedImpact:500,possibleImpact:500,sourceNote:400})) (result as unknown as Record<string,unknown>)[field]=string(raw[field],max,'主体资料');
    if(!result.facts)throw new Error('请为“'+result.label+'”写一个具体做法、事件或规则。');
    if(!Array.isArray(raw.signals)||raw.signals.length>subjectSignalKeys.length||raw.signals.some(s=>!subjectSignalKeys.includes(s as GuidanceSignal)))throw new Error('主体行为选项无效。');
    result.signals=[...new Set(raw.signals)] as GuidanceSignal[];return result;
  });
}
export function validateRelationships(value:unknown,subjects:GuidanceSubject[]):GuidanceRelationship[]{
  if(value===undefined)return [];
  if(!Array.isArray(value)||value.length>maxRelationships)throw new Error('每次最多记录 6 条主体联系。');
  const subjectIds=new Set(subjects.map(s=>s.id)),seen=new Set<string>();return value.map(raw=>{
    if(!isObject(raw))throw new Error('主体联系格式无效。');
    const key=id(raw.id),from=id(raw.from),to=id(raw.to);
    if(seen.has(key)||from===to||!subjectIds.has(from)||!subjectIds.has(to))throw new Error('请为联系选择两个不同且仍在本次分析中的主体。');seen.add(key);
    return {id:key,from,to,kind:choice(raw.kind,relationshipKinds,'联系类型'),description:string(raw.description,600,'主体如何相互作用',true),impact:string(raw.impact,600,'联系的影响'),certainty:choice(raw.certainty,relationshipCertainty,'联系的核实情况'),source:string(raw.source,400,'联系的依据')};
  });
}
type Conditions={danger:boolean;caution:boolean;dependent:boolean;capacityLabel:string;domainLabel:string};
const influence:Record<GuidanceSignal,string>={
  listening:'倾听可能为表达需要和协商提供入口；还要验证不同意见是否也能被听见。',
  help:'具体支持可能增加资源与选择；需要核对能帮什么、何时可用，以及附带条件。',
  humiliation:'贬低或羞辱可能增加表达压力、影响对自己的理解；不能据此诊断人格。',
  control:'关系或资源被用于强迫服从时，选择空间可能受限；依赖程度会改变拒绝的代价。',
  threat:'威胁线索需要优先核对安全与可靠求助，不能用一次顺从或沟通来保证风险消失。',
  violence:'伤害线索需要优先关注安全与保护，不安排独自对质。',
  overload:'要求超过可用时间或资源时，可能挤压学习、生活或工作安排；先核对实际负担。',
  unclear:'规则或责任不清可能增加反复调整的成本；需要明确谁能解释和改变标准。',
  isolation:'缺少可放心求助的渠道可能减少退路；需要核实能够保密且提供实际帮助的支持。'
};
export function integrateGuidance(input:GuidanceInput,labels:Record<GuidanceSignal,string>,cues:SubjectCue[],conditions:Conditions):GuidanceIntegration{
  const raw=input.subjects||[],relations=input.relationships||[];
  const position=[
    {label:'当时的阶段',value:[input.age?input.age+' 岁':'',lifeStages[input.stage as keyof typeof lifeStages]].filter(Boolean).join(' · ')},
    {label:'自己的特点与需要',value:input.self||''},{label:'希望先改变',value:input.goal},
    {label:'自主空间',value:conditions.capacityLabel},{label:'已有支持',value:input.resources},{label:'当前限制',value:input.constraints}
  ].filter(p=>p.value);
  const subjects=raw.map(s=>{
    const hints=cues.filter(h=>h.id===s.id&&!s.signals.includes(h.signal));
    const characteristics:SubjectReading['characteristics']=s.characteristics?[{label:s.characteristics,basis:excerpt(s.facts,220),status:'用户的理解，待具体事例验证',influence:'请结合发生频率、不同场景和反例，核对这一特点如何实际影响自己。'}]:[];
    for(const flag of s.signals)characteristics.push({label:labels[flag],basis:excerpt(s.facts,220),status:'用户标注的行为，系统未独立核实',influence:influence[flag]});
    for(const h of hints)characteristics.push({label:labels[h.signal],basis:h.quote,status:'关键词线索，待核实',influence:influence[h.signal]});
    const uncertainty=[];
    if(s.source==='unknown'||!s.sourceNote)uncertainty.push('补充发生时间、信息来源与适用场景；来源类别本身不代表内容已被核实。');
    if(!characteristics.length)uncertainty.push('已有事件描述，尚不足以概括稳定特点。可以补一个具体反例或重复发生的情形。');
    if(!s.relation)uncertainty.push('这个主体对哪些事情有决定权？你在哪些方面依赖它，或能影响它？');
    if(!s.observedImpact)uncertainty.push('目前没有单独填写已经发生的影响；下列规则提示仍是需要观察的可能路径。');
    const response=conditions.danger?'先确认安全的联系和求助方式，再核实谁能提供实际保护；不独自对质。':s.kind==='condition'?'核实这项条件的适用时间、范围和传导环节，先选择一个成本可承担、可撤回的准备动作。':conditions.caution?'先盘点决定权、资源依赖和安全的支持渠道；暂不把直接表达或对质作为默认步骤。':s.signals.some(f=>f==='help'||f==='listening')?'围绕一项具体需要，核实能获得的帮助或可协商的安排，约定一次小范围、可回看的尝试。':'先核对一项具体规则、要求或事件，明确谁有权限调整，再选择一个有限、可撤回的尝试。';
    return {id:s.id,label:s.label,kind:subjectKinds[s.kind],layer:subjectLayers[s.layer],facts:s.facts,source:sourceKinds[s.source],sourceNote:s.sourceNote,relation:s.relation,resources:s.resources,characteristics,observedImpact:s.observedImpact,possibleImpact:s.possibleImpact,response,uncertainty};
  });
  const relationshipReading={unknown:'目前保留这条联系，不据此补造因果。可以观察一次具体事件中双方的先后反应。',reinforce:'要求或压力可能叠加。核对是否占用同一份时间、资源或选择空间，寻找能够共同调整的一个环节。',support:'支持可能缓冲其他主体带来的限制。核实帮助是否真的可用、能否保密，以及是否附有新的依赖条件。',conflict:'不同规则或目标可能把你夹在中间。先核实各方要求和决定权，避免把难以同时满足的要求全部归给自己承担。'};
  const relationships=relations.map(r=>({from:raw.find(s=>s.id===r.from)!.label,to:raw.find(s=>s.id===r.to)!.label,kind:relationshipKinds[r.kind],description:r.description,impact:r.impact,certainty:relationshipCertainty[r.certainty],source:r.source,reading:relationshipReading[r.kind]}));
  const actionSpace=[conditions.danger?'安全与可靠支持优先，暂不安排独自对质。':conditions.dependent?'按现有依赖程度安排改变，先增加一项实际可用的支持。':'先选择自己确实能控制、成本可承担的一个环节。'];
  if(input.resources)actionSpace.push('你记录的支持：'+input.resources+'。需要核对谁愿意帮、能帮到哪一步。');
  if(input.constraints)actionSpace.push('你记录的限制：'+input.constraints+'。方案应说明暂时保留什么、什么条件变化后再调整。');
  if(subjects.some(s=>s.resources))actionSpace.push('把主体掌握的资源与自己的需要对照，检查可获得性、条件和替代渠道。');
  return {overview:raw.length?'围绕'+conditions.domainLabel+'，结合自己的特点，逐个核对“'+raw.map(s=>s.label).join('、')+'”的做法、关系和影响。已有支持与限制可以同时存在。':'先根据这件事整理处境；补充关键主体后，可以进一步拆开特点、关系和影响。',position,subjects,relationships,actionSpace,reviewQuestions:['实际做了什么，结果与预期有何不同？','自己、关键主体或外部条件，分别发生了什么变化？','哪条关于主体特点或影响的判断得到支持，哪条需要修正？依据是什么？','下一步保留什么、调整什么，何时带着新记录再次回看？'],watchFor:input.watchFor||''};
}
