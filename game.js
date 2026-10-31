let THREE = null;

const $ = (id) => document.getElementById(id);
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const lerp = (a, b, t) => a + (b - a) * t;
const rand = (a, b) => a + Math.random() * (b - a);
const V3 = (x=0,y=0,z=0) => new THREE.Vector3(x,y,z);

const WEAPONS = [
  {id:'pistol',name:'SERVICE PISTOL',short:'Pistol',type:'PISTOL',kind:'SIDEARM',icon:'⌁',cost:0,damage:34,mag:12,reserve:84,rate:.28,reload:1.25,spread:.006,range:75,auto:false,recoil:.035,desc:'A dependable semi-automatic sidearm. Accurate, quick to draw.'},
  {id:'revolver',name:'MORROW .44',short:'Morrow .44',type:'HEAVY REVOLVER',kind:'SIDEARM',icon:'◉',cost:420,damage:68,mag:6,reserve:48,rate:.43,reload:1.8,spread:.0045,range:82,auto:false,recoil:.105,desc:'Six hard-hitting rounds with deliberate, accurate follow-up fire.'},
  {id:'carbine',name:'VX-9 CARBINE',short:'Carbine',type:'ASSAULT RIFLE',kind:'RIFLE',icon:'╾',cost:560,damage:25,mag:30,reserve:150,rate:.105,reload:1.65,spread:.014,range:100,auto:true,recoil:.055,desc:'A modular all-rounder with a controllable full-auto action.'},
  {id:'burst',name:'VXR-3 BURST',short:'VXR-3',type:'BURST RIFLE',kind:'RIFLE',icon:'≋',cost:840,damage:31,mag:27,reserve:135,rate:.085,reload:1.7,spread:.009,range:115,auto:false,burst:true,recoil:.045,desc:'Crisp three-round bursts reward a steady aim at mid range.'},
  {id:'smg',name:'KITE-45 SMG',short:'Kite-45',type:'SUBMACHINE GUN',kind:'SMG',icon:'⌁',cost:780,damage:18,mag:36,reserve:180,rate:.072,reload:1.45,spread:.023,range:62,auto:true,recoil:.035,desc:'Compact, exceptionally fast, and built for close-quarters work.'},
  {id:'shotgun',name:'BREACH-12',short:'Breach-12',type:'COMBAT SHOTGUN',kind:'SHOTGUN',icon:'≋',cost:980,damage:12,mag:8,reserve:48,rate:.66,reload:1.85,spread:.075,range:31,auto:false,recoil:.14,pellets:8,desc:'Eight-pellet buckshot. Devastating at room-clearing distance.'},
  {id:'dmr',name:'SABLE DMR',short:'Sable DMR',type:'MARKSMAN RIFLE',kind:'RIFLE',icon:'⟿',cost:1120,damage:57,mag:14,reserve:84,rate:.34,reload:1.8,spread:.0035,range:145,auto:false,recoil:.085,desc:'A fast, hard-hitting semi-auto for precise medium-to-long shots.'},
  {id:'sniper',name:'LONGSHOT M7',short:'Longshot',type:'PRECISION RIFLE',kind:'SNIPER',icon:'⟿',cost:1320,damage:102,mag:5,reserve:35,rate:.9,reload:2.15,spread:.0015,range:180,auto:false,recoil:.19,desc:'High-velocity precision rifle. Hold right click to steady the optic.'},
  {id:'lmg',name:'TITAN LMG',short:'Titan',type:'LIGHT MACHINE GUN',kind:'HEAVY',icon:'╾',cost:1540,damage:23,mag:60,reserve:240,rate:.095,reload:2.55,spread:.022,range:110,auto:true,recoil:.075,desc:'Belt-fed sustained fire with a deep ammunition reserve.'},
  {id:'launcher',name:'ATLAS-6 LAUNCHER',short:'Atlas-6',type:'GRENADE LAUNCHER',kind:'HEAVY',icon:'◉',cost:1760,damage:175,mag:1,reserve:12,rate:1.25,reload:2.2,spread:.007,range:105,auto:false,recoil:.24,explosive:true,desc:'Single-shot explosive rounds deal heavy damage across a small area.'}
];
const MISSIONS = [
  {id:1,title:'DUST TO DUST',subtitle:'THE GLASS FLATS',theme:'desert',type:'eliminate',goal:7,reward:360,enemies:['scout','rifle'],brief:'A raider cell has breached the perimeter. Clear the flats before the next convoy arrives.'},
  {id:2,title:'HOLD THE LINE',subtitle:'RELAY STATION K-4',theme:'industrial',type:'defend',goal:42,reward:520,enemies:['scout','rifle','heavy'],brief:'The relay is the only comms link left in the sector. Hold the marked zone until the uplink completes.'},
  {id:3,title:'NO SAFE ROUTE',subtitle:'FROSTLINE PASS',theme:'arctic',type:'checkpoint',goal:1,reward:680,enemies:['scout','rifle','sniper'],brief:'Push through the pass and reach the extraction beacon. Expect fire from the ridge.'},
  {id:4,title:'THE IRON WITNESS',subtitle:'WRECKSITE 09',theme:'wreck',type:'boss',goal:1,reward:1050,enemies:['rifle','heavy','sniper','boss'],brief:'A command unit is directing the remaining hostiles. Find it and end the operation.'},
  {id:5,title:'UNDER THE CANOPY',subtitle:'BLACK CANOPY',theme:'jungle',type:'eliminate',goal:12,reward:1240,enemies:['scout','rifle','heavy'],brief:'A raider column is using the dense canopy to hide its advance. Break through and clear the route.'},
  {id:6,title:'ASHES OF K-9',subtitle:'ASH QUARTER',theme:'urban',type:'defend',goal:50,reward:1480,enemies:['rifle','heavy','sniper'],brief:'Hold the evacuation signal in the abandoned quarter until the last civilians are out.'}
];
const THEMES = {
  desert:{name:'GLASS FLATS',ground:'#73614a',ground2:'#a18a64',sky:'#9f694c',fog:0x8f644c,accent:'#d5bd7b',light:0xffc690,rock:'#665648',metal:'#4d5149'},
  industrial:{name:'RELAY K-4',ground:'#444b48',ground2:'#60655d',sky:'#5c716d',fog:0x506361,accent:'#b8c879',light:0xaac9a5,rock:'#353d3d',metal:'#384744'},
  arctic:{name:'FROSTLINE PASS',ground:'#879494',ground2:'#bdc8bf',sky:'#718997',fog:0x7c909a,accent:'#b9e6df',light:0xb3d9ed,rock:'#667779',metal:'#44555b'},
  wreck:{name:'WRECKSITE 09',ground:'#3e3a38',ground2:'#655047',sky:'#765246',fog:0x593f38,accent:'#e2a566',light:0xffa86d,rock:'#322f2e',metal:'#4a3b37'},
  jungle:{name:'BLACK CANOPY',ground:'#3d493c',ground2:'#596148',sky:'#536a5d',fog:0x4b6359,accent:'#d0be69',light:0xb7d18c,rock:'#343e32',metal:'#39443a'},
  urban:{name:'ASH QUARTER',ground:'#48413c',ground2:'#70645a',sky:'#786e66',fog:0x625951,accent:'#e0ad72',light:0xf2b782,rock:'#393735',metal:'#41403d'},
  range:{name:'DUSTLINE',ground:'#655848',ground2:'#8c7858',sky:'#776253',fog:0x66564a,accent:'#d7ef70',light:0xffc991,rock:'#514b40',metal:'#424941'}
};
const SAVE_KEY='outpost-zero-save-v1';
const defaults={credits:1160,unlockedMission:1,ownedWeapons:['pistol'],quickSlots:['pistol'],equipped:'pistol',upgrades:{},armorLevel:0,medkits:0,skin:'standard',stats:{kills:0,operations:0},settings:{sensitivity:1,volume:.45,shake:true,reducedMotion:false,crouchToggle:false,aimToggle:false,invertY:false,difficulty:'recruit'}};
let save;
try{save={...structuredClone(defaults),...JSON.parse(localStorage.getItem(SAVE_KEY)||'{}')};}catch{save=structuredClone(defaults)}
save.stats={...defaults.stats,...save.stats};save.settings={...defaults.settings,...save.settings};save.ownedWeapons=Array.isArray(save.ownedWeapons)?save.ownedWeapons:['pistol'];if(!save.ownedWeapons.includes('pistol'))save.ownedWeapons.unshift('pistol');save.upgrades=save.upgrades||{};{const slots=Array.isArray(save.quickSlots)?save.quickSlots:[];const used=new Set();save.quickSlots=Array.from({length:6},(_,i)=>{const id=slots[i];if(id&&save.ownedWeapons.includes(id)&&!used.has(id)){used.add(id);return id}return null});if(!save.quickSlots[0])save.quickSlots[0]='pistol'}
function persist(){localStorage.setItem(SAVE_KEY,JSON.stringify(save));updateCredits()}

let scene,camera,renderer,clock,worldGroup,weaponRoot,weaponFlash,checkpointMesh,defendRing,dustField=null;
let enemies=[],tracers=[],particles=[],coverProps=[],obstacles=[];
let active=false,paused=false,runMode=null,mission=null,currentTheme='range',selectedWeapon=WEAPONS[0],ammo={},reloading=false,reloadUntil=0,shotCooldown=0,mouseDown=false,aiming=false;
let health=100,armor=50,playerPos=null,velocity=null,yaw=-Math.PI/2,pitch=0,onGround=true,crouching=false,crouchToggled=false,cameraHeight=1.66,sprinting=false,damageCooldown=0;
let elapsed=0,runKills=0,runShots=0,runHits=0,runReward=0,objectiveProgress=0,missionTimer=0,wave=0,waveRemaining=0,spawnQueue=0,spawnClock=0,enemyCap=8,intermission=false,burstRemaining=0;
let keys={},lastToastTimer=0,lastHitTimer=0,runStart=0,wasLocked=false,armoryReturn='main',armoryTab='loadout',audioContext=null,masterGain=null,screenShake=0,markerPulse=0;
let raycaster=null;
const enemyMeshMaterial={};

function initialize(){
  playerPos=V3(-30,0,0);velocity=V3();raycaster=new THREE.Raycaster();
  scene=new THREE.Scene();scene.background=new THREE.Color(0x171c19);scene.fog=new THREE.FogExp2(0x74634f,.0095);
  camera=new THREE.PerspectiveCamera(74,innerWidth/innerHeight,.08,260);camera.position.set(-30,1.7,0);scene.add(camera);
  renderer=new THREE.WebGLRenderer({canvas:$('gameCanvas'),antialias:true,powerPreference:'high-performance'});renderer.setPixelRatio(Math.min(devicePixelRatio,1.7));renderer.setSize(innerWidth,innerHeight);renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.08;
  clock=new THREE.Clock();
  scene.add(new THREE.HemisphereLight(0xc9d9d0,0x514234,1.2));
  const sun=new THREE.DirectionalLight(0xffd9b0,2.4);sun.position.set(-28,47,31);sun.castShadow=true;sun.shadow.mapSize.set(1536,1536);sun.shadow.camera.left=-72;sun.shadow.camera.right=72;sun.shadow.camera.top=72;sun.shadow.camera.bottom=-72;sun.shadow.bias=-.00035;scene.add(sun);
  const fill=new THREE.DirectionalLight(0x8bacb2,.55);fill.position.set(28,17,-30);scene.add(fill);
  buildWorld('range',true);buildWeaponModel(WEAPONS[0]);applySettings();updateWeaponHUD();
  addEventListener('resize',onResize);addEventListener('keydown',onKeyDown);addEventListener('keyup',e=>keys[e.code]=false);addEventListener('mousemove',onMouseMove);addEventListener('mousedown',onMouseDown);addEventListener('mouseup',onMouseUp);addEventListener('wheel',onWheel,{passive:false});addEventListener('blur',resetInput);document.addEventListener('visibilitychange',()=>{if(document.hidden)resetInput()});document.addEventListener('pointerlockchange',onLockChange);$('gameCanvas').addEventListener('click',onCanvasClick);
  animate();
}

