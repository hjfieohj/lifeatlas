import {test} from 'node:test';
import assert from 'node:assert/strict';
import {analyzeEnvironment,blankGuidance,validateGuidance} from '../src/environment-advisor.ts';
import {blankEnvironment,environmentOf,hasEnvironmentContent,blankProfile} from '../src/environment-model.ts';

test('a child reporting violence gets support-first choices with no direct compromise',()=>{
  const i={...blankGuidance(),story:'虚构案例：父亲动手打我，还威胁要打我。',age:'13',stage:'secondary',capacity:'dependent' as const,safety:'danger' as const};
  const r=analyzeEnvironment(i);assert.equal(r.plans.length,4);assert.equal(r.plans.find(p=>p.key==='compromise')!.allowed,false);
  assert.match(r.plans[0].steps,/不独自对质/);assert.match(r.plans[1].steps,/成年人/);assert.match(r.plans[3].cost,/不是无限期忍受/);
  assert.ok(r.evidence.some(s=>s.includes('待核实')));
});
test('explicit safety concern and unknown safety never recommend direct compromise',()=>{
  for(const safety of ['concern','unknown'] as const){const r=analyzeEnvironment({...blankGuidance(),story:'表达要求会怎样还不清楚',safety});assert.equal(r.plans.find(p=>p.key==='compromise')!.allowed,false);assert.match(r.plans[0].steps,/暂不直接挑战/);}
});
test('negated cues do not become positive findings and absence of cues does not prove safety',()=>{
  const r=analyzeEnvironment({...blankGuidance(),story:'父亲没有打我，也从未威胁报复。我不喜欢他的安排。',safety:'safe'});
  assert.equal(r.findings[0].title,'目前还不足以下定论');assert.equal(r.evidence.length,0);assert.equal(r.plans.find(p=>p.key==='compromise')!.allowed,true);
  assert.equal(analyzeEnvironment(blankGuidance()).plans.length,0);
});
test('workload and support can coexist without a personality diagnosis or guaranteed optimum',()=>{
  const i={...blankGuidance(),domain:'work' as const,story:'任务太多，老板也愿意听我说。',safety:'safe' as const,signals:['help','overload'] as const,goal:'每周留出两晚学习',constraints:'需要保住收入'};
  const r=analyzeEnvironment({...i,signals:[...i.signals]});assert.ok(r.findings.some(f=>f.title.includes('资源')));assert.ok(r.findings.some(f=>f.title.includes('支持')));assert.match(r.plans[0].steps,/两晚学习/);assert.ok(r.findings.some(f=>f.reason.includes('保住收入')));
});
test('input validation bounds text and enum values, strips unknown fields and deduplicates signals',()=>{
  const i={...blankGuidance(),story:'同一件事',signals:['help','help'],invented:'ignore'};const v=validateGuidance(i);assert.deepEqual(v.signals,['help']);assert.equal((v as any).invented,undefined);
  for(const extra of [{story:''},{story:'x'.repeat(4001)},{age:'-1'},{age:'12.5'},{age:'121'},{stage:'diagnosed'},{safety:'safe by postcode'},{signals:['infer iq']},{resources:{private:true}}])assert.throws(()=>validateGuidance({...i,...extra}));
});
test('older environment fields normalize, and a structured stage is valid content',()=>{
  const old=environmentOf({asOf:'2025-01-01',family:'原有家庭描述'})!;assert.equal(old.family,'原有家庭描述');assert.equal(old.school,'');assert.equal(old.profile,undefined);
  const e={...blankEnvironment('2026-01-01'),profile:{...blankProfile(),age:'16',stage:'secondary',province:'示例省',district:'示例县'}};
  assert.equal(hasEnvironmentContent(e),true);assert.deepEqual(environmentOf(JSON.stringify(e))!.profile,e.profile);
});

test('self-discovery and opportunity questions get feasible domain-specific steps, not a generic confrontation script',()=>{
  const self=analyzeEnvironment({...blankGuidance(),domain:'personal',story:'不知道自己擅长什么',safety:'safe'});assert.match(self.plans[0].steps,/短时练习/);
  const place=analyzeEnvironment({...blankGuidance(),domain:'society',story:'想看看附近能申请什么学习机会'});assert.match(place.plans[0].steps,/原发布机构/);assert.match(place.plans[0].steps,/适用地区/);
  const online=analyzeEnvironment({...blankGuidance(),domain:'digital',story:'有人推荐课程，想先判断能不能相信',resources:'一位亲友'});assert.match(online.plans[0].steps,/暂停付款/);assert.ok(online.findings.some(f=>f.reason.includes('亲友')));
});
