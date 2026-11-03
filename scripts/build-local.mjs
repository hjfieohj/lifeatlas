import {build} from 'esbuild';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {execFileSync} from 'node:child_process';
const root=fileURLToPath(new URL('../',import.meta.url)),out=path.join(root,'dist-local');
fs.mkdirSync(path.join(out,'web/assets'),{recursive:true});fs.mkdirSync(path.join(out,'runtime'),{recursive:true});
fs.cpSync(path.join(root,'public'),path.join(out,'web'),{recursive:true});fs.cpSync(path.join(root,'drizzle'),path.join(out,'migrations'),{recursive:true,filter:p=>!p.includes(path.sep+'meta')});
await build({absWorkingDir:root,entryPoints:['local/entry.ts'],bundle:true,format:'esm',target:'es2022',outdir:path.join(out,'web/assets'),entryNames:'app',minify:true,external:['/fonts/*','/images/*']});
await build({absWorkingDir:root,entryPoints:['local/bootstrap.ts'],bundle:true,format:'iife',target:'es2022',outfile:path.join(out,'web/local-bootstrap.js'),minify:true});
await build({absWorkingDir:root,entryPoints:['local/services.ts'],bundle:true,format:'esm',platform:'node',target:'node24',outfile:path.join(out,'runtime/services.mjs')});
const integrationBuild=await build({absWorkingDir:root,entryPoints:['local/integrations.mjs'],bundle:true,format:'esm',platform:'node',target:'node24',outfile:path.join(out,'runtime/integrations.mjs'),metafile:true,banner:{js:"import {createRequire as __createRequire} from 'node:module'; const require=__createRequire(import.meta.url);"}});
// unpdf loads its local PDF.js implementation relative to import.meta.url.
for(const file of fs.readdirSync(path.join(root,'node_modules/unpdf/dist')).filter(f=>f.startsWith('pdfjs')&&f.endsWith('.mjs')))fs.copyFileSync(path.join(root,'node_modules/unpdf/dist',file),path.join(out,'runtime',file));
fs.cpSync(path.join(root,'node_modules/unpdf/dist/licenses'),path.join(out,'licenses/pdfjs'),{recursive:true});
const integrationLicenses=path.join(out,'licenses/integrations');fs.mkdirSync(integrationLicenses,{recursive:true});
const packages=new Set();
for(const input of Object.keys(integrationBuild.metafile.inputs)){if(!input.includes('node_modules/'))continue;let dir=path.dirname(path.resolve(root,input));while(dir!==root&&dir!==path.dirname(dir)){if(fs.existsSync(path.join(dir,'package.json'))&&JSON.parse(fs.readFileSync(path.join(dir,'package.json'),'utf8')).name){packages.add(dir);break;}dir=path.dirname(dir);}}
const licenseIndex=[];
for(const dir of packages){const pkg=JSON.parse(fs.readFileSync(path.join(dir,'package.json'),'utf8'));const folder=path.join(integrationLicenses,pkg.name.replaceAll('/','-'));fs.mkdirSync(folder,{recursive:true});for(const file of fs.readdirSync(dir).filter(f=>/^(license|licence|copying|notice)/i.test(f)))fs.cpSync(path.join(dir,file),path.join(folder,file),{recursive:true});licenseIndex.push({name:pkg.name,version:pkg.version,license:pkg.license||'See bundled license',repository:pkg.repository});}
fs.writeFileSync(path.join(integrationLicenses,'INDEX.json'),JSON.stringify(licenseIndex,null,2));
for(const file of ['server.mjs','database.mjs','launcher.mjs'])if(fs.existsSync(path.join(root,'local',file)))fs.copyFileSync(path.join(root,'local',file),path.join(out,'runtime',file));
if(fs.existsSync(path.join(root,'local/lifeatlas.ico')))fs.copyFileSync(path.join(root,'local/lifeatlas.ico'),path.join(out,'LifeAtlas.ico'));
if(fs.existsSync(path.join(root,'local/lifeatlas.ico')))fs.copyFileSync(path.join(root,'local/lifeatlas.ico'),path.join(out,'LifeAtlas-Orbit-v2.ico'));
if(process.platform==='win32')execFileSync('powershell.exe',['-NoProfile','-NonInteractive','-ExecutionPolicy','Bypass','-File',path.join(root,'scripts/build-local-launcher.ps1'),'-OutputDirectory',out],{stdio:'inherit',windowsHide:true});
fs.copyFileSync(path.join(root,'scripts/install-local-shortcuts.ps1'),path.join(out,'Install-Desktop-Shortcut.ps1'));
fs.writeFileSync(path.join(out,'Install-Desktop-Shortcut.cmd'),'@echo off\r\npowershell.exe -NoProfile -NonInteractive -ExecutionPolicy Bypass -WindowStyle Hidden -File "%~dp0Install-Desktop-Shortcut.ps1" -ApplicationDirectory "%~dp0."\r\n','ascii');
fs.copyFileSync(path.join(root,'docs/LOCAL-WORKSPACE.md'),path.join(out,'本地功能与连接指南.md'));
fs.copyFileSync(path.join(root,'docs/DOWNLOADS.md'),path.join(out,'使用说明.md'));
const knowledge=path.join(out,'web/knowledge-universe/index.html');fs.writeFileSync(knowledge,fs.readFileSync(knowledge,'utf8').replace('<head>','<head>\n<script src="/local-bootstrap.js" defer></script>'));
fs.writeFileSync(path.join(out,'web/index.html'),'<!doctype html><html lang="zh-CN"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>LifeAtlas · 本地生活全图</title><link rel="icon" href="/favicon.svg?v=atlas-orbit-v2"><link rel="stylesheet" href="/assets/app.css"><script type="module" src="/assets/app.js"></script></head><body><a class="skip" href="#main">跳到主要内容</a><div id="app"></div><dialog id="modal" aria-labelledby="dialog-title"></dialog><div id="toast" role="status" aria-live="polite"></div></body></html>');
console.log('Built self-contained local application: '+out);