function textureCanvas(type,colorA,colorB){
  const canvas=document.createElement('canvas');canvas.width=canvas.height=512;const c=canvas.getContext('2d');c.fillStyle=colorA;c.fillRect(0,0,512,512);
  let seed=type==='sand'?29:type==='metal'?67:91;const random=()=>{seed=(seed*9301+49297)%233280;return seed/233280};
  if(type==='sand'){
    for(let i=0;i<18000;i++){const x=random()*512,y=random()*512,r=random()*1.5+.25;c.globalAlpha=random()*.24;c.fillStyle=random()>.48?colorB:'#e0d1aa';c.beginPath();c.arc(x,y,r,0,Math.PI*2);c.fill()}
    c.globalAlpha=.08;for(let i=0;i<18;i++){c.strokeStyle='#211d17';c.lineWidth=2;c.beginPath();let y=random()*512;c.moveTo(0,y);for(let x=0;x<512;x+=28)c.lineTo(x,y+=rand(-1.6,1.6));c.stroke()}
  }else if(type==='metal'){
    for(let i=0;i<90;i++){const x=random()*512,y=random()*512,w=random()*110+8,h=random()*2+1;c.globalAlpha=random()*.18;c.fillStyle=random()>.5?colorB:'#e2e3d5';c.fillRect(x,y,w,h)}
    c.globalAlpha=.18;for(let x=18;x<512;x+=64)for(let y=18;y<512;y+=64){c.fillStyle='#0d1513';c.beginPath();c.arc(x,y,2,0,Math.PI*2);c.fill()}
  }else{
    c.strokeStyle=colorB;c.lineWidth=2;c.globalAlpha=.22;for(let i=0;i<38;i++){c.beginPath();c.moveTo(random()*512,random()*512);c.lineTo(random()*512,random()*512);c.stroke()}
  }
  c.globalAlpha=1;const tex=new THREE.CanvasTexture(canvas);tex.colorSpace=THREE.SRGBColorSpace;tex.wrapS=tex.wrapT=THREE.RepeatWrapping;tex.anisotropy=4;return tex;
}
function mat(color,rough=.75,metalness=.1,extra={}){return new THREE.MeshStandardMaterial({color,roughness:rough,metalness,...extra})}
function box(parent,x,y,z,w,h,d,material,cast=true){const mesh=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),material);mesh.position.set(x,y,z);mesh.castShadow=cast;mesh.receiveShadow=true;parent.add(mesh);return mesh}
function cylinder(parent,x,y,z,r1,r2,h,material,segments=12){const m=new THREE.Mesh(new THREE.CylinderGeometry(r1,r2,h,segments),material);m.position.set(x,y,z);m.castShadow=true;m.receiveShadow=true;parent.add(m);return m}
function buildWorld(themeName,menu=false){
  if(worldGroup){scene.remove(worldGroup);disposeTree(worldGroup)}
  worldGroup=new THREE.Group();scene.add(worldGroup);coverProps=[];obstacles=[];checkpointMesh=null;defendRing=null;
  const t=THEMES[themeName]||THEMES.range;const groundHex=new THREE.Color(t.ground);const groundTex=textureCanvas(themeName==='industrial'||themeName==='wreck'?'metal':'sand',t.ground,t.ground2);groundTex.repeat.set(28,28);
  const sky=new THREE.Mesh(new THREE.SphereGeometry(190,36,24),new THREE.ShaderMaterial({side:THREE.BackSide,depthWrite:false,uniforms:{topColor:{value:new THREE.Color(t.sky).multiplyScalar(.46)},horizonColor:{value:new THREE.Color(t.sky).multiplyScalar(1.2)},sunsetColor:{value:new THREE.Color(t.accent).multiplyScalar(.52)}},vertexShader:'varying vec3 vSky; void main(){vSky=position;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);}',fragmentShader:'uniform vec3 topColor;uniform vec3 horizonColor;uniform vec3 sunsetColor;varying vec3 vSky;void main(){float h=normalize(vSky).y;float g=smoothstep(-0.12,0.72,h);vec3 c=mix(horizonColor,topColor,g);float band=exp(-pow((h+0.02)*5.2,2.0));c=mix(c,sunsetColor,band*0.42);gl_FragColor=vec4(c,1.0);}'}));sky.renderOrder=-10;worldGroup.add(sky);
  const ground=new THREE.Mesh(new THREE.PlaneGeometry(210,210),new THREE.MeshStandardMaterial({map:groundTex,color:0xffffff,roughness:.95}));ground.rotation.x=-Math.PI/2;ground.position.y=-.09;ground.receiveShadow=true;worldGroup.add(ground);
  scene.background=new THREE.Color(t.sky);scene.fog.color.set(t.fog);scene.fog.density=themeName==='arctic'?.011:.009;
  const ambientAccent=new THREE.PointLight(t.light,55,100,2);ambientAccent.position.set(2,13,-6);worldGroup.add(ambientAccent);
  const sunDisk=new THREE.Mesh(new THREE.SphereGeometry(4.2,20,14),new THREE.MeshBasicMaterial({color:t.light,toneMapped:false}));sunDisk.position.set(16,45,38);worldGroup.add(sunDisk);const halo=new THREE.Mesh(new THREE.SphereGeometry(7.5,20,14),new THREE.MeshBasicMaterial({color:t.accent,transparent:true,opacity:.12,depthWrite:false}));halo.position.copy(sunDisk.position);worldGroup.add(halo);
  const rockMat=mat(t.rock,.94,0),metalMat=mat(t.metal,.58,.42),trimMat=mat(t.accent,.45,.35,{emissive:new THREE.Color(t.accent),emissiveIntensity:.14});
  // Layered angular ridges create a distant horizon around the combat space.
  for(let side=0;side<4;side++){
    const count=20;const verts=[],indices=[];const axis=side%2===0?'x':'z';
    for(let i=0;i<=count;i++){const p=-104+i*10.4;const peak=rand(12,25);const x=axis==='x'?p:(side===1?104:-104);const z=axis==='z'?p:(side===0?104:-104);verts.push(x,0,z);verts.push(x+(axis==='z'?rand(-4,4):0),peak,z+(axis==='x'?rand(-4,4):0));}
    for(let i=0;i<count;i++){let a=i*2;indices.push(a,a+1,a+2,a+1,a+3,a+2)}
    const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(verts,3));g.setIndex(indices);g.computeVertexNormals();const ridge=new THREE.Mesh(g,new THREE.MeshStandardMaterial({color:side%2?t.rock:t.ground2,roughness:1,side:THREE.DoubleSide}));ridge.position.y=-.1;worldGroup.add(ridge);
  }
  // Sector perimeter pylons and low concrete revetments.
  const perimeterMat=mat(themeName==='arctic'?'#59686a':'#343c37',.9,.12);
  for(let i=0;i<18;i++){const a=i*Math.PI*2/18;const x=Math.cos(a)*52,z=Math.sin(a)*52;const py=cylinder(worldGroup,x,1.6,z,.42,.68,3.2,metalMat,8);py.rotation.z=rand(-.08,.08);cylinder(worldGroup,x,3.25,z,.54,.54,.12,trimMat,8);const lamp=new THREE.PointLight(t.light,3,7);lamp.position.set(x,3.5,z);worldGroup.add(lamp);}
  // Shielded equipment huts, octagonal antenna structures, and angled barricades.
  for(let i=0;i<7;i++){
    const a=i/7*Math.PI*2+.18;const x=Math.cos(a)*rand(22,39),z=Math.sin(a)*rand(22,39);const rotation=rand(0,Math.PI*2);const hut=new THREE.Group();hut.position.set(x,0,z);hut.rotation.y=rotation;worldGroup.add(hut);
    const width=rand(5,8),depth=rand(4,7),height=rand(2.6,3.8);
    box(hut,0,height/2,0,width,height,depth,metalMat);const roof=new THREE.Mesh(new THREE.CylinderGeometry(width*.72,width*.82,.55,6,1),perimeterMat);roof.position.y=height+.2;roof.rotation.y=Math.PI/6;roof.castShadow=true;hut.add(roof);
    box(hut,0,.35,depth/2+.035,width*.23,.7,.09,trimMat,false);
    for(let s of [-1,1]){box(hut,s*width*.43,height*.45,0,.12,height*.72,depth+.16,trimMat,false)}
    for(let k=0;k<3;k++)box(hut,0,height*.38,depth/2+.09,width*.19,.1,.1,mat('#18231f',.4,.2,{emissive:new THREE.Color(t.accent),emissiveIntensity:.5}),false);
    obstacles.push({x,z,r:Math.max(width,depth)*.63});
  }
  for(let i=0;i<15;i++){
    const x=rand(-41,41),z=rand(-39,39);if(Math.hypot(x+30,z)>13||Math.hypot(x,z)<12)continue;
    if(Math.random()<.55){makeBarricade(x,z,rand(2.6,4.2),rand(1.3,2),rand(1.1,1.8),perimeterMat,trimMat);}
    else{makeDrum(x,z,metalMat,trimMat);}
  }
  // A distinctive comms array anchors the central installation.
  const tower=new THREE.Group();tower.position.set(5,0,-7);worldGroup.add(tower);
  const towerBase=new THREE.Mesh(new THREE.CylinderGeometry(3.1,3.7,1.1,8),perimeterMat);towerBase.position.y=.55;tower.add(towerBase);
  const mast=cylinder(tower,0,7,0,.16,.32,13,metalMat,10);
  for(let y=3;y<12;y+=2.5){const rad=.25+(y-3)*.05;const ring=new THREE.Mesh(new THREE.TorusGeometry(rad,.035,5,12),trimMat);ring.rotation.x=Math.PI/2;ring.position.y=y;tower.add(ring)}
  for(let i=0;i<6;i++){const p=new THREE.Mesh(new THREE.BoxGeometry(.12,5,.12),metalMat);p.position.set(Math.cos(i*Math.PI/3)*1.5,4,Math.sin(i*Math.PI/3)*1.5);tower.add(p)}
  const dish=new THREE.Mesh(new THREE.SphereGeometry(1.45,12,8,0,Math.PI*2,0,Math.PI*.5),mat('#a9b9a6',.42,.55,{side:THREE.DoubleSide}));dish.position.set(-1,8,1);dish.rotation.x=Math.PI/2;tower.add(dish);
  const beacon=cylinder(worldGroup,5,12,-7,.11,.11,.08,trimMat,10);const beaconLight=new THREE.PointLight(t.light,18,28);beaconLight.position.set(5,13,-7);worldGroup.add(beaconLight);
  // Angular stone outcrops and small wreck fragments break up the horizon.
  for(let i=0;i<48;i++){
    const angle=rand(0,Math.PI*2),radius=rand(55,88),x=Math.cos(angle)*radius,z=Math.sin(angle)*radius;const rock=new THREE.Mesh(new THREE.IcosahedronGeometry(rand(1.2,4),1),rockMat);rock.position.set(x,rand(.2,2),z);rock.scale.set(rand(.65,1.6),rand(.55,1.8),rand(.7,1.7));rock.rotation.set(rand(0,1),rand(0,Math.PI),rand(0,1));rock.castShadow=true;worldGroup.add(rock);
  }
  if(themeName==='jungle')buildJungleSet();
  if(themeName==='urban')buildUrbanSet();
  buildDust(t.accent);
  if(themeName==='wreck')for(let i=0;i<8;i++){const wreck=new THREE.Group();wreck.position.set(rand(-45,45),rand(.8,2.2),rand(-42,42));wreck.rotation.set(rand(-.3,.3),rand(0,Math.PI),rand(-.55,.55));worldGroup.add(wreck);box(wreck,0,0,0,rand(2,7),.5,rand(1,2),perimeterMat);const strut=cylinder(wreck,0,1,0,.12,.16,2,metalMat,7);strut.rotation.z=rand(-.5,.5)}
  // Fine range markings and a road leading to the comms array.
  const road=new THREE.Mesh(new THREE.PlaneGeometry(5,88),new THREE.MeshStandardMaterial({color:themeName==='arctic'?'#a9b5af':'#a78d64',roughness:.9,transparent:true,opacity:.32}));road.rotation.x=-Math.PI/2;road.rotation.z=.21;road.position.set(-11,.006,0);worldGroup.add(road);
  for(let side of [-1,1])for(let i=0;i<9;i++){const dash=box(worldGroup,-11+side*2.75,.008,-39+i*10,.07,.02,4,trimMat,false);dash.rotation.y=.21;}
  if(menu){for(let i=0;i<8;i++){const lamp=new THREE.PointLight(t.accent,2,12);lamp.position.set(rand(-30,30),rand(3,10),rand(-30,30));worldGroup.add(lamp)}}
}
function buildJungleSet(){
  const bark=mat('#443a2b',.96),leafMats=['#354933','#40583b','#506545','#63704a'].map(c=>mat(c,.98)),stone=mat('#454a3a',.9);
  const leafGeo=new THREE.IcosahedronGeometry(2.6,1);
  for(let i=0;i<30;i++){
    const a=rand(0,Math.PI*2),r=rand(29,77),x=Math.cos(a)*r,z=Math.sin(a)*r;
    if(Math.hypot(x+30,z)<15)continue;
    const h=rand(6,11),trunk=cylinder(worldGroup,x,h/2,z,rand(.24,.36),rand(.38,.55),h,bark,8);trunk.rotation.z=rand(-.08,.08);
    for(let b=0;b<3;b++){const branch=cylinder(worldGroup,x+rand(-.8,.8),h*.68+b*.35,z+rand(-.8,.8),.09,.18,rand(2.3,3.7),bark,6);branch.rotation.z=rand(-.55,.55);branch.rotation.x=rand(-.5,.5)}
    for(let c=0;c<5;c++){const crown=new THREE.Mesh(leafGeo,leafMats[(i+c)%leafMats.length]);crown.position.set(x+rand(-2.3,2.3),h+rand(-.3,2.7),z+rand(-2.2,2.2));crown.scale.set(rand(.75,1.5),rand(.65,1.25),rand(.75,1.4));crown.rotation.set(rand(-.3,.3),rand(0,6),rand(-.3,.3));crown.castShadow=false;worldGroup.add(crown)}
    if(r<52)obstacles.push({x,z,r:1.1});
  }
  for(let i=0;i<34;i++){const a=rand(0,Math.PI*2),r=rand(18,50),x=Math.cos(a)*r,z=Math.sin(a)*r;if(Math.hypot(x+30,z)<9)continue;const shrub=new THREE.Mesh(new THREE.IcosahedronGeometry(rand(.65,1.35),1),leafMats[i%leafMats.length]);shrub.position.set(x,.65,z);shrub.scale.set(1.5,.8,1.25);shrub.castShadow=false;worldGroup.add(shrub)}
  for(let i=0;i<7;i++){const a=i/7*Math.PI*2,x=Math.cos(a)*rand(35,45),z=Math.sin(a)*rand(35,45);const boulder=new THREE.Mesh(new THREE.IcosahedronGeometry(rand(1.2,2.4),1),stone);boulder.position.set(x,.7,z);boulder.scale.set(1.6,.9,1.2);boulder.castShadow=true;worldGroup.add(boulder);obstacles.push({x,z,r:1.5})}
}
function buildUrbanSet(){
  const concrete=mat('#514c47',.9,.12),edge=mat('#6d665c',.85,.18),glass=mat('#8eaa9b',.24,.42,{emissive:0x273c34,emissiveIntensity:.45}),litGlass=mat('#d9a96e',.25,.3,{emissive:0x986b3d,emissiveIntensity:.65});
  for(let i=0;i<12;i++){
    const a=i/12*Math.PI*2+rand(-.12,.12),r=rand(54,78),x=Math.cos(a)*r,z=Math.sin(a)*r,w=rand(7,12),d=rand(6,10),h=rand(10,24);const front=Math.atan2(x,z);const building=new THREE.Group();building.position.set(x,0,z);building.rotation.y=front;worldGroup.add(building);
    box(building,0,h/2,0,w,h,d,concrete);box(building,0,h+.12,0,w+.45,.25,d+.45,edge);
    for(let floor=0;floor<Math.floor(h/3);floor++){
      const y=1.25+floor*2.8;if(y>h-.8)continue;
      for(let col=0;col<3;col++){const wx=(col-1)*w*.29;const winMat=Math.random()<.2?litGlass:glass;box(building,wx,y,-d/2-.035,w*.16,1.18,.045,winMat,false)}
      box(building,0,y-1.42,0,w+.08,.12,d+.08,edge,false);
    }
    box(building,w*.3,h+.65,-d*.22,.55,1.05,.55,mat('#373532',.75,.2));
    if(r<62)obstacles.push({x,z,r:Math.max(w,d)*.62});
  }
  // Broken shopfronts make a low, navigable urban edge around the objective space.
  for(let i=0;i<8;i++){const a=i/8*Math.PI*2,x=Math.cos(a)*rand(34,44),z=Math.sin(a)*rand(34,44);makeBarricade(x,z,rand(3,5),rand(1.8,2.8),rand(1,1.6),concrete,edge)}
}
function buildDust(color){
  const c=document.createElement('canvas');c.width=c.height=32;const ctx=c.getContext('2d'),grad=ctx.createRadialGradient(16,16,1,16,16,15);grad.addColorStop(0,'rgba(255,255,255,1)');grad.addColorStop(1,'rgba(255,255,255,0)');ctx.fillStyle=grad;ctx.fillRect(0,0,32,32);const map=new THREE.CanvasTexture(c);
  const count=380,positions=new Float32Array(count*3);for(let i=0;i<count;i++){const a=rand(0,Math.PI*2),r=rand(4,57);positions[i*3]=Math.cos(a)*r;positions[i*3+1]=rand(.5,9);positions[i*3+2]=Math.sin(a)*r}
  const geo=new THREE.BufferGeometry();geo.setAttribute('position',new THREE.BufferAttribute(positions,3));dustField=new THREE.Points(geo,new THREE.PointsMaterial({color, map, size:.22, transparent:true, opacity:.22, depthWrite:false, sizeAttenuation:true}));dustField.frustumCulled=false;worldGroup.add(dustField);
}
function makeBarricade(x,z,w,h,d,baseMat,accentMat){
  const shape=new THREE.Shape();shape.moveTo(-w/2,0);shape.lineTo(-w/2,h*.62);shape.lineTo(-w*.38,h);shape.lineTo(w*.38,h);shape.lineTo(w/2,h*.62);shape.lineTo(w/2,0);shape.closePath();
  const geo=new THREE.ExtrudeGeometry(shape,{depth:d,bevelEnabled:true,bevelSegments:1,steps:1,bevelSize:.06,bevelThickness:.05});geo.translate(0,0,-d/2);
  const mesh=new THREE.Mesh(geo,baseMat);mesh.position.set(x,0,z);mesh.rotation.y=rand(0,Math.PI);mesh.castShadow=true;mesh.receiveShadow=true;worldGroup.add(mesh);
  const band=box(worldGroup,x,h*.36,z,w*.92,.12,d+.16,accentMat,false);band.rotation.y=mesh.rotation.y;coverProps.push({x,z,w,d,h,rotation:mesh.rotation.y});obstacles.push({x,z,r:Math.max(w,d)*.55});
}
function makeDrum(x,z,base,accent){const g=new THREE.Group();g.position.set(x,0,z);worldGroup.add(g);cylinder(g,0,.62,0,.48,.52,1.24,base,12);for(let y of [.22,.95])cylinder(g,0,y,0,.51,.51,.09,accent,12);coverProps.push({x,z,w:1,d:1,h:1.2});obstacles.push({x,z,r:.65});}
function disposeTree(root){root.traverse(o=>{if(o.geometry)o.geometry.dispose();if(o.material){if(Array.isArray(o.material))o.material.forEach(m=>m.dispose());else o.material.dispose()}})}

