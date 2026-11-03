import {environmentOf} from './environment-model.ts';
const text=(value:unknown)=>typeof value==='string'?value.trim():'';
function environment(value:unknown){const e=environmentOf(value);return e?JSON.stringify(e):'未填写';}
export function topicAIContext(t:{title?:string;baseline?:string;direction?:string;environmentProfile?:unknown}){
 return `成长主题：${text(t.title)}\n当前处境：${text(t.baseline)}\n想靠近的方向：${text(t.direction)}\n环境资料：${environment(t.environmentProfile)}`;
}
export function momentAIContext(title:string,m:{occurredOn?:string;kind?:string;event?:string;observation?:string;feedback?:string;reflection?:string;action?:string},env?:unknown,impact?:string){
 return `成长主题：${text(title)}\n日期：${text(m.occurredOn)}\n类型：${m.kind==='review'?'阶段总结':'经历与观察'}\n发生了什么：${text(m.event)}\n观察：${text(m.observation)}\n反馈：${text(m.feedback)}\n理解：${text(m.reflection)}\n下一步：${text(m.action)}\n当时环境：${environment(env)}\n环境影响：${text(impact)}`;
}
