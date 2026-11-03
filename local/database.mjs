import {DatabaseSync} from 'node:sqlite';
import fs from 'node:fs';
import path from 'node:path';
import {createHash,randomUUID} from 'node:crypto';
export const stateKeys=['atlas-knowledge-universe-v1','lifeatlas-demo-v1','lifeatlas-appearance-v1','lifeatlas-modules-v1','lifeatlas-workspace-v1'];
export function atomicJson(file,value){const temp=file+'.'+randomUUID()+'.tmp';fs.writeFileSync(temp,JSON.stringify(value,null,2),{mode:0o600});fs.renameSync(temp,file);}
export function openDatabase(file,migrations){
 const db=new DatabaseSync(file);db.exec('PRAGMA journal_mode=WAL; PRAGMA synchronous=FULL; PRAGMA busy_timeout=5000;');
 const exists=name=>!!db.prepare("SELECT 1 FROM sqlite_master WHERE type='table' AND name=?").get(name);
 const columns=name=>db.prepare(`PRAGMA table_info(${name})`).all().map(x=>x.name);
 const apply=name=>db.exec(fs.readFileSync(path.join(migrations,name),'utf8'));
 if(!exists('gmail_connections'))apply('0000_striped_turbo.sql');
 if(!exists('growth_topics'))apply('0001_thin_katie_power.sql');
 if(!columns('growth_moments').includes('context'))apply('0002_sloppy_star_brand.sql');
 if(!columns('growth_topics').includes('environment_profile'))apply('0003_polite_cloak.sql');
 db.exec(`CREATE TABLE IF NOT EXISTS local_meta (key TEXT PRIMARY KEY,value TEXT NOT NULL);
 CREATE TABLE IF NOT EXISTS local_state (key TEXT PRIMARY KEY,value TEXT,version INTEGER NOT NULL,mutation TEXT NOT NULL,updated_at INTEGER NOT NULL);
 CREATE TABLE IF NOT EXISTS local_state_history (id INTEGER PRIMARY KEY,key TEXT NOT NULL,value TEXT,version INTEGER NOT NULL,saved_at INTEGER NOT NULL);
 CREATE TABLE IF NOT EXISTS local_conflicts (id INTEGER PRIMARY KEY,key TEXT NOT NULL,value TEXT,saved_at INTEGER NOT NULL);
 INSERT OR IGNORE INTO local_meta VALUES ('epoch','${randomUUID()}');`);
 return db;
}
export function adapter(db){
 function prepare(query,args=[]){return {bind(...values){return prepare(query,values);},async first(column){const row=db.prepare(query).get(...args);return column?(row?.[column]??null):(row??null);},async all(){return {results:db.prepare(query).all(...args)};},execute(){const r=db.prepare(query).run(...args);return {success:true,meta:{changes:Number(r.changes),last_row_id:Number(r.lastInsertRowid)}};},async run(){return this.execute();}};}
 return {prepare,async batch(list){db.exec('BEGIN IMMEDIATE');try{const rows=list.map(q=>q.execute());db.exec('COMMIT');return rows;}catch(error){db.exec('ROLLBACK');throw error;}}};
}
export function stateSnapshot(db){return {epoch:db.prepare("SELECT value FROM local_meta WHERE key='epoch'").get().value,initialized:!!db.prepare("SELECT 1 FROM local_meta WHERE key='initialized'").get(),items:db.prepare('SELECT key,value,version FROM local_state').all()};}
export function validateState(key,value){if(!stateKeys.includes(key)||!(value===null||typeof value==='string')||(value===null?0:Buffer.byteLength(value,'utf8'))>4*1024*1024)throw new Error('资料格式或长度无效。');if(value!==null){const parsed=JSON.parse(value);if(!parsed||typeof parsed!=='object'||Array.isArray(parsed))throw new Error('资料必须为JSON对象。');}}
export function initializeState(db,values){
 db.exec('BEGIN IMMEDIATE');try{if(stateSnapshot(db).initialized)throw new Error('资料已经初始化，请重新读取。');for(const [key,value] of Object.entries(values)){validateState(key,value);db.prepare('INSERT INTO local_state VALUES (?,?,1,?,?)').run(key,value,randomUUID(),Date.now());}db.prepare("INSERT INTO local_meta VALUES ('initialized','1')").run();db.exec('COMMIT');return stateSnapshot(db);}catch(e){db.exec('ROLLBACK');throw e;}
}
export function saveState(db,{key,value,version,mutation}){
 validateState(key,value);if(!Number.isSafeInteger(version)||version<0||typeof mutation!=='string'||mutation.length>100)throw new Error('保存版本无效。');
 const current=db.prepare('SELECT * FROM local_state WHERE key=?').get(key);
 if(current?.mutation===mutation)return {ok:true,version:current.version};
 if((current?.version??0)!==version){db.prepare('INSERT INTO local_conflicts (key,value,saved_at) VALUES (?,?,?)').run(key,value,Date.now());return {ok:false,conflict:true};}
 if(current?.value===value){db.prepare('UPDATE local_state SET mutation=? WHERE key=?').run(mutation,key);return {ok:true,version};}
 db.exec('BEGIN IMMEDIATE');try{const checkpoint=db.prepare('SELECT saved_at FROM local_state_history WHERE key=? ORDER BY id DESC LIMIT 1').get(key);if(current&&(!checkpoint||Date.now()-checkpoint.saved_at>=60000))db.prepare('INSERT INTO local_state_history (key,value,version,saved_at) VALUES (?,?,?,?)').run(key,current.value,current.version,Date.now());db.prepare('DELETE FROM local_state_history WHERE key=? AND id NOT IN (SELECT id FROM local_state_history WHERE key=? ORDER BY id DESC LIMIT 16)').run(key,key);let checkpointBytes=0;const checkpoints=db.prepare('SELECT id,length(CAST(value AS BLOB)) bytes FROM local_state_history WHERE key=? ORDER BY id DESC').all(key);for(let i=0;i<checkpoints.length;i++){checkpointBytes+=Number(checkpoints[i].bytes||0);if(i>0&&checkpointBytes>12*1024*1024){db.prepare('DELETE FROM local_state_history WHERE key=? AND id<=?').run(key,checkpoints[i].id);break;}}db.prepare('INSERT INTO local_state VALUES (?,?,?,?,?) ON CONFLICT(key) DO UPDATE SET value=excluded.value,version=excluded.version,mutation=excluded.mutation,updated_at=excluded.updated_at').run(key,value,version+1,mutation,Date.now());db.exec('COMMIT');return {ok:true,version:version+1};}catch(e){db.exec('ROLLBACK');throw e;}
}
export function backupDatabase(db,dataDir,owner,reason='manual'){
 const dir=path.join(dataDir,'backups');fs.mkdirSync(dir,{recursive:true});const stamp=new Date().toISOString().replace(/[:.]/g,'-')+'-'+randomUUID().slice(0,8),temp=path.join(dir,stamp+'.sqlite');
 try{db.exec(`VACUUM INTO '${temp.replaceAll("'","''")}'`);const bytes=fs.readFileSync(temp),payload={format:'lifeatlas-local-backup',version:1,createdAt:new Date().toISOString(),owner,sha256:createHash('sha256').update(bytes).digest('hex'),database:bytes.toString('base64')};const file=path.join(dir,`LifeAtlas-${reason}-${stamp}.json`);atomicJson(file,payload);return {file,payload};}finally{if(fs.existsSync(temp))fs.unlinkSync(temp);}
}
export function validateBackup(payload,tempFile){
 if(payload?.format!=='lifeatlas-local-backup'||payload.version!==1||typeof payload.owner!=='string'||!payload.owner||payload.owner.length>128||typeof payload.database!=='string'||payload.database.length>140*1024*1024)throw new Error('不是有效的LifeAtlas完整备份。');
 const bytes=Buffer.from(payload.database,'base64');if(bytes.subarray(0,16).toString()!=='SQLite format 3\0'||createHash('sha256').update(bytes).digest('hex')!==payload.sha256)throw new Error('备份校验失败，文件可能不完整。');
 fs.writeFileSync(tempFile,bytes,{mode:0o600});let probe;try{probe=new DatabaseSync(tempFile,{readOnly:true});if(probe.prepare('PRAGMA quick_check').get().quick_check!=='ok')throw new Error('数据库检查未通过。');probe.prepare('SELECT id,owner,environment_profile FROM growth_topics LIMIT 0').all();probe.prepare('SELECT context FROM growth_moments LIMIT 0').all();probe.prepare('SELECT snapshot FROM growth_revisions LIMIT 0').all();probe.prepare('SELECT key,value,version,mutation FROM local_state LIMIT 0').all();probe.prepare('SELECT key,value FROM local_meta LIMIT 0').all();probe.prepare('SELECT key,value FROM local_state_history LIMIT 0').all();probe.prepare('SELECT key,value FROM local_conflicts LIMIT 0').all();const owner=probe.prepare("SELECT value FROM local_meta WHERE key='owner'").get();if(owner&&owner.value!==payload.owner)throw new Error('备份身份校验失败。');const owners=probe.prepare('SELECT DISTINCT owner FROM growth_topics').all();if(owners.length&&!owners.some(o=>o.owner===payload.owner))throw new Error('备份记录身份不匹配。');}finally{probe?.close();}
}
