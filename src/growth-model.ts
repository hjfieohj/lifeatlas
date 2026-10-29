import type { LifeEnvironment } from './environment-model.ts';
import type { GuidanceSnapshot } from './environment-advisor.ts';
export type GrowthTopic = { id: string; title: string; baseline: string; direction: string; environmentProfile?:string; createdAt: number; updatedAt: number; version: number; deleted: number };
export type GrowthMoment = { id: string; topicId: string; occurredOn: string; kind: 'experience' | 'review'; event: string; observation: string; reflection: string; action: string; feedback: string; context?: string; createdAt: number; updatedAt: number; version: number; deleted: number };
export type GrowthReference = { id:string; version:number; occurredOn:string; event:string; reflection:string; action:string; environment?:LifeEnvironment; environmentImpact?:string };
export type GrowthContext = { source?:GrowthReference; review?:{ from:string; to:string; refs:GrowthReference[] }; environment?:LifeEnvironment; environmentImpact?:string; guidance?:GuidanceSnapshot };
export type GrowthAttempt = GrowthMoment & { feedbackCount:number };
export type GrowthFilters = { q?:string; from?:string; to?:string };
export function contextOf(m:Pick<GrowthMoment,'context'>):GrowthContext { try { return JSON.parse(m.context||'{}') as GrowthContext; } catch { return {}; } }
export type GrowthRevision = { id: string; entityId: string; kind: 'topic' | 'moment'; version: number; snapshot: string; savedAt: number };
export const momentFields = ['event', 'observation', 'feedback', 'reflection', 'action'] as const;
export const momentLabels = { event: '发生了什么', observation: '我观察到什么', feedback: '上一次尝试的结果', reflection: '现在的理解与总结', action: '下一次准备怎样尝试' };
export function localDay(now = new Date()) { return `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}-${String(now.getDate()).padStart(2,'0')}`; }
export function validDay(day: unknown): day is string {
  if (typeof day !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(day) || day < '1900-01-01' || day > '2100-12-31') return false;
  const date = new Date(day+'T00:00:00Z'); return Number.isFinite(date.getTime()) && date.toISOString().slice(0,10) === day;
}
