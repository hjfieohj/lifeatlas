import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {spawn,execFileSync} from 'node:child_process';
const appRoot=fileURLToPath(new URL('../',import.meta.url)),args=process.argv.slice(2),action=args[0]||'open',at=args.indexOf('--data-dir'),dataDir=path.resolve(at<0?path.join(appRoot,path.basename(appRoot)==='dist-local'?'../.local-data':'../LifeAtlas本地资料'):args[at+1]);
const portAt=args.indexOf('--port'),port=portAt<0?5173:Number(args[portAt+1]),base='http://localhost:'+port;
const runtimeFile=path.join(dataDir,'runtime.json');
async function health(){try{const r=await fetch(base+'/api/local/health',{signal:AbortSignal.timeout(1000)});return r.ok&&(await r.json()).app==='lifeatlas-local';}catch{return false;}}
async function start(){
 if(await health())return;
 fs.mkdirSync(dataDir,{recursive:true});const out=fs.openSync(path.join(dataDir,'application.log'),'a');
 const child=spawn(process.execPath,[path.join(appRoot,'runtime/server.mjs'),'--data-dir',dataDir,'--port',String(port)],{cwd:appRoot,windowsHide:true,detached:true,stdio:['ignore',out,out]});await new Promise((resolve,reject)=>{child.once('spawn',resolve);child.once('error',reject);});child.unref();fs.closeSync(out);
 for(let n=0;n<60;n++){if(await health())return;await new Promise(r=>setTimeout(r,250));}
 throw new Error('启动未完成。请查看资料目录中的 application.log；端口可能被旧程序占用。');
}
if(action==='stop'){
 if(!await health()){console.log('本地程序没有运行。');process.exit(0);}const value=JSON.parse(fs.readFileSync(runtimeFile,'utf8'));
 const response=await fetch(base+'/api/local/shutdown',{method:'POST',headers:{'x-lifeatlas-control':value.control}});if(!response.ok)throw new Error('无法停止：运行信息不匹配。');for(let n=0;n<60;n++){await new Promise(r=>setTimeout(r,100));if(!await health())break;}if(await health())throw new Error('程序仍在结束工作，请稍后重试。');console.log('LifeAtlas已停止。');
}else if(action==='open'||action==='start'||action==='backup'){
 await start();
 if(action==='backup'){const root=await fetch(base),cookie=(root.headers.get('set-cookie')||'').split(';')[0];const r=await fetch(base+'/api/local/backup',{method:'POST',headers:{Cookie:cookie,Origin:base,'Content-Type':'application/json'},body:'{}'});if(!r.ok)throw new Error('备份失败，请在设置中重试。');console.log('备份已保存到 '+path.join(dataDir,'backups'));}
 if(action==='open'){
  if(process.platform==='win32'){
   const candidates=[];for(const browser of ['msedge.exe','chrome.exe']){try{const value=execFileSync('powershell.exe',['-NoProfile','-NonInteractive','-Command',`(Get-ItemProperty -LiteralPath 'HKLM:/SOFTWARE/Microsoft/Windows/CurrentVersion/App Paths/${browser}' -ErrorAction SilentlyContinue).'(default)'`],{encoding:'utf8',windowsHide:true}).trim();if(value)candidates.push(value);}catch{}}
   const browser=candidates.find(p=>fs.existsSync(p));if(browser)spawn(browser,['--app='+base+'/#knowledge','--window-size=1440,940'],{detached:true,windowsHide:true,stdio:'ignore'}).unref();else spawn('rundll32.exe',['url.dll,FileProtocolHandler',base+'/#knowledge'],{detached:true,windowsHide:true,stdio:'ignore'}).unref();
  }else console.log('打开 '+base+'/#knowledge');
 }
}else throw new Error('Use open, start, stop or backup.');
