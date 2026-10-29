export const environmentFields=['personal','strengths','family','school','neighborhood','work','place','society','culture','living','digital','region','governance','power','economy','industry','geopolitics','exposure','supports','constraints','sources'] as const;
export type EnvironmentField=typeof environmentFields[number];
export const lifeStages={'':'暂不填写',preschool:'学龄前',primary:'小学阶段',secondary:'中学或中职阶段',higher:'大学或继续学习',work:'在职',transition:'求职或转型',care:'主要承担照护',retired:'退休',other:'其他或多个阶段'};
export const settlements={'':'暂不填写',rural:'农村',town:'乡镇或县城',city:'城市',other:'其他或流动居住'};
export const profileKeys=['age','stage','occupation','major','industry','settlement','province','city','district'] as const;
export type EnvironmentProfile=Record<typeof profileKeys[number],string>;
export type LifeEnvironment={asOf:string;profile?:EnvironmentProfile}&Record<EnvironmentField,string>;
export const environmentLayers=[
  {id:'personal',title:'个人',description:'阶段、特点、专业与承受能力',fields:['personal','strengths','living','digital']},
  {id:'family',title:'家庭',description:'父母、关系、责任与支持',fields:['family']},
  {id:'social',title:'身边社会',description:'学校、职场、邻里与同伴',fields:['school','work','neighborhood']},
  {id:'regional',title:'地域与制度',description:'区县、省市、区域经济与地方治理',fields:['place','region','society','culture','governance','power']},
  {id:'macro',title:'宏观与外部环境',description:'经济周期、行业传导与地缘风险',fields:['economy','industry','geopolitics']}
] as const satisfies ReadonlyArray<{id:string;title:string;description:string;fields:readonly EnvironmentField[]}>;
export const environmentLabels:Record<EnvironmentField,string>={personal:'个人阶段、需要与特点',strengths:'特长、兴趣与已有能力',family:'父母、家庭与共同生活',school:'学校、老师与学习环境',neighborhood:'邻里、同伴与亲密关系',work:'行业、同事与管理方式',place:'地域、机会与生活条件',society:'主要政策与公共服务',culture:'风俗、文化与人情',living:'经济、健康、时间与生活保障',digital:'网络与信息环境',region:'跨区域联系与区域经济',governance:'地方治理与公开施政',power:'重要经济主体与地方影响力',economy:'宏观经济、就业与生活成本',industry:'经济变化与职业、行业、专业的联系',geopolitics:'地缘、供应链与外部风险',exposure:'外部变化怎样一步步影响到我',supports:'可利用的支持与资源',constraints:'当前的限制与压力',sources:'依据、来源与待核实之处'};
export const environmentPrompts:Record<EnvironmentField,string>={
  personal:'目前在读几年级、做什么工作或承担哪些角色？自己的习惯、需要和容易受影响的地方是什么？',
  strengths:'喜欢什么、擅长什么？写一个做成过的具体例子，区分自己的兴趣与他人的期待。',
  family:'可用“母亲、父亲”等称呼。分别写他们的知识经验、常见做法、沟通方式，以及实际给过的支持或压力。性格判断请配具体事例。',
  school:'课程与教学资源、老师如何讲解和反馈、同学如何相处、求助是否有效。别只用升学率或学历概括。',
  neighborhood:'居住环境、噪声与安全、邻里规则、朋友或伴侣怎样相处。哪些具体行为容易产生冲突，哪些人能够支持你？',
  work:'行业与岗位、同事合作、老板如何分配任务和评价、收入稳定性、工时与边界。记录具体事件。',
  place:'可只写省、市、区县。哪些岗位、学校、公共服务确实能接触到？生活成本、通勤、自然环境与基础设施怎样？',
  society:'影响这件事的主要政策与公共服务。写明适用地区、有效期、资格条件、具体来源和核实情况。',
  culture:'具体遇到的风俗、人情往来和价值期待；描述实际情形，避免替整个地方下结论。',
  living:'收入是否够基本生活、可支配时间、休息与身体负担、照护责任。只写愿意保存的内容，无需精确金额或病史。',
  digital:'常从哪里获得信息？是否遇到比较焦虑、诱导消费、虚假机会或网络骚扰？信息如何核实？',
  region:'所在地区与华北、长三角、珠三角等区域的产业、交通、人口和资源联系如何？哪些条件实际影响自己的专业或工作？区域只是分析范围。',
  governance:'主要负责人的公开施政重点、具体决策、承诺履行、办事透明度与服务反馈。写明任职时期、地区和来源；依据可观察的做法理解治理，不凭传闻推断人格。',
  power:'哪些大企业、雇主或资源集中者影响当地就业与生活？涉及胁迫、违法或黑恶势力的线索，区分亲历、传闻、公开报道与司法材料，保留来源，不据传闻认定个人或组织。',
  economy:'有何可核实的就业、收入、需求、价格或经济变化？标明时间与来源，区分总体趋势、所在行业和自己的实际处境。',
  industry:'从经济变化到行业订单、岗位、收入和专业机会，影响经过哪些环节？哪些是已有迹象，哪些仍是假设？',
  geopolitics:'经核实、与自己有关的国际关系、交通、供应链或跨境变化。影响是否真的到达自己的工作与生活？不因某个居住地就默认存在某项风险。',
  exposure:'外部变化 → 区域或行业 → 学校、组织或家庭 → 自己的收入、学习、安全或选择。哪一环有证据？哪些还需观察？自己能调整哪一步？',
  supports:'哪些人、制度、时间或资源可以帮助自己？',constraints:'哪些条件暂时难以改变？哪些有协商或调整的空间？',sources:'区分亲身观察、他人转述和公开文件，写下来源、查阅日期与不确定之处。'
};
export const blankProfile=():EnvironmentProfile=>Object.fromEntries(profileKeys.map(k=>[k,''])) as EnvironmentProfile;
export function hasEnvironmentContent(env:LifeEnvironment){return environmentFields.some(k=>env[k]?.trim())||profileKeys.some(k=>env.profile?.[k]?.trim());}
export function blankEnvironment(asOf:string):LifeEnvironment{return {asOf,...Object.fromEntries(environmentFields.map(k=>[k,'']))} as LifeEnvironment;}
export function environmentOf(value:unknown):LifeEnvironment|null{
  let raw=value;try{if(typeof raw==='string')raw=JSON.parse(raw);}catch{return null;}
  if(!raw||typeof raw!=='object'||Array.isArray(raw)||typeof (raw as LifeEnvironment).asOf!=='string')return null;
  const source=raw as LifeEnvironment,result=blankEnvironment(source.asOf);for(const k of environmentFields)if(typeof source[k]==='string')result[k]=source[k];
  const p=source.profile;if(p&&typeof p==='object'&&!Array.isArray(p)){result.profile=blankProfile();for(const k of profileKeys)if(typeof p[k]==='string')result.profile[k]=p[k];}
  return hasEnvironmentContent(result)?result:null;
}