function weaponMaterials(id){const metal=mat('#313b37',.38,.7),poly=mat(id==='sniper'?'#484e45':'#333a35',.52,.25),accent=mat(save.skin==='cinder'?'#bc7247':'#aab28e',.38,.45),glass=mat('#97c8ba',.15,.6,{transparent:true,opacity:.55,emissive:0x284b43,emissiveIntensity:.5});return{metal,poly,accent,glass}}
function buildWeaponModel(data){
  if(weaponRoot){camera.remove(weaponRoot);disposeTree(weaponRoot)}
  weaponRoot=new THREE.Group();weaponRoot.position.set(.31,-.3,-.53);weaponRoot.rotation.set(-.025,-.025,0);camera.add(weaponRoot);const m=weaponMaterials(data.id);const long=data.id==='sniper'||data.id==='lmg'||data.id==='dmr'?1.18:data.id==='launcher'?1.28:data.id==='shotgun'?1.03:data.id==='smg'?.64:.82;
  const body=box(weaponRoot,0,0,0,.18,.16,long,m.poly);body.position.z=-.13;
  const upper=box(weaponRoot,0,.072,-.16,.135,.045,long*.78,m.metal);const barrel=cylinder(weaponRoot,0,.012,-.13-long*.59,.036,.046,long*.72,m.metal,10);barrel.rotation.x=Math.PI/2;
  const muzzle=cylinder(weaponRoot,0,.012,-.13-long*.95,.061,.053,.12,m.accent,10);muzzle.rotation.x=Math.PI/2;
  if(data.id==='launcher'){const tube=cylinder(weaponRoot,0,.035,-.26,.13,.13,long*.94,m.poly,12);tube.rotation.x=Math.PI/2;const frontRing=cylinder(weaponRoot,0,.035,-.26-long*.48,.16,.16,.12,m.accent,12);frontRing.rotation.x=Math.PI/2;const rearRing=cylinder(weaponRoot,0,.035,-.26+long*.46,.15,.15,.11,m.metal,12);rearRing.rotation.x=Math.PI/2;box(weaponRoot,0,.19,-.27,.08,.12,.35,m.metal);box(weaponRoot,.13,-.08,-.12,.1,.2,.17,m.accent)}
  const grip=box(weaponRoot,0,-.14,.06,.105,.27,.13,m.metal);grip.rotation.x=-.19;grip.rotation.z=-.12;
  if(data.id!=='pistol'&&data.id!=='revolver'){
    const mag=box(weaponRoot,0,-.17,-.08,data.id==='lmg'?.12:.09,data.id==='lmg'?.32:.24,data.id==='lmg'?.27:.17,m.accent);mag.rotation.x=-.13;
    box(weaponRoot,0,.125,-.1,.08,.035,long*.68,m.metal);
    for(let i=0;i<5;i++)box(weaponRoot,0,.15,-.36+i*.12,.027,.035,.035,m.accent,false);
    if(data.id==='sniper'||data.id==='dmr'){const scope=cylinder(weaponRoot,0,.22,-.22,.09,.09,.35,m.metal,12);scope.rotation.x=Math.PI/2;const lens=cylinder(weaponRoot,0,.22,-.42,.067,.067,.04,m.glass,12);lens.rotation.x=Math.PI/2;box(weaponRoot,0,.285,-.19,.08,.09,.11,m.metal)}
    if(data.id==='lmg'){const stock=box(weaponRoot,0,-.015,.32,.15,.12,.43,m.metal);stock.rotation.x=.04;for(let i=0;i<5;i++)box(weaponRoot,.09,-.06,-.48+i*.09,.025,.055,.06,m.accent)}
    if(data.id==='shotgun'){const pump=box(weaponRoot,0,-.09,-.47,.15,.095,.32,m.accent);pump.position.y=-.11}
    if(data.id==='carbine'){const stock=box(weaponRoot,0,-.005,.28,.14,.115,.38,m.metal);stock.rotation.x=.04;box(weaponRoot,.11,.015,-.23,.065,.08,.24,m.accent)}
    if(data.id==='smg')box(weaponRoot,0,-.04,.22,.13,.11,.28,m.metal);
  }else{
    box(weaponRoot,0,.126,-.25,.11,.1,.22,m.metal);const sight=cylinder(weaponRoot,0,.19,-.25,.045,.045,.15,m.glass,10);sight.rotation.x=Math.PI/2;box(weaponRoot,0,-.14,-.08,.09,.21,.13,m.accent);
    if(data.id==='revolver'){const drum=cylinder(weaponRoot,0,-.005,-.12,.105,.105,.18,m.accent,10);drum.rotation.z=Math.PI/2;for(let i=0;i<6;i++){const a=i*Math.PI/3;const pin=cylinder(weaponRoot,Math.cos(a)*.063,-.005+Math.sin(a)*.063,-.12,.014,.014,.19,m.metal,6);pin.rotation.z=Math.PI/2}box(weaponRoot,0,.19,-.12,.14,.055,.22,m.metal)}
  }
  const flashMat=new THREE.MeshBasicMaterial({color:0xffd17c,transparent:true,opacity:0,side:THREE.DoubleSide});weaponFlash=new THREE.Mesh(new THREE.ConeGeometry(.075,.26,8),flashMat);weaponFlash.rotation.x=Math.PI/2;weaponFlash.position.set(0,.012,-.13-long*1.1);weaponRoot.add(weaponFlash);
  const sideGlow=new THREE.PointLight(0xffae5c,0,3);sideGlow.position.copy(weaponFlash.position);weaponRoot.add(sideGlow);weaponRoot.userData.sideGlow=sideGlow;weaponRoot.userData.muzzleZ=-.13-long*1.1;
}

