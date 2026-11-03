import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import {createHash} from 'node:crypto';
import {execFileSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
const root=fileURLToPath(new URL('../',import.meta.url)),args=process.argv.slice(2),arg=name=>{const i=args.indexOf(name);return i<0?null:args[i+1];};
const version=arg('--version'),destination=arg('--output-dir');
if(!/^v\d+\.\d+\.\d+$/.test(version||'')||!destination)throw new Error('Pass --version vX.Y.Z and --output-dir ABSOLUTE_PATH.');
if(process.platform!=='win32')throw new Error('Windows x64 runtime packages must be assembled on Windows.');
if(execFileSync('git',['status','--porcelain'],{cwd:root,encoding:'utf8'}).trim())throw new Error('Commit project changes before packaging.');
const commit=execFileSync('git',['rev-parse','HEAD'],{cwd:root,encoding:'utf8'}).trim(),out=path.resolve(destination);
fs.mkdirSync(out,{recursive:true});const staging=fs.mkdtempSync(path.join(os.tmpdir(),'LifeAtlas-release-'));
const app=path.join(staging,'LifeAtlas'),knowledge=path.join(staging,'Knowledge-Universe-Offline'),icons=path.join(staging,'LifeAtlas-Icons');
execFileSync(process.execPath,[path.join(root,'scripts/install-local.mjs'),app],{cwd:root,stdio:'inherit',windowsHide:true});
fs.copyFileSync(path.join(root,'docs/DOWNLOADS.md'),path.join(app,'使用说明.md'));
fs.writeFileSync(path.join(app,'BUILD-INFO.json'),JSON.stringify({version,commit,nodeVersion:process.versions.node,platform:'win32',arch:process.arch},null,2));
fs.cpSync(path.join(root,'public/knowledge-universe'),knowledge,{recursive:true});
fs.mkdirSync(icons,{recursive:true});
for(const [source,name]of [['public/brand/lifeatlas-app-icon.svg','LifeAtlas.svg'],['public/brand/app-icon-provenance.json','provenance.json'],['local/lifeatlas.ico','LifeAtlas.ico'],['local/lifeatlas-icon.png','LifeAtlas-1024.png'],['docs/APP-ICON.md','设计说明.md']])fs.copyFileSync(path.join(root,source),path.join(icons,name));
function audit(folder){
 const forbiddenDirectories=new Set(['node_modules','.git','.wrangler','.sites-runtime','.local-data','backups','LifeAtlas本地资料']);
 const files=[];
 function walk(dir){for(const entry of fs.readdirSync(dir,{withFileTypes:true})){const file=path.join(dir,entry.name);if(entry.isSymbolicLink())throw new Error('Symbolic link in package: '+file);if(entry.isDirectory()){if(forbiddenDirectories.has(entry.name))throw new Error('Private/cache directory in package: '+file);walk(file);}else{if(/\.(sqlite(?:-wal|-shm)?|db|log|pem|pfx|key)$/i.test(entry.name)||entry.name==='connection-vault.enc'||/^(settings|runtime|migration-report)\.json$/i.test(entry.name)||entry.name.startsWith('.env'))throw new Error('Private/runtime data in package: '+file);files.push(path.relative(folder,file).replaceAll('\\','/'));}}}
 walk(folder);return files;
}
const manifests={windows:audit(app),knowledge:audit(knowledge),icons:audit(icons)};
for(const expected of ['LifeAtlas.exe','runtime/node.exe','runtime/server.mjs','runtime/services.mjs','runtime/integrations.mjs','licenses/integrations/INDEX.json','Install-Desktop-Shortcut.cmd','Install-Desktop-Shortcut.ps1','本地功能与连接指南.md','web/index.html','web/assets/app.js','web/knowledge-universe/index.html','web/knowledge-universe/library.js','LifeAtlas-Orbit-v2.ico','licenses/Node-LICENSE.txt'])if(!manifests.windows.includes(expected))throw new Error('Missing release file: '+expected);
for(const [folder,name]of [[app,'LifeAtlas-Windows-x64.zip'],[knowledge,'Knowledge-Universe-Offline.zip'],[icons,'LifeAtlas-Icons.zip']])execFileSync('powershell.exe',['-NoProfile','-NonInteractive','-ExecutionPolicy','Bypass','-File',path.join(root,'scripts/zip-release.ps1'),'-InputDirectory',folder,'-OutputFile',path.join(out,name)],{cwd:root,stdio:'inherit',windowsHide:true});
execFileSync('git',['archive','--format=zip','--prefix=LifeAtlas-Source/','-o',path.join(out,'LifeAtlas-Source.zip'),'HEAD'],{cwd:root});
fs.copyFileSync(path.join(root,'docs/DOWNLOADS.md'),path.join(out,'LifeAtlas-Readme.zh-CN.md'));
const names=['LifeAtlas-Windows-x64.zip','LifeAtlas-Source.zip','Knowledge-Universe-Offline.zip','LifeAtlas-Icons.zip','LifeAtlas-Readme.zh-CN.md'];
const sums=names.map(name=>createHash('sha256').update(fs.readFileSync(path.join(out,name))).digest('hex')+'  '+name);
fs.writeFileSync(path.join(out,'SHA256SUMS.txt'),sums.join('\n')+'\n');
fs.writeFileSync(path.join(out,'PACKAGE-MANIFEST.json'),JSON.stringify({version,commit,staging,files:manifests,checksums:sums},null,2));
console.log(JSON.stringify({version,commit,output:out,staging,assets:[...names,'SHA256SUMS.txt']},null,2));
