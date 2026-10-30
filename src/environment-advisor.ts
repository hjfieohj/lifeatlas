// Educational decision support. Rules expose their evidence and never diagnose a person.
import {integrateGuidance,validateSubjects,validateRelationships,type GuidanceSubject,type GuidanceRelationship,type GuidanceIntegration} from './environment-subjects.ts';
export const guidanceVersion='environment-guide-v3' as const;
export const guidanceDomains={personal:'个人特点与生活选择',family:'父母与家庭',school:'学校与老师',neighborhood:'邻里、朋友或伴侣',work:'工作与同事',society:'地域、政策与机会',regional:'地方治理与区域环境',economic:'宏观经济与行业影响',geopolitical:'地缘与外部风险',digital:'网络与信息'};
export const guidanceCapacities={unknown:'还不清楚',dependent:'生活或决定主要依赖他人',some:'能调整一部分，但有明显限制',independent:'基本能独立安排'};
export const guidanceSafety={unknown:'不确定',safe:'目前没有安全担忧',concern:'担心表达后被报复或处境恶化',danger:'有身体伤害、威胁或无法安全离开的担忧'};
export const guidanceSignals={listening:'愿意听我说，并讨论办法',help:'给过具体、可靠的帮助',humiliation:'反复辱骂、贬低或公开羞辱',control:'用关系或资源强迫我服从，限制正常交往',threat:'威胁伤害或报复',violence:'动手伤害或限制人身自由',overload:'要求过多，时间或资源明显不足',unclear:'规则常变，责任或评价标准不清',isolation:'很难找到可以放心求助的人'};
export type GuidanceSignal=keyof typeof guidanceSignals;
export type GuidanceInput={domain:keyof typeof guidanceDomains;age:string;stage:string;story:string;impact:string;goal:string;constraints:string;resources:string;capacity:keyof typeof guidanceCapacities;safety:keyof typeof guidanceSafety;signals:GuidanceSignal[];change?:string;connection?:string;evidence?:string;watchFor?:string;self?:string;subjects?:GuidanceSubject[];relationships?:GuidanceRelationship[]};
export const planKeys=['preferred','alternative','compromise','pause'] as const;
export type PlanKey=typeof planKeys[number];
export type GuidancePlan={key:PlanKey;title:string;when:string;steps:string;cost:string;stop:string;allowed:boolean};
export type GuidanceReport={version:typeof guidanceVersion|'environment-guide-v2'|'environment-guide-v1';summary:string;evidence:string[];findings:{title:string;reason:string;meaning:string}[];questions:string[];plans:GuidancePlan[];review:string;integration?:GuidanceIntegration};
export type GuidanceSnapshot={version:GuidanceReport['version'];input:GuidanceInput;report:GuidanceReport;selectedPlan:PlanKey};
export const guidanceSources=[
  {title:'CDC：个人、关系、社区与社会的多层环境视角',url:'https://www.cdc.gov/violence-prevention/about/index.html',use:'借用多层环境视角组织信息，不用于给个人预测暴力风险。'},
  {title:'NIOSH：工作要求、能力与资源之间的匹配',url:'https://www.cdc.gov/niosh/stress/about/index.html',use:'用于提醒检查工作要求与资源，不是压力测量或诊断。'},
  {title:'Harvard：儿童成长中的稳定支持关系',url:'https://developingchild.harvard.edu/resources/working-paper/supportive-relationships-and-active-skill-building-strengthen-the-foundations-of-resilience/',use:'用于优先寻找可靠支持，不保证某种做法一定有效。'},
  {title:'CFPB：应急储备与现金流',url:'https://www.consumerfinance.gov/an-essential-guide-to-building-an-emergency-fund/',use:'借用检查现金流和意外支出准备的思路；具体储备取决于实际情况，不给买卖或配置指令。'},
  {title:'UNDRR：区分事件、暴露与承受能力',url:'https://www.undrr.org/terminology/disaster-risk',use:'借用区分事件、暴露、脆弱性和能力的思路，不预测冲突或测算个人风险概率。'}
];
export function blankGuidance():GuidanceInput{return {domain:'family',age:'',stage:'',story:'',impact:'',goal:'',constraints:'',resources:'',capacity:'unknown',safety:'unknown',signals:[],change:'',connection:'',evidence:'',watchFor:'',self:'',subjects:[],relationships:[]};}