function bindUI(){
  $('playCampaign').onclick=()=>{renderMissions();$('campaignPanel').classList.remove('hidden')};
  $('playSurvival').onclick=()=>startRun('survival');$('playChallenge').onclick=()=>startRun('challenge');$('playFree').onclick=()=>{renderFreeMaps();$('campaignPanel').classList.remove('hidden')};
  $('openArmory').onclick=()=>openArmory('main','loadout');$('openShop').onclick=()=>openArmory('main','weapons');$('hudShopButton').onclick=()=>openArmory('game','loadout');$('pauseArmory').onclick=()=>openArmory('pause','loadout');
  $('openSettings').onclick=()=>{$('settingsPanel').classList.remove('hidden');syncSettings()};
  $('resumeButton').onclick=resumeRun;$('restartButton').onclick=()=>startRun(runMode,mission,runMode==='free'?currentTheme:null);$('exitButton').onclick=exitToMenu;
  $('resultContinue').onclick=()=>{$('resultsPanel').classList.add('hidden');$('mainMenu').classList.remove('hidden');$('gameHeader').classList.add('hidden')};
  $('resultReplay').onclick=()=>startRun(runMode,mission,runMode==='free'?currentTheme:null);
  document.querySelectorAll('[data-close]').forEach(b=>b.addEventListener('click',()=>closePanel(b.dataset.close)));
  document.querySelectorAll('.armory-tab').forEach(b=>b.addEventListener('click',()=>{armoryTab=b.dataset.tab;document.querySelectorAll('.armory-tab').forEach(t=>t.classList.toggle('active',t===b));renderArmory()}));
  $('sensitivityControl').oninput=e=>{save.settings.sensitivity=+e.target.value;persist()};$('volumeControl').oninput=e=>{save.settings.volume=+e.target.value;applySettings();persist()};$('difficultyControl').onchange=e=>{save.settings.difficulty=e.target.value;persist()};$('shakeControl').onchange=e=>{save.settings.shake=e.target.checked;persist()};$('reducedMotionControl').onchange=e=>{save.settings.reducedMotion=e.target.checked;persist()};$('crouchToggleControl').onchange=e=>{save.settings.crouchToggle=e.target.checked;crouchToggled=false;persist()};$('aimToggleControl').onchange=e=>{save.settings.aimToggle=e.target.checked;aiming=false;$('crosshair').classList.remove('aimed');persist()};$('invertYControl').onchange=e=>{save.settings.invertY=e.target.checked;persist()};
}
function updateCredits(){$('menuCash').textContent=Math.floor(save.credits).toLocaleString();$('armoryCash').textContent=Math.floor(save.credits).toLocaleString();$('hudCash').textContent=Math.floor(save.credits).toLocaleString();const op=save.stats.operations; $('operatorRank').textContent=op>=8?'VETERAN':op>=3?'OPERATIVE':'RECRUIT'}
function renderMissions(){$('missionPanelEyebrow').textContent='DEPLOYMENT SELECT';$('missionPanelTitle').textContent='Campaign';$('missionPanelIntro').textContent='Choose an operation. New sectors unlock as you advance.';const host=$('missionList');host.replaceChildren();MISSIONS.forEach(m=>{const unlocked=m.id<=save.unlockedMission;const b=document.createElement('button');b.className='mission-card '+(unlocked?'unlocked':'');b.disabled=!unlocked;b.innerHTML=`<span class="mission-num">0${m.id}</span><span class="mission-copy"><b>${m.title}</b><small>${m.subtitle} · ${m.type.toUpperCase()}</small></span><span class="mission-status">${unlocked?`+${m.reward} CR`:'LOCKED'}</span>`;if(unlocked)b.onclick=()=>startRun('campaign',m);host.append(b)})}
function renderFreeMaps(){$('missionPanelEyebrow').textContent='TRAINING GRID // MAP SELECT';$('missionPanelTitle').textContent='Free Play';$('missionPanelIntro').textContent='Choose a sector to explore. All maps are available for practice.';const host=$('missionList');host.replaceChildren();Object.entries(THEMES).forEach(([id,map],i)=>{const b=document.createElement('button');b.className='mission-card unlocked';b.innerHTML=`<span class="map-thumbnail map-${id}" aria-hidden="true"><i></i></span><span class="mission-copy"><b>${map.name}</b><small>${id==='jungle'?'DENSE CANOPY':id==='urban'?'RUINED CITY BLOCKS':id==='arctic'?'FROSTLINE PASS':id==='industrial'?'RELAY OUTPOST':id==='wreck'?'SALVAGE YARD':'OPEN TRAINING SECTOR'}</small></span><span class="mission-status">DEPLOY ↗</span>`;b.onclick=()=>startRun('free',null,id);host.append(b)})}
function assignQuickSlot(slot,id){const previous=save.quickSlots[slot];if(id&&!save.ownedWeapons.includes(id))return;if(id){const other=save.quickSlots.indexOf(id);if(other>=0&&other!==slot)save.quickSlots[other]=previous}save.quickSlots[slot]=id;persist();renderArmory()}
function openArmory(from,tab='loadout'){armoryReturn=from;armoryTab=tab;renderArmory();$('armoryPanel').classList.remove('hidden');if(from==='game'){paused=true;document.exitPointerLock?.();$('startPrompt').classList.add('hidden')}if(from==='pause')$('pausePanel').classList.add('hidden')}
function closePanel(id){$(id).classList.add('hidden');if(id==='armoryPanel'){if(armoryReturn==='game'&&active){paused=false;$('startPrompt').classList.remove('hidden');$('gameCanvas').requestPointerLock?.()}else if(armoryReturn==='pause')$('pausePanel').classList.remove('hidden')} }
function renderArmory(){
  const host=$('armoryContent');host.replaceChildren();document.querySelectorAll('.armory-tab').forEach(t=>t.classList.toggle('active',t.dataset.tab===armoryTab));const addCard=(title,cat,icon,desc,stats,price,action,disabled=false,extra='')=>{const el=document.createElement('article');el.className='store-card '+extra;el.innerHTML=`<div class="store-top"><span class="store-type">${cat}</span><span class="store-icon">${icon}</span></div><h3>${title}</h3><p>${desc}</p>${stats?`<div class="store-stats">${stats.map(s=>`<span>${s[0]} <i>${s[1]}</i></span>`).join('')}</div>`:''}<div class="store-footer"><span class="store-price">${price}</span><button class="store-action" ${disabled?'disabled':''}>${action}</button></div>`;host.append(el);return el.querySelector('button')};
  if(armoryTab==='loadout'){
    const owned=WEAPONS.filter(w=>save.ownedWeapons.includes(w.id));
    for(let i=0;i<6;i++){
      const id=save.quickSlots[i],w=WEAPONS.find(item=>item.id===id),card=document.createElement('article');card.className='store-card loadout-slot '+(save.equipped===id?'equipped':'');
      card.innerHTML=`<div class="store-top"><span class="store-type">QUICK SLOT 0${i+1}</span><span class="store-icon">${w?.icon||'＋'}</span></div><h3>${w?.name||'EMPTY SLOT'}</h3><p>${w?`${w.type} · ${w.damage} DMG · ${w.mag} ROUND MAG`:'Assign any weapon you own to this number key.'}</p><div class="loadout-slot-controls"><select aria-label="Assign quick slot ${i+1}"><option value="">${w?'REMOVE FROM SLOT':'CHOOSE WEAPON'}</option>${owned.map(item=>`<option value="${item.id}" ${item.id===id?'selected':''}>${item.name}</option>`).join('')}</select><button class="store-action" ${w?'':'disabled'}>${save.equipped===id?'EQUIPPED':'EQUIP'}</button></div>`;host.append(card);
      card.querySelector('select').onchange=e=>assignQuickSlot(i,e.target.value||null);const button=card.querySelector('button');if(w)button.onclick=()=>{save.equipped=w.id;selectedWeapon=w;persist();if(camera)buildWeaponModel(w);updateWeaponHUD();renderArmory();if(active)toast(`${w.short.toUpperCase()} EQUIPPED`)};
    }
  }
  if(armoryTab==='weapons')WEAPONS.forEach(w=>{const owned=save.ownedWeapons.includes(w.id),equipped=save.equipped===w.id;const b=addCard(w.name,w.type,w.icon,w.desc,[['DMG',Math.round(w.damage*(1+((save.upgrades[w.id]?.power||0)*.12)))],['MAG',w.mag+(save.upgrades[w.id]?.capacity||0)*4],['RATE',`${(1/w.rate).toFixed(1)}/s`]],owned?'IN INVENTORY':`${w.cost} CR`,equipped?'EQUIPPED':owned?'EQUIP':'PURCHASE',!owned&&save.credits<w.cost,equipped?'equipped':'');b.onclick=()=>{if(owned){save.equipped=w.id;selectedWeapon=w;persist();if(camera)buildWeaponModel(w);renderArmory();updateWeaponHUD();if(active)toast(`${w.short.toUpperCase()} EQUIPPED`)}else if(save.credits>=w.cost){save.credits-=w.cost;save.ownedWeapons.push(w.id);save.equipped=w.id;selectedWeapon=w;ammo[w.id]={mag:w.mag+(save.upgrades[w.id]?.capacity||0)*4,reserve:w.reserve};if(save.quickSlots.includes(null))save.quickSlots[save.quickSlots.indexOf(null)]=w.id;persist();if(camera)buildWeaponModel(w);renderArmory();updateWeaponHUD();playSound('buy');toast(`${w.short.toUpperCase()} ACQUIRED`)}}});
  if(armoryTab==='upgrades'){
    const levels=save.upgrades[save.equipped]||{};const current=WEAPONS.find(w=>w.id===save.equipped)||WEAPONS[0];
    [{id:'power',title:'MATCH-GRADE LOAD',icon:'↗',desc:'Precision ammunition increases damage by 12% per level.',cost:340,max:3,stat:'DAMAGE',value:`+${(levels.power||0)*12}%`},{id:'capacity',title:'EXTENDED MAGAZINE',icon:'▤',desc:'A reinforced magazine adds 4 rounds per level.',cost:285,max:3,stat:'MAG SIZE',value:`+${(levels.capacity||0)*4}`},{id:'handling',title:'RECOIL COMPENSATOR',icon:'⌁',desc:'A tuned buffer reduces kick and tightens follow-up shots.',cost:310,max:3,stat:'LEVEL',value:`${levels.handling||0}/3`},{id:'reload',title:'QUICK-CHANGE DRILL',icon:'↻',desc:'Field drills improve reload speed by 14% per level.',cost:295,max:3,stat:'RELOAD',value:`-${(levels.reload||0)*14}%`}].forEach(up=>{const lv=levels[up.id]||0;const b=addCard(up.title,current.type,up.icon,up.desc,[[up.stat,up.value]],lv>=up.max?'MAX LEVEL':`${up.cost+lv*130} CR`,lv>=up.max?'MAXED':'INSTALL',lv>=up.max||save.credits<up.cost+lv*130);b.onclick=()=>{const price=up.cost+lv*130;if(save.credits<price)return;save.credits-=price;if(!save.upgrades[current.id])save.upgrades[current.id]={};save.upgrades[current.id][up.id]=lv+1;persist();renderArmory();playSound('buy');toast(`${up.title} INSTALLED`)}});
    const lv=save.armorLevel||0;const b=addCard('CERAMIC INSERTS','OPERATOR ARMOR','⬡','Raise your starting armor by 20, up to 100. Armor absorbs incoming fire.',[['START ARMOR',`${Math.min(100,difficultyTuning().playerArmor+lv*20)}/100`]],lv>=2?'MAX LEVEL':`${420+lv*260} CR`,lv>=2?'MAXED':'UPGRADE',lv>=2||save.credits<420+lv*260);b.onclick=()=>{if(lv>=2)return;save.credits-=420+lv*260;save.armorLevel=lv+1;persist();renderArmory()};
  }
  if(armoryTab==='gear'){
    let b=addCard('FIELD MEDKIT','CONSUMABLE','✚','Restore 45 health during a mission. Press F to use. Does not restore armor.',[['IN PACK',save.medkits]],'180 CR','PURCHASE',save.credits<180);b.onclick=()=>{if(save.credits<180)return;save.credits-=180;save.medkits++;persist();renderArmory();playSound('buy')};
    b=addCard('SIGNAL FLARE','UTILITY','✦','Cosmetic weapon finish with a warm copper receiver and illuminated sight.',[['FINISH',save.skin==='cinder'?'OWNED':'STANDARD']],save.skin==='cinder'?'UNLOCKED':'320 CR',save.skin==='cinder'?'EQUIPPED':'UNLOCK',save.skin==='cinder'||save.credits<320,save.skin==='cinder'?'equipped':'');b.onclick=()=>{if(save.skin==='cinder')return;save.credits-=320;save.skin='cinder';persist();buildWeaponModel(selectedWeapon);renderArmory();playSound('buy')};
    b=addCard('TACTICAL PLATING','PROTECTION','⬡','Reinforce the outer carrier. Raise your starting armor for the next deployment.',[['START ARMOR',`${Math.min(100,difficultyTuning().playerArmor+(save.armorLevel||0)*20)}`]],(save.armorLevel||0)>=2?'MAX LEVEL':`${420+(save.armorLevel||0)*260} CR`,(save.armorLevel||0)>=2?'MAXED':'INSTALL',(save.armorLevel||0)>=2||save.credits<420+(save.armorLevel||0)*260);b.onclick=()=>{if(save.armorLevel>=2)return;save.credits-=420+save.armorLevel*260;save.armorLevel++;persist();renderArmory()};
  }
}
function applySettings(){if(masterGain)masterGain.gain.value=save.settings.volume??.45}
function syncSettings(){$('sensitivityControl').value=save.settings.sensitivity;$('volumeControl').value=save.settings.volume;$('difficultyControl').value=save.settings.difficulty;$('shakeControl').checked=save.settings.shake;$('reducedMotionControl').checked=save.settings.reducedMotion;$('crouchToggleControl').checked=!!save.settings.crouchToggle;$('aimToggleControl').checked=!!save.settings.aimToggle;$('invertYControl').checked=!!save.settings.invertY}
function difficultyTuning(){return({recruit:{playerArmor:80,enemyHealth:.78,enemyDamage:.62,enemyAccuracy:.76,enemyFireRate:1.25,enemySpeed:.92},standard:{playerArmor:60,enemyHealth:1,enemyDamage:1,enemyAccuracy:1,enemyFireRate:1,enemySpeed:1},veteran:{playerArmor:50,enemyHealth:1.2,enemyDamage:1.28,enemyAccuracy:1.18,enemyFireRate:.84,enemySpeed:1.05}})[save.settings.difficulty]||{playerArmor:80,enemyHealth:.78,enemyDamage:.62,enemyAccuracy:.76,enemyFireRate:1.25,enemySpeed:.92}}

