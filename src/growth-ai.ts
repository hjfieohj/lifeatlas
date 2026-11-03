import {mountInlineAI} from './inline-ai';
import type {GrowthTopic,GrowthMoment} from './growth-model';
import {contextOf} from './growth-model';
import {readEnvironment} from './growth-environment';
import {topicAIContext,momentAIContext} from './growth-ai-context';
export function mountGrowthAI(panel:HTMLElement,options:{topic:GrowthTopic|null;moments:GrowthMoment[];draftId:string;editingTopic:GrowthTopic|null;editingMoment:GrowthMoment|null}){
 if(!window.lifeAtlasLocal)return ()=>{};
 const cleanup:(()=>void)[]=[],{topic}=options;
 function attach(after:Element,id:string,label:string,read:()=>string,content:()=>string,watch?:HTMLElement){const host=document.createElement('div');after.insertAdjacentElement('afterend',host);cleanup.push(mountInlineAI(host,{type:'growth',kind:'growth',id,label,read,content,watch}));}
 const form=panel.querySelector<HTMLFormElement>('.growth-editor form');
 const currentTitle=()=>form?.id==='growth-topic-form'?(form.querySelector<HTMLInputElement>('[name="title"]')?.value.trim()||''):(topic?.title||'');
 const prefix=()=>currentTitle()?'当前成长主题：'+currentTitle()+'\n':'';
 if(form){
  const id=form.id==='growth-topic-form'?(options.editingTopic?.id||options.draftId):form.id==='growth-moment-form'?(options.editingMoment?.id||options.draftId):form.id==='growth-advisor-form'?options.draftId:topic?.id||options.draftId;
  type Field=HTMLInputElement; // Shared value/name DOM interface; select uses a runtime tag check below.
  const fields=()=>Array.from(form.querySelectorAll<Field>('textarea,select,input[type="text"],input[type="number"],input:not([type])')).filter(el=>!el.closest('.inline-ai')&&!el.matches(':disabled')&&el.name);
  const label=(el:Field)=>form.querySelector(`label[for="${el.id}"]`)?.textContent?.trim()||el.closest('label')?.childNodes[0]?.textContent?.trim()||el.name;
  const read=(elements:()=>Field[])=>prefix()+elements().filter(el=>el.value.trim()).map(el=>label(el)+'：'+(el.tagName==='SELECT'?(el as unknown as HTMLSelectElement).selectedOptions[0]?.textContent:el.value.trim())).join('\n');
  if(form.id==='growth-topic-form'||form.id==='growth-moment-form'){
   for(const field of fields().filter(el=>el.tagName==='TEXTAREA'&&!el.closest('.growth-environment-editor'))){const name=field.name;attach(field,id+':'+name,label(field),()=>read(()=>[field]),()=>field.value,form);}
  }
  // Environment and situational guidance contain interdependent inputs; keep each layer together.
  for(const [index,group] of Array.from(form.querySelectorAll<HTMLElement>('.growth-environment-group')).entries()){
   const title=group.querySelector('summary strong,legend,h3,h4')?.textContent?.trim()||'环境层次 '+(index+1),elements=()=>fields().filter(el=>group.contains(el));
   const host=document.createElement('div');group.appendChild(host);cleanup.push(mountInlineAI(host,{type:'growth',kind:'growth',id:id+':environment:'+index,label:title,read:()=>read(elements),content:()=>elements().map(el=>el.value).join('').trim(),watch:form}));
  }
  const labelText=form.id==='growth-advisor-form'?'当前困扰与选择':form.id==='growth-environment-form'?'五层环境资料':form.id==='growth-topic-form'?'整个成长主题':'这次经历的全部填写';
  const whole=()=>{const values:Record<string,string>={};new FormData(form).forEach((v,k)=>{if(typeof v==='string')values[k]=v;});
   if(form.id==='growth-topic-form')return topicAIContext({...values,environmentProfile:options.editingTopic?.environmentProfile});
   if(form.id==='growth-moment-form')return momentAIContext(currentTitle(),values,form.querySelector<HTMLInputElement>('#growth-attach-environment')?.checked?readEnvironment(form):null,values.environmentImpact);
   return read(fields);
  };
  const suffix=form.id==='growth-environment-form'?':environment':form.id==='growth-advisor-form'?':guidance':':whole';
  attach(form,id+suffix,labelText,whole,()=>form.id==='growth-advisor-form'?(form.querySelector<HTMLInputElement>('[name="story"]')?.value||''):fields().filter(el=>el.name!=='title'&&el.tagName!=='SELECT').map(el=>el.value).join('').trim(),form);
 }else if(topic){
  const intro=panel.querySelector('.growth-topic-intro');
  if(intro)attach(intro,topic.id+':whole','成长主题与起点',()=>topicAIContext(topic),()=>topic.baseline+topic.direction);
  for(const moment of options.moments){const article=panel.querySelector('#moment-'+CSS.escape(moment.id));if(!article)continue;attach(article,moment.id+':whole','这次经历与观察',()=>momentAIContext(topic.title,moment,contextOf(moment).environment,contextOf(moment).environmentImpact),()=>moment.event);}
  const reading=panel.querySelector('.growth-reading');if(reading&&options.moments.length)attach(reading,topic.id+':trajectory','当前已加载的成长轨迹',()=>`主题：${topic.title}\n仅包含当前已加载的 ${options.moments.length} 条记录，不代表完整历史。\n`+options.moments.map(m=>`${m.occurredOn}\n事件：${m.event}\n观察：${m.observation}\n反馈：${m.feedback}\n理解：${m.reflection}\n尝试：${m.action}`).join('\n\n'),()=>options.moments.map(m=>m.event).join(''));
 }
 return ()=>cleanup.forEach(fn=>fn());
}
