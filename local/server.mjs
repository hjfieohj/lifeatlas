import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {randomUUID,randomBytes,timingSafeEqual} from 'node:crypto';
import {DatabaseSync} from 'node:sqlite';
import {GrowthService,GrowthRepository} from './services.mjs';
import {openDatabase,adapter,atomicJson,stateSnapshot,initializeState,saveState,backupDatabase,validateBackup} from './database.mjs';
import {createIntegrations,initializeIntegrations} from './integrations.mjs';
const args=process.argv.slice(2),arg=(name,fallback)=>{const i=args.indexOf(name);return i<0?fallback:args[i+1];};
const appRoot=fileURLToPath(new URL('../',import.meta.url)),dataDir=path.resolve(arg('--data-dir',path.join(appRoot,path.basename(appRoot)==='dist-local'?'../.local-data':'../LifeAtlas本地资料'))),port=Number(arg('--port','5173'));
if(!Number.isInteger(port)||port<1024||port>65535)throw new Error('Invalid local port.');
fs.mkdirSync(dataDir,{recursive:true});const configFile=path.join(dataDir,'settings.json'),dbFile=path.join(dataDir,'lifeatlas.sqlite'),migrations=path.join(appRoot,'migrations');
let db=openDatabase(dbFile,migrations),settings;
initializeIntegrations(db);
const integrations=createIntegrations({getDb:()=>db,dataDir});
if(fs.existsSync(configFile))settings=JSON.parse(fs.readFileSync(configFile,'utf8'));else{const owners=db.prepare('SELECT DISTINCT owner FROM growth_topics').all().map(x=>x.owner);settings={owner:owners.length===1?owners[0]:owners.includes('local_seedy')?'local_seedy':'local:'+randomUUID(),session:randomBytes(32).toString('hex')};atomicJson(configFile,settings);}
if(!settings.owner||typeof settings.session!=='string')throw new Error('本地身份文件无效，请从备份恢复。');
const storedOwner=db.prepare("SELECT value FROM local_meta WHERE key='owner'").get();if(storedOwner)settings.owner=storedOwner.value;else db.prepare("INSERT INTO local_meta VALUES ('owner',?)").run(settings.owner);
const control=randomBytes(32).toString('hex'),cookie='lifeatlas_local_session',runtimeFile=path.join(dataDir,'runtime.json'),webRoot=path.join(appRoot,'web');let busy=false;
const mime={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.json':'application/json; charset=utf-8','.svg':'image/svg+xml','.woff2':'font/woff2','.woff':'font/woff','.png':'image/png','.webp':'image/webp','.ico':'image/x-icon','.txt':'text/plain; charset=utf-8'};
function equal(a,b){const x=Buffer.from(a||''),y=Buffer.from(b||'');return x.length===y.length&&timingSafeEqual(x,y);}
function send(res,status,value,headers={}){const json=typeof value!=='string'&&!Buffer.isBuffer(value);res.writeHead(status,{'Cache-Control':'no-store','X-Content-Type-Options':'nosniff','Referrer-Policy':'no-referrer','Cross-Origin-Resource-Policy':'same-origin',...(json?{'Content-Type':'application/json; charset=utf-8'}:{}),...headers});res.end(json?JSON.stringify(value):value);}
async function body(req,limit=5*1024*1024){const chunks=[];let size=0;for await(const c of req){size+=c.length;if(size>limit){const error=new Error('文件过大，无法处理。');error.status=413;throw error;}chunks.push(c);}return Buffer.concat(chunks);}
const server=http.createServer(async(req,res)=>{
 try{
 const host=req.headers.host;if(![`localhost:${port}`,`127.0.0.1:${port}`].includes(host)){send(res,403,{error:{message:'只允许从本机地址访问。'}});return;}
 const url=new URL(req.url,`http://${host}`),origin=url.origin,cross=req.headers['sec-fetch-site']==='cross-site';
 if(cross||(req.headers.origin&&req.headers.origin!==origin)){send(res,403,{error:{message:'请求来源不匹配。'}});return;}
 if(url.pathname==='/api/local/health'){send(res,200,{app:'lifeatlas-local',version:1});return;}
 if(url.pathname==='/api/local/shutdown'&&req.method==='POST'&&equal(req.headers['x-lifeatlas-control'],control)){send(res,200,{ok:true});setTimeout(()=>server.close(()=>{db.close();try{if(JSON.parse(fs.readFileSync(runtimeFile,'utf8')).control===control)fs.unlinkSync(runtimeFile);}catch{}process.exit(0);}),50);return;}
 const hasSession=(req.headers.cookie||'').split(';').some(v=>equal(v.trim(),cookie+'='+settings.session));
 if(url.pathname.startsWith('/api/')){
  if(!hasSession){send(res,401,{error:{message:'本地会话已失效，请刷新程序。'}});return;}
  if(req.method!=='GET'&&(req.headers.origin!==origin||!(req.headers['content-type']||'').startsWith('application/json'))){send(res,403,{error:{message:'请在本地程序中提交操作。'}});return;}
  if(busy){send(res,503,{error:{message:'正在恢复备份，请稍后重试。'}});return;}
  if(url.pathname.startsWith('/api/local/')){
   const localRoute=url.pathname.slice('/api/local/'.length);
   if(/^(connections|ai|documents|mail)(\/|$)/.test(localRoute)){
    initializeIntegrations(db);
    if(url.pathname.startsWith('/api/local/documents/download/')&&req.method==='GET'){
     const id=decodeURIComponent(url.pathname.split('/').pop()),doc=db.prepare('SELECT name,bytes FROM local_documents WHERE id=?').get(id);
     if(!doc){send(res,404,{error:{message:'文件不存在。'}});return;}
     send(res,200,doc.bytes,{'Content-Type':'application/octet-stream','Content-Disposition':"attachment; filename*=UTF-8''"+encodeURIComponent(doc.name)});return;
    }
    let input={};if(req.method==='POST')input=JSON.parse((await body(req,localRoute==='documents'?29*1024*1024:256*1024)).toString());
    try{send(res,200,await integrations.handle(localRoute,req.method,input));}catch(error){send(res,400,{error:{message:['TimeoutError','AbortError'].includes(error.name)?'连接超时，请检查服务是否运行、网络或模型加载情况。':error.message}});}return;
   }
   if(url.pathname==='/api/local/state'&&req.method==='GET'){send(res,200,{...stateSnapshot(db),dataDir});return;}
   if(url.pathname==='/api/local/initialize'&&req.method==='POST'){const b=JSON.parse((await body(req)).toString());send(res,200,initializeState(db,b.values||{}));return;}
   if(url.pathname==='/api/local/state'&&req.method==='POST'){const b=JSON.parse((await body(req)).toString());const value=saveState(db,b);send(res,value.ok?200:409,value);return;}
   if(url.pathname==='/api/local/backup'&&req.method==='POST'){const {payload}=backupDatabase(db,dataDir,settings.owner);send(res,200,payload,{'Content-Disposition':'attachment; filename="LifeAtlas-backup.json"'});return;}
   if(url.pathname==='/api/local/restore'&&req.method==='POST'){
    if(integrations.isBusy()){send(res,409,{error:{message:'请等待正在进行的分析、文件解析或邮箱同步完成后，再恢复备份。'}});return;}
    const payload=JSON.parse((await body(req,145*1024*1024)).toString()),temp=path.join(dataDir,randomUUID()+'.restore.sqlite');busy=true;
    try{
     validateBackup(payload,temp);
     const incoming=new DatabaseSync(temp);try{incoming.exec('BEGIN IMMEDIATE');for(const [key,value]of [['epoch',randomUUID()],['owner',payload.owner],['initialized','1']])incoming.prepare('INSERT OR REPLACE INTO local_meta VALUES (?,?)').run(key,value);incoming.exec('COMMIT');}finally{incoming.close();}
     backupDatabase(db,dataDir,settings.owner,'before-restore');db.exec('PRAGMA wal_checkpoint(TRUNCATE)');db.close();
     const old=path.join(dataDir,'backups','before-restore-'+randomUUID()+'.sqlite'),oldSettings=settings;fs.copyFileSync(dbFile,old);
     try{fs.renameSync(temp,dbFile);db=openDatabase(dbFile,migrations);settings={...settings,owner:payload.owner};atomicJson(configFile,settings);}catch(e){try{db.close();}catch{}fs.copyFileSync(old,dbFile);db=openDatabase(dbFile,migrations);settings=oldSettings;throw e;}
     send(res,200,{ok:true});
    }finally{busy=false;if(fs.existsSync(temp))fs.unlinkSync(temp);}return;
   }
   send(res,404,{error:{message:'没有这个本地入口。'}});return;
  }
  const request=new Request(url,{method:req.method,headers:req.headers,...(!['GET','HEAD'].includes(req.method)?{body:await body(req)}:{})}),user={userId:settings.owner,email:'local@localhost'},binding=adapter(db);
  const service=url.pathname.startsWith('/api/growth/')?new GrowthService(new GrowthRepository(binding)):null;
  if(!service){send(res,404,{error:{message:'没有这个入口。'}});return;}const response=await service.handle(request,user);send(res,response.status,Buffer.from(await response.arrayBuffer()),Object.fromEntries(response.headers));return;
 }
 if(!['GET','HEAD'].includes(req.method)){send(res,405,'Method not allowed');return;}
 if(url.pathname==='/signin-with-chatgpt'||url.pathname==='/signout-with-chatgpt'){res.writeHead(303,{Location:'/#growth','Set-Cookie':`${cookie}=${settings.session}; Path=/; HttpOnly; SameSite=Strict`});res.end();return;}
 const decoded=decodeURIComponent(url.pathname),file=path.resolve(webRoot,'.'+(decoded==='/'?'/index.html':decoded));
 if(!file.startsWith(webRoot+path.sep)||!fs.existsSync(file)||!fs.statSync(file).isFile()){send(res,404,'Not found');return;}
 send(res,200,req.method==='HEAD'?'':fs.readFileSync(file),{'Content-Type':mime[path.extname(file)]||'application/octet-stream',...(path.extname(file)==='.html'?{'Set-Cookie':`${cookie}=${settings.session}; Path=/; HttpOnly; SameSite=Strict`}:{})});
 }catch(error){send(res,error.status||400,{error:{message:error.status===413?error.message:'操作未完成，请检查资料格式或重试。'}});console.error(new Date().toISOString(),error.message);}
});
server.requestTimeout=30000;server.headersTimeout=15000;
server.listen(port,'127.0.0.1',()=>{atomicJson(runtimeFile,{pid:process.pid,port,control,appRoot});backupDatabase(db,dataDir,settings.owner,'startup');console.log('LifeAtlas local ready: http://localhost:'+port);});
server.on('error',error=>{console.error(error.code==='EADDRINUSE'?'本地端口已被占用，请先停止旧服务。':error.message);db.close();process.exit(1);});
for(const signal of ['SIGINT','SIGTERM'])process.on(signal,()=>server.close(()=>{db.close();process.exit(0);}));