function startRun(mode,chosenMission=null,freeTheme=null){
  if(!THREE||!renderer){showEngineNotice('FIELD ENGINE IS STILL LOADING. CHECK YOUR CONNECTION AND TRY AGAIN.',true);return}
  document.exitPointerLock?.();$('mainMenu').classList.add('hidden');$('campaignPanel').classList.add('hidden');$('armoryPanel').classList.add('hidden');$('settingsPanel').classList.add('hidden');$('pausePanel').classList.add('hidden');$('resultsPanel').classList.add('hidden');$('gameHeader').classList.remove('hidden');$('hud').classList.remove('hidden');
  runMode=mode;mission=mode==='campaign'?chosenMission:null;currentTheme=mission?.theme||freeTheme||(mode==='free'?'range':mode==='challenge'?'wreck':'industrial');active=true;paused=false;elapsed=0;runKills=0;runShots=0;runHits=0;runReward=0;objectiveProgress=0;missionTimer=0;wave=0;waveRemaining=0;spawnQueue=0;spawnClock=0;intermission=false;shotCooldown=0;burstRemaining=0;reloading=false;mouseDown=false;aiming=false;crouchToggled=false;crouching=false;cameraHeight=1.66;health=100;armor=Math.min(100,difficultyTuning().playerArmor+(save.armorLevel||0)*20);playerPos.set(-30,0,0);velocity.set(0,0,0);yaw=-Math.PI/2;pitch=0;onGround=true;damageCooldown=0;ammo={};WEAPONS.forEach(w=>ammo[w.id]={mag:w.mag+(save.upgrades[w.id]?.capacity||0)*4,reserve:w.reserve});selectedWeapon=WEAPONS.find(w=>w.id===save.equipped)||WEAPONS[0];buildWeaponModel(selectedWeapon);buildWorld(currentTheme);
  const label=mission?mission.title:mode==='survival'?'ENDLESS HOLD':mode==='challenge'?'RAPID RESPONSE':mode==='free'?'LIVE FIRE RANGE':'LIVE FIRE RANGE';$('missionTag').textContent=label;$('locationName').textContent=THEMES[currentTheme].name;
  const total=mission?.type==='eliminate'?mission.goal:mission?.type==='boss'?1:mission?.type==='defend'?mission.goal:mode==='challenge'?12:0;
  $('objectiveTitle').textContent=mission?(mission.type==='eliminate'?'Eliminate hostiles':mission.type==='defend'?'Hold the uplink':mission.type==='checkpoint'?'Reach the beacon':'Neutralize command unit'):mode==='survival'?'Survive the waves':mode==='challenge'?'Neutralize 12 hostiles':'Live fire exercise';
  $('objectiveHint').textContent=mission?.type==='defend'?'UPLINK HOLD TIME':mission?.type==='checkpoint'?'DISTANCE TO BEACON':mission?.type==='boss'?'COMMAND VITALS':mode==='challenge'?'TIME REMAINING':mode==='survival'?'HOSTILES IN WAVE':'HOSTILES NEUTRALIZED';
  $('objectiveCount').textContent=mission?.type==='defend'?`0 / ${mission.goal}s`:mission?.type==='checkpoint'?'—':mission?.type==='boss'?'TARGET ACTIVE':mode==='survival'?'WAVE 01':mode==='challenge'?'02:00':mission?`0 / ${mission.goal}`:'0';$('objectiveProgress').style.width='0%';
  $('waveTag').textContent=mode==='survival'?'WAVE 01':mode==='challenge'?'TIME 02:00':'LIVE';$('pauseMission').textContent=mission?.title||label;$('startPrompt').classList.remove('hidden');
  enemies.forEach(e=>{worldGroup.remove(e.group);disposeTree(e.group)});enemies=[];clearTransients();
  if(mission?.type==='checkpoint')makeCheckpoint();if(mission?.type==='defend')makeDefendZone();
  if(mission?.type==='boss'){spawnEnemy('boss',new THREE.Vector3(20,0,-5));for(let i=0;i<4;i++)spawnEnemy(i%2?'rifle':'heavy',randomSpawn())}
  else if(mission?.type==='eliminate'){spawnQueue=mission.goal;spawnClock=.1}
  else if(mission?.type==='defend'){spawnQueue=18;spawnClock=.4}
  else if(mission?.type==='checkpoint'){spawnQueue=7;spawnClock=.4}
  else if(mode==='survival'){beginWave()}
  else if(mode==='challenge'){spawnQueue=12;spawnClock=.2;missionTimer=120}
  else if(mode==='free'){spawnQueue=5;spawnClock=.2}
  camera.position.set(playerPos.x,1.7,playerPos.z);camera.rotation.order='YXZ';camera.rotation.set(0,yaw,0);
  playSound('deploy');updateHUD();setTimeout(()=>{$('gameCanvas').requestPointerLock?.();},60);
}
function makeCheckpoint(){const t=THEMES[mission.theme];const g=new THREE.Group();g.position.set(36,0,0);worldGroup.add(g);const ring=new THREE.Mesh(new THREE.TorusGeometry(2.2,.15,8,28),mat(t.accent,.28,.35,{emissive:new THREE.Color(t.accent),emissiveIntensity:.9}));ring.position.y=2.1;g.add(ring);const base=new THREE.Mesh(new THREE.CylinderGeometry(2.7,2.7,.18,28),mat('#29352e',.6,.5));base.position.y=.09;g.add(base);const beam=new THREE.Mesh(new THREE.CylinderGeometry(.08,.9,9,16,1,true),new THREE.MeshBasicMaterial({color:t.accent,transparent:true,opacity:.13,side:THREE.DoubleSide,depthWrite:false}));beam.position.y=4.5;g.add(beam);const light=new THREE.PointLight(t.light,35,22,2);light.position.y=3;g.add(light);checkpointMesh=g}
function makeDefendZone(){const t=THEMES[mission.theme];const g=new THREE.Group();g.position.set(3,0,1);worldGroup.add(g);const base=new THREE.Mesh(new THREE.CylinderGeometry(10,10,.12,48),new THREE.MeshBasicMaterial({color:t.accent,transparent:true,opacity:.09,side:THREE.DoubleSide}));base.position.y=.04;g.add(base);const ring=new THREE.Mesh(new THREE.TorusGeometry(10,.08,6,64),mat(t.accent,.35,.2,{emissive:new THREE.Color(t.accent),emissiveIntensity:.55}));ring.rotation.x=Math.PI/2;ring.position.y=.09;g.add(ring);for(let i=0;i<8;i++){const a=i*Math.PI/4;const p=cylinder(g,Math.cos(a)*10,1,Math.sin(a)*10,.11,.11,2,mat(t.accent,.25,.2,{emissive:new THREE.Color(t.accent),emissiveIntensity:.55}),8);const l=new THREE.PointLight(t.light,4,5);l.position.copy(p.position);g.add(l)}defendRing=g}
function beginWave(){intermission=false;wave++;waveRemaining=4+Math.min(10,(wave-1)*2);spawnQueue=waveRemaining;spawnClock=.4;$('waveTag').textContent=`WAVE ${String(wave).padStart(2,'0')}`;$('objectiveCount').textContent=`WAVE ${String(wave).padStart(2,'0')} · ${waveRemaining} LEFT`;toast(`WAVE ${String(wave).padStart(2,'0')} INBOUND`)}
function randomSpawn(){const a=rand(-Math.PI,Math.PI),r=rand(24,39);return new THREE.Vector3(clamp(playerPos.x+Math.cos(a)*r,-47,47),0,clamp(playerPos.z+Math.sin(a)*r,-47,47))}

