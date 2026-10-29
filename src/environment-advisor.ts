// Educational decision support. Rules expose their evidence and never diagnose a person.
export const guidanceVersion='environment-guide-v1' as const;
export const guidanceDomains={family:'父母与家庭',school:'学校与老师',neighborhood:'邻里、朋友或伴侣',work:'工作与同事',society:'地域、政策与机会',personal:'认识自己与生活选择',digital:'网络与信息'};
export const guidanceCapacities={unknown:'还不清楚',dependent:'生活或决定主要依赖他人',some:'能调整一部分，但有明显限制',independent:'基本能独立安排'};
export const guidanceSafety={unknown:'不确定',safe:'目前没有安全担忧',concern:'担心表达后被报复或处境恶化',danger:'有身体伤害、威胁或无法安全离开的担忧'};
export const guidanceSignals={listening:'愿意听我说，并讨论办法',help:'给过具体、可靠的帮助',humiliation:'反复辱骂、贬低或公开羞辱',control:'用关系或资源强迫我服从，限制正常交往',threat:'威胁伤害或报复',violence:'动手伤害或限制人身自由',overload:'要求过多，时间或资源明显不足',unclear:'规则常变，责任或评价标准不清',isolation:'很难找到可以放心求助的人'};
export type GuidanceSignal=keyof typeof guidanceSignals;
export type GuidanceInput={domain:keyof typeof guidanceDomains;age:string;stage:string;story:string;impact:string;goal:string;constraints:string;resources:string;capacity:keyof typeof guidanceCapacities;safety:keyof typeof guidanceSafety;signals:GuidanceSignal[]};
export const planKeys=['preferred','alternative','compromise','pause'] as const;
export type PlanKey=typeof planKeys[number];
export type GuidancePlan={key:PlanKey;title:string;when:string;steps:string;cost:string;stop:string;allowed:boolean};
export type GuidanceReport={version:typeof guidanceVersion;summary:string;evidence:string[];findings:{title:string;reason:string;meaning:string}[];questions:string[];plans:GuidancePlan[];review:string};
export type GuidanceSnapshot={version:typeof guidanceVersion;input:GuidanceInput;report:GuidanceReport;selectedPlan:PlanKey};
export const guidanceSources=[
  {title:'CDC：个人、关系、社区与社会的多层环境视角',url:'https://www.cdc.gov/violence-prevention/about/index.html',use:'借用多层环境视角组织信息，不用于给个人预测暴力风险。'},
  {title:'NIOSH：工作要求、能力与资源之间的匹配',url:'https://www.cdc.gov/niosh/stress/about/index.html',use:'用于提醒检查工作要求与资源，不是压力测量或诊断。'},
  {title:'Harvard：儿童成长中的稳定支持关系',url:'https://developingchild.harvard.edu/resources/working-paper/supportive-relationships-and-active-skill-building-strengthen-the-foundations-of-resilience/',use:'用于优先寻找可靠支持，不保证某种做法一定有效。'}
];
export function blankGuidance():GuidanceInput{return {domain:'family',age:'',stage:'',story:'',impact:'',goal:'',constraints:'',resources:'',capacity:'unknown',safety:'unknown',signals:[]};}

