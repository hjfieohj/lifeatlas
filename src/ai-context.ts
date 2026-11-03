export type AIMode='guide'|'summary';
export type AIKind='growth'|'investment'|'life'|'task'|'knowledge'|'mail';
export function aiMode(content:string):AIMode{return content.trim()?'summary':'guide';}
export function aiPrompt(kind:AIKind,label:string,mode:AIMode){
 const instruction=mode==='guide'
  ?'当前填写区还没有内容。请先用一句话说明可以怎样开始，再提出 3 个简短、具体、容易回答的问题，最后给出一个可自行填写的句式。不要替用户编造经历、答案或结论。'
  :'请根据当前内容：1. 简要总结事实与核心问题；2. 区分已有依据、推测和仍未知的部分；3. 扩展值得考虑的角度；4. 提出 2—3 个后续问题或可验证的小步骤。不要擅自替用户下决定。';
 const domain:Record<AIKind,string>={growth:'尊重个人处境与五层环境。不要依据身份、职业或地域推断人格，不做心理诊断。',investment:'围绕研究问题、期限、资料来源、假设、风险和验证方式展开。不要编造实时行情、收益或买卖指令；缺少依据时先提问。',life:'帮助保留具体体验、感受与想继续探索的方向。',task:'帮助澄清目标、约束与可以开始的下一步。',knowledge:'区分原资料与延伸解释，未知来源要明确说明；优先帮助理解和建立知识联系。',mail:'概括信息与需要用户决定的事项，不发送、不回复或执行邮件操作。'};
 return `当前板块：${label}\n${instruction}\n${domain[kind]}\n只分析提供的当前板块资料，用中文清晰回答。`;
}
export async function aiFingerprint(text:string){return Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(text)))).map(b=>b.toString(16).padStart(2,'0')).join('');}
