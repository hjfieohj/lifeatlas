'use strict';
// Actual XYZ point volumes. Gas, stars and dark dust all turn with the camera.
(() => {
 const T=UniverseRuntime.THREE,TAU=Math.PI*2;
 const rng=seed=>()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296;};
 const hash=s=>[...s].reduce((a,c)=>(a*31+c.charCodeAt(0))>>>0,17);
 const normal=r=>Math.sqrt(-2*Math.log(Math.max(.0001,r())))*Math.cos(TAU*r());
 const vertex=`
 attribute float aSize;attribute float aOpacity;attribute float aSeed;
 uniform float uTime;uniform float uViewport;uniform float uKind;
 varying vec3 vColor;varying float vOpacity;varying float vSeed;
 void main(){
  vec3 p=position;
  float breathe=sin(uTime*.09+aSeed*6.283);
  p+=vec3(sin(aSeed*22.1+uTime*.08),cos(aSeed*17.3+uTime*.07),breathe)*(1.0-uKind)*1.6;
  vec4 mv=modelViewMatrix*vec4(p,1.0);
  gl_Position=projectionMatrix*mv;
  gl_PointSize=clamp(aSize*uViewport/max(4.0,-mv.z),uKind>.5?1.0:2.0,110.0);
  float depth=clamp((-mv.z-100.0)/2600.0,0.0,1.0);
  vColor=color*mix(1.05,.55,depth);
  vOpacity=aOpacity*mix(1.0,.65,depth)*(uKind>.5?.75+.25*sin(aSeed*49.0+uTime*.45):.9+.1*breathe);
  vSeed=aSeed;
 }`;
 const fragment=`
 uniform sampler2D uCloud;uniform float uKind;
 varying vec3 vColor;varying float vOpacity;varying float vSeed;
 void main(){
  vec2 p=gl_PointCoord-.5;
  float r=length(p)*2.0;if(r>1.0)discard;
  float mask;
  if(uKind>.5){
   mask=exp(-r*r*5.5)*(1.0-smoothstep(.15,1.0,r));
   float cross=max(exp(-abs(p.x)*100.0),exp(-abs(p.y)*100.0))*.12;
   mask+=cross*(1.0-smoothstep(0.0,.95,r));
  }else{
   float a=vSeed*6.283;mat2 rot=mat2(cos(a),-sin(a),sin(a),cos(a));
   vec2 uv=rot*p+.5;mask=texture2D(uCloud,uv).a*(1.0-smoothstep(.2,1.0,r));
  }
  float alpha=mask*vOpacity;if(alpha<.003)discard;
  gl_FragColor=vec4(vColor,alpha);
 }`;
 function cloudTexture(){
  const c=document.createElement('canvas');c.width=c.height=128;const ctx=c.getContext('2d'),data=ctx.createImageData(128,128);
  for(let y=0;y<128;y++)for(let x=0;x<128;x++){
   const px=(x-64)/64,py=(y-64)/64,r=Math.hypot(px,py),n=Math.sin(px*9+Math.sin(py*7)*1.3)*.18+Math.sin(py*15+px*3)*.13+Math.sin(px*26+py*18)*.06;
   const alpha=Math.max(0,Math.exp(-r*r*2.3)*(.6+n)*Math.max(0,1-r*r));const i=(y*128+x)*4;
   data.data[i]=255;data.data[i+1]=255;data.data[i+2]=255;data.data[i+3]=Math.min(255,alpha*255);
  }
  ctx.putImageData(data,0,0);const t=new T.CanvasTexture(c);t.colorSpace=T.NoColorSpace;return t;
 }
 class NebulaField {
  constructor(world){this.world=world;this.texture=cloudTexture();this.materials=[];this.pointCount=0;this.compact=innerWidth<640;}
  clear(){this.materials=[];this.pointCount=0;}
  points(positions,colors,sizes,alphas,seeds,{kind=0,dust=false}={}){
   const g=new T.BufferGeometry();for(const [key,values,size] of [['position',positions,3],['color',colors,3],['aSize',sizes,1],['aOpacity',alphas,1],['aSeed',seeds,1]])g.setAttribute(key,new T.Float32BufferAttribute(values,size));
   const m=new T.ShaderMaterial({vertexShader:vertex,fragmentShader:fragment,uniforms:{uCloud:{value:this.texture},uTime:{value:0},uViewport:{value:900},uKind:{value:kind}},vertexColors:true,transparent:true,depthWrite:false,depthTest:true,blending:dust?T.NormalBlending:T.AdditiveBlending,toneMapped:false});
   const field=new T.Points(g,m);field.frustumCulled=false;field.renderOrder=dust?2:kind?3:1;field.userData.nebula=true;field.userData.effect=dust?'dust':kind?'stars':'gas';this.world.add(field);this.materials.push(m);this.pointCount+=sizes.length;return field;
  }
  cloud(center,radius,color,seed,{density=1,common=false}={}){
   const random=rng(seed),q=new T.Quaternion().setFromEuler(new T.Euler(random()*1.9-.95,random()*TAU,random()*1.2-.6)),c=new T.Color(color),p=[],cs=[],size=[],alpha=[],seeds=[];
   const count=Math.floor((this.compact?400:760)*density);
   for(let i=0;i<count;i++){
    const t=random(),arm=i%3,a=t*TAU*1.1+arm*TAU/3+normal(random)*.15,r=radius*(.08+.9*Math.sqrt(t));
    const v=new T.Vector3(Math.cos(a)*r+normal(random)*radius*.12,normal(random)*radius*(.17+.12*t)+Math.sin(a*1.6)*radius*.12,Math.sin(a)*r*.72+normal(random)*radius*.1).applyQuaternion(q).add(center);
    p.push(v.x,v.y,v.z);const tint=c.clone().lerp(new T.Color('#7b96bd'),random()*.32);const hot=.65+random()*.42;cs.push(tint.r*hot,tint.g*hot,tint.b*hot);size.push(radius*(.16+random()*.26));alpha.push((common?.034:.095)*(0.6+random()*.8));seeds.push(random());
   }
   this.points(p,cs,size,alpha,seeds);
   const sp=[],sc=[],ss=[],sa=[],sr=[],stars=Math.floor((this.compact?580:1250)*density);
   for(let i=0;i<stars;i++){
    const a=random()*TAU,r=radius*Math.pow(random(),.65),v=new T.Vector3(Math.cos(a)*r,normal(random)*radius*.23,Math.sin(a)*r*.78).applyQuaternion(q).add(center);
    sp.push(v.x,v.y,v.z);const star=new T.Color().setHSL(.53+random()*.13,.15+random()*.2,.68+random()*.27).lerp(c,.22);sc.push(star.r,star.g,star.b);ss.push((1+random()**5*6)*radius/200);sa.push(.32+random()*.5);sr.push(random());
   }
   this.points(sp,sc,ss,sa,sr,{kind:1});
   if(!common){
    const dp=[],dc=[],ds=[],da=[],dr=[];
    for(let i=0;i<Math.floor(count*.12);i++){const t=random(),a=t*4.4-.5,v=new T.Vector3(Math.cos(a)*radius*(t-.35),Math.sin(a*2)*radius*.16,Math.sin(a)*radius*.37).applyQuaternion(q).add(center);dp.push(v.x,v.y,v.z);dc.push(.012,.022,.045);ds.push(radius*(.22+random()*.22));da.push(.13+random()*.16);dr.push(random());}
    this.points(dp,dc,ds,da,dr,{dust:true});
   }
  }
  beacon(position,color,radius,selected=false){
   const c=new T.Color(color).lerp(new T.Color('#e9f6ff'),.58);
   this.points([position.x,position.y,position.z],[c.r,c.g,c.b],[radius*3.4],[1],[.4],{kind:1}).renderOrder=5;
   this.points([position.x,position.y,position.z],[c.r,c.g,c.b],[radius*(selected?22:15)],[selected?.5:.28],[.7]).renderOrder=4;
  }
  filament(a,b,color,strength=.3){
   const seed=Math.floor(Math.abs(a.x*13+b.z*17+a.y*3))+71,random=rng(seed),mid=a.clone().lerp(b,.5);mid.z+=a.distanceTo(b)*.16;
   const path=new T.QuadraticBezierCurve3(a,mid,b),p=[],c=[],s=[],o=[],seedValues=[],tint=new T.Color(color),count=this.compact?100:180;
   for(let i=0;i<count;i++){const t=i/count,v=path.getPoint(t),spread=3+Math.sin(t*Math.PI)*5;v.x+=normal(random)*spread;v.y+=normal(random)*spread;v.z+=normal(random)*spread;p.push(v.x,v.y,v.z);c.push(tint.r,tint.g,tint.b);s.push(1+random()*3);o.push(strength*(.35+random()*.6));seedValues.push(t);}
   this.points(p,c,s,o,seedValues,{kind:1});
  }
  update(time,viewport){for(const m of this.materials){m.uniforms.uTime.value=time;m.uniforms.uViewport.value=viewport;}}
  dispose(){this.texture.dispose();this.clear();}
 }
 window.NebulaField=NebulaField;
})();
