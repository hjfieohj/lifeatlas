import fs from 'node:fs/promises';
import ts from 'typescript';
const sourceUrl=new URL('../src/cosmic-background.ts',import.meta.url);
const source=(await fs.readFile(sourceUrl,'utf8')).replace('export type CosmicState','type CosmicState').replace('export function createCosmicSky','function createCosmicSky');
const result=ts.transpileModule(source,{compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.ESNext,removeComments:false}});
const text='// Generated from src/cosmic-background.ts. Run npm run build:sky after changes.\n(()=>{\n'+result.outputText+'\nwindow.CosmicSkyRuntime={createCosmicSky};\n})();\n';
await fs.writeFile(new URL('../public/knowledge-universe/cosmic-background.js',import.meta.url),text);
console.log('Synchronized the shared cosmic background.');