// Small, deliberately bounded cues supplement explicit answers. Non-matching text is never declared safe.
const cues:Partial<Record<GuidanceSignal,string[]>>={humiliation:['辱骂','羞辱','骂我废物','骂我没用','骂我没出息'],control:['不准和朋友','不让我和朋友','控制我的钱','强迫我'],threat:['威胁伤害','威胁要打','威胁报复'],violence:['打我','殴打','动手打','掐我','锁在屋里','限制人身自由'],overload:['天天加班','每天加班','任务太多','忙不过来'],unclear:['标准总变','规则总变','责任不清']};
function cueEvidence(story:string){const result:{signal:GuidanceSignal;quote:string}[]=[];for(const [signal,words] of Object.entries(cues)){const sentence=story.split(/[。！？!?\n；;]/).find(s=>words!.some(w=>{const i=s.indexOf(w);return i>=0&&!/(?:没有|从未|不曾|不会|并未|并没有|没|不)[^，,。！？]{0,5}$/.test(s.slice(0,i));}));if(sentence)result.push({signal:signal as GuidanceSignal,quote:sentence.trim().slice(0,160)});}return result;}
export function analyzeEnvironment(input:GuidanceInput):GuidanceReport{
  const hints=cueEvidence(input.story),signals=new Set(input.signals),evidence=input.signals.map(s=>'你确认：'+guidanceSignals[s]);
  for(const h of hints){signals.add(h.signal);evidence.push('叙述线索（待核实）：“'+h.quote+'”');}
  const subjectCues=(input.subjects||[]).flatMap(s=>cueEvidence(s.facts).map(h=>({id:s.id,...h})));
  for(const s of input.subjects||[]){
    for(const flag of s.signals){signals.add(flag);evidence.push('你为“'+s.label+'”标注：'+guidanceSignals[flag]+'（系统未独立核实）。');}
    for(const h of subjectCues.filter(h=>h.id===s.id)){signals.add(h.signal);evidence.push('“'+s.label+'”的关键词线索（待核实）：“'+h.quote+'”。');}
  }
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
  const domainQuestions:Record<GuidanceInput['domain'],string>={family:'父母之间、或同一位父母在不同场景的做法是否不同？哪些具体需要有过被尊重的例子？',school:'老师是否给出可理解的讲解和反馈？如果求助无效，是否有另一位老师或校内支持渠道？',neighborhood:'冲突是噪声、边界、规则还是交往方式？有没有可核实的共同规则和中立协助者？',work:'工时、报酬、任务优先级和评价标准是否明确？谁有权限调整，而不只是要求你承受？',society:'先找一个能实际接触的岗位、课程或公共服务，核对门槛、通勤与费用。',regional:'相关政策、公开决策或地方影响力的来源与时期是什么？通过哪些具体资格、岗位、服务或安全条件影响你？',economic:'总体经济、自己的行业和个人现金流分别有什么证据？职业、所学专业和固定生活责任使你暴露在哪一环？',geopolitical:'有什么经核实的通告或事件？是否实际影响你的交通、居住、供应链或跨境安排？哪些信息只是推测？',personal:'你做成过什么具体事情？自己想要什么，哪些是他人的期待？先用一次小尝试验证。',digital:'这条信息或机会是谁提供的？是否催促付费、要求保密，能否从独立来源核实？'};
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
  const macro=['society','regional','economic','geopolitical'].includes(input.domain);
  if(macro){
    if(findings[0]?.title==='目前还不足以下定论')findings[0]={title:'先确认事实与影响路径',reason:'你提出了对外部环境的关注，个人影响仍需更多依据。',meaning:'区分已经发生的事实、总体趋势与个人假设，再逐环检查自己的暴露和承受能力。信息不足时可以先准备，但不宜把假设当成确定结论。'};
    findings.push({title:'把外部变化与个人暴露分开',reason:input.change?'你记录的外部变化：“'+input.change+'”。':'当前尚未给出有时间与来源的外部变化。',meaning:'外部变化不自动等于个人风险。先检查地区或行业、组织或家庭、自己的生活之间的传导环节，再考虑资源、替代选择与承受能力。这里没有实时核实宏观情况。'});
    if(input.connection)findings.push({title:'核对你画出的影响路径',reason:'你记录的联系：“'+input.connection+'”。',meaning:'逐环标明已经发生的事实与尚待验证的假设。相同地区的人可能处在不同岗位和家庭条件中，因此不能只凭地名判断风险。'});
    if(input.evidence)evidence.push('你提供的来源（系统未核实）：'+input.evidence);
    if(!input.evidence)questions.push('这项判断的来源、发布日期与适用范围是什么？能否从独立来源交叉核实？');
    if(!input.connection)questions.push('外部变化通过哪个具体环节影响你的职业、专业、收入或生活？哪一环已有证据？');
    if(!danger&&input.safety!=='concern'&&!signals.has('control')){
      preferred.title='首选｜核实变化与个人影响';preferred.when='担心大环境变化，但对真实性、影响路径或承受能力还不清楚。';preferred.steps='向原发布机构核对来源、时间、适用地区与资格条件，画出“外部变化 → 区域或行业 → 组织或家庭 → 自己”的路径。先选一个低成本、可撤回的准备动作，再根据新证据调整。';
      alternative.title='备选｜增加一种可靠的替代';alternative.steps='核实另一个岗位、课程、供应渠道或生活安排的条件与成本，先获取信息和练习，不急于辞职、搬迁或投入大笔资金。';alternative.cost='核实信息需要时间，替代渠道也可能无效或不适用。';
      compromise.title='折中安排｜保留基本盘，小步调整';compromise.when='没有明确人身安全担忧，必要生活、学业或收入仍需维持。';compromise.steps='保留必要生活安排，先调整一项能控制的支出、时间或技能准备，约定一次回看。不要把总体判断直接变成不可逆的个人决定。';compromise.allowed=true;
      pause.steps='当事实或传导关系尚不清楚时，暂缓自己还不了解、难以撤回的承诺，保留基本生活安排，并确定何时、看到什么新证据后重评。';
      if(input.domain==='economic'){preferred.title='首选｜检查现金流与职业暴露';preferred.steps='先区分总体趋势、行业需求和自己的收入稳定性，再梳理必要支出、既有义务、可用资源与意外支出准备。能否储备、储备多少取决于实际处境；不因一句“经济下行”就统一买卖、举债或投资。';}
      if(input.domain==='regional'){preferred.steps='核对适用地区、时期、政策资格和公开决策，观察办事、就业、公共服务与资源集中如何具体影响自己。涉及地方势力的线索应核实来源；不安排独自调查或对质。';}
      if(input.domain==='geopolitical'){preferred.steps='核实可信通告的时间和适用地点，检查它是否实际影响交通、居住、工作订单或跨境安排；整理必要联系人和可行替代。不要因居住地就推断冲突必然发生，也不因未经核实的信息仓促迁移。';}
      preferred.cost='信息可能滞后，核实与准备也不能消除全部不确定性；先控制时间、金钱和暴露成本。';preferred.stop='来源失效、适用条件改变或实际信号与判断不符时，停止扩大投入并重新评估。';
      alternative.when='首选资源暂时不足，或收入、技能与渠道过于集中。';
      compromise.cost='部分期待会暂时延后；保留基本生活和必要资源，避免在折中中累积无法承受的负担。';compromise.stop='若影响必要生活、学习或安全，或实际代价超过可承受范围，停止该安排并重选方案。';
      pause.title='暂缓决定｜等证据，保留选择';pause.when='消息或影响路径尚不清楚，行动代价暂时难以承担。';pause.cost='可能错过部分机会；需要约定回看时间，避免无限拖延。';pause.stop='关键变化已核实、原有安排不再可行或约定时间已到时，重新选择行动。';
      if(child)preferred.steps='请能保护你的可靠成年人陪同核实外部消息与实际影响，先照顾学习、生活和安全。你不需要独自承担家庭财务或外部风险的处置责任。';
    }
    if(input.watchFor)questions.push('下次回看你设定的信号：“'+input.watchFor+'”。它实际出现了吗？');
  }
  if(input.resources)findings.push({title:'把已有支持变成能用的一步',reason:'你写下的支持：“'+input.resources+'”。',meaning:'先核实谁愿意帮、能帮什么、是否安全和可靠，再提出一件具体、可完成的请求。不要把全部希望只押在一个人或渠道上。'});
  if(input.goal)for(const p of [preferred,alternative,compromise,pause])p.steps+=' 这次先围绕你希望的“'+input.goal+'”，确定一个小步骤。';
  if(input.constraints)findings.push({title:'先按现有能力安排改变',reason:'你写下的限制：“'+input.constraints+'”。',meaning:dependent?'先从可获得的陪同、保护与具体资源开始，不要求你立即独立或单独承担冲突。':'将大的改变拆成可撤回的小步，先核实资源和代价，再扩大行动。'});
  return {version:guidanceVersion,summary:danger?'当前优先事项是安全与可靠支持。以下线索仍需结合实际核实。':macro?'先核实外部变化，再看它如何影响自己的职业、生活与选择。':caution?'先增加安全的选择余地，再决定是否直接沟通或改变环境。':'先用一件具体的小事检验环境的可协商空间，保留其他选择。',evidence,findings,questions,plans:[preferred,alternative,compromise,pause],review:'尝试之后记录：实际做了什么？对方或外部条件怎样变化？安全、负担或选择空间有没有变化？哪条判断需要修正？',integration:integrateGuidance(input,guidanceSignals,subjectCues,{danger,caution,dependent,capacityLabel:guidanceCapacities[input.capacity],domainLabel:guidanceDomains[input.domain]})};
}

