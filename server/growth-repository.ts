import type { GrowthTopic, GrowthMoment, GrowthRevision } from '../src/growth-model.ts';
const topicCols = 'id,title,baseline,direction,created_at AS createdAt,updated_at AS updatedAt,version,deleted';
const momentCols = 'id,topic_id AS topicId,occurred_on AS occurredOn,kind,event,observation,reflection,action,feedback,created_at AS createdAt,updated_at AS updatedAt,version,deleted';
export class GrowthRepository {
  constructor(private db: D1Database) {}
  async topics(owner: string) { return (await this.db.prepare(`SELECT ${topicCols} FROM growth_topics WHERE owner=? ORDER BY created_at DESC,id DESC`).bind(owner).all<GrowthTopic>()).results; }
  topic(owner: string, id: string) { return this.db.prepare(`SELECT ${topicCols} FROM growth_topics WHERE owner=? AND id=?`).bind(owner,id).first<GrowthTopic>(); }
  moment(owner: string, id: string) { return this.db.prepare(`SELECT ${momentCols} FROM growth_moments WHERE owner=? AND id=?`).bind(owner,id).first<GrowthMoment>(); }
  async saveTopic(owner: string, value: GrowthTopic, expected: number) {
    const statement = expected === 0 ? this.db.prepare('INSERT OR IGNORE INTO growth_topics (id,owner,title,baseline,direction,created_at,updated_at,version,deleted) SELECT ?,?,?,?,?,?,?,1,0 WHERE (SELECT count(*) FROM growth_topics WHERE owner=?)<100').bind(value.id,owner,value.title,value.baseline,value.direction,value.createdAt,value.updatedAt,owner)
      : this.db.prepare('UPDATE growth_topics SET title=?,baseline=?,direction=?,updated_at=?,version=? WHERE owner=? AND id=? AND version=? AND deleted=0').bind(value.title,value.baseline,value.direction,value.updatedAt,value.version,owner,value.id,expected);
    const revision = this.revisionStatement(owner, value.id, value.id,'topic',value.version,value.updatedAt,JSON.stringify(value));
    return (await this.db.batch([statement,revision]))[0].meta.changes === 1;
  }
  async saveMoment(owner: string, value: GrowthMoment, expected: number) {
    const vals=[value.occurredOn,value.kind,value.event,value.observation,value.reflection,value.action,value.feedback,value.updatedAt,value.version];
    const statement = expected === 0 ? this.db.prepare('INSERT OR IGNORE INTO growth_moments (id,owner,topic_id,occurred_on,kind,event,observation,reflection,action,feedback,updated_at,version,created_at,deleted) SELECT ?,?,?,?,?,?,?,?,?,?,?,?,?,0 WHERE EXISTS(SELECT 1 FROM growth_topics WHERE owner=? AND id=? AND deleted=0)').bind(value.id,owner,value.topicId,...vals,value.createdAt,owner,value.topicId)
      : this.db.prepare('UPDATE growth_moments SET occurred_on=?,kind=?,event=?,observation=?,reflection=?,action=?,feedback=?,updated_at=?,version=? WHERE owner=? AND id=? AND topic_id=? AND version=? AND deleted=0 AND EXISTS(SELECT 1 FROM growth_topics WHERE owner=? AND id=? AND deleted=0)').bind(...vals,owner,value.id,value.topicId,expected,owner,value.topicId);
    return (await this.db.batch([statement,this.revisionStatement(owner,value.id,value.topicId,'moment',value.version,value.updatedAt,JSON.stringify(value))]))[0].meta.changes === 1;
  }
  private revisionStatement(owner: string,id:string,topicId:string,kind:'topic'|'moment',version:number,time:number,snapshot:string) {
    const table=kind==='topic'?'growth_topics':'growth_moments';
    return this.db.prepare(`INSERT OR IGNORE INTO growth_revisions (id,owner,entity_id,topic_id,kind,version,snapshot,saved_at) SELECT ?,?,?,?,?,?,?,? WHERE EXISTS(SELECT 1 FROM ${table} WHERE owner=? AND id=? AND version=? AND updated_at=?)`).bind(crypto.randomUUID(),owner,id,topicId,kind,version,snapshot,time,owner,id,version,time);
  }
  async moments(owner:string,topicId:string,cursor?:string) {
    const parts=cursor?.split('_'); const clause=parts?' AND (occurred_on<? OR (occurred_on=? AND id<?))':'';
    const rows=(await this.db.prepare(`SELECT ${momentCols} FROM growth_moments WHERE owner=? AND topic_id=?${clause} ORDER BY occurred_on DESC,id DESC LIMIT 31`).bind(owner,topicId,...(parts?[parts[0],parts[0],parts[1]]:[])).all<GrowthMoment>()).results;
    const items=rows.slice(0,30), last=items.at(-1);
    const first=await this.db.prepare(`SELECT ${momentCols} FROM growth_moments WHERE owner=? AND topic_id=? AND deleted=0 ORDER BY occurred_on,id LIMIT 1`).bind(owner,topicId).first<GrowthMoment>();
    const latest=await this.db.prepare(`SELECT ${momentCols} FROM growth_moments WHERE owner=? AND topic_id=? AND deleted=0 ORDER BY occurred_on DESC,id DESC LIMIT 1`).bind(owner,topicId).first<GrowthMoment>();
    return {items,next:rows.length>30&&last?`${last.occurredOn}_${last.id}`:null,first,latest};
  }
  async revisions(owner:string,id:string,kind:string,before=2_147_483_647) {
    const rows=(await this.db.prepare('SELECT id,entity_id AS entityId,kind,version,snapshot,saved_at AS savedAt FROM growth_revisions WHERE owner=? AND entity_id=? AND kind=? AND version<? ORDER BY version DESC LIMIT 21').bind(owner,id,kind,before).all<GrowthRevision>()).results;
    return {items:rows.slice(0,20),next:rows.length>20?rows[19].version:null};
  }
  async setArchived(owner:string,id:string,kind:'topic'|'moment',version:number,deleted:number,now:number) {
    const table=kind==='topic'?'growth_topics':'growth_moments';
    // Moving to/from the archive changes version, preserving older content snapshots.
    const condition=kind==='moment'?' AND EXISTS(SELECT 1 FROM growth_topics t WHERE t.id=growth_moments.topic_id AND t.owner=? AND t.deleted=0)':'';
    return (await this.db.prepare(`UPDATE ${table} SET deleted=?,version=version+1,updated_at=? WHERE owner=? AND id=? AND version=?${condition}`).bind(deleted,now,owner,id,version,...(kind==='moment'?[owner]:[])).run()).meta.changes===1;
  }
  async exportPage(owner:string,topicId:string,offset:number) {
    const tag=await this.db.prepare('SELECT t.version,t.deleted,(SELECT count(*) FROM growth_moments WHERE owner=? AND topic_id=?) AS n,(SELECT COALESCE(sum(version),0) FROM growth_moments WHERE owner=? AND topic_id=?) AS v,(SELECT count(*) FROM growth_revisions WHERE owner=? AND topic_id=?) AS r FROM growth_topics t WHERE t.owner=? AND t.id=?').bind(owner,topicId,owner,topicId,owner,topicId,owner,topicId).first();
    const rows=(await this.db.prepare(`SELECT 'topic' AS type, 't:'||id AS key, json_object('id',id,'title',title,'baseline',baseline,'direction',direction,'createdAt',created_at,'updatedAt',updated_at,'version',version,'deleted',deleted) AS data FROM growth_topics WHERE owner=? AND id=? UNION ALL SELECT 'moment','m:'||id,json_object('id',id,'topicId',topic_id,'occurredOn',occurred_on,'kind',kind,'event',event,'observation',observation,'reflection',reflection,'action',action,'feedback',feedback,'createdAt',created_at,'updatedAt',updated_at,'version',version,'deleted',deleted) FROM growth_moments WHERE owner=? AND topic_id=? UNION ALL SELECT 'revision','r:'||id,json_object('entityId',entity_id,'kind',kind,'version',version,'snapshot',json(snapshot),'savedAt',saved_at) FROM growth_revisions WHERE owner=? AND topic_id=? ORDER BY key LIMIT 101 OFFSET ?`).bind(owner,topicId,owner,topicId,owner,topicId,offset).all<{type:string;key:string;data:string}>()).results;
    return {tag:JSON.stringify(tag),items:rows.slice(0,100).map(r=>({type:r.type,data:JSON.parse(r.data)})),next:rows.length>100?offset+100:null};
  }
}
