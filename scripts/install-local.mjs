import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {DatabaseSync,backup} from 'node:sqlite';
const root=fileURLToPath(new URL('../',import.meta.url)),destination=process.argv[2];if(!destination)throw new Error('Pass an explicit installation folder.');
const target=path.resolve(destination);if(!fs.existsSync(path.join(root,'dist-local/runtime/server.mjs')))throw new Error('Run npm run build:local first.');
fs.mkdirSync(target,{recursive:true});fs.cpSync(path.join(root,'dist-local'),target,{recursive:true});fs.copyFileSync(process.execPath,path.join(target,'runtime/node.exe'));
const importAt=process.argv.indexOf('--import-database');
if(importAt>=0){const source=path.resolve(process.argv[importAt+1]),dataDir=path.resolve(target,'../LifeAtlas本地资料'),destinationDb=path.join(dataDir,'lifeatlas.sqlite');if(fs.existsSync(destinationDb))throw new Error('Existing local data preserved; automatic database import was not run.');fs.mkdirSync(path.join(dataDir,'backups'),{recursive:true});const sourceDb=new DatabaseSync(source,{readOnly:true});try{const copy=path.join(dataDir,'backups','旧版成长资料-'+new Date().toISOString().replace(/[:.]/g,'-')+'.sqlite');await backup(sourceDb,copy);fs.copyFileSync(copy,destinationDb);fs.writeFileSync(path.join(dataDir,'migration-report.json'),JSON.stringify({importedAt:new Date().toISOString(),source,backup:copy,sourceUnchanged:true},null,2));}finally{sourceDb.close();}}
if(process.versions.node!=='24.13.0')throw new Error('The bundled runtime license is pinned to Node 24.13.0; update it before packaging another version.');
fs.mkdirSync(path.join(target,'licenses'),{recursive:true});fs.copyFileSync(path.join(root,'local/Node-LICENSE.txt'),path.join(target,'licenses/Node-LICENSE.txt'));
fs.writeFileSync(path.join(target,'runtime-manifest.json'),JSON.stringify({nodeVersion:process.versions.node,licenseSource:'https://raw.githubusercontent.com/nodejs/node/v24.13.0/LICENSE',iconSource:'public/favicon.svg',platform:process.platform,arch:process.arch},null,2));
fs.writeFileSync(path.join(target,'README.txt'),'LifeAtlas 本地程序\r\n\r\n双击 LifeAtlas.exe，在独立窗口中使用。若浏览器不支持独立窗口，将使用本机网页。\r\n桌面与开始菜单入口直接启动EXE，不再依赖Windows Script Host。\r\n无需打开Codex或安装开发依赖。运行时不需要联网，外部链接和真实Gmail除外。\r\n资料保存在程序旁边的“LifeAtlas本地资料”文件夹，升级只替换程序，保留资料。\r\n偏好设置 → 本地资料与备份可下载完整备份或恢复；每次启动自动备份。\r\n关闭窗口不会停止本机服务，可再次打开；需要停止时使用开始菜单的“停止LifeAtlas”，或运行 LifeAtlas.exe stop。\r\n首次从旧file页面迁移笔记，在旧页面导出JSON，再到本地知识宇宙导入。\r\n本版本仅允许这台电脑访问。\r\n请勿把个人资料或完整备份提交公开仓库。\r\n','utf8');
console.log('Installed local application: '+target);
