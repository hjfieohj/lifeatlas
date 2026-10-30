import {test} from 'node:test';
import assert from 'node:assert/strict';
import {blankGuidance,validateGuidance,analyzeEnvironment,type GuidanceReport} from '../src/environment-advisor.ts';
import {blankSubject,blankRelationship,importGuidanceEnvironment,integratedSections} from '../src/environment-subjects.ts';
import {blankEnvironment,blankProfile} from '../src/environment-model.ts';
import {guidanceReading,guidanceReportMarkup,advisorForm} from '../src/growth-advisor.ts';

const subject=(id='parent')=>({...blankSubject(id),label:'父亲（虚构）',facts:'周末会一起安排学习，也有临时改变安排的情况。'});
const input=()=>({...blankGuidance(),story:'虚构：学习时间与家庭安排有冲突。',safety:'safe' as const,subjects:[subject()]});

test('subject validation strips extras, bounds facts and references, and rejects invalid links',()=>{
  const s={...subject(),signals:['help','help'],secret:'discard'},v=validateGuidance({...input(),subjects:[s]});
  assert.deepEqual(v.subjects![0].signals,['help']);assert.equal((v.subjects![0] as any).secret,undefined);
  for(const bad of [{label:''},{facts:''},{facts:'x'.repeat(1001)},{label:'x'.repeat(81)},{id:'<bad>'},{kind:'diagnosis'},{layer:'infer'},{source:'verified by system'},{signals:['iq']},{sourceNote:[]}])assert.throws(()=>validateGuidance({...input(),subjects:[{...subject(),...bad}]}));
  assert.throws(()=>validateGuidance({...input(),subjects:[subject(),subject()]}));
  assert.throws(()=>validateGuidance({...input(),subjects:Array.from({length:7},(_,i)=>subject('s'+i))}));
  const subjects=[subject('a'),subject('b')],link={...blankRelationship('r','a','b'),description:'家中的安排会回应老师提出的任务。'};
  assert.equal(validateGuidance({...input(),subjects,relationships:[link]}).relationships![0].description,link.description);
  for(const bad of [{from:'missing'},{to:'a'},{kind:'caused'},{certainty:'proven'},{description:''},{impact:'x'.repeat(601)}])assert.throws(()=>validateGuidance({...input(),subjects,relationships:[{...link,...bad}]}));
  assert.throws(()=>validateGuidance({...input(),subjects,relationships:[link,link]}));
  assert.throws(()=>validateGuidance({...input(),subjects,relationships:Array.from({length:7},(_,i)=>({...link,id:'r'+i}))}));
});

test('subject facts can trigger protective rules while negated cues do not establish danger',()=>{
  const dangerous=analyzeEnvironment({...input(),age:'13',stage:'secondary',subjects:[{...subject(),facts:'虚构：昨天威胁要打我。'}]});
  assert.equal(dangerous.plans.find(p=>p.key==='compromise')!.allowed,false);assert.match(dangerous.plans[0].steps,/不独自对质/);
  assert.match(dangerous.integration!.subjects[0].response,/不独自对质/);assert.ok(dangerous.evidence.some(e=>e.includes('关键词线索（待核实）')));
  const negated=analyzeEnvironment({...input(),subjects:[{...subject(),facts:'从未威胁报复，也没有打我。'}]});
  assert.equal(negated.evidence.length,0);assert.equal(negated.plans.find(p=>p.key==='compromise')!.allowed,true);
});

test('characteristics, observed impacts, possible impacts and source uncertainty stay separate',()=>{
  const r=analyzeEnvironment({...input(),self:'需要较长的安静时间',subjects:[{...subject(),characteristics:'重视成绩，也愿意提供资料',signals:['help','unclear'],resources:'可借用电脑',observedImpact:'昨天的计划被打断',possibleImpact:'担心下周无法完成',source:'reported',sourceNote:'亲友转述，时间待核实'}]});
  const s=r.integration!.subjects[0];assert.equal(s.observedImpact,'昨天的计划被打断');assert.equal(s.possibleImpact,'担心下周无法完成');
  assert.equal(s.source,'他人转述');assert.ok(s.characteristics.some(c=>c.status.includes('用户的理解')));assert.ok(s.characteristics.filter(c=>c.status.includes('未独立核实')).length===2);
  assert.ok(r.integration!.position.some(p=>p.value==='需要较长的安静时间'));assert.ok(r.integration!.actionSpace.some(s=>s.includes('资源')));assert.equal(r.integration!.reviewQuestions.length,4);
  assert.equal(r.integration!.relationships.length,0);
});

