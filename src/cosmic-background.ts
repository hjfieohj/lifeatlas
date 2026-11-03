// Procedural deep sky: all pixels are generated locally, without external media.
export type CosmicState = {enabled:boolean;paused:boolean;skin:string};
const TAU=Math.PI*2;
const random=(seed:number)=>()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296;};
function hash(x:number,y:number){let n=Math.imul(x,374761393)+Math.imul(y,668265263);n=(n^(n>>>13))>>>0;return Math.imul(n,1274126177)>>>0;}
function noise(x:number,y:number){const ix=Math.floor(x),iy=Math.floor(y),fx=x-ix,fy=y-iy,sx=fx*fx*(3-2*fx),sy=fy*fy*(3-2*fy);const v=(a:number,b:number)=>hash(a,b)/4294967295;return(v(ix,iy)*(1-sx)+v(ix+1,iy)*sx)*(1-sy)+(v(ix,iy+1)*(1-sx)+v(ix+1,iy+1)*sx)*sy;}
function fbm(x:number,y:number){let value=0,amp=.55;for(let i=0;i<4;i++){value+=noise(x,y)*amp;x=x*2.06+3.1;y=y*2.03+7.3;amp*=.5;}return value;}

export function createCosmicSky(host:HTMLElement,signal:AbortSignal){
 const canvas=document.createElement('canvas');canvas.className='cosmic-sky-canvas';canvas.setAttribute('aria-hidden','true');host.appendChild(canvas);
 const ctx=canvas.getContext('2d',{alpha:false});const nebula=document.createElement('canvas');nebula.width=640;nebula.height=480;const nctx=nebula.getContext('2d');
 const rand=random(643719),stars=Array.from({length:720},()=>({x:rand(),y:rand(),r:.25+rand()**4*1.6,phase:rand()*TAU,speed:.07+rand()*.24,depth:.3+rand()*.7,warm:rand()>.83}));
 let state:CosmicState={enabled:true,paused:false,skin:'island'},w=1,h=1,ratio=1,t=0,raf=0,last=0,paintedSkin='';
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 function makeNebula(){
  if(!nctx)return;const image=nctx.createImageData(nebula.width,nebula.height);const warm=state.skin==='observatory';
  for(let y=0;y<nebula.height;y++)for(let x=0;x<nebula.width;x++){
   const u=x/nebula.width,v=y/nebula.height,n=fbm(u*6,v*6),filament=fbm(u*13+31,v*13+5);
   const band=Math.exp(-Math.pow((v-(.83-u*.64+Math.sin(u*5)*.065))/.16,2)),cloud=Math.pow(Math.max(0,n-.29),1.65)*band*3.5;
   const dust=Math.pow(Math.max(0,.58-filament),1.3)*band*.78,blue=Math.exp(-((u-.73)**2+(v-.32)**2)/.14),violet=Math.exp(-((u-.3)**2+(v-.64)**2)/.11);
   const light=Math.max(0,cloud-dust),i=(y*nebula.width+x)*4;
   if(warm){const clouds=Math.max(0,fbm(u*4+8,v*5)-.38)*Math.exp(-Math.pow((v-.42)/.40,2))*3.5;const c=Math.min(.94,clouds);image.data[i]=104+v*97+c*(151-v*75);image.data[i+1]=174+v*56+c*(81-v*32);image.data[i+2]=222+v*26+c*(33-v*15);image.data[i+3]=255;continue;}
   image.data[i]=3+light*(warm?55:33)+violet*cloud*28;
   image.data[i+1]=7+light*(warm?39:47)+blue*cloud*12;
   image.data[i+2]=17+light*(warm?51:91)+violet*cloud*19;image.data[i+3]=255;
  }
  nctx.putImageData(image,0,0);paintedSkin=state.skin;
 }
 function paint(){
  if(!ctx||!state.enabled)return;
  if(paintedSkin!==state.skin)makeNebula();
  const drift=Math.sin(t*.014)*w*.025;
  ctx.globalAlpha=1;ctx.fillStyle='#030713';ctx.fillRect(0,0,w,h);
  ctx.drawImage(nebula,-w*.08+drift,-h*.08+Math.cos(t*.012)*h*.018,w*1.17,h*1.17);
  if(state.skin==='observatory'){ctx.globalAlpha=1;host.dataset.skyTime=t.toFixed(2);return;}
  const count=w<640?390:stars.length;
  for(let i=0;i<count;i++){
   const s=stars[i],x=((s.x*w+t*s.depth*1.45)%(w+12))-6,y=((s.y*h+t*s.depth*.36)%(h+12))-6;
   const alpha=.3+(.5+.5*Math.sin(t*s.speed+s.phase))*.64;ctx.globalAlpha=alpha;
   ctx.fillStyle=s.warm?'#f6dcc3':'#daeaff';ctx.beginPath();ctx.arc(x,y,s.r,0,TAU);ctx.fill();
   if(s.r>1.5){ctx.globalAlpha=alpha*.28;ctx.strokeStyle=s.warm?'#e7bca0':'#a8ceff';ctx.lineWidth=.65;ctx.beginPath();ctx.moveTo(x-4,y);ctx.lineTo(x+4,y);ctx.moveTo(x,y-4);ctx.lineTo(x,y+4);ctx.stroke();}
  }
  ctx.globalAlpha=1;host.dataset.skyTime=t.toFixed(2);
 }
 function resize(){
  const box=host.getBoundingClientRect();w=Math.max(1,box.width);h=Math.max(1,box.height);ratio=Math.min(devicePixelRatio||1,w<640?1.15:1.35,Math.sqrt(1_700_000/(w*h)));
  canvas.width=Math.round(w*ratio);canvas.height=Math.round(h*ratio);ctx?.setTransform(ratio,0,0,ratio,0,0);paint();
 }
 function frame(now:number){
  raf=0;if(signal.aborted||state.paused||!state.enabled||document.hidden||reduced.matches)return;
  const elapsed=now-last;if(elapsed>=(w<640?1000/20:1000/24)){t+=Math.min(elapsed/1000,.1);last=now;paint();}raf=requestAnimationFrame(frame);
 }
 function schedule(){if(raf)cancelAnimationFrame(raf);raf=0;if(state.enabled&&!state.paused&&!document.hidden&&!reduced.matches&&!signal.aborted&&ctx){last=performance.now();raf=requestAnimationFrame(frame);}}
 window.addEventListener('resize',resize,{signal});document.addEventListener('visibilitychange',schedule,{signal});reduced.addEventListener('change',schedule,{signal});
 signal.addEventListener('abort',()=>{cancelAnimationFrame(raf);canvas.remove();},{once:true});
 resize();schedule();
 return{update(next:CosmicState){const old=state.skin;state=next;host.dataset.paused=String(state.paused||document.hidden||reduced.matches);if(old!==state.skin)paintedSkin='';paint();schedule();},destroy(){cancelAnimationFrame(raf);canvas.remove();}};
}
