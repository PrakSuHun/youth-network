'use strict';
// Shared scene units, not product specifications. Measure the leading edge, including forks.
window.SafeLierScenario=Object.freeze({
  outerRadius:4.2,innerRadius:2.7,startClearance:5.3,stopClearance:3.0,
  detectClearance:4.9,warningClearance:3.65,
  sample(value){
    const progress=Math.max(0,Math.min(100,Number(value)||0));
    const clearance=this.startClearance-(this.startClearance-this.stopClearance)*progress/100;
    const stage=clearance<=this.warningClearance?3:clearance<=this.outerRadius?2:clearance<=this.detectClearance?1:0;
    return {progress,clearance,stage};
  }
});
// Local rigged human model and scene assets work from file:// and offline.
window.createSafetyScene = function createSafetyScene(host) {
  const T = window.THREE;
  const scenario=window.SafeLierScenario;
  if (!T || !host || !window.SafeWorkerLoader || !window.SAFE_WORKER_ASSET) return null;
  let renderer;
  try { renderer = new T.WebGLRenderer({antialias:true, alpha:true, powerPreference:'low-power'}); }
  catch (_) { return null; }
  const demo=host.closest('.safety-demo');
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.shadowMap.enabled=true; renderer.shadowMap.type=T.PCFSoftShadowMap;
  renderer.outputColorSpace=T.SRGBColorSpace; renderer.toneMapping=T.ACESFilmicToneMapping;
  renderer.toneMappingExposure=1.05;
  const canvas=renderer.domElement;
  canvas.tabIndex=0;
  canvas.setAttribute('aria-label','3D 현장: 안전조끼를 착용한 작업자와 접근하는 이동장비. 좌우 방향키로 회전할 수 있습니다.');
  canvas.setAttribute('aria-describedby','scene-hint');
  host.prepend(canvas);
  const scene=new T.Scene(); scene.background=new T.Color('#e9edec');
  const camera=new T.OrthographicCamera(-9,9,7,-7,.1,100);
  const target=new T.Vector3(0,.7,-2.0);
  let azimuth=1.15, topView=false, closeView=false, disposed=false, scheduled=0;
  const materials=[];
  const mat=(color,options={})=>{const m=new T.MeshStandardMaterial({color,roughness:.72,...options});materials.push(m);return m;};
  const navy=mat('#243942'), rubber=mat('#18252c'), lime=mat('#c0e94b'), metal=mat('#82979b',{metalness:.55,roughness:.4});
  const silver=mat('#edf4e7',{metalness:.35}), white=mat('#f1f3e9'), amber=mat('#e9ac47'), glass=mat('#527d88',{metalness:.25,roughness:.24});
  const boxGeo=new T.BoxGeometry(1,1,1);
  function box(parent,w,h,d,x,y,z,m){const o=new T.Mesh(boxGeo,m);o.scale.set(w,h,d);o.position.set(x,y,z);o.castShadow=true;o.receiveShadow=true;parent.add(o);return o;}
  function cyl(parent,rt,rb,h,x,y,z,m,n=24){const o=new T.Mesh(new T.CylinderGeometry(rt,rb,h,n),m);o.position.set(x,y,z);o.castShadow=true;o.receiveShadow=true;parent.add(o);return o;}
  function sphere(parent,r,x,y,z,m,sx=1,sy=1,sz=1){const o=new T.Mesh(new T.SphereGeometry(r,24,16),m);o.position.set(x,y,z);o.scale.set(sx,sy,sz);o.castShadow=true;parent.add(o);return o;}
  function beam(parent,a,b,width,m,depth=width){const start=new T.Vector3(...a),end=new T.Vector3(...b);const o=box(parent,width,start.distanceTo(end),depth,...start.clone().add(end).multiplyScalar(.5).toArray(),m);o.quaternion.setFromUnitVectors(new T.Vector3(0,1,0),end.sub(start).normalize());return o;}
  scene.add(new T.HemisphereLight('#ffffff','#a1b3ab',1.8));
  const sun=new T.DirectionalLight('#fff9e9',2.8);sun.position.set(-6,12,8);sun.castShadow=true;sun.shadow.mapSize.set(2048,2048);Object.assign(sun.shadow.camera,{left:-12,right:12,top:12,bottom:-12,near:.5,far:35});sun.shadow.normalBias=.025;sun.shadow.bias=-.00015;scene.add(sun);
  const fill=new T.DirectionalLight('#dceaff',1.3);fill.position.set(8,4,-5);scene.add(fill);
  const world=new T.Group();scene.add(world);
  const floorMat=mat('#dce3df'), edgeMat=mat('#b8c6bf');
  box(world,17,.2,17,0,-.16,0,edgeMat);
  box(world,16.9,.04,16.9,0,-.045,0,floorMat);
  const grid=new T.GridHelper(17,17,'#c6d2cb','#d0d9d3');grid.position.y=-.019;world.add(grid);
  const laneMat=mat('#f4f5df');
  for(const x of [-6.5,6.5])box(world,.045,.012,13,x,.005,0,laneMat);
  for(const z of [-6.5,6.5])box(world,13,.012,.045,0,.005,z,laneMat);
  // Low storage islands frame the scene without obstructing any approach direction.
  const wood=mat('#b6ad8b'), cardboard=mat('#c6c5b1'), tape=mat('#e3dfc5');
  function pallet(x,z){const group=new T.Group();group.position.set(x,0,z);world.add(group);for(let i=0;i<5;i++)box(group,.23,.1,1.35,-.52+i*.26,.13,0,wood);for(const sx of [-.48,.48])box(group,.15,.16,1.25,sx,.05,0,wood);box(group,1,.66,1.05,0,.5,0,cardboard);box(group,.055,.012,1.05,0,.837,0,tape);box(group,.055,.65,.01,0,.5,.531,tape);}
  pallet(-5.5,-4.8);pallet(-5.5,-3.2);pallet(5.3,-5.3);
  function bollard(x,z){cyl(world,.16,.2,.11,x,.045,z,navy);cyl(world,.07,.07,.8,x,.48,z,amber);cyl(world,.073,.073,.12,x,.66,z,navy);}
  bollard(-6.1,-2.3);bollard(6.1,-4.2);bollard(-4.5,-6.1);
  function label(text,width=2.1){const c=document.createElement('canvas');c.width=256;c.height=80;const ctx=c.getContext('2d');ctx.fillStyle='rgba(248,251,247,.94)';ctx.beginPath();ctx.roundRect(1,1,254,78,25);ctx.fill();ctx.fillStyle='#344e51';ctx.font='600 28px Pretendard, sans-serif';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(text,128,41);const texture=new T.CanvasTexture(c);texture.colorSpace=T.SRGBColorSpace;const material=new T.SpriteMaterial({map:texture,depthTest:false,transparent:true,toneMapped:false});const sprite=new T.Sprite(material);sprite.scale.set(width,width*80/256,1);sprite.renderOrder=5;return sprite;}
  const outerRingMat=new T.MeshBasicMaterial({color:'#589a9c',transparent:true,opacity:.62,side:T.DoubleSide,depthWrite:false});
  const innerRingMat=new T.MeshBasicMaterial({color:'#c9985b',transparent:true,opacity:.65,side:T.DoubleSide,depthWrite:false});
  for(const [r,material] of [[scenario.outerRadius,outerRingMat],[scenario.innerRadius,innerRingMat]]){
    const ring=new T.Mesh(new T.RingGeometry(r-.028,r+.028,128),material);ring.rotation.x=-Math.PI/2;ring.position.y=.014;world.add(ring);
  }
  // The worker faces +Z; the vehicle approaches along -Z, behind the worker.
  const sightArrow=new T.ArrowHelper(new T.Vector3(0,0,1),new T.Vector3(0,.04,.65),1.0,0x839590,.25,.2);world.add(sightArrow);
  const sightLabel=label('시선 방향',1.25);sightLabel.position.set(0,.12,1.98);world.add(sightLabel);
  const worker=new T.Group();world.add(worker);
  const asset=window.SAFE_WORKER_ASSET;
  const manager=new T.LoadingManager();
  manager.setURLModifier(url=>asset.textures[url.split(/[\\/]/).pop()] || url);
  manager.addHandler(/\.tga$/i,new T.TextureLoader(manager));
  manager.onLoad=()=>{host.dataset.worker='ready';invalidate();};
  manager.onError=()=>{host.dataset.worker='error';demo.classList.remove('scene-ready');};
  try {
    const bytes=Uint8Array.from(atob(asset.fbx),c=>c.charCodeAt(0));
    const human=new window.SafeWorkerLoader(manager).parse(bytes.buffer,'');
    human.name='Safe-Lier human worker';
    human.updateMatrixWorld(true);
    // Relax the rig's original A-pose using world-space limb directions.
    function aimBone(name,childName,direction){
      const bone=human.getObjectByName(name),end=human.getObjectByName(childName);
      if(!bone || !end)return;
      const current=end.getWorldPosition(new T.Vector3()).sub(bone.getWorldPosition(new T.Vector3())).normalize();
      const turn=new T.Quaternion().setFromUnitVectors(current,new T.Vector3(...direction).normalize());
      const worldRotation=turn.multiply(bone.getWorldQuaternion(new T.Quaternion()));
      bone.quaternion.copy(bone.parent.getWorldQuaternion(new T.Quaternion()).invert().multiply(worldRotation));
      human.updateMatrixWorld(true);
    }
    for(const [side,sign] of [['L',1],['R',-1]]){
      aimBone(`Bip01_${side}_UpperArm`,`Bip01_${side}_Forearm`,[sign*.14,-1,.045]);
      aimBone(`Bip01_${side}_Forearm`,`Bip01_${side}_Hand`,[sign*.035,-1,.12]);
    }
    human.traverse(o=>{
      if(!o.isMesh)return;
      o.castShadow=true;o.receiveShadow=true;o.frustumCulled=false;
      const convert=m=>{
        const replacement=new T.MeshStandardMaterial({map:m.map,normalMap:m.normalMap,color:'#ffffff',roughness:.85,metalness:0});
        replacement.name=m.name;
        replacement.normalScale.set(.55,.55);
        if(replacement.map){replacement.map.colorSpace=T.SRGBColorSpace;replacement.map.anisotropy=Math.min(4,renderer.capabilities.getMaxAnisotropy());}
        m.specularMap?.dispose();m.dispose();return replacement;
      };
      o.material=Array.isArray(o.material)?o.material.map(convert):convert(o.material);
    });
    const bounds=new T.Box3().setFromObject(human),height=bounds.max.y-bounds.min.y;
    const scale=2.72/height;human.scale.multiplyScalar(scale);
    human.position.set(-(bounds.min.x+bounds.max.x)*scale/2,-bounds.min.y*scale,-(bounds.min.z+bounds.max.z)*scale/2);
    worker.add(human);
  } catch(error) {
    console.warn('3D worker unavailable; using the diagram experience.',error);
    renderer.dispose();canvas.remove();return null;
  }
  const ledMaterial=mat('#a9d84c',{emissive:'#82ba26',emissiveIntensity:.35});
  // Illustrative sensor housings sit on the actual mesh's shoulder line.
  for(const x of [-.30,.30])for(const z of [-.13,.15]){
    const module=box(worker,.13,.07,.11,x,2.23,z,navy);
    cyl(worker,.027,.027,.018,x,2.23,z+(z>0?.063:-.063),glass).rotation.x=Math.PI/2;
    box(worker,.06,.025,.015,x,2.275,z+(z>0?.06:-.06),ledMaterial);
  }
  const workerLabel=label('Safe-Lier 착용',1.8);workerLabel.position.set(0,3.05,0);worker.add(workerLabel);
  const haloMaterial=new T.MeshBasicMaterial({color:'#a7cc60',transparent:true,opacity:.19,side:T.DoubleSide,depthWrite:false});
  const halo=new T.Mesh(new T.CircleGeometry(.8,64),haloMaterial);halo.rotation.x=-Math.PI/2;halo.position.y=.025;world.add(halo);
  const sectorMat=new T.MeshBasicMaterial({color:'#a3c751',transparent:true,opacity:.15,side:T.DoubleSide,depthWrite:false});
  const sector=new T.Mesh(new T.RingGeometry(scenario.innerRadius,scenario.outerRadius,64,1,-Math.PI/4,Math.PI/2),sectorMat);sector.rotation.x=-Math.PI/2;sector.position.y=.019;world.add(sector);
  const pathMaterial=new T.LineDashedMaterial({color:'#8b9f78',dashSize:.16,gapSize:.15,transparent:true,opacity:.8});
  const path=new T.Line(new T.BufferGeometry().setFromPoints([new T.Vector3(0,.035,.9),new T.Vector3(0,.035,5)]),pathMaterial);path.computeLineDistances();world.add(path);
  function wheels(group,x,zs,r=.31){for(const z of zs)for(const sx of [-x,x]){const wheel=cyl(group,r,r,.19,sx,r,z,rubber);wheel.rotation.z=Math.PI/2;const hub=cyl(group,r*.42,r*.42,.205,sx,r,z,metal);hub.rotation.z=Math.PI/2;}}
  function forklift(){const g=new T.Group();box(g,1.12,.43,1.55,0,.59,0,lime);box(g,1.02,.14,1.58,0,.32,0,navy);box(g,1.08,.53,.47,0,.94,-.55,lime);wheels(g,.57,[-.52,.48]);box(g,.47,.1,.48,0,.98,-.13,navy);box(g,.45,.46,.12,0,1.17,-.35,navy);for(const x of [-.48,.48])for(const z of [-.61,.5])box(g,.065,1.4,.065,x,1.38,z,navy);box(g,1.16,.11,1.38,0,2.1,-.04,navy);for(let x=-.38;x<=.4;x+=.19)box(g,.035,.025,1.25,x,2.17,-.04,metal);for(const x of [-.4,.4]){box(g,.11,2.04,.11,x,1.18,.82,navy);box(g,.09,1.7,.045,x,1.19,.894,metal);box(g,.16,.06,1.17,x,.24,1.36,metal);}box(g,.93,.11,.14,0,.43,.91,navy);box(g,.93,.1,.14,0,1.86,.84,navy);for(const x of [-.47,.47])box(g,.13,.11,.02,x,1.1,-.798,white);return g;}
  function truck(){const g=new T.Group();wheels(g,.69,[-.93,.88],.35);box(g,1.3,.16,2.75,0,.39,0,navy);box(g,1.38,1.25,1.8,0,1.18,-.46,white);box(g,1.3,.69,.98,0,.84,.94,lime);box(g,1.25,.54,.88,0,1.43,.9,lime);box(g,1.03,.36,.02,0,1.43,1.354,glass);for(const x of [-.636,.636])box(g,.025,.35,.59,x,1.43,.94,glass);box(g,1.06,.15,.025,0,.76,1.446,navy);for(const x of [-.43,.43])box(g,.22,.14,.025,x,.99,1.443,white);box(g,1.37,.1,.13,0,.54,1.43,metal);for(const x of [-.45,.45])box(g,.025,1.17,.025,x,1.19,-1.37,metal);return g;}
  function excavator(){const g=new T.Group();for(const x of [-.63,.63]){box(g,.36,.38,1.7,x,.3,-.15,rubber);for(let z=-.76;z<=.7;z+=.28){const w=cyl(g,.14,.14,.37,x,.3,z,metal);w.rotation.z=Math.PI/2;}for(let z=-.86;z<=.68;z+=.16)box(g,.38,.027,.06,x,.51,z,navy);}cyl(g,.53,.53,.22,0,.64,0,navy);box(g,1.16,.42,1.19,0,.94,-.1,amber);box(g,.65,.93,.75,-.22,1.53,-.18,navy);box(g,.55,.66,.018,-.22,1.57,.21,glass);box(g,.019,.67,.62,-.555,1.57,-.18,glass);box(g,.73,.08,.84,-.22,2.03,-.18,amber);beam(g,[.35,1.08,.32],[.35,2.22,.86],.22,amber);beam(g,[.35,2.22,.86],[.35,1.02,1.61],.18,amber);beam(g,[.36,1.18,.52],[.36,1.96,.97],.065,metal);beam(g,[.36,2.10,.99],[.36,1.26,1.52],.06,metal);box(g,.51,.4,.51,.35,.87,1.76,navy);box(g,.54,.065,.67,.35,.66,1.83,metal);return g;}
  const vehicles={forklift:forklift(),truck:truck(),excavator:excavator()};
  const frontExtents={};
  Object.entries(vehicles).forEach(([name,vehicle])=>{
    vehicle.scale.setScalar(.85);vehicle.updateMatrixWorld(true);
    frontExtents[name]=new T.Box3().setFromObject(vehicle).max.z;
  });
  const vehicleRig=new T.Group();world.add(vehicleRig);Object.values(vehicles).forEach(v=>vehicleRig.add(v));
  let equipmentLabel=label('지게차',1.4);scene.add(equipmentLabel);
  // A nearby phone makes the middle stage visible without representing measured telemetry.
  const phone=new T.Group();phone.position.set(2,.04,-.6);phone.rotation.y=1.0;world.add(phone);
  box(phone,.4,.78,.065,0,.58,0,navy);const screenMat=mat('#46676c',{emissive:'#6caab0',emissiveIntensity:0});box(phone,.34,.66,.009,0,.58,.038,screenMat);box(phone,.11,.02,.01,0,.87,.047,navy);box(phone,.19,.045,.013,0,.56,.05,lime);box(phone,.025,.2,.014,0,.56,.05,lime);box(phone,.31,.045,.3,0,.06,0,metal);beam(phone,[0,.09,-.1],[0,.55,-.035],.07,metal);
  let phoneLabel=label('스마트폰 AI',1.6);phoneLabel.position.set(0,1.27,0);phone.add(phoneLabel);
  const connector=new T.Line(new T.BufferGeometry().setFromPoints([new T.Vector3(.32,1.58,0),new T.Vector3(2,.8,-.6)]),new T.LineDashedMaterial({color:'#8cad49',dashSize:.08,gapSize:.07}));connector.computeLineDistances();world.add(connector);
  let state={value:0,equipment:'forklift',stage:0};
  function draw(){scheduled=0;if(!disposed)renderer.render(scene,camera);}
  function invalidate(){if(!scheduled&&!disposed)scheduled=requestAnimationFrame(draw);}
  function setCamera(){const elevation=topView?1.48:closeView?.20:.67;camera.position.set(Math.sin(azimuth)*18*Math.cos(elevation),18*Math.sin(elevation),Math.cos(azimuth)*18*Math.cos(elevation));const focus=closeView?new T.Vector3(0,1.4,0):target;camera.position.add(focus);camera.lookAt(focus);camera.updateProjectionMatrix();invalidate();}
  function resize(){const w=host.clientWidth,h=host.clientHeight;if(!w||!h)return;renderer.setSize(w,h,false);const aspect=w/h;const vertical=closeView?Math.max(4.3,3.5/aspect):topView?Math.max(15.7,15.7/aspect):Math.max(8.6,11.8/aspect);camera.left=-vertical*aspect/2;camera.right=vertical*aspect/2;camera.top=vertical/2;camera.bottom=-vertical/2;setCamera();}
  function update(next){const prior=state;state={...state,...next};const {value,equipment}=state;const {clearance,stage}=scenario.sample(value);const a=Math.PI;const distance=clearance+frontExtents[equipment];vehicleRig.position.set(Math.sin(a)*distance,0,Math.cos(a)*distance);vehicleRig.rotation.y=a+Math.PI;for(const [key,v] of Object.entries(vehicles))v.visible=key===equipment;
    if(prior.equipment!==equipment){scene.remove(equipmentLabel);equipmentLabel.material.map.dispose();equipmentLabel.material.dispose();equipmentLabel=label({forklift:'지게차',truck:'트럭',excavator:'굴착기'}[equipment],1.4);scene.add(equipmentLabel);}
    if(prior.stage!==stage){
      phone.remove(phoneLabel);phoneLabel.material.map.dispose();phoneLabel.material.dispose();
      phoneLabel=label(stage===3?'경고 전달':stage===2?'AI 인식 중':'스마트폰 AI',1.6);
      phoneLabel.position.set(0,1.27,0);phone.add(phoneLabel);
    }
    equipmentLabel.position.copy(vehicleRig.position).add(new T.Vector3(0,2.75,0));
    sector.rotation.z=a-Math.PI/2;path.rotation.y=a;
    const color=stage===3?'#eb8950':stage===2?'#d3b453':'#9bbc55';sectorMat.color.set(color);sectorMat.opacity=stage===0?.08:.19;haloMaterial.color.set(color);haloMaterial.opacity=stage===3?.4:.18;ledMaterial.color.set(stage===3?'#ff9451':'#b2da57');ledMaterial.emissive.set(stage===3?'#ff762e':'#82ba26');ledMaterial.emissiveIntensity=stage===3?2:.35;screenMat.emissiveIntensity=stage>=2?1.4:0;connector.visible=stage>=2;phoneLabel.material.opacity=stage>=2?1:.65;
    outerRingMat.opacity=stage>=2?.95:.62;innerRingMat.color.set(stage===3?'#e18042':'#c9985b');
    innerRingMat.opacity=stage===3?1:.65;
    // Expose the displayed geometry for boundary checks and assistive tooling.
    host.dataset.clearance=clearance.toFixed(4);host.dataset.vehicleFront=frontExtents[equipment].toFixed(4);
    host.dataset.vehicleZ=vehicleRig.position.z.toFixed(4);host.dataset.stage=String(stage);
    host.dataset.phoneActive=String(stage>=2);host.dataset.warningActive=String(stage===3);
    canvas.setAttribute('aria-label',`3D 현장: 작업자 뒤쪽 사각지대에서 ${ {forklift:'지게차',truck:'트럭',excavator:'굴착기'}[equipment]} 접근, ${['감지 대기','접근 감지','AI 판단','작업자 직접 경고'][stage]}. 좌우 방향키로 회전할 수 있습니다.`);invalidate();
  }
  demo.classList.add('scene-ready');
  const observer=new ResizeObserver(resize);observer.observe(host);
  const viewButtons=host.querySelectorAll('[data-view]');
  viewButtons.forEach(b=>b.addEventListener('click',()=>{topView=b.dataset.view==='top';closeView=b.dataset.view==='worker';azimuth=topView?0:closeView?.30:1.15;viewButtons.forEach(x=>x.setAttribute('aria-pressed',String(x===b)));resize();}));
  let drag=null;
  canvas.addEventListener('pointerdown',e=>{if(e.button!==0)return;drag={x:e.clientX,y:e.clientY,start:azimuth};});
  canvas.addEventListener('pointermove',e=>{if(!drag)return;const dx=e.clientX-drag.x,dy=e.clientY-drag.y;if(e.pointerType==='touch'&&Math.abs(dy)>Math.abs(dx)&&!canvas.hasPointerCapture(e.pointerId)){drag=null;return;}if(Math.abs(dx)>5){canvas.setPointerCapture(e.pointerId);azimuth=drag.start-dx*.008;setCamera();}});
  const release=()=>{drag=null;};canvas.addEventListener('pointerup',release);canvas.addEventListener('pointercancel',release);canvas.addEventListener('lostpointercapture',release);
  canvas.addEventListener('keydown',e=>{if(e.key==='ArrowLeft'||e.key==='ArrowRight'){e.preventDefault();azimuth+=(e.key==='ArrowLeft'?.18:-.18);setCamera();}if(e.key==='Home'){e.preventDefault();azimuth=1.15;topView=false;closeView=false;viewButtons.forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.view==='perspective')));resize();}});
  canvas.addEventListener('webglcontextlost',e=>{e.preventDefault();demo.classList.remove('scene-ready');});
  canvas.addEventListener('webglcontextrestored',()=>{demo.classList.add('scene-ready');resize();update(state);});
  document.fonts.ready.then(()=>{if(!disposed)invalidate();});
  update(state);resize();
  return {update,resetView(){azimuth=1.15;topView=false;closeView=false;viewButtons.forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.view==='perspective')));resize();},dispose(){disposed=true;cancelAnimationFrame(scheduled);observer.disconnect();const geometries=new Set(),mats=new Set();scene.traverse(o=>{if(o.geometry)geometries.add(o.geometry);if(o.material)(Array.isArray(o.material)?o.material:[o.material]).forEach(m=>mats.add(m));});geometries.forEach(g=>g.dispose());const textures=new Set();mats.forEach(m=>{Object.values(m).forEach(v=>{if(v?.isTexture)textures.add(v);});m.dispose();});textures.forEach(t=>t.dispose());renderer.dispose();canvas.remove();}};
};