function createEnemyMaterials(type){const scheme=type==='boss'?['#393637','#55534d','#db7650']:type==='sniper'?['#343e3b','#586252','#8db8ba']:type==='heavy'?['#3c3330','#645046','#d19a59']:type==='scout'?['#353b32','#596144','#cfb268']:['#303c39','#536058','#d37450'];return{body:mat(scheme[0],.6,.35),armor:mat(scheme[1],.48,.45),accent:mat(scheme[2],.38,.3,{emissive:new THREE.Color(scheme[2]),emissiveIntensity:.13}),visor:mat('#dc9c70',.18,.4,{emissive:0x6c3220,emissiveIntensity:.7})}}
function makeEnemyModel(type){
  const g=new THREE.Group();const m=createEnemyMaterials(type),scale=type==='boss'?1.48:type==='heavy'?1.18:type==='scout'?.91:1;
  const body=new THREE.Mesh(new THREE.CapsuleGeometry(.39*scale,.78*scale,4,8),m.body);body.position.y=1.22*scale;body.castShadow=true;g.add(body);
  const chest=new THREE.Mesh(new THREE.BoxGeometry(.79*scale,.55*scale,.32*scale),m.armor);chest.position.set(0,1.42*scale,-.12*scale);chest.rotation.x=-.05;chest.castShadow=true;g.add(chest);
  const chestMark=box(g,0,1.43*scale,-.295*scale,.23*scale,.08*scale,.025,m.accent,false);
  const helmet=new THREE.Mesh(new THREE.SphereGeometry(.32*scale,12,9),m.armor);helmet.position.y=2.02*scale;helmet.scale.set(1, .83,1);helmet.castShadow=true;g.add(helmet);
  const visor=box(g,0,2*scale,-.292*scale,.43*scale,.115*scale,.04,m.visor,false);
  for(let s of [-1,1]){
    const shoulder=new THREE.Mesh(new THREE.SphereGeometry(.25*scale,9,7),m.armor);shoulder.position.set(s*.53*scale,1.59*scale,-.04);shoulder.scale.set(1,.82,1);g.add(shoulder);
    const arm=new THREE.Mesh(new THREE.CapsuleGeometry(.12*scale,.48*scale,3,6),m.body);arm.position.set(s*.56*scale,1.16*scale,-.1);arm.rotation.z=s*.13;arm.castShadow=true;g.add(arm);
    const leg=new THREE.Mesh(new THREE.CapsuleGeometry(.15*scale,.55*scale,3,6),m.body);leg.position.set(s*.21*scale,.47*scale,.02);leg.rotation.x=.06;leg.castShadow=true;g.add(leg);
  }
  const pack=box(g,0,1.38*scale,.28*scale,.46*scale,.63*scale,.25*scale,m.body);pack.rotation.x=-.06;
  const gun=box(g,.27*scale,1.18*scale,-.51*scale,.16*scale,.15*scale,.79*scale,mat('#252b29',.4,.6));gun.rotation.x=-.03;
  const gunBarrel=cylinder(g,.27*scale,1.18*scale,-.95*scale,.035,.045,.48*scale,mat('#181d1b',.36,.7),8);gunBarrel.rotation.x=Math.PI/2;
  const muzzle=new THREE.Mesh(new THREE.SphereGeometry(.09*scale,7,6),new THREE.MeshBasicMaterial({color:0xffb56d,transparent:true,opacity:0}));muzzle.position.set(.27*scale,1.18*scale,-1.19*scale);g.add(muzzle);
  if(type==='boss'){const crest=new THREE.Mesh(new THREE.ConeGeometry(.14,.38,5),m.accent);crest.position.set(0,2.38*scale,0);g.add(crest);for(let i=0;i<2;i++){const lamp=new THREE.PointLight(0xf0764d,2,4);lamp.position.set(i?-.3:.3,2.02,-.3);g.add(lamp)}}
  g.userData={muzzle,visor,walk:Math.random()*6};return g;
}
function spawnEnemy(type,position){
  const model=makeEnemyModel(type);model.position.copy(position);worldGroup.add(model);
  const spec=type==='boss'?{hp:850,speed:2.15,rate:1.05,damage:15,range:36,reward:180}:type==='heavy'?{hp:210,speed:1.6,rate:1.35,damage:16,range:27,reward:42}:type==='sniper'?{hp:82,speed:1.2,rate:1.75,damage:18,range:52,reward:44}:type==='scout'?{hp:58,speed:3.9,rate:1.28,damage:8,range:17,reward:22}:{hp:100,speed:2.25,rate:1.3,damage:11,range:25,reward:30};
  const waveScale=runMode==='survival'?1+(wave-1)*.13:1,tune=difficultyTuning();
  const e={group:model,type,hp:spec.hp*tune.enemyHealth*waveScale,maxHp:spec.hp*tune.enemyHealth*waveScale,speed:spec.speed*tune.enemySpeed,rate:spec.rate*tune.enemyFireRate/Math.sqrt(waveScale),damage:spec.damage*tune.enemyDamage*waveScale,range:spec.range,reward:spec.reward,x:position.x,z:position.z,attack:rand(.5,2),phase:rand(0,2.8),strafe:Math.random()<.5?-1:1,dead:false,flash:0};enemies.push(e);return e;
}

function equipWeapon(w,resetAmmo=false){selectedWeapon=w;save.equipped=w.id;if(resetAmmo||!ammo[w.id])ammo[w.id]={mag:w.mag+(save.upgrades[w.id]?.capacity||0)*4,reserve:w.reserve};reloading=false;burstRemaining=0;buildWeaponModel(w);updateWeaponHUD();persist()}
function weaponStats(w){const up=save.upgrades[w.id]||{};return{damage:w.damage*(1+(up.power||0)*.12),spread:w.spread*Math.pow(.84,up.handling||0),reload:w.reload*Math.pow(.86,up.reload||0),mag:w.mag+(up.capacity||0)*4,rate:w.rate}}
function updateWeaponHUD(){if(!$('weaponClass'))return;$('weaponClass').textContent=selectedWeapon.type;const slot=save.quickSlots.indexOf(selectedWeapon.id);$('weaponSlot').textContent=slot>=0?String(slot+1).padStart(2,'0'):'--';$('weaponSilhouette').textContent=selectedWeapon.icon;const a=ammo[selectedWeapon.id]||{mag:selectedWeapon.mag,reserve:selectedWeapon.reserve};$('ammoValue').textContent=a.mag;$('reserveValue').textContent=a.reserve;$('reloadLabel').textContent=reloading?'RELOADING…':''}

function onCanvasClick(){if(!active||paused)return;if(document.pointerLockElement!==$('gameCanvas'))$('gameCanvas').requestPointerLock?.()}
function onMouseDown(e){if(!active||paused)return;if(e.button===0){mouseDown=true;if(document.pointerLockElement===$('gameCanvas'))fire()}if(e.button===2){e.preventDefault();aiming=save.settings.aimToggle?!aiming:true;$('crosshair').classList.toggle('aimed',aiming)}}
function onMouseUp(e){if(e.button===0)mouseDown=false;if(e.button===2&&!save.settings.aimToggle){aiming=false;$('crosshair').classList.remove('aimed')}}
function onWheel(e){if(!active||paused)return;e.preventDefault();const owned=WEAPONS.filter(w=>save.ownedWeapons.includes(w.id));if(owned.length<2)return;let i=owned.findIndex(w=>w.id===selectedWeapon.id);i=(i+(e.deltaY>0?1:-1)+owned.length)%owned.length;equipWeapon(owned[i])}
function onMouseMove(e){if(document.pointerLockElement!==$('gameCanvas')||!active||paused)return;const sens=save.settings.sensitivity*.00175*(aiming?(selectedWeapon.id==='sniper'?.62:.78):1);const vertical=save.settings.invertY?-e.movementY:e.movementY;yaw-=e.movementX*sens;pitch-=vertical*sens;pitch=clamp(pitch,-1.46,1.46);camera.rotation.order='YXZ';camera.rotation.set(pitch,yaw,0)}
function onLockChange(){const locked=document.pointerLockElement===$('gameCanvas');if(locked){$('startPrompt').classList.add('hidden');if($('armoryPanel').classList.contains('hidden')&&$('pausePanel').classList.contains('hidden')){paused=false}}else{resetInput();if(active&&!paused&&$('armoryPanel').classList.contains('hidden')&&$('resultsPanel').classList.contains('hidden'))$('startPrompt').classList.remove('hidden')}}
function resetInput(){for(const key of Object.keys(keys))keys[key]=false;mouseDown=false;aiming=false;crouchToggled=false;$('crosshair')?.classList.remove('aimed')}
function onKeyDown(e){if(['Space','Tab','ArrowUp','ArrowDown','ArrowLeft','ArrowRight'].includes(e.code))e.preventDefault();if(e.repeat&&['Escape','KeyR','KeyF','KeyC','Tab','ControlLeft','ControlRight'].includes(e.code))return;if(e.code==='Escape'){if($('armoryPanel').classList.contains('hidden'))togglePause();return}if(!active||paused)return;if(e.code==='KeyC'||e.code==='ControlLeft'||e.code==='ControlRight'){if(save.settings.crouchToggle)crouchToggled=!crouchToggled;else keys[e.code]=true;return}keys[e.code]=true;if(e.code==='KeyR')reloadWeapon();if(e.code==='KeyF')useMedkit();if(e.code==='Tab'){openArmory('game','loadout');return}if(/^Digit[1-6]$/.test(e.code)){const id=save.quickSlots[Number(e.code.slice(-1))-1],w=WEAPONS.find(item=>item.id===id);if(w)equipWeapon(w)}}
function togglePause(){if(!active)return;if(paused){resumeRun();return}paused=true;mouseDown=false;burstRemaining=0;document.exitPointerLock?.();$('startPrompt').classList.add('hidden');$('pausePanel').classList.remove('hidden')}
function resumeRun(){if(!active)return;paused=false;$('pausePanel').classList.add('hidden');$('startPrompt').classList.remove('hidden');$('gameCanvas').requestPointerLock?.()}
function reloadWeapon(){if(reloading)return;const a=ammo[selectedWeapon.id],st=weaponStats(selectedWeapon);if(!a||a.mag>=st.mag||a.reserve<=0)return;reloading=true;reloadUntil=elapsed+st.reload;$('reloadLabel').textContent='RELOADING…';playSound('reload')}
function useMedkit(){if(!save.medkits||health>=100){toast(save.medkits?'VITALS AT CAPACITY':'NO FIELD MEDKITS');return}save.medkits--;health=Math.min(100,health+45);persist();playSound('heal');toast('FIELD MEDKIT APPLIED');updateHUD()}
function fire(fromBurst=false){if(!active||paused||reloading||shotCooldown>0)return;const a=ammo[selectedWeapon.id],st=weaponStats(selectedWeapon);if(!a||a.mag<=0){reloadWeapon();if(a?.reserve<=0)toast('MAGAZINE EMPTY');return}a.mag--;shotCooldown=st.rate;runShots++;if(selectedWeapon.burst&&!fromBurst)burstRemaining=2;updateWeaponHUD();playSound(selectedWeapon.explosive?'explosion':selectedWeapon.id==='shotgun'?'shotgun':selectedWeapon.id==='sniper'?'sniper':selectedWeapon.id==='lmg'?'heavy':'shot');
  const spread=st.spread*(aiming?.48:1)*(sprinting?1.9:1)*(crouching?.78:1);const dir=new THREE.Vector3((Math.random()-.5)*spread,(Math.random()-.5)*spread,0).add(new THREE.Vector3(0,0,-1)).normalize();dir.applyQuaternion(camera.quaternion);raycaster.set(camera.position,dir);raycaster.far=selectedWeapon.range;
  const meshes=[];for(const en of enemies)if(!en.dead)en.group.traverse(o=>{if(o.isMesh)meshes.push(o)});const intersects=raycaster.intersectObjects(meshes,false);let hitEnemy=null,hitPoint=raycaster.ray.origin.clone().addScaledVector(dir,selectedWeapon.range);
  if(intersects.length){hitPoint=intersects[0].point;for(let p=intersects[0].object;p;p=p.parent){hitEnemy=enemies.find(en=>en.group===p);if(hitEnemy)break}}
  createTracer(camera.position.clone().add(camera.getWorldDirection(V3()).multiplyScalar(.55)),hitPoint,0xffd69b,.09);
  weaponFlash.material.opacity=.94;weaponRoot.userData.sideGlow.intensity=2.5;weaponRoot.position.z=-.53+st.recoil*(.65+Math.random()*.5);camera.rotation.x=clamp(camera.rotation.x+(Math.random()-.5)*st.recoil*.19,-1.46,1.46);$('crosshair').classList.add('fire');setTimeout(()=>$('crosshair').classList.remove('fire'),65);
  if(selectedWeapon.explosive){makeExplosion(hitPoint);let landed=false;for(const target of enemies){if(target.dead)continue;const d=target.group.position.distanceTo(hitPoint);if(d<6){landed=true;target.hp-=st.damage*Math.max(.25,1-d/7);makeImpact(target.group.position.clone().add(V3(0,1,0)),0xf2a35e);if(target.hp<=0)killEnemy(target)}}if(landed){runHits++;showHit(false)}}
  else if(hitEnemy){runHits++;const pellets=selectedWeapon.pellets||1;const damage=st.damage*pellets;if(hitEnemy.type==='boss'&&selectedWeapon.id==='sniper')hitEnemy.hp-=damage*1.12;else hitEnemy.hp-=damage;hitEnemy.flash=.08;hitEnemy.group.traverse(o=>{if(o.isMesh&&o.material?.emissive){o.material.emissive.setHex(0x75291d);setTimeout(()=>{if(o.material)o.material.emissive.setHex(0)},75)}});showHit(hitEnemy.hp<=0);makeImpact(hitPoint,hitEnemy.type==='boss'?0xe8a363:0xd5b676);if(hitEnemy.hp<=0)killEnemy(hitEnemy)}
  if(a.mag===0&&a.reserve>0)setTimeout(()=>{if(active&&!reloading)reloadWeapon()},180);
}
function createTracer(start,end,color=0xffdc9c,duration=.13){const geo=new THREE.BufferGeometry().setFromPoints([start,end]);const line=new THREE.Line(geo,new THREE.LineBasicMaterial({color,transparent:true,opacity:.9}));scene.add(line);tracers.push({line,time:duration,total:duration})}
function makeImpact(pos,color){for(let i=0;i<5;i++){const mesh=new THREE.Mesh(new THREE.SphereGeometry(rand(.025,.055),5,4),new THREE.MeshBasicMaterial({color,transparent:true,opacity:.95}));mesh.position.copy(pos);scene.add(mesh);particles.push({mesh,vel:V3(rand(-2,2),rand(.5,3),rand(-2,2)),life:rand(.12,.27),max:.27})}}
function makeExplosion(pos){const flash=new THREE.Mesh(new THREE.SphereGeometry(1,12,10),new THREE.MeshBasicMaterial({color:0xffad55,transparent:true,opacity:.82,depthWrite:false}));flash.position.copy(pos);scene.add(flash);particles.push({mesh:flash,vel:V3(),life:.27,max:.27,expansion:true});for(let i=0;i<20;i++){const mesh=new THREE.Mesh(new THREE.SphereGeometry(rand(.035,.11),5,4),new THREE.MeshBasicMaterial({color:Math.random()<.5?0xffbe6b:0x9b4d2d,transparent:true,opacity:.95}));mesh.position.copy(pos);scene.add(mesh);particles.push({mesh,vel:V3(rand(-6,6),rand(-2,7),rand(-6,6)),life:rand(.28,.62),max:.62})}}
function showHit(kill){const el=$('hitMarker');el.classList.toggle('kill',kill);el.classList.add('show');clearTimeout(lastHitTimer);lastHitTimer=setTimeout(()=>el.classList.remove('show','kill'),130)}
function killEnemy(e){if(e.dead)return;e.dead=true;runKills++;save.stats.kills++;const reward=e.reward;save.credits+=reward;runReward+=reward;persist();worldGroup.remove(e.group);disposeTree(e.group);const typeName=e.type==='boss'?'COMMAND UNIT':e.type.toUpperCase();const entry=document.createElement('div');entry.className='kill-entry';entry.innerHTML=`<span>+${reward} CR</span> &nbsp; ${typeName} NEUTRALIZED`;const feed=$('killFeed');feed.prepend(entry);setTimeout(()=>entry.remove(),2600);playSound('kill');
  if(mission?.type==='eliminate')objectiveProgress++;
  if(runMode==='challenge')objectiveProgress++;
  if(runMode==='free'&&spawnQueue===0&&enemies.filter(x=>!x.dead).length<3)spawnQueue++;
  updateObjective();
}