test('cross-layer relationships retain user evidence and uncertainty instead of inventing causation',()=>{
  const a=subject('a'),b={...subject('b'),label:'老师',layer:'social' as const},r={...blankRelationship('r','a','b'),kind:'conflict' as const,description:'两边时间要求不同',impact:'个人时间被挤压',source:'本周两次日程',certainty:'possible' as const};
  const report=analyzeEnvironment({...input(),subjects:[a,b],relationships:[r]});const link=report.integration!.relationships[0];
  assert.equal(link.description,r.description);assert.equal(link.source,r.source);assert.equal(link.impact,r.impact);assert.equal(link.certainty,'可能如此，尚待验证');assert.match(link.reading,/核实/);
  assert.equal(analyzeEnvironment({...input(),subjects:[a,b]}).integration!.relationships.length,0);
});

test('environment import is a dated, bounded draft excerpt and never overwrites existing user fields',()=>{
  const env={...blankEnvironment('2026-01-01'),profile:{...blankProfile(),age:'16',stage:'secondary',occupation:'实习'},personal:'喜欢安静阅读',family:'长辈会提供学习材料',school:'任务较多',place:'虚构县城',economy:'虚构行业变化',supports:'亲友',constraints:'通勤',sources:'个人记录'};
  const before=structuredClone(env),i={...input(),self:'我自己写的特点',resources:'已有朋友支持'};
  const imported=importGuidanceEnvironment(i,env,'2026-01-02');assert.equal(imported.added,4);assert.equal(imported.input.self,i.self);assert.equal(imported.input.resources,i.resources);assert.equal(imported.input.age,'16');assert.equal(imported.input.constraints,'通勤');
  assert.equal(i.subjects.length,1);assert.deepEqual(env,before);assert.ok(imported.input.subjects!.every(s=>s.id==='parent'||s.source==='unknown'));assert.match(imported.input.subjects![1].sourceNote,/2026-01-01/);
  assert.equal(importGuidanceEnvironment(imported.input,env,'2026-01-02').added,0);
  const full=importGuidanceEnvironment({...i,subjects:Array.from({length:6},(_,n)=>subject('s'+n))},env,'2026-01-02');assert.equal(full.added,0);assert.equal(full.skipped,4);
  assert.throws(()=>importGuidanceEnvironment(i,env,'2025-12-31'));assert.throws(()=>importGuidanceEnvironment(i,env,'2026-02-30'));
});

test('integrated rendering escapes subject data and preserves v1/v2 frozen reports unchanged',()=>{
  const payload='<img src=x onerror=alert(1)>',i={...input(),subjects:[{...subject(),label:payload,characteristics:payload,facts:payload,sourceNote:payload},subject('other')],relationships:[{...blankRelationship('r','parent','other'),description:payload,source:payload}]};
  const report=analyzeEnvironment(i),html=guidanceReportMarkup(report);
  for(const title of integratedSections)assert.ok(html.includes(title));assert.ok(html.includes('&lt;img'));assert.ok(!html.includes(payload));assert.ok(!advisorForm(i,'2026-10-31').includes(payload));
  assert.match(advisorForm(blankGuidance(),'2026-10-31'),/尚未接入大模型/);
  for(const version of ['environment-guide-v1','environment-guide-v2'] as const){
    const legacy:GuidanceReport={...report,version,summary:'旧版冻结内容 '+version};delete legacy.integration;
    const snapshot={version,input:i,report:legacy,selectedPlan:'preferred' as const},frozen=structuredClone(snapshot),markup=guidanceReading(snapshot);
    assert.match(markup,/旧版冻结内容/);assert.ok(!markup.includes(integratedSections[0]));assert.deepEqual(snapshot,frozen);assert.ok(!markup.includes('type="submit"'));
  }
});
