// Explicit local start/stop; never registers a service or an OS startup task.
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {spawn,spawnSync,execFileSync} from 'node:child_process';
const root=fileURLToPath(new URL('../',import.meta.url)),script=path.join(root,'scripts','run-framework.mjs');
const state=path.join(root,'.sites-runtime'),file=path.join(state,'local-app.json');
const args=process.argv.slice(2),action=args[0]||'start';
const url='http://localhost:5173/#knowledge';
function record(){try{return JSON.parse(fs.readFileSync(file,'utf8'));}catch{return null;}}
function owns(pid){
 if(!Number.isInteger(pid)||pid<1)return false;
 try{
  process.kill(pid,0);
  if(process.platform==='win32'){
   const command=execFileSync('powershell.exe',['-NoProfile','-NonInteractive','-Command',`(Get-CimInstance Win32_Process -Filter "ProcessId = ${pid}").CommandLine`],{encoding:'utf8',windowsHide:true});
   return command.includes(script);
  }
  return fs.readFileSync(`/proc/${pid}/cmdline`,'utf8').includes(script);
 }catch{return false;}
}
if(action==='stop'){
 const value=record();
 if(value&&owns(value.pid)){
  if(process.platform==='win32')execFileSync('taskkill.exe',['/PID',String(value.pid),'/T','/F'],{windowsHide:true,stdio:'ignore'});else process.kill(value.pid,'SIGTERM');
  fs.unlinkSync(file);console.log('LifeAtlas local application stopped.');
 }else console.log('No matching LifeAtlas application process is running.');
}else if(action==='start'){
 fs.mkdirSync(state,{recursive:true});const value=record();
 if(value&&owns(value.pid))console.log('LifeAtlas is already running: '+url);
 else{
  const generated=spawnSync(process.execPath,[path.join(root,'scripts','build-cosmic-background.mjs')],{cwd:root,stdio:'inherit',windowsHide:true});if(generated.status!==0)process.exit(generated.status||1);
  const out=fs.openSync(path.join(state,'local-app.stdout.log'),'a'),err=fs.openSync(path.join(state,'local-app.stderr.log'),'a');
  const child=spawn(process.execPath,[script,'dev'],{cwd:root,detached:true,windowsHide:true,stdio:['ignore',out,err]});
  await new Promise((resolve,reject)=>{child.once('spawn',resolve);child.once('error',reject);});
  fs.writeFileSync(file,JSON.stringify({pid:child.pid,script,startedAt:new Date().toISOString()}));child.unref();fs.closeSync(out);fs.closeSync(err);
  console.log('LifeAtlas is starting in the background: '+url+'\nUse the stop script to close it.');
 }
}else throw new Error('Use start or stop.');