// Small, deliberately bounded cues supplement explicit answers. Non-matching text is never declared safe.
const cues:Partial<Record<GuidanceSignal,string[]>>={humiliation:['辱骂','羞辱','骂我废物','骂我没用','骂我没出息'],control:['不准和朋友','不让我和朋友','控制我的钱','强迫我'],threat:['威胁伤害','威胁要打','威胁报复'],violence:['打我','殴打','动手打','掐我','锁在屋里','限制人身自由'],overload:['天天加班','每天加班','任务太多','忙不过来'],unclear:['标准总变','规则总变','责任不清']};
function cueEvidence(story:string){const result:{signal:GuidanceSignal;quote:string}[]=[];for(const [signal,words] of Object.entries(cues)){const sentence=story.split(/[。！？!?\n；;]/).find(s=>words!.some(w=>{const i=s.indexOf(w);return i>=0&&!/(?:没有|从未|不曾|不会|并未|并没有|没|不)[^，,。！？]{0,5}$/.test(s.slice(0,i));}));if(sentence)result.push({signal:signal as GuidanceSignal,quote:sentence.trim().slice(0,160)});}return result;}
export function analyzeEnvironment(input:GuidanceInput):GuidanceReport{
  const hints=cueEvidence(input.story),signals=new Set(input.signals),evidence=input.signals.map(s=>'你确认：'+guidanceSignals[s]);
  for(const h of hints){signals.add(h.signal);evidence.push('叙述线索（待核实）：“'+h.quote+'”');}
  const child=(input.age!==''&&Number(input.age)<18)||['preschool','primary','secondary'].includes(input.stage),dependent=child||input.capacity==='dependent';
  const danger=input.safety==='danger'||signals.has('violence')||signals.has('threat'),caution=danger||input.safety==='concern'||input.safety==='unknown'||signals.has('control');
  const findings:GuidanceReport['findings']=[],questions:string[]=[];
  if(!input.story.trim())return {version:guidanceVersion,summary:'先写下一件具体发生的事，就可以开始。',evidence:[],findings:[],questions:['谁在什么情况下做了什么？你受到什么影响？'],plans:[],review:''};
  if(danger)findings.push({title:'先处理安全与求助',reason:input.safety==='danger'?'你选择了有安全担忧。':'你确认的行为或叙述中出现了伤害、威胁线索，具体情况仍需核实。',meaning:'伤害或威胁不能用“性格如此”解释成你必须接受的事。优先考虑安全处所和可靠帮助，不安排独自对质。若危险正在发生，优先联系当地紧急服务或身边能立即保护你的人。'});
  if(signals.has('humiliation'))findings.push({title:'批评事情与贬低人格需要分开',reason:'你确认或描述了辱骂、羞辱一类的行为。',meaning:'需要辨别对方是否在讨论具体问题、是否允许回应，以及这种方式是否反复影响你。不能仅凭这些信息诊断对方的人格；你的不适值得认真对待。'});
  if(signals.has('control'))findings.push({title:'选择余地可能受到关系或资源约束',reason:'你确认或描述了强迫服从、控制资源或限制交往的线索。',meaning:'先盘点哪些决定确实由你掌握，哪些需要外部支持。独立能力不足时，先增加一个可靠支持点，比要求自己立刻脱离所有依赖更可行。'});
  if(signals.has('overload')||signals.has('unclear'))findings.push({title:'也要检查要求与资源、规则是否匹配',reason:'你确认或描述了负担过多或标准不清。',meaning:input.domain==='work'?'先核对任务量、时间、权限、评价标准和可获得的帮助，再判断问题在哪里。可尝试让负责人明确优先级，避免把组织问题全部归为能力不足。':'先核对时间、任务、规则和可获得的帮助。可以先减少一个冲突要求，或请相关的人明确可执行的标准。'});
  if(signals.has('listening')||signals.has('help'))findings.push({title:'保留已经存在的支持',reason:'你确认对方愿意倾听或给过可靠帮助。',meaning:'支持与压力可能同时存在。可以先从一件容易达成的小事验证协商空间；存在支持不抵消伤害，也不要求你忽略自己的感受。'});
  if(!findings.length)findings.push({title:'目前还不足以下定论',reason:'已收到你的叙述，但没有足够明确的行为与安全信息。',meaning:'先把“发生了什么”和“我认为这意味着什么”分开。以下是可供选择的小步方案，不代表已判断谁对谁错，也不会据此认定某人正常或异常。'});
  if(input.safety==='unknown')questions.push('表达不同意见后，对方通常会怎样回应？是否存在报复或身体伤害的担忧？');
  if(!input.age&&!input.stage)questions.push('你目前是上学、工作还是其他阶段？年龄可以只按愿意分享的范围填写。');
  if(!input.resources||signals.has('isolation'))questions.push(child?'有没有一位不参与冲突、愿意认真听你说且能提供保护的成年人？不一定是这位老师或父母。':'有没有一位不参与冲突、能保密并提供实际帮助的人或机构？');
  questions.push('这件事发生过几次？有没有不一样的例子？最近一次的原话或具体行为是什么？');
  if(input.domain==='society')questions.push('机会、政策和服务的依据是什么？是否适用于你的地区、年龄和条件？不要只凭省市或城乡标签判断。');
  const domainQuestions:Record<GuidanceInput['domain'],string>={family:'父母之间、或同一位父母在不同场景的做法是否不同？哪些具体需要有过被尊重的例子？',school:'老师是否给出可理解的讲解和反馈？如果求助无效，是否有另一位老师或校内支持渠道？',neighborhood:'冲突是噪声、边界、规则还是交往方式？有没有可核实的共同规则和中立协助者？',work:'工时、报酬、任务优先级和评价标准是否明确？谁有权限调整，而不只是要求你承受？',society:'先找一个能实际接触的岗位、课程或公共服务，核对门槛、通勤与费用。',personal:'你做成过什么具体事情？自己想要什么，哪些是他人的期待？先用一次小尝试验证。',digital:'这条信息或机会是谁提供的？是否催促付费、要求保密，能否从独立来源核实？'};
  questions.push(domainQuestions[input.domain]);
  const support=child?'一位不参与冲突、你信任且能保护你的成年人':'一位能保密并提供实际帮助的人或机构';
  const preferred:GuidancePlan={key:'preferred',title:danger?'首选｜先获得安全支持':caution?'首选｜先建立支持和退路':'首选｜做一次小范围验证',when:danger?'存在身体伤害、威胁或无法安全离开的担忧。':caution?'表达可能招致报复，或关系与资源明显不对等。':'目前没有明确危险，能够安全地提出一件具体需要。',steps:danger?`先联系${support}，说明最近发生的具体事情，并商量安全的求助地点与方式。危险正在发生时先求助，不独自对质。`:caution?`先找${support}讨论可行选择，列出一项能获得的支持。暂不直接挑战对方，先确认联系和离开的安排不会增加风险。`:`选一个平静时段，只说一件事：“发生____时，我受到____影响，我希望先试____。”${dependent?'如果直接说很困难，可以先请可靠的人陪同或转达。':'先约定一个小范围、可撤回的尝试。'}`,cost:danger?'可能需要他人介入；选择联系人时要考虑保密与是否真正能保护你。':'需要准备和时间，对方未必配合；先小范围尝试，减少暴露和投入。',stop:'若出现威胁、报复或危险升级，停止直接协商，转向安全支持。',allowed:true};
  const alternative:GuidancePlan={key:'alternative',title:'备选｜换一个渠道或增加选择',when:'首选暂时做不到、对方不配合，或单靠沟通无法改变。',steps:danger?`若第一个联系人帮不上忙，换另一位可靠成年人或当地保护、紧急服务渠道。不要把求助只押在冲突当事人身上。`:dependent?`先找到${support}，请他帮你解决一件具体困难，例如学习资源、沟通陪同或生活安排。`:`用低成本方式了解另一个团队、课程、住处或支持渠道，先核实条件与费用；不急于辞职、搬家或投入大笔资金。`,cost:'新渠道也可能无效，需要核实可靠性；避免一次性切断现有收入、照护或住处。',stop:'若新渠道索要不必要的隐私、金钱或服从，暂停并向独立的人核实。',allowed:true};
  const compromise:GuidancePlan={key:'compromise',title:'协商妥协｜缩小冲突，保留底线',when:caution?'当前不适用：安全或自主表达的条件尚未确认。':'暂时无法改变整体关系，但双方仍可安全讨论具体安排。',steps:'提出一个有限、可撤回的安排，例如任务减少一项、保留固定学习时间、先试一次新的沟通方式。写清双方各自做什么，以及何时回看。',cost:'一部分需求暂时不能满足；妥协要有范围，不应交换人身安全或放弃基本保护。',stop:'若底线被持续突破或对方以威胁逼迫，停止此方案，转向外部支持。',allowed:!caution};
  const pause:GuidancePlan={key:'pause',title:'暂时避让｜争取时间和支持',when:'当下无力改变、情绪激烈或直接回应会增加风险；这是过渡安排。',steps:danger?'先减少即时接触，寻找能保护你的安全地点和联系人。不要独自硬撑，也不要为了执行建议而擅自去不安全的地方。':'先暂停争辩，保住基本作息、学习或收入。同时约定一个具体的回看时间，并准备一个联系人或下一步资源。',cost:'短期问题可能仍在；避让不是认可对方，也不是无限期忍受。',stop:'若已经不能保证身体安全，优先立即求助；若约定时间到仍无改善，重新选择支持或替代渠道。',allowed:true};
  if(child)alternative.cost='求助者可能暂时帮不上忙，可以更换可靠渠道；不需要你独自处理，也不要去不安全的地方。';
  if(!danger&&!signals.has('control')&&input.safety!=='concern'){
    if(input.domain==='personal'){
      preferred.title='首选｜用一件小事认识自己的能力';preferred.when='想认识兴趣、需要或特长，暂时还没有足够的实际经验。';preferred.steps='选一件愿意尝试的事，安排一次可负担的短时练习，记录哪里投入、哪里困难，并向可靠的人要具体反馈。一次成败不代表你的全部能力。';
      alternative.steps='准备两个低成本的小尝试，例如动手做一件作品、阅读后讲给人听，比较兴趣、体验与反馈。避免先付高额课程费来证明自己。';
      compromise.steps='先保留必要的学习、工作与休息，只给探索留出一小段固定时间；过一段时间再决定是否增加投入。';
      pause.steps='精力不足时先减小目标、恢复基本作息，记下一项想再尝试的事和具体回看时间，不用立刻证明自己。';
    }
    if(input.domain==='society'){
      preferred.title='首选｜核实一个实际可接触的机会';preferred.when='希望了解机会，但对准入条件、来源或成本还不清楚。';preferred.steps='选一个具体岗位、课程或公共服务，通过原发布机构核对适用地区、年龄条件、截止时间和费用，再判断自己是否够得着。这里不会凭地名自动判断机会多少。';
      alternative.steps='再查一个邻近地区或线上可接触的替代渠道，比较时间、费用、资格和可靠性，先了解再投入。';compromise.steps='暂时保留现有住处、收入或学业，以业余时间完成一次申请条件核对或免费体验，再考虑更大的改变。';
    }
    if(input.domain==='digital'){
      preferred.title='首选｜先核实，再投入';preferred.when='信息或机会尚未从独立来源确认。';preferred.steps='暂停付款和提供敏感资料，找到原发布机构的独立公开渠道核对身份、条件和费用；对方催促或要求保密时，先找可信的人一起看。';alternative.steps='选择另一个能公开核实、无需立即付费或交出敏感资料的学习或服务渠道，不把机会只押在单个推荐者身上。';compromise.steps='只阅读公开资料或使用无需敏感资料的免费体验，不为所谓机会先承担无法承受的费用或长期承诺。';
    }
  }
  if(input.resources)findings.push({title:'把已有支持变成能用的一步',reason:'你写下的支持：“'+input.resources+'”。',meaning:'先核实谁愿意帮、能帮什么、是否安全和可靠，再提出一件具体、可完成的请求。不要把全部希望只押在一个人或渠道上。'});
  if(input.goal)for(const p of [preferred,alternative,compromise,pause])p.steps+=' 这次先围绕你希望的“'+input.goal+'”，确定一个小步骤。';
  if(input.constraints)findings.push({title:'先按现有能力安排改变',reason:'你写下的限制：“'+input.constraints+'”。',meaning:dependent?'先从可获得的陪同、保护与具体资源开始，不要求你立即独立或单独承担冲突。':'将大的改变拆成可撤回的小步，先核实资源和代价，再扩大行动。'});
  return {version:guidanceVersion,summary:danger?'当前优先事项是安全与可靠支持。以下线索仍需结合实际核实。':caution?'先增加安全的选择余地，再决定是否直接沟通或改变环境。':'先用一件具体的小事检验环境的可协商空间，保留其他选择。',evidence,findings,questions,plans:[preferred,alternative,compromise,pause],review:'尝试之后记录：实际做了什么？对方怎样回应？安全、负担或选择空间有没有变化？哪条判断需要修正？'};
}