export function validateGuidance(value:unknown):GuidanceInput{
  if(!value||typeof value!=='object'||Array.isArray(value))throw new Error('请重新填写这次困扰。');
  const raw=value as Record<string,unknown>,result=blankGuidance();
  for(const k of ['story','impact','goal','constraints','resources','age','stage','change','connection','evidence','watchFor','self'] as const){const v=raw[k]??'',max=k==='story'?4000:k==='age'?3:k==='stage'?30:1000;if(typeof v!=='string'||v.length>max)throw new Error('输入内容格式或长度不合适，请检查后再分析。');result[k]=v.trim();}
  if(!result.story)throw new Error('请先描述一件具体发生的事。');
  if(result.age&&!/^(?:[0-9]|[1-9][0-9]|1[01][0-9]|120)$/.test(result.age))throw new Error('年龄请填写 0 至 120 的整数，也可以留空。');
  if(!['','preschool','primary','secondary','higher','work','transition','care','retired','other'].includes(result.stage))throw new Error('请选择有效的个人阶段。');
  for(const [k,options] of [['domain',guidanceDomains],['capacity',guidanceCapacities],['safety',guidanceSafety]] as const){if(typeof raw[k]!=='string'||!Object.hasOwn(options,raw[k] as string))throw new Error('请选择当前处境和安全情况。');(result as unknown as Record<string,unknown>)[k]=raw[k];}
  if(!Array.isArray(raw.signals)||raw.signals.length>Object.keys(guidanceSignals).length||raw.signals.some(s=>typeof s!=='string'||!Object.hasOwn(guidanceSignals,s)))throw new Error('具体行为选项无效，请重新选择。');
  result.signals=[...new Set(raw.signals)] as GuidanceSignal[];
  result.subjects=validateSubjects(raw.subjects);result.relationships=validateRelationships(raw.relationships,result.subjects);
  if(JSON.stringify(result).length>55_000)throw new Error('这次内容较多，请减少一部分主体或分次分析。');
  return result;
}
