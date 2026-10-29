export const environmentFields=['personal','strengths','family','school','neighborhood','work','place','society','culture','living','digital','supports','constraints','sources'] as const;
export type EnvironmentField=typeof environmentFields[number];
export const lifeStages={'':'暂不填写',preschool:'学龄前',primary:'小学阶段',secondary:'中学或中职阶段',higher:'大学或继续学习',work:'在职',transition:'求职或转型',care:'主要承担照护',retired:'退休',other:'其他或多个阶段'};
export const settlements={'':'暂不填写',rural:'农村',town:'乡镇或县城',city:'城市',other:'其他或流动居住'};
export const profileKeys=['age','stage','settlement','province','city','district'] as const;
export type EnvironmentProfile=Record<typeof profileKeys[number],string>;
export type LifeEnvironment={asOf:string;profile?:EnvironmentProfile}&Record<EnvironmentField,string>;
export const environmentLabels:Record<EnvironmentField,string>={personal:'个人阶段、需要与特点',strengths:'特长、兴趣与已有能力',family:'父母、家庭与共同生活',school:'学校、老师与学习环境',neighborhood:'邻里、同伴与亲密关系',work:'行业、同事与管理方式',place:'地域、机会与生活条件',society:'政策与社会环境',culture:'风俗、文化与人情',living:'经济、健康、时间与生活保障',digital:'网络与信息环境',supports:'可利用的支持与资源',constraints:'当前的限制与压力',sources:'依据、来源与待核实之处'};
export const environmentPrompts:Record<EnvironmentField,string>={personal:'目前在读几年级、做什么工作或承担哪些角色？自己的习惯、需要和容易受影响的地方是什么？',strengths:'喜欢什么、擅长什么？写一个做成过的具体例子，区分自己的兴趣与他人的期待。',family:'可用“母亲、父亲”等称呼。分别写他们的知识经验、常见做法、沟通方式，以及实际给过的支持或压力。性格判断请配具体事例。',school:'课程与教学资源、老师如何讲解和反馈、同学如何相处、求助是否有效。别只用升学率或学历概括。',neighborhood:'居住环境、噪声与安全、邻里规则、朋友或伴侣怎样相处。哪些具体行为容易产生冲突，哪些人能够支持你？',work:'行业与岗位、同事合作、老板如何分配任务和评价、收入稳定性、工时与边界。记录具体事件。',place:'可只写省、市、区县。哪些岗位、学校、公共服务确实能接触到？生活成本、通勤与迁移成本怎样？',society:'影响这件事的政策、行业和就业条件。政策请写适用地区、有效期和核实情况。',culture:'具体遇到的风俗、人情往来和价值期待；描述实际情形，避免替整个地方下结论。',living:'收入是否够基本生活、可支配时间、休息与身体负担、照护责任。只写愿意保存的内容，无需精确金额或病史。',digital:'常从哪里获得信息？是否遇到比较焦虑、诱导消费、虚假机会或网络骚扰？信息如何核实？',supports:'哪些人、制度、时间或资源可以帮助自己？',constraints:'哪些条件暂时难以改变？哪些有协商或调整的空间？',sources:'区分亲身观察、他人转述和公开文件，写下来源、查阅日期与不确定之处。'};
export const blankProfile=():EnvironmentProfile=>Object.fromEntries(profileKeys.map(k=>[k,''])) as EnvironmentProfile;
export function hasEnvironmentContent(env:LifeEnvironment){return environmentFields.some(k=>env[k]?.trim())||profileKeys.some(k=>env.profile?.[k]?.trim());}
export function blankEnvironment(asOf:string):LifeEnvironment{return {asOf,...Object.fromEntries(environmentFields.map(k=>[k,'']))} as LifeEnvironment;}
export function environmentOf(value:unknown):LifeEnvironment|null{
  let raw=value;try{if(typeof raw==='string')raw=JSON.parse(raw);}catch{return null;}
  if(!raw||typeof raw!=='object'||Array.isArray(raw)||typeof (raw as LifeEnvironment).asOf!=='string')return null;
  const result=blankEnvironment((raw as LifeEnvironment).asOf);for(const k of environmentFields)if(typeof (raw as LifeEnvironment)[k]==='string')result[k]=(raw as LifeEnvironment)[k];
  const p=(raw as LifeEnvironment).profile;if(p&&typeof p==='object'&&!Array.isArray(p)){result.profile=blankProfile();for(const k of profileKeys)if(typeof p[k]==='string')result.profile[k]=p[k];}
  return hasEnvironmentContent(result)?result:null;
}