export function validateGuidance(value:unknown):GuidanceInput{
  if(!value||typeof value!=='object'||Array.isArray(value))throw new Error('请重新填写这次困扰。');
  const raw=value as Record<string,unknown>,result=blankGuidance();
  for(const k of ['story','impact','goal','constraints','resources','age','stage'] as const){const v=raw[k]??'',max=k==='story'?4000:k==='age'?3:k==='stage'?30:1000;if(typeof v!=='string'||v.length>max)throw new Error('输入内容格式或长度不合适，请检查后再分析。');result[k]=v.trim();}
  if(!result.story)throw new Error('请先描述一件具体发生的事。');
  if(result.age&&!/^(?:[0-9]|[1-9][0-9]|1[01][0-9]|120)$/.test(result.age))throw new Error('年龄请填写 0 至 120 的整数，也可以留空。');
  if(!['','preschool','primary','secondary','higher','work','transition','care','retired','other'].includes(result.stage))throw new Error('请选择有效的个人阶段。');
  for(const [k,options] of [['domain',guidanceDomains],['capacity',guidanceCapacities],['safety',guidanceSafety]] as const){if(typeof raw[k]!=='string'||!Object.hasOwn(options,raw[k] as string))throw new Error('请选择当前处境和安全情况。');(result as unknown as Record<string,unknown>)[k]=raw[k];}
  if(!Array.isArray(raw.signals)||raw.signals.length>Object.keys(guidanceSignals).length||raw.signals.some(s=>typeof s!=='string'||!Object.hasOwn(guidanceSignals,s)))throw new Error('具体行为选项无效，请重新选择。');
  result.signals=[...new Set(raw.signals)] as GuidanceSignal[];return result;
}
