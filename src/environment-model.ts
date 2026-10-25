export const environmentFields=['family','work','place','society','culture','supports','constraints','sources'] as const;
export type EnvironmentField=typeof environmentFields[number];
export type LifeEnvironment={asOf:string}&Record<EnvironmentField,string>;
export const environmentLabels:Record<EnvironmentField,string>={family:'家庭与共同生活',work:'同事、工作与组织',place:'地域与生活条件',society:'政策与社会环境',culture:'风俗、文化与人情',supports:'可利用的支持与资源',constraints:'当前的限制与压力',sources:'依据、来源与待核实之处'};
export const environmentPrompts:Record<EnvironmentField,string>={family:'家庭中的角色、照护责任、沟通方式，以及谁能提供支持。',work:'岗位、同事关系、公司的规则和协作方式；也可以记录学校或其他组织。',place:'县城或城市、居住与通勤、公共服务、生活成本。按你愿意分享的范围描述。',society:'影响这件事的政策、行业和就业条件。政策请写适用地区、有效期和核实情况。',culture:'具体遇到的风俗、人情往来和价值期待；描述实际情形，避免替整个地方下结论。',supports:'哪些人、制度、时间或资源可以帮助自己？',constraints:'哪些条件暂时难以改变？哪些有协商或调整的空间？',sources:'区分亲身观察、他人转述和公开文件，写下来源、查阅日期与不确定之处。'};
export function blankEnvironment(asOf:string):LifeEnvironment{return {asOf,...Object.fromEntries(environmentFields.map(k=>[k,'']))} as LifeEnvironment;}
export function environmentOf(value:unknown):LifeEnvironment|null{
  let raw=value;try{if(typeof raw==='string')raw=JSON.parse(raw);}catch{return null;}
  if(!raw||typeof raw!=='object'||Array.isArray(raw)||typeof (raw as LifeEnvironment).asOf!=='string')return null;
  const result=blankEnvironment((raw as LifeEnvironment).asOf);for(const k of environmentFields)if(typeof (raw as LifeEnvironment)[k]==='string')result[k]=(raw as LifeEnvironment)[k];
  return environmentFields.some(k=>result[k].trim())?result:null;
}