function animate(){requestAnimationFrame(animate);const dt=Math.min(clock.getDelta(),.05);if(!renderer)return;if(active&&!paused)updateGame(dt);else animateMenuCamera(dt);updateVisuals(dt);renderer.render(scene,camera)}
function animateMenuCamera(dt){if(active)return;camera.position.x=lerp(camera.position.x,-30,dt*.5);camera.position.y=lerp(camera.position.y,1.7,dt*.5);yaw+=dt*.016;camera.rotation.order='YXZ';camera.rotation.set(-.025,yaw,0);if(worldGroup)worldGroup.rotation.y=Math.sin(performance.now()*.00006)*.015}
function updateGame(dt){elapsed+=dt;missionTimer+=dt;shotCooldown=Math.max(0,shotCooldown-dt);damageCooldown=Math.max(0,damageCooldown-dt);if(reloading&&elapsed>=reloadUntil){const a=ammo[selectedWeapon.id],st=weaponStats(selectedWeapon),need=st.mag-a.mag,take=Math.min(need,a.reserve);a.mag+=take;a.reserve-=take;reloading=false;playSound('reloadDone');updateWeaponHUD()}
  updateMovement(dt);updateWeaponMotion(dt);if(burstRemaining>0&&shotCooldown<=0){burstRemaining--;fire(true)}else if(mouseDown&&selectedWeapon.auto)fire();updateSpawns(dt);updateEnemies(dt);updateMode(dt);updateObjective();if(mission?.type==='checkpoint'&&checkpointMesh){checkpointMesh.rotation.y+=dt*.5;checkpointMesh.children[1].material.opacity=.11+Math.sin(elapsed*2)*.045}
  if(runMode==='challenge'){const left=Math.max(0,120-missionTimer);$('waveTag').textContent=`TIME ${formatTime(left)}`;if(left<=0&&objectiveProgress<12)endRun(false,'TIME EXPIRED')}
  if(health<=0&&runMode!=='free')endRun(false,'OPERATOR DOWN');if(health<=0&&runMode==='free'){health=100;armor=Math.max(0,armor-25);playerPos.set(-30,0,0);velocity.set(0,0,0);toast('FIELD RESET // ARMOR DEGRADED');updateHUD()}
  updateHUD();
}
function updateMovement(dt){const forward=V3(-Math.sin(yaw),0,-Math.cos(yaw));const right=V3(Math.cos(yaw),0,-Math.sin(yaw));const wish=V3();if(keys.KeyW)wish.add(forward);if(keys.KeyS)wish.sub(forward);if(keys.KeyD)wish.add(right);if(keys.KeyA)wish.sub(right);if(wish.lengthSq())wish.normalize();crouching=save.settings.crouchToggle?crouchToggled:!!(keys.KeyC||keys.ControlLeft||keys.ControlRight);sprinting=!!(keys.ShiftLeft||keys.ShiftRight)&&!crouching&&!!wish.lengthSq();const speed=sprinting?10.7:crouching?2.6:5.6;const accel=wish.lengthSq()?22:16;velocity.x=lerp(velocity.x,wish.x*speed,Math.min(1,accel*dt));velocity.z=lerp(velocity.z,wish.z*speed,Math.min(1,accel*dt));if(keys.Space&&onGround){velocity.y=6.7;onGround=false;keys.Space=false;playSound('jump')}velocity.y-=18*dt;playerPos.addScaledVector(velocity,dt);if(playerPos.y<0){playerPos.y=0;velocity.y=0;onGround=true}playerPos.x=clamp(playerPos.x,-48,48);playerPos.z=clamp(playerPos.z,-48,48);
  // Soft collision against large set dressing keeps the arena edges fair without snagging movement.
  for(const ob of obstacles){const dx=playerPos.x-ob.x,dz=playerPos.z-ob.z,d=Math.hypot(dx,dz),min=ob.r+.43;if(d<min&&d>.001){playerPos.x=ob.x+dx/d*min;playerPos.z=ob.z+dz/d*min}}
  const bob=sprinting?.078:crouching?.012:.04;const motion=save.settings.reducedMotion?0:bob*Math.sin(elapsed*(sprinting?15:9))*Math.min(1,Math.hypot(velocity.x,velocity.z)*.6);const targetHeight=crouching?1.12:1.66;cameraHeight=lerp(cameraHeight,targetHeight,Math.min(1,dt*11));camera.position.set(playerPos.x,playerPos.y+cameraHeight+motion,playerPos.z);camera.rotation.order='YXZ';camera.rotation.set(pitch,yaw,0);
  const targetFov=aiming?(selectedWeapon.id==='sniper'?43:61):sprinting?80:74;camera.fov=lerp(camera.fov,targetFov,dt*8);camera.updateProjectionMatrix();$('movementState').textContent=sprinting?'SPRINT':crouching?'LOW PROFILE':aiming?'AIMING':'READY';
}
function updateWeaponMotion(dt){if(!weaponRoot)return;const targetZ=-.53;weaponRoot.position.z=lerp(weaponRoot.position.z,targetZ,Math.min(1,dt*12));weaponRoot.position.y=lerp(weaponRoot.position.y,-.3+(sprinting?.035:0)+(crouching?-.04:0),dt*8);weaponRoot.rotation.z=lerp(weaponRoot.rotation.z,sprinting?-.05:0,dt*8);if(weaponFlash){weaponFlash.material.opacity=Math.max(0,weaponFlash.material.opacity-dt*9);weaponRoot.userData.sideGlow.intensity=Math.max(0,weaponRoot.userData.sideGlow.intensity-dt*20)}}
function updateSpawns(dt){spawnClock-=dt;const alive=enemies.filter(e=>!e.dead).length;const cap=runMode==='free'?5:enemyCap;if(spawnQueue>0&&spawnClock<=0&&alive<cap){spawnClock=rand(.8,1.35);spawnQueue--;let pool=mission?.enemies||(['scout','rifle','heavy','sniper']);let type=pool[Math.floor(Math.random()*pool.length)];if(runMode==='survival'&&wave>=4&&Math.random()<.12)type='heavy';spawnEnemy(type,randomSpawn())}}
function updateEnemies(dt){const target=playerPos.clone();for(let i=enemies.length-1;i>=0;i--){const e=enemies[i];if(e.dead)continue;const g=e.group,dx=target.x-e.x,dz=target.z-e.z,dist=Math.hypot(dx,dz);e.attack-=dt;e.phase+=dt;let move=dist>e.range*.64?1:dist<e.range*.33?-.25:0;if(e.type==='scout')move=dist>5?1:0;if(e.type==='sniper')move=dist>e.range*.72?1:dist<13?-.65:0;if(e.type==='boss')move=dist>8?1:0;
    let vx=dist?dx/dist:0,vz=dist?dz/dist:0;const strafe=e.type==='sniper'?.18:.3;vx+=Math.cos(e.phase*1.1)*e.strafe*strafe;vz+=Math.sin(e.phase*1.1)*e.strafe*strafe;const len=Math.hypot(vx,vz)||1;vx/=len;vz/=len;e.x+=vx*e.speed*move*dt;e.z+=vz*e.speed*move*dt;
    for(const ob of obstacles){const ox=e.x-ob.x,oz=e.z-ob.z,d=Math.hypot(ox,oz),min=ob.r+.52;if(d<min&&d>.001){e.x=ob.x+ox/d*min;e.z=ob.z+oz/d*min}}
    e.x=clamp(e.x,-48,48);e.z=clamp(e.z,-48,48);g.position.set(e.x,0,e.z);g.rotation.y=Math.atan2(-dx,-dz);g.position.y=Math.max(0,Math.sin(e.phase*7)*.018);
    if(e.attack<=0&&dist<e.range&&dist>2.5){e.attack=e.rate*rand(.75,1.32);const chance=e.type==='sniper'?.78:.58;if(Math.random()<chance*(save.settings.difficulty==='recruit'?.78:save.settings.difficulty==='veteran'?1.08:1))enemyFire(e)}
    const flash=e.group.userData.muzzle;if(flash){flash.material.opacity=Math.max(0,flash.material.opacity-dt*10)}
  }}
