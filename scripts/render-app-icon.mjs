import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import sharp from 'sharp';
const root=fileURLToPath(new URL('../',import.meta.url));
const svg=fs.readFileSync(path.join(root,'public/brand/lifeatlas-app-icon.svg'));
await sharp(svg).resize(1024,1024).png().toFile(path.join(root,'local/lifeatlas-icon.png'));
fs.copyFileSync(path.join(root,'public/brand/lifeatlas-app-icon.svg'),path.join(root,'public/favicon.svg'));
