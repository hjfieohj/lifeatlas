'use strict';
(() => {
  const {THREE:T,TrackballControls} = UniverseRuntime;
  const TAU=Math.PI*2;
  const reduced=matchMedia('(prefers-reduced-motion:reduce)').matches;
  const escapeHTML=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const hash=s=>[...s].reduce((a,c)=>(a*31+c.charCodeAt(0))>>>0,7);
  function rng(seed){return()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296;};}
  class Universe3D {
    constructor(el,opts={}) {
      this.el=el;this.opts=opts;this.focusId='universe';this.selectedId=null;this.showBridges=true;this.autoRotate=!reduced;this.motionAllowed=true;this.motionPaused=false;this.sceneTime=0;
      this.nodes=[];this.links=[];this.map=new Map();this.children=new Map();this.objects=[];this.picks=[];this.labels=[];this.active=true;this.dirty=true;this.ready=false;
      this.widthPx=el.clientWidth;this.heightPx=el.clientHeight;this.scene=new T.Scene();this.scene.background=null;
      this.camera=new T.PerspectiveCamera(47,this.widthPx/this.heightPx,.3,30000);
      this.renderer=new T.WebGLRenderer({antialias:true,alpha:true,powerPreference:'low-power',preserveDrawingBuffer:true});
      this.renderer.setPixelRatio(Math.min(devicePixelRatio,innerWidth<640?1:1.3));this.renderer.setSize(this.widthPx,this.heightPx);this.renderer.outputColorSpace=T.SRGBColorSpace;
      this.renderer.domElement.setAttribute('aria-label','可旋转、缩放和逐层进入的三维知识宇宙');this.el.appendChild(this.renderer.domElement);
      this.labelLayer=document.createElement('div');this.labelLayer.className='planet-labels';this.el.appendChild(this.labelLayer);
      this.leaderLayer=document.createElementNS('http://www.w3.org/2000/svg','svg');this.leaderLayer.setAttribute('class','label-leaders');this.leaderLayer.setAttribute('aria-hidden','true');this.labelLayer.appendChild(this.leaderLayer);
      this.controls=new TrackballControls(this.camera,this.renderer.domElement);this.controls.rotateSpeed=2.1;this.controls.zoomSpeed=1.1;this.controls.panSpeed=.6;this.controls.dynamicDampingFactor=.13;this.controls.staticMoving=false;this.controls.multiTouchRoll=true;this.controls.keys=[];this.controls.minDistance=12;this.controls.maxDistance=10000;
      this.controls.addEventListener('change',()=>this.invalidate());this.controls.addEventListener('start',()=>{this.transition=null;this.interacting=true;this.invalidate();});this.controls.addEventListener('end',()=>{this.interacting=false;this.autoResumeAt=performance.now()+2800;});
      this.scene.add(new T.AmbientLight('#d5e6ff',2.1));const key=new T.DirectionalLight('#eff7ff',3);key.position.set(500,700,1000);this.scene.add(key);
      const rim=new T.DirectionalLight('#7388ce',1.7);rim.position.set(-700,0,-500);this.scene.add(rim);
      this.world=new T.Group();this.scene.add(this.world);this.nebula=new NebulaField(this.world);this.addStars();
      this.ray=new T.Raycaster();this.pointer=new T.Vector2();this.down=null;this.tooltip=document.querySelector('#graph-tooltip');
      this.renderer.domElement.addEventListener('pointerdown',e=>{this.down={x:e.clientX,y:e.clientY,time:performance.now()};});
      this.renderer.domElement.addEventListener('pointerup',e=>{
        const down=this.down;this.down=null;if(!down||Math.hypot(e.clientX-down.x,e.clientY-down.y)>6)return;
        const hit=this.hit(e);if(hit)this.opts.onSelect?.(hit.userData.id);
      });
      this.renderer.domElement.addEventListener('pointermove',e=>this.hover(e));
      this.renderer.domElement.addEventListener('pointerleave',()=>{if(this.tooltip)this.tooltip.hidden=true;});
      this.tick=this.tick.bind(this);this.frameId=requestAnimationFrame(this.tick);
      this.resizeObserver=new ResizeObserver(()=>{const w=this.el.clientWidth,h=this.el.clientHeight;if(w&&h&&(w!==this.widthPx||h!==this.heightPx)){this.widthPx=w;this.heightPx=h;this.resize();}});this.resizeObserver.observe(this.el);
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
      const anchors=[[420,30,140],[-100,330,250],[-410,100,-170],[100,-210,420],[-250,-230,-170],[200,200,-380]];
      domainNodes.forEach((n,i)=>{const v=anchors[i]||[Math.cos(i*2.4)*450,Math.sin(i*2.4)*350,(i%2?1:-1)*250];[n.x,n.y,n.z]=v;});
      const place=parent=>{
        const list=this.children.get(parent.id)||[],seed=hash(parent.id),phase=seed%19*.3;
        const radius=parent.depth===1?165:parent.depth===2?70:parent.depth===3?32:17;
        list.forEach((n,i)=>{const a=i*2.39996+phase,u=1-2*(i+.5)/Math.max(list.length,1),r=Math.sqrt(Math.max(0,1-u*u));
          n.x=parent.x+Math.cos(a)*r*radius;n.y=parent.y+u*radius*.9;n.z=parent.z+Math.sin(a)*r*radius;place(n);});
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
    setAutoRotate(value){this.autoRotate=!!value&&!reduced;this.invalidate();return this;}
    setMotionAllowed(value){this.motionAllowed=!!value;return this;}
    setMotionPaused(value){this.motionPaused=!!value;return this;}
    clearWorld(){
      this.world.traverse(o=>{o.geometry?.dispose();if(o.material){const list=Array.isArray(o.material)?o.material:[o.material];for(const m of list){m.map?.dispose();m.dispose();}}});
      this.world.clear();this.leaderLayer.replaceChildren();this.labelLayer.replaceChildren(this.leaderLayer);this.objects=[];this.picks=[];this.labels=[];this.nebula.clear();
    }
    visibleNodes(){
      if(this.collectionIds)return this.nodes.filter(n=>this.collectionIds.has(n.id));
      const focus=this.map.get(this.focusId);if(!focus)return[];
      const limit=this.focusId==='universe'?2:focus.depth+2;
      return [focus,...this.descendants(focus.id)].filter(n=>n.id!=='universe'&&n.depth<=limit);
    }

    body(n,position,portal=false){
      const children=this.children.get(n.id)||[],hasChildren=children.length>0;
      const radius=portal?5:n.depth===1?11:hasChildren?6:3.2;
      const mesh=new T.Mesh(new T.SphereGeometry(Math.max(radius*1.5,7),10,8),new T.MeshBasicMaterial({transparent:true,opacity:0,depthWrite:false,color:this.color(n)}));
      mesh.position.copy(position);mesh.userData={id:n.id,portal};this.world.add(mesh);this.picks.push(mesh);this.objects.push({n,mesh,portal,radius});
      this.nebula.beacon(position,this.color(n),radius,n.id===this.selectedId||portal);
      const label=document.createElement('button');label.className='planet-label'+(n.depth===1?' galaxy-label':'')+(portal?' portal-label':'');
      const subtitle=portal?'跨系跃迁':hasChildren&&n.depth>1?`${children.length} 个下级 · 点击深入`:'';
      label.innerHTML=`<span style="color:${this.color(n)}">${escapeHTML(n.title)}</span>${subtitle?`<small>${subtitle}</small>`:''}`;
      label.title=n.title+(portal?'，来自 '+(this.map.get(n.parent)?.title||'其他系统'):'');label.dataset.nodeId=n.id;
      label.onclick=e=>{e.stopPropagation();this.opts.onSelect?.(n.id);};this.labelLayer.appendChild(label);
      const leader=document.createElementNS('http://www.w3.org/2000/svg','line');leader.setAttribute('stroke',this.color(n));leader.setAttribute('stroke-opacity','.5');leader.setAttribute('stroke-width','1');leader.style.display='none';this.leaderLayer.appendChild(leader);
      this.labels.push({n,element:label,leader,position:position.clone(),portal,radius,width:label.offsetWidth,height:label.offsetHeight,priority:portal?1:n.id===this.selectedId?0:n.depth});
      return mesh;
    }
    curve(a,b,c,opacity=.3,dashed=false){this.nebula.filament(a,b,c,opacity);}
    galaxyCloud(n,radius=230,density=1){this.nebula.cloud(n.position,radius,this.color(n),hash(n.id),{density});}

    nearestVisible(id,set){let n=this.map.get(id);while(n&&!set.has(n.id))n=this.map.get(n.parent);return n;}
    rebuildScene(){
      this.clearWorld();const visible=this.visibleNodes(),set=new Set(visible.map(n=>n.id));this.visibleIds=set;
      const focus=this.map.get(this.focusId)||this.map.get('universe');this.visibleRadius=Math.max(45,...visible.map(n=>n.position.distanceTo(focus.position)));
      if(this.focusId==='universe'&&!this.collectionIds)this.nebula.cloud(new T.Vector3(0,0,0),540,'#728db8',3291,{density:.65,common:true});
      for(const n of visible){this.body(n,n.position);if(n.depth===1)this.galaxyCloud(n,245,1);}
      if(this.focusId!=='universe'&&focus){
        if(focus.depth>1)this.galaxyCloud(focus,Math.max(45,this.visibleRadius*1.12),1.2);
        for(const n of visible.filter(n=>n.parent===focus.id&&this.children.get(n.id)?.length))if(n.depth>1)this.galaxyCloud(n,focus.depth===1?85:37,.38);
      }
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
      const w=this.el.clientWidth,h=this.el.clientHeight;if(w!==this.widthPx||h!==this.heightPx){this.widthPx=w;this.heightPx=h;this.resize();}
      let list=this.visibleNodes();if(!list.length)list=[this.map.get('universe')];
      const bbox=new T.Box3();list.forEach(n=>bbox.expandByPoint(n.position));this.objects.filter(o=>o.portal).forEach(o=>bbox.expandByPoint(o.mesh.position));const center=bbox.getCenter(new T.Vector3()),size=bbox.getSize(new T.Vector3());
      const radius=Math.max(48,size.length()/2),aspect=this.widthPx/this.heightPx;
      const distance=radius/Math.sin(T.MathUtils.degToRad(47/2))*Math.max(1,1/Math.max(aspect,.35))*(this.focusId==='universe'?.80:1.18);
      const prior=this.camera.position.clone().sub(this.controls.target);const dir=prior.length()>1?prior.normalize():new T.Vector3(.36,.25,1).normalize();const end=center.clone().addScaledVector(dir,distance);
      this.fly(end,center,animate&&!reduced?800:0);return this;
    }
    fly(position,target,ms){
      if(!ms){this.camera.position.copy(position);this.controls.target.copy(target);this.controls.update();this.invalidate();return;}
      this.transition={start:performance.now(),ms,from:this.camera.position.clone(),to:position.clone(),fromTarget:this.controls.target.clone(),target:target.clone()};this.invalidate();
    }
    zoomBy(factor){this.transition=null;const dir=this.camera.position.clone().sub(this.controls.target);const dist=T.MathUtils.clamp(dir.length()/factor,12,10000);this.camera.position.copy(this.controls.target).add(dir.normalize().multiplyScalar(dist));this.controls.update();this.invalidate();return this;}
    width(value){if(value===undefined)return this.widthPx;this.widthPx=value;this.resize();return this;}
    height(value){if(value===undefined)return this.heightPx;this.heightPx=value;this.resize();return this;}
    resize(){this.camera.aspect=this.widthPx/this.heightPx;this.camera.updateProjectionMatrix();this.controls.handleResize();this.renderer.setSize(this.widthPx,this.heightPx);for(const l of this.labels){const hidden=l.element.hidden;l.element.hidden=false;l.width=l.element.offsetWidth;l.height=l.element.offsetHeight;l.element.hidden=hidden;}this.invalidate();}
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
        const contextual=this.focusId!=='universe'||label.n.depth===1||label.portal||selected;const show=contextual&&available&&inFrame&&clear(box);
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
        if(now-(this.lastFrame||0)<33)return;
        const dt=Math.min(.08,(now-(this.lastFrame||now))/1000);this.lastFrame=now;
        const moving=this.motionAllowed&&!this.motionPaused&&!reduced;
        if(moving)this.sceneTime+=dt;
        if(moving&&this.autoRotate&&!this.transition&&!this.interacting&&now>(this.autoResumeAt||0)){
          const offset=this.camera.position.clone().sub(this.controls.target).applyAxisAngle(new T.Vector3(0,1,0),dt*.035);
          this.camera.position.copy(this.controls.target).add(offset);
        }
        this.nebula.update(this.sceneTime,this.heightPx*this.renderer.getPixelRatio()/(2*Math.tan(T.MathUtils.degToRad(47/2))));this.controls.update();this.camera.updateMatrixWorld();this.renderer.render(this.scene,this.camera);this.positionLabels();this.ready=true;this.initialFrames=Math.max(0,(this.initialFrames||0)-1);this.dirty=false;
      }
    }
    dispose(){cancelAnimationFrame(this.frameId);this.clearWorld();this.stars.geometry.dispose();this.stars.material.dispose();this.resizeObserver.disconnect();this.nebula.dispose();this.controls.dispose();this.renderer.dispose();}
  }
  window.Universe3D=Universe3D;
})();