function enemyFire(e){const origin=e.group.position.clone().add(V3(0,e.type==='boss'?1.7:1.35,0));const aim=V3(playerPos.x,camera.position.y-.17,playerPos.z);const distance=origin.distanceTo(aim);const accuracy=clamp(((e.type==='sniper'?.84:.67)-distance*.004)*difficultyTuning().enemyAccuracy,0,.82);const spread=(1-accuracy)*distance*.16;aim.x+=rand(-spread,spread);aim.y+=rand(-spread*.28,spread*.28);aim.z+=rand(-spread,spread);createTracer(origin,aim,e.type==='boss'?0xff764e:0xffb570,.16);if(e.group.userData.muzzle)e.group.userData.muzzle.material.opacity=.95;const zoneDistance=defendRing?Math.hypot(playerPos.x-3,playerPos.z-1):0;const onCover=mission?.type==='defend'&&zoneDistance>10;if(Math.random()<accuracy&&!onCover){damagePlayer(e.damage);}}
function damagePlayer(amount){if(damageCooldown>0)return;damageCooldown=.18;let absorb=Math.min(armor,amount*.72);armor-=absorb;health-=amount-absorb;if(save.settings.shake)screenShake=Math.max(screenShake,.08);const fl=$('damageFlash');fl.classList.add('show');setTimeout(()=>fl.classList.remove('show'),130);playSound('hurt');updateHUD();if(health<=0&&runMode==='free')health=0}

function updateMode(dt){const living=enemies.filter(e=>!e.dead).length;if(mission?.type==='eliminate'&&objectiveProgress>=mission.goal)endRun(true);
  if(mission?.type==='defend'){
    const inside=Math.hypot(playerPos.x-3,playerPos.z-1)<10; if(inside)objectiveProgress=Math.min(mission.goal,objectiveProgress+dt);else objectiveProgress=Math.max(0,objectiveProgress-dt*.12);
    if(objectiveProgress>=mission.goal)endRun(true);if(missionTimer>92&&objectiveProgress<mission.goal)endRun(false,'UPLINK LOST');
  }
  if(mission?.type==='checkpoint'&&playerPos.distanceTo(V3(36,0,0))<3.5)endRun(true);
  if(mission?.type==='boss'&&!enemies.some(e=>!e.dead&&e.type==='boss'))endRun(true);
  if(runMode==='challenge'&&objectiveProgress>=12)endRun(true);
  if(runMode==='survival'&&spawnQueue===0&&living===0&&!intermission){intermission=true;const bonus=120+wave*50;save.credits+=bonus;runReward+=bonus;persist();setTimeout(()=>{if(active&&runMode==='survival')beginWave()},1300)}
}
function updateObjective(){if(!$('hud')||!active)return;let progress=0,label='';if(mission?.type==='eliminate'){progress=objectiveProgress/mission.goal;label=`${objectiveProgress} / ${mission.goal}`}else if(mission?.type==='defend'){progress=objectiveProgress/mission.goal;label=`${Math.floor(objectiveProgress)} / ${mission.goal}s`}else if(mission?.type==='checkpoint'){const d=Math.max(0,Math.hypot(playerPos.x-36,playerPos.z));progress=1-d/68;label=`${Math.ceil(d)} m`}else if(mission?.type==='boss'){const boss=enemies.find(e=>e.type==='boss'&&!e.dead);progress=boss?1-boss.hp/boss.maxHp:1;label=boss?`${Math.ceil(Math.max(0,boss.hp))} / ${boss.maxHp} HP`:'TARGET DOWN'}else if(runMode==='survival'){progress=waveRemaining?1-(spawnQueue+enemies.filter(e=>!e.dead).length)/waveRemaining:1;label=`WAVE ${String(wave).padStart(2,'0')} · ${spawnQueue+enemies.filter(e=>!e.dead).length} LEFT`}else if(runMode==='challenge'){progress=objectiveProgress/12;label=`${objectiveProgress} / 12`}else{progress=Math.min(.94,runKills/20);label=`${runKills} ELIMINATED`}
  $('objectiveProgress').style.width=`${clamp(progress,0,1)*100}%`;$('objectiveCount').textContent=label;
}
function updateHUD(){if(!$('healthValue'))return;$('healthValue').textContent=Math.ceil(clamp(health,0,100));$('armorValue').textContent=Math.ceil(clamp(armor,0,100));$('healthBar').style.width=`${clamp(health,0,100)}%`;$('armorBar').style.width=`${clamp(armor,0,100)}%`;if(health<30)$('healthBar').style.background='var(--red)';else $('healthBar').style.background='var(--acid)';$('hudCash').textContent=Math.floor(save.credits).toLocaleString();updateWeaponHUD()}
function clearTransients(){for(const t of tracers){scene.remove(t.line);t.line.geometry.dispose();t.line.material.dispose()}tracers=[];for(const p of particles){scene.remove(p.mesh);p.mesh.geometry.dispose();p.mesh.material.dispose()}particles=[];$('killFeed').replaceChildren()}
function updateVisuals(dt){
  if(dustField)dustField.rotation.y+=dt*.002;
  for(let i=tracers.length-1;i>=0;i--){const t=tracers[i];t.time-=dt;t.line.material.opacity=clamp(t.time/t.total,0,1);if(t.time<=0){scene.remove(t.line);t.line.geometry.dispose();t.line.material.dispose();tracers.splice(i,1)}}
  for(let i=particles.length-1;i>=0;i--){const p=particles[i];p.life-=dt;p.mesh.position.addScaledVector(p.vel,dt);p.vel.y-=5*dt;if(p.expansion){const scale=1+(1-p.life/p.max)*5.5;p.mesh.scale.setScalar(scale)}p.mesh.material.opacity=clamp(p.life/p.max,0,1);if(p.life<=0){scene.remove(p.mesh);p.mesh.geometry.dispose();p.mesh.material.dispose();particles.splice(i,1)}}
  if(screenShake>0){screenShake=Math.max(0,screenShake-dt*.7);camera.position.x+=rand(-screenShake,screenShake);camera.position.y+=rand(-screenShake,screenShake)}
}
function endRun(won,reason=''){if(!active)return;active=false;paused=false;mouseDown=false;reloading=false;document.exitPointerLock?.();$('hud').classList.add('hidden');$('pausePanel').classList.add('hidden');$('startPrompt').classList.add('hidden');$('gameHeader').classList.add('hidden');
  let bonus=0;if(won){bonus=mission?mission.reward:runMode==='challenge'?620:runMode==='survival'?100:0;const accuracy=runShots?runHits/runShots:0;bonus+=Math.round(bonus*accuracy*.34);save.credits+=bonus;runReward+=bonus;save.stats.operations++;if(mission)save.unlockedMission=Math.max(save.unlockedMission,Math.min(MISSIONS.length,mission.id+1));persist()}
  const hitPct=runShots?Math.round(runHits/runShots*100):0;$('resultEyebrow').textContent=won?'OPERATION COMPLETE':'OPERATION FAILED';$('resultTitle').textContent=won?(runMode==='survival'?`WAVE ${wave} CLEARED`:runMode==='challenge'?'TIME ATTACK CLEARED':'SECTOR SECURED'):reason||'OPERATOR DOWN';$('resultSubtitle').textContent=won?'The line held. Sector intel has been secured.':'The field team lost contact. Regroup and redeploy.';$('resultKills').textContent=runKills;$('resultAccuracy').textContent=`${hitPct}%`;$('resultTime').textContent=formatTime(elapsed);$('resultReward').textContent=runReward.toLocaleString();$('resultsPanel').classList.remove('hidden');renderMissions();renderArmory();playSound(won?'win':'fail');
}
function exitToMenu(){active=false;paused=false;document.exitPointerLock?.();$('pausePanel').classList.add('hidden');$('hud').classList.add('hidden');$('gameHeader').classList.add('hidden');$('startPrompt').classList.add('hidden');$('mainMenu').classList.remove('hidden')}
function formatTime(s){s=Math.max(0,Math.floor(s));return`${String(Math.floor(s/60)).padStart(2,'0')}:${String(s%60).padStart(2,'0')}`}
function toast(message){const el=$('toast');el.textContent=message;el.classList.add('show');clearTimeout(lastToastTimer);lastToastTimer=setTimeout(()=>el.classList.remove('show'),1550)}
function showEngineNotice(message,sticky=false){const el=$('engineNotice');if(!el)return;el.textContent=message;el.classList.remove('hidden');clearTimeout(el._hideTimer);if(!sticky)el._hideTimer=setTimeout(()=>el.classList.add('hidden'),3500)}

function ensureAudio(){if(!audioContext){const C=window.AudioContext||window.webkitAudioContext;if(!C)return;audioContext=new C();masterGain=audioContext.createGain();masterGain.gain.value=save.settings.volume??.45;masterGain.connect(audioContext.destination)}if(audioContext.state==='suspended')audioContext.resume()}
function playSound(type){ensureAudio();if(!audioContext||!masterGain||masterGain.gain.value===0)return;const now=audioContext.currentTime;const osc=(freq,endFreq,dur,wave='sawtooth',gain=.12)=>{const o=audioContext.createOscillator(),g=audioContext.createGain();o.type=wave;o.frequency.setValueAtTime(freq,now);o.frequency.exponentialRampToValueAtTime(Math.max(20,endFreq),now+dur);g.gain.setValueAtTime(gain,now);g.gain.exponentialRampToValueAtTime(.001,now+dur);o.connect(g);g.connect(masterGain);o.start(now);o.stop(now+dur)};const noise=(dur,gain=.1,cutoff=1800)=>{const n=Math.floor(audioContext.sampleRate*dur),b=audioContext.createBuffer(1,n,audioContext.sampleRate),d=b.getChannelData(0);for(let i=0;i<n;i++)d[i]=(Math.random()*2-1)*(1-i/n);const src=audioContext.createBufferSource(),f=audioContext.createBiquadFilter(),g=audioContext.createGain();src.buffer=b;f.type='lowpass';f.frequency.value=cutoff;g.gain.value=gain;src.connect(f);f.connect(g);g.connect(masterGain);src.start(now)};
  if(type==='explosion'){noise(.42,.27,850);osc(96,24,.38,'sine',.25)}else if(type==='shot'){noise(.09,.15,2200);osc(rand(78,105),40,.11,'triangle',.13)}else if(type==='shotgun'){noise(.2,.24,1250);osc(82,28,.21,'sawtooth',.2)}else if(type==='sniper'){noise(.24,.2,1500);osc(60,23,.25,'triangle',.24)}else if(type==='heavy'){noise(.11,.18,1000);osc(69,38,.15,'square',.14)}else if(type==='reload'){osc(520,390,.05,'square',.04);setTimeout(()=>{if(audioContext)osc(310,230,.07,'square',.045)},360)}else if(type==='reloadDone'){osc(690,860,.08,'sine',.06)}else if(type==='buy'){osc(620,940,.13,'sine',.07);setTimeout(()=>{if(audioContext)osc(930,1260,.1,'sine',.05)},85)}else if(type==='hurt'){osc(110,46,.19,'sawtooth',.13);noise(.12,.06,500)}else if(type==='kill'){osc(560,940,.12,'triangle',.07)}else if(type==='deploy'){osc(90,190,.42,'sawtooth',.055);setTimeout(()=>{if(audioContext)osc(380,620,.22,'sine',.045)},140)}else if(type==='jump'){osc(180,360,.12,'sine',.04)}else if(type==='heal'){osc(440,900,.34,'sine',.08);setTimeout(()=>{if(audioContext)osc(650,1110,.2,'sine',.045)},100)}else if(type==='win'){osc(320,620,.35,'triangle',.08);setTimeout(()=>{if(audioContext)osc(480,960,.36,'sine',.07)},140)}else if(type==='fail'){osc(230,48,.55,'triangle',.1)}}

function onResize(){camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();renderer.setPixelRatio(Math.min(devicePixelRatio,1.7));renderer.setSize(innerWidth,innerHeight)}

bindUI();applySettings();updateCredits();renderMissions();renderArmory();updateWeaponHUD();
showEngineNotice('LOADING FIELD ENGINE…',true);
async function bootGame(){
  try{
    THREE=await import('https://cdn.jsdelivr.net/npm/three@0.169.0/build/three.module.js');
    initialize();
    $('engineNotice').classList.add('hidden');
  }catch(error){
    console.error('Outpost Zero could not initialize its Three.js renderer.',error);
    showEngineNotice('3D FIELD ENGINE FAILED TO LOAD. OPEN THIS GAME IN A CURRENT BROWSER WITH INTERNET ACCESS.',true);
  }
}
bootGame();
