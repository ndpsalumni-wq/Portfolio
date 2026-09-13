const story = document.querySelector('.scroll-story');
const host = document.getElementById('avatar-stage');
const chapters = [...document.querySelectorAll('.story-chapter')];
const toggle = document.getElementById('motionToggle');
const reduced = matchMedia('(prefers-reduced-motion: reduce)');
let paused = reduced.matches;
let draw = () => {};
function syncToggle() {
    toggle.textContent = paused ? 'Resume motion' : 'Pause motion';
    toggle.setAttribute('aria-pressed', String(paused));
}
syncToggle();
toggle.addEventListener('click', () => { paused = !paused; syncToggle(); draw(); });
reduced.addEventListener('change', () => { paused = reduced.matches; syncToggle(); draw(); });
const chaptersObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => entry.target.classList.toggle('chapter-active', entry.isIntersecting));
}, { rootMargin: '-20% 0px -20% 0px' });
chapters.forEach(chapter => chaptersObserver.observe(chapter));

// Locally hosted Three.js keeps the scene independent of third-party CDNs.
try {
 const T = await import('./vendor/three.module.js');
 const renderer = new T.WebGLRenderer({ alpha:true, antialias:true, powerPreference:'low-power' });
 renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5));
 renderer.outputColorSpace = T.SRGBColorSpace;
 const scene = new T.Scene();
 const camera = new T.PerspectiveCamera(32, 1, .1, 100);
 camera.position.set(0, 1.6, 8.8); camera.lookAt(0, 1.5, 0);
 scene.add(new T.HemisphereLight(0xe6f2ff, 0x242c35, 2.3));
 const key = new T.DirectionalLight(0xffe2be, 3); key.position.set(3,5,4); scene.add(key);
 const rim = new T.DirectionalLight(0xb8e7ff, 4); rim.position.set(-3,3,-2); scene.add(rim);
 const avatar = new T.Group(); scene.add(avatar);
 const skin = new T.MeshStandardMaterial({color:0xb87a53,roughness:.72});
 const jacket = new T.MeshStandardMaterial({color:0x17202a,roughness:.65});
 const hair = new T.MeshStandardMaterial({color:0x111315,roughness:.9});
 const trousers = new T.MeshStandardMaterial({color:0x292e38,roughness:.85});
 const metal = new T.MeshStandardMaterial({color:0xb9c2cb,metalness:.8,roughness:.3});
 const glass = new T.MeshStandardMaterial({color:0x111c24,metalness:.65,roughness:.2});
 function mesh(geometry,material,x,y,z,sx=1,sy=1,sz=1,parent=avatar) {
  const object = new T.Mesh(geometry,material); object.position.set(x,y,z); object.scale.set(sx,sy,sz); parent.add(object); return object;
 }
 const sphere = new T.SphereGeometry(1,32,24);
 // A deliberately stylised, full-body character with black shirt, quiff and sunglasses.
 mesh(sphere,skin,0,2.96,0,.37,.46,.34);
 mesh(new T.CylinderGeometry(.14,.17,.28,24),skin,0,2.5,0);
 mesh(sphere,hair,0,3.27,-.04,.38,.24,.34);
 const quiff = mesh(sphere,hair,.04,3.4,.06,.34,.18,.3); quiff.rotation.z=-.22;
 mesh(sphere,hair,0,2.71,.08,.28,.16,.25);
 mesh(sphere,skin,0,2.91,.33,.075,.11,.065);
 for(const side of [-1,1]) {
  mesh(sphere,skin,side*.36,2.95,0,.065,.115,.065);
  mesh(new T.BoxGeometry(.29,.15,.055),glass,side*.17,3.04,.313);
  mesh(new T.BoxGeometry(.025,.035,.34),metal,side*.325,3.06,.15);
 }
 mesh(new T.BoxGeometry(.08,.025,.045),metal,0,3.05,.355);
 mesh(new T.CylinderGeometry(.4,.3,.93,32),jacket,0,2.02,0,1,.98,.68);
 mesh(sphere,trousers,0,1.43,0,.31,.25,.21);
 for(const side of [-1,1]) {
  const lapel=mesh(new T.BoxGeometry(.16,.3,.035),jacket,side*.13,2.38,.24); lapel.rotation.z=side*.35;
  mesh(new T.CapsuleGeometry(.14,.72,8,20),trousers,side*.19,.8,0);
  mesh(sphere,jacket,side*.19,.2,.1,.18,.12,.32);
  mesh(new T.BoxGeometry(.33,.045,.55),metal,side*.19,.105,.09);
 }
 const arms=[];
 for(const side of [-1,1]) {
  const arm=new T.Group(); arm.position.set(side*.39,2.35,0); avatar.add(arm);
  mesh(new T.CapsuleGeometry(.12,.55,8,20),jacket,0,-.36,0,1,1,1,arm);
  mesh(new T.CapsuleGeometry(.095,.25,8,20),skin,0,-.83,.025,1,1,1,arm);
  mesh(sphere,skin,0,-1.04,.025,.11,.14,.09,arm); arm.rotation.z=side*.13; arms.push(arm);
 }
 for(let i=0;i<4;i++) mesh(sphere,metal,0,2.29-i*.16,.277,.018,.018,.012);
 const podium=mesh(new T.CylinderGeometry(.95,1,.08,64),jacket,0,.015,0,1,1,1,scene);
 const ring = mesh(new T.TorusGeometry(.96,.014,8,80),new T.MeshBasicMaterial({color:0xc8f494}),0,.065,0,1,1,1,scene); ring.rotation.x=Math.PI/2;
 host.append(renderer.domElement); host.classList.add('has-avatar');
 renderer.domElement.setAttribute('aria-hidden','true');
 let visible=true, frame=0;
 function render() {
  frame=0; if(!visible || document.hidden) return;
  const positions=chapters.map(c=>c.getBoundingClientRect().top);
  const focus=innerHeight*.45;
  let index=0; for(let i=1;i<positions.length;i++) if(positions[i]<focus) index=i;
  document.querySelector('.stage-index').textContent=`0${index+1} / 04`;
  const progress=T.MathUtils.clamp((focus-positions[0])/(positions.at(-1)-positions[0]),0,1);
  if(!paused) {
   avatar.rotation.y=-.3+progress*Math.PI*2;
   avatar.position.x=Math.sin(progress*Math.PI*2)*.22;
   avatar.position.y=Math.sin(progress*Math.PI)*.09;
   arms[0].rotation.x=Math.sin(progress*Math.PI*2)*.24;
   arms[1].rotation.z=.13-Math.sin(progress*Math.PI)*.35;
  }
  renderer.render(scene,camera);
 }
 draw=()=>{ if(!frame) frame=requestAnimationFrame(render); };
 const resize=new ResizeObserver(()=>{
  const w=host.clientWidth,h=host.clientHeight; if(!w||!h) return;
  renderer.setSize(w,h,false); camera.aspect=w/h; camera.updateProjectionMatrix(); draw();
 }); resize.observe(host);
 new IntersectionObserver(entries=>{visible=entries[0].isIntersecting; if(visible) draw();}).observe(story);
 addEventListener('scroll',draw,{passive:true});
 document.addEventListener('visibilitychange',draw);
 renderer.domElement.addEventListener('webglcontextlost',event=>{event.preventDefault(); host.classList.remove('has-avatar'); toggle.hidden=true;});
 renderer.domElement.addEventListener('webglcontextrestored',()=>{host.classList.add('has-avatar');toggle.hidden=false;draw();});
 draw();
} catch(error) {
 // The portrait and every chapter remain available without WebGL.
 toggle.hidden=true;
 console.warn('3D view unavailable; showing portrait.',error.message);
}
