'use strict';
(() => {
  const {THREE:T,OrbitControls} = UniverseRuntime;
  const TAU=Math.PI*2;
  const reduced=matchMedia('(prefers-reduced-motion:reduce)').matches;
  const escapeHTML=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const hash=s=>[...s].reduce((a,c)=>(a*31+c.charCodeAt(0))>>>0,7);
  function rng(seed){return()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296;};}
  class Universe3D {
    constructor(el,opts={}) {
      this.el=el;this.opts=opts;this.focusId='universe';this.selectedId=null;this.showBridges=true;this.autoRotate=false;
      this.nodes=[];this.links=[];this.map=new Map();this.children=new Map();this.objects=[];this.picks=[];this.labels=[];this.active=true;this.dirty=true;this.ready=false;
      this.widthPx=el.clientWidth;this.heightPx=el.clientHeight;this.scene=new T.Scene();this.scene.background=null;
      this.camera=new T.PerspectiveCamera(47,this.widthPx/this.heightPx,.3,30000);
      this.renderer=new T.WebGLRenderer({antialias:true,alpha:true,powerPreference:'low-power',preserveDrawingBuffer:true});
      this.renderer.setPixelRatio(Math.min(devicePixelRatio,1.6));this.renderer.setSize(this.widthPx,this.heightPx);this.renderer.outputColorSpace=T.SRGBColorSpace;
      this.renderer.domElement.setAttribute('aria-label','可旋转、缩放和逐层进入的三维知识宇宙');this.el.appendChild(this.renderer.domElement);
      this.labelLayer=document.createElement('div');this.labelLayer.className='planet-labels';this.el.appendChild(this.labelLayer);
      this.leaderLayer=document.createElementNS('http://www.w3.org/2000/svg','svg');this.leaderLayer.setAttribute('class','label-leaders');this.leaderLayer.setAttribute('aria-hidden','true');this.labelLayer.appendChild(this.leaderLayer);
      this.controls=new OrbitControls(this.camera,this.renderer.domElement);this.controls.enableDamping=true;this.controls.dampingFactor=.11;this.controls.minDistance=12;this.controls.maxDistance=10000;this.controls.autoRotateSpeed=.35;
      this.controls.addEventListener('change',()=>this.invalidate());this.controls.addEventListener('start',()=>{this.transition=null;this.invalidate();});
      this.scene.add(new T.AmbientLight('#d5e6ff',2.1));const key=new T.DirectionalLight('#eff7ff',3);key.position.set(500,700,1000);this.scene.add(key);
      const rim=new T.DirectionalLight('#7388ce',1.7);rim.position.set(-700,0,-500);this.scene.add(rim);
      this.world=new T.Group();this.scene.add(this.world);this.addStars();
      this.ray=new T.Raycaster();this.pointer=new T.Vector2();this.down=null;this.tooltip=document.querySelector('#graph-tooltip');
      this.renderer.domElement.addEventListener('pointerdown',e=>{this.down={x:e.clientX,y:e.clientY,time:performance.now()};});
      this.renderer.domElement.addEventListener('pointerup',e=>{
        if(!this.down||Math.hypot(e.clientX-this.down.x,e.clientY-this.down.y)>6)return;
        const hit=this.hit(e);if(hit)this.opts.onSelect?.(hit.userData.id);this.down=null;
      });
      this.renderer.domElement.addEventListener('pointermove',e=>this.hover(e));
      this.renderer.domElement.addEventListener('pointerleave',()=>{if(this.tooltip)this.tooltip.hidden=true;});
      this.tick=this.tick.bind(this);this.frameId=requestAnimationFrame(this.tick);
      this.invalidate();
    }
    color(n){return this.opts.domains?.find(d=>d.id===n.domain)?.color||'#c2dfe8';}
    invalidate(){this.dirty=true;this.settleUntil=performance.now()+420;}
    addStars(){
      const random=rng(83152),positions=[],colors=[];
      for(let i=0;i<1800;i++){
        const az=random()*TAU,u=random()*2-1,r=2600+random()*5000,s=Math.sqrt(1-u*u);
        positions.push(r*s*Math.cos(az),r*u,r*s*Math.sin(az));const c=new T.Color().setHSL(.57+random()*.12,.15,.45+random()*.4);colors.push(c.r,c.g,c.b);
      }
      const geo=new T.BufferGeometry();geo.setAttribute('position',new T.Float32BufferAttribute(positions,3));geo.setAttribute('color',new T.Float32BufferAttribute(colors,3));
      this.stars=new T.Points(geo,new T.PointsMaterial({size:2.7,sizeAttenuation:true,vertexColors:true,transparent:true,opacity:.72,depthWrite:false}));this.scene.add(this.stars);
    }
    setData(nodes,links){
      this.nodes=nodes;this.links=links;this.map=new Map(nodes.map(n=>[n.id,n]));this.children=new Map(nodes.map(n=>[n.id,[]]));
      for(const n of nodes)if(n.parent&&this.children.has(n.parent))this.children.get(n.parent).push(n);
      this.layout();if(!this.map.has(this.focusId))this.focusId='universe';this.rebuildScene();return this;
    }
    layout(){
      const root=this.map.get('universe');if(!root)return;Object.assign(root,{x:0,y:0,z:0});
      const domainNodes=this.children.get('universe')||[];
      domainNodes.forEach((n,i)=>{const a=TAU*i/domainNodes.length+.28;n.x=Math.cos(a)*570;n.y=Math.sin(a)*390;n.z=Math.sin(a*2+.8)*155;});
      const place=parent=>{
        const list=this.children.get(parent.id)||[],seed=hash(parent.id),tilt=(seed%90-45)*Math.PI/180;
        const base=parent.depth===1?145:parent.depth===2?64:parent.depth===3?31:17;
        const radius=base*Math.max(1,Math.sqrt(list.length/4));
        list.forEach((n,i)=>{const a=TAU*i/list.length+(seed%13)*.32;const x=Math.cos(a)*radius,z=Math.sin(a)*radius;
          n.x=parent.x+x;n.y=parent.y+z*Math.sin(tilt);n.z=parent.z+z*Math.cos(tilt);place(n);});
      };
      domainNodes.forEach(place);
      for(const n of this.nodes){n.position=new T.Vector3(n.x||0,n.y||0,n.z||0);n.fx=n.x;n.fy=n.y;n.fz=n.z;}
    }
    descendants(id){const out=[];const visit=p=>{for(const n of this.children.get(p)||[]){out.push(n);visit(n.id);}};visit(id);return out;}
    ancestors(id){const out=[];let n=this.map.get(id),seen=new Set();while(n&&!seen.has(n.id)){seen.add(n.id);out.unshift(n);n=this.map.get(n.parent);}return out;}
    resolveFocus(id){const n=this.map.get(id);if(!n)return'universe';return(this.children.get(id)||[]).length?id:n.parent||'universe';}
    focus(id,selectedId=null,animate=true){
      this.focusId=this.resolveFocus(id);this.selectedId=selectedId;this.collectionIds=null;this.rebuildScene();this.fit(animate);this.opts.onFocus?.(this.focusId);return this;
    }
    select(id){this.selectedId=id;this.rebuildScene();return this;}
    setBridges(value){this.showBridges=value;this.rebuildScene();return this;}
    setCollection(ids){this.collectionIds=new Set(ids);this.rebuildScene();this.fit(true);return this;}
    setAutoRotate(value){this.autoRotate=!!value&&!reduced;this.controls.autoRotate=this.autoRotate;this.invalidate();return this;}
    clearWorld(){
      this.world.traverse(o=>{o.geometry?.dispose();if(o.material){const list=Array.isArray(o.material)?o.material:[o.material];for(const m of list){m.map?.dispose();m.dispose();}}});
      this.world.clear();this.leaderLayer.replaceChildren();this.labelLayer.replaceChildren(this.leaderLayer);this.objects=[];this.picks=[];this.labels=[];
    }
    visibleNodes(){
      if(this.collectionIds)return this.nodes.filter(n=>this.collectionIds.has(n.id));
      const focus=this.map.get(this.focusId);if(!focus)return[];
      const limit=this.focusId==='universe'?2:focus.depth+2;
      return [focus,...this.descendants(focus.id)].filter(n=>n.id!=='universe'&&n.depth<=limit);
    }
    texture(n){
      const c=document.createElement('canvas');c.width=128;c.height=64;const ctx=c.getContext('2d'),rand=rng(hash(n.id)),base=new T.Color(this.color(n));
      const image=ctx.createImageData(c.width,c.height);
      for(let y=0;y<c.height;y++)for(let x=0;x<c.width;x++){
        let noise=Math.sin(x*.15+Math.sin(y*.3)*2)+Math.cos(y*.6+x*.06)+rand()*.7;
        const fac=.55+(noise+2)/6;let r=base.r*fac,g=base.g*fac,b=base.b*fac;
        if(n.id==='earth'){const land=noise>.6;r=land?.12:.035;g=land?.39:.21;b=land?.27:.48;if(y<7||y>57){r=.78;g=.85;b=.9;}}
        if(n.id==='sun'){r=1;g=.42+fac*.4;b=.09+fac*.2;}
        if(n.id==='moon'){r=.4*fac;g=.43*fac;b=.48*fac;}
        if(n.id==='mars'){r=.66*fac;g=.26*fac;b=.13*fac;}
        const i=(y*c.width+x)*4;image.data[i]=Math.min(255,r*255);image.data[i+1]=Math.min(255,g*255);image.data[i+2]=Math.min(255,b*255);image.data[i+3]=255;
      }
      ctx.putImageData(image,0,0);const texture=new T.CanvasTexture(c);texture.colorSpace=T.SRGBColorSpace;return texture;
    }
    body(n,position,portal=false){
      const children=this.children.get(n.id)||[],hasChildren=children.length>0;
      const radius=portal?6.5:n.depth===1?23:hasChildren?(n.depth===2?11:7):n.depth<=3?6.3:4;
      const geo=new T.SphereGeometry(portal?6.5:radius,32,20),material=new T.MeshStandardMaterial({color:'#ffffff',map:this.texture(n),roughness:.75,metalness:.08,emissive:new T.Color(this.color(n)),emissiveIntensity:n.depth===1?.26:n.id==='sun'?.9:.035});
      const mesh=new T.Mesh(geo,material);mesh.position.copy(position);mesh.rotation.z=(hash(n.id)%100)/100;mesh.userData={id:n.id,portal};this.world.add(mesh);this.picks.push(mesh);this.objects.push({n,mesh,portal,radius});
      if(n.depth===1||n.id===this.selectedId||portal){
        const ring=new T.Mesh(new T.RingGeometry(radius*1.35,radius*1.4,80),new T.MeshBasicMaterial({color:this.color(n),transparent:true,opacity:portal?.7:.48,side:T.DoubleSide,depthWrite:false}));ring.position.copy(position);ring.rotation.x=-.4;ring.rotation.y=.25;this.world.add(ring);
        const glowGeo=new T.SphereGeometry(radius*1.14,24,16),glow=new T.Mesh(glowGeo,new T.MeshBasicMaterial({color:this.color(n),transparent:true,opacity:.065,side:T.BackSide,depthWrite:false}));glow.position.copy(position);this.world.add(glow);
      }
      const label=document.createElement('button');label.className='planet-label'+(n.depth===1?' galaxy-label':'')+(portal?' portal-label':'');
      const subtitle=portal?'跨系联系 · 点击跃迁':hasChildren?`${children.length} 个${n.depth===1?'子系统':'子节点'} · 点击进入`:'';
      label.innerHTML=`<span style="color:${this.color(n)}">${escapeHTML(n.title)}</span>${subtitle?`<small>${subtitle}</small>`:''}`;
      label.title=n.title+(portal?'，来自 '+(this.map.get(n.parent)?.title||'其他系统'):'');label.dataset.nodeId=n.id;
      label.onclick=e=>{e.stopPropagation();this.opts.onSelect?.(n.id);};this.labelLayer.appendChild(label);
      const leader=document.createElementNS('http://www.w3.org/2000/svg','line');leader.setAttribute('stroke',this.color(n));leader.setAttribute('stroke-opacity','.5');leader.setAttribute('stroke-width','1');leader.style.display='none';this.leaderLayer.appendChild(leader);
      this.labels.push({n,element:label,leader,position:position.clone(),portal,radius,width:label.offsetWidth,height:label.offsetHeight,priority:portal?1:n.id===this.selectedId?0:n.depth});
      return mesh;
    }
    curve(a,b,c,opacity=.3,dashed=false){
      const mid=a.clone().lerp(b,.5);const dist=a.distanceTo(b);mid.z+=Math.min(dist*.2,90);mid.y+=dist*.07;
      const curve=new T.QuadraticBezierCurve3(a,mid,b),geo=new T.BufferGeometry().setFromPoints(curve.getPoints(32));
      const material=dashed?new T.LineDashedMaterial({color:c,transparent:true,opacity,dashSize:6,gapSize:4,depthWrite:false}):new T.LineBasicMaterial({color:c,transparent:true,opacity,depthWrite:false});
      const line=new T.Line(geo,material);if(dashed)line.computeLineDistances();this.world.add(line);return line;
    }
    orbit(parent,children){
      if(!children.length)return;
      const sample=children[0],r=parent.position.distanceTo(sample.position);if(r<.1)return;
      const seed=hash(parent.id),tilt=(seed%90-45)*Math.PI/180,pts=[];
      for(let i=0;i<=100;i++){const a=i/100*TAU;pts.push(new T.Vector3(parent.x+Math.cos(a)*r,parent.y+Math.sin(a)*r*Math.sin(tilt),parent.z+Math.sin(a)*r*Math.cos(tilt)));}
      const line=new T.LineLoop(new T.BufferGeometry().setFromPoints(pts),new T.LineBasicMaterial({color:this.color(parent),transparent:true,opacity:parent.id===this.focusId?.28:.13,depthWrite:false}));this.world.add(line);
    }
    galaxyCloud(n){
      const random=rng(hash(n.id)),positions=[],c=this.color(n);
      for(let i=0;i<220;i++){const r=28+random()*182,a=r*.027+(i%3)*TAU/3+(random()-.5)*.6;positions.push(n.x+Math.cos(a)*r,n.y+(random()-.5)*22,n.z+Math.sin(a)*r*.65);}
      const geo=new T.BufferGeometry();geo.setAttribute('position',new T.Float32BufferAttribute(positions,3));this.world.add(new T.Points(geo,new T.PointsMaterial({color:c,size:1.4,transparent:true,opacity:.36,depthWrite:false,blending:T.AdditiveBlending})));
    }
    nearestVisible(id,set){let n=this.map.get(id);while(n&&!set.has(n.id))n=this.map.get(n.parent);return n;}
    rebuildScene(){
      this.clearWorld();const visible=this.visibleNodes(),set=new Set(visible.map(n=>n.id));this.visibleIds=set;
      const focus=this.map.get(this.focusId)||this.map.get('universe');this.visibleRadius=Math.max(45,...visible.map(n=>n.position.distanceTo(focus.position)));
      for(const n of visible){this.body(n,n.position);if(n.depth===1)this.galaxyCloud(n);}
      for(const p of visible){const children=(this.children.get(p.id)||[]).filter(n=>set.has(n.id));this.orbit(p,children);for(const n of children)this.curve(p.position,n.position,this.color(n),.09);}
      this.bridgeCount=0;
      if(this.showBridges){
        if(this.selectedId){
          const selected=this.map.get(this.selectedId);const added=new Set();let index=0;
          const related=this.links.filter(l=>l.kind==='relation'&&(l.source===this.selectedId||l.target===this.selectedId));
          for(const l of related){const id=l.source===this.selectedId?l.target:l.source,n=this.map.get(id);if(!n||added.has(id))continue;added.add(id);
            let pos=n.position;
            if(!set.has(id)){
              const focus=this.map.get(this.focusId),spread=this.visibleRadius||140;const a=-.9+index*.65;
              pos=focus.position.clone().add(new T.Vector3(Math.cos(a)*(spread+65),Math.sin(a)*(spread+50),70+index*11));this.body(n,pos,true);index++;
            }
            this.curve(selected.position,pos,this.color(n),.63,true);this.bridgeCount++;
          }
        }else{
          const pairs=new Set();for(const l of this.links.filter(l=>l.kind==='relation')){
            const a=this.nearestVisible(l.source,set),b=this.nearestVisible(l.target,set);if(!a||!b||a.id===b.id)continue;
            if(this.focusId==='universe'&&a.domain===b.domain)continue;
            const key=[a.id,b.id].sort().join('|');if(pairs.has(key))continue;pairs.add(key);
            this.curve(a.position,b.position,a.domain===b.domain?this.color(a):'#8da7c6',.2,true);this.bridgeCount++;
          }
        }
      }
      this.labels.sort((a,b)=>a.priority-b.priority);this.invalidate();
      this.ready=false;this.initialFrames=4;
    }
    fit(animate=true){
      let list=this.visibleNodes();if(!list.length)list=[this.map.get('universe')];
      const bbox=new T.Box3();list.forEach(n=>bbox.expandByPoint(n.position));this.objects.filter(o=>o.portal).forEach(o=>bbox.expandByPoint(o.mesh.position));const center=bbox.getCenter(new T.Vector3()),size=bbox.getSize(new T.Vector3());
      const radius=Math.max(48,size.length()/2),aspect=this.widthPx/this.heightPx;
      const distance=radius/Math.sin(T.MathUtils.degToRad(47/2))*Math.max(1,1/Math.max(aspect,.35))*(this.focusId==='universe'?1.05:1.18);
      const dir=new T.Vector3(.14,.4,1).normalize();const end=center.clone().addScaledVector(dir,distance);
      this.fly(end,center,animate&&!reduced?800:0);return this;
    }
    fly(position,target,ms){
      if(!ms){this.camera.position.copy(position);this.controls.target.copy(target);this.controls.update();this.invalidate();return;}
      this.transition={start:performance.now(),ms,from:this.camera.position.clone(),to:position.clone(),fromTarget:this.controls.target.clone(),target:target.clone()};this.invalidate();
    }
    zoomBy(factor){this.transition=null;const dir=this.camera.position.clone().sub(this.controls.target);const dist=T.MathUtils.clamp(dir.length()/factor,12,10000);this.camera.position.copy(this.controls.target).add(dir.normalize().multiplyScalar(dist));this.controls.update();this.invalidate();return this;}
    width(value){if(value===undefined)return this.widthPx;this.widthPx=value;this.resize();return this;}
    height(value){if(value===undefined)return this.heightPx;this.heightPx=value;this.resize();return this;}
    resize(){this.camera.aspect=this.widthPx/this.heightPx;this.camera.updateProjectionMatrix();this.renderer.setSize(this.widthPx,this.heightPx);for(const l of this.labels){const hidden=l.element.hidden;l.element.hidden=false;l.width=l.element.offsetWidth;l.height=l.element.offsetHeight;l.element.hidden=hidden;}this.invalidate();}
    pauseAnimation(){this.active=false;return this;}
    resumeAnimation(){this.active=true;this.invalidate();return this;}
    hit(e){const r=this.renderer.domElement.getBoundingClientRect();this.pointer.set((e.clientX-r.left)/r.width*2-1,-((e.clientY-r.top)/r.height)*2+1);this.ray.setFromCamera(this.pointer,this.camera);return this.ray.intersectObjects(this.picks,false)[0]?.object;}
    hover(e){
      if(this.down)return;const object=this.hit(e);this.el.style.cursor=object?'pointer':'grab';
      if(!this.tooltip)return;if(!object){this.tooltip.hidden=true;return;}const n=this.map.get(object.userData.id),rect=this.el.getBoundingClientRect();
      this.tooltip.textContent=n.title+((this.children.get(n.id)||[]).length?' · 点击进入系统':' · 点击阅读');this.tooltip.style.left=Math.min(e.clientX-rect.left+14,this.widthPx-215)+'px';this.tooltip.style.top=Math.max(8,e.clientY-rect.top-38)+'px';this.tooltip.hidden=false;
    }
    screenPosition(id){const o=this.objects.find(o=>o.n.id===id&&!o.portal);if(!o)return null;const p=o.mesh.position.clone().project(this.camera);return{x:(p.x+1)/2*this.widthPx,y:(1-p.y)/2*this.heightPx,z:p.z};}
    positionLabels(){
      const used=[];const focus=this.map.get(this.focusId);const pvec=new T.Vector3();
      for(const label of this.labels){
        pvec.copy(label.position).project(this.camera);const x=(pvec.x+1)*this.widthPx/2,y=(1-pvec.y)*this.heightPx/2;
        const selected=label.n.id===this.selectedId;const important=label.n.depth===1||label.portal||selected||label.n.parent===this.focusId;
        const distance=this.camera.position.distanceTo(label.position),pixelRadius=label.radius*this.heightPx/(distance*2*Math.tan(T.MathUtils.degToRad(47/2)));
        const available=important||pixelRadius>3.1;
        const offset=Math.max(12,pixelRadius+5);const w=label.width||label.n.title.length*12+16,h=label.height||24;
        const labelY=important?T.MathUtils.clamp(y+offset,190,this.heightPx-110-h):y+offset;
        let box={x:x-w/2,y:labelY,w,h};
        const clear=b=>b.x>=8&&b.x+b.w<=this.widthPx-8&&b.y>=185&&b.y+b.h<this.heightPx-103&&!used.some(u=>b.x<u.x+u.w+4&&b.x+b.w+4>u.x&&b.y<u.y+u.h+3&&b.y+b.h+3>u.y);
        if(important&&!clear(box)){
          const candidates=[[0,0],[0,28],[0,-h-offset*2],[0,56],[w*.65,0],[-w*.65,0],[w*.65,40],[-w*.65,40],[0,-80],[w,0],[-w,0]];
          let replacement=candidates.map(([dx,dy])=>({x:T.MathUtils.clamp(x-w/2+dx,8,this.widthPx-w-8),y:T.MathUtils.clamp(labelY+dy,190,this.heightPx-h-110),w,h})).find(clear);
          if(!replacement){for(let yy=190;yy<this.heightPx-h-110&&!replacement;yy+=h+7)for(const xx of [12,this.widthPx-w-12,(this.widthPx-w)/2]){const candidate={x:xx,y:yy,w,h};if(clear(candidate)){replacement=candidate;break;}}}
          if(replacement)box=replacement;
        }
        const inFrame=pvec.z>-1&&pvec.z<1&&x>0&&x<this.widthPx&&y>125&&y<this.heightPx-65;
        const show=available&&inFrame&&clear(box);
        label.element.hidden=!show;label.leader.style.display='none';
        if(show){
          label.element.style.left=(box.x+w/2)+'px';label.element.style.top=box.y+'px';used.push(box);
          if(Math.abs(box.x+w/2-x)>8||Math.abs(box.y-(y+offset))>8){const l=label.leader;l.setAttribute('x1',x);l.setAttribute('y1',y);l.setAttribute('x2',box.x+w/2);l.setAttribute('y2',box.y>y?box.y:box.y+h);l.style.display='';}
        }
      }
    }
    tick(now){
      this.frameId=requestAnimationFrame(this.tick);if(!this.active||document.hidden)return;
      if(this.transition){const tr=this.transition,p=Math.min((now-tr.start)/tr.ms,1),ease=1-Math.pow(1-p,4);this.camera.position.lerpVectors(tr.from,tr.to,ease);this.controls.target.lerpVectors(tr.fromTarget,tr.target,ease);this.dirty=true;if(p===1)this.transition=null;}
      // Keep the visible WebGL surface composited; stop entirely in the background or directory.
      {
        if(now-(this.lastFrame||0)<32)return;this.lastFrame=now;this.controls.update();this.camera.updateMatrixWorld();this.renderer.render(this.scene,this.camera);this.positionLabels();this.ready=true;this.initialFrames=Math.max(0,(this.initialFrames||0)-1);this.dirty=false;
      }
    }
    dispose(){cancelAnimationFrame(this.frameId);this.clearWorld();this.stars.geometry.dispose();this.stars.material.dispose();this.controls.dispose();this.renderer.dispose();}
  }
  window.Universe3D=Universe3D;
})();
