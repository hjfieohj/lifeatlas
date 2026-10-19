import { GrowthRepository } from './growth-repository.ts';
import { validDay, momentFields, contextOf } from '../src/growth-model.ts';
import type { GrowthTopic, GrowthMoment, GrowthContext, GrowthReference } from '../src/growth-model.ts';
class GrowthError extends Error { constructor(message:string,public status=400){super(message);} }
const headers={'Cache-Control':'private, no-store','Pragma':'no-cache','Referrer-Policy':'no-referrer','X-Content-Type-Options':'nosniff'};
const json=(data:unknown,status=200)=>Response.json(data,{status,headers});
const uuid=(v:unknown):v is string=>typeof v==='string'&&/^[a-f0-9]{8}-[a-f0-9]{4}-4[a-f0-9]{3}-[89ab][a-f0-9]{3}-[a-f0-9]{12}$/i.test(v);
function text(v:unknown,max:number,required=false){if(typeof v!=='string'||v.length>max||(required&&!v.trim()))throw new GrowthError('内容为空或超过长度限制，请检查后保存。');return v.trim();}
function expected(v:unknown){if(!Number.isSafeInteger(v)||Number(v)<0||Number(v)>2_000_000_000)throw new GrowthError('记录版本无效，请重新读取。');return Number(v);}
const reference=(m:GrowthMoment,withAction=false):GrowthReference=>({id:m.id,version:m.version,occurredOn:m.occurredOn,event:m.event.slice(0,300),reflection:m.reflection.slice(0,500),action:withAction?m.action:''});
export class GrowthService {
  constructor(private repo:GrowthRepository|null,private now=Date.now){}
  async handle(request:Request,user:{userId:string}|null):Promise<Response>{
    try{
      if(!user)return json({error:{message:'请先登录生活空间，查看和保存自己的成长记录。'},signInUrl:'/signin-with-chatgpt?return_to=%2F%23growth'},401);
      if(!this.repo)return json({error:{message:'成长记录的存储暂不可用，请稍后重试。'}},503);
      const repo=this.repo, owner=user.userId,url=new URL(request.url),action=url.pathname.split('/').at(-1);
      if(request.method==='GET'){
        if(action==='topics')return json({items:await repo.topics(owner)});
        const topicId=url.searchParams.get('topic');
        if(action==='moments'||action==='export'||action==='attempts'){
          if(!uuid(topicId)||!await repo.topic(owner,topicId))throw new GrowthError('找不到这个成长主题。',404);
          if(action==='attempts')return json({items:await repo.attempts(owner,topicId)});
          if(action==='export'){const raw=url.searchParams.get('offset')||'0';if(!/^\d{1,8}$/.test(raw))throw new GrowthError('导出位置无效。');return json(await repo.exportPage(owner,topicId,Number(raw)));}
          const cursor=url.searchParams.get('cursor')||undefined;
          if(cursor&&(!validDay(cursor.split('_')[0])||!uuid(cursor.split('_')[1])||cursor.split('_').length!==2))throw new GrowthError('时间线位置无效，请重新读取。');
          const q=(url.searchParams.get('q')||'').trim(),from=url.searchParams.get('from')||'',to=url.searchParams.get('to')||'';
          if(q.length>120||(from&&!validDay(from))||(to&&!validDay(to))||(from&&to&&from>to))throw new GrowthError('请检查关键词与起止日期。');
          return json(await repo.moments(owner,topicId,cursor,{q,from,to}));
        }
        if(action==='revisions'){
          const id=url.searchParams.get('id'),kind=url.searchParams.get('kind');
          if(!uuid(id)||!['topic','moment'].includes(kind||''))throw new GrowthError('修改记录参数无效。');
          const entity=kind==='topic'?await repo.topic(owner,id):await repo.moment(owner,id);
          if(!entity)throw new GrowthError('找不到这条记录。',404);
          const raw=url.searchParams.get('before');if(raw&&!/^\d{1,10}$/.test(raw))throw new GrowthError('版本位置无效。');
          return json(await repo.revisions(owner,id,kind!,raw?Number(raw):undefined));
        }
        throw new GrowthError('没有这个读取入口。',404);
      }
      if(request.method!=='POST')throw new GrowthError('此操作需要明确提交。',405);
      if(request.headers.get('Origin')!==url.origin||request.headers.get('Sec-Fetch-Site')==='cross-site')throw new GrowthError('请求来源不匹配，请回到生活空间重试。',403);
      if(!(request.headers.get('Content-Type')||'').startsWith('application/json'))throw new GrowthError('请求格式无效。',415);
      const raw=await request.text();if(raw.length>50_000)throw new GrowthError('这次内容过长，请分成多条记录。',413);
      let b:Record<string,unknown>;try{b=JSON.parse(raw);if(!b||Array.isArray(b)||typeof b!=='object')throw 0;}catch{throw new GrowthError('请求内容无效。');}
      if(!uuid(b.id))throw new GrowthError('记录编号无效。');
      const id=b.id,version=expected(b.version),now=this.now();
      if(action==='topic'){
        const old=await repo.topic(owner,id);
        if(version>0&&!old)throw new GrowthError('找不到这个成长主题。',404);
        if(old&&(old.version!==version||old.deleted))throw new GrowthError('这个主题已在另一处修改或归档。请保留当前输入，重新读取后再编辑。',409);
        const value:GrowthTopic={id,title:text(b.title,100,true),baseline:text(b.baseline,3000),direction:text(b.direction,1000),createdAt:old?.createdAt??now,updatedAt:now,version:version+1,deleted:0};
        if(!await repo.saveTopic(owner,value,version))throw new GrowthError('未保存：主题已变化，或已达到 100 个主题上限。请重新读取确认。',409);
        return json({item:value});
      }
      if(action==='moment'){
        if(!uuid(b.topicId))throw new GrowthError('主题编号无效。');
        const topic=await repo.topic(owner,b.topicId);if(!topic||topic.deleted)throw new GrowthError('主题不存在或已归档，请先恢复主题。',404);
        const old=await repo.moment(owner,id);
        if(version>0&&(!old||old.topicId!==b.topicId))throw new GrowthError('找不到这条经历。',404);
        if(old&&(old.version!==version||old.deleted||old.topicId!==b.topicId))throw new GrowthError('这条记录已变化。请保留当前输入，重新读取后再编辑。',409);
        if(!validDay(b.occurredOn)||!['experience','review'].includes(String(b.kind)))throw new GrowthError('请填写有效的发生日期和记录类型。');
        const fields=Object.fromEntries(momentFields.map(k=>[k,text(b[k],6000,k==='event')])) as Pick<GrowthMoment,typeof momentFields[number]>;
        const context:GrowthContext=old?contextOf(old):{};
        if(!old&&b.sourceId){
          if(!uuid(b.sourceId)||b.sourceId===id)throw new GrowthError('尝试来源无效。');
          const source=await repo.moment(owner,b.sourceId);
          if(!source||source.topicId!==b.topicId||source.deleted||!source.action.trim())throw new GrowthError('找不到可回应的这次尝试。',404);
          if(source.version!==expected(b.sourceVersion))throw new GrowthError('这次尝试的原文已变化，请重新选择来源后保存。',409);
          if(b.occurredOn<source.occurredOn)throw new GrowthError('反馈日期不能早于尝试来源日期。');
          context.source=reference(source,true);
        }
        if(context.source&&!fields.feedback)throw new GrowthError('请写下这次尝试的实际结果，也可以填写尚未尝试。');
        if(!old&&b.reviewRefs!==undefined){
          if(b.kind!=='review'||!validDay(b.reviewFrom)||!validDay(b.reviewTo)||b.reviewFrom>b.reviewTo||!Array.isArray(b.reviewRefs)||b.reviewRefs.length>20)throw new GrowthError('回顾区间或材料无效，最多选择 20 条。');
          const refs:GrowthReference[]=[],seen=new Set<string>();
          for(const item of b.reviewRefs){
            if(!item||typeof item!=='object'||!uuid(item.id)||item.id===id||seen.has(item.id))throw new GrowthError('回顾材料编号无效或重复。');
            seen.add(item.id);const record=await repo.moment(owner,item.id);
            if(!record||record.topicId!==b.topicId||record.deleted||record.occurredOn<b.reviewFrom||record.occurredOn>b.reviewTo)throw new GrowthError('回顾材料不存在或不在这个区间，请重新载入。',404);
            if(record.version!==expected(item.version))throw new GrowthError('回顾材料已有更新，请重新载入后再保存。',409);
            refs.push(reference(record));
          }
          context.review={from:b.reviewFrom,to:b.reviewTo,refs};
        }
        const value:GrowthMoment={id,topicId:b.topicId,occurredOn:b.occurredOn,kind:b.kind as GrowthMoment['kind'],...fields,context:JSON.stringify(context),createdAt:old?.createdAt??now,updatedAt:now,version:version+1,deleted:0};
        if(!await repo.saveMoment(owner,value,version))throw new GrowthError('未保存：记录或主题已变化，请保留输入并重新读取。',409);
        return json({item:value});
      }
      if(action==='archive'){
        if(!['topic','moment'].includes(String(b.kind))||![0,1].includes(Number(b.deleted)))throw new GrowthError('归档参数无效。');
        const kind=b.kind as 'topic'|'moment';const entity=kind==='topic'?await repo.topic(owner,id):await repo.moment(owner,id);
        if(!entity)throw new GrowthError('找不到这条记录。',404);
        if(!await repo.setArchived(owner,id,kind,version,Number(b.deleted),now))throw new GrowthError('记录已变化，请重新读取后操作。',409);
        return json({ok:true});
      }
      throw new GrowthError('没有这个保存入口。',404);
    }catch(e){return json({error:{message:e instanceof GrowthError?e.message:'暂时无法完成操作。输入仍留在页面，请稍后重试；不要重复新建。'}},e instanceof GrowthError?e.status:500);}
  }
}
