'use strict';
(() => {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  // Subtle entry animations never hide content or block keyboard navigation.
  const revealTargets = document.querySelectorAll('.section-intro, .editorial-copy, .explore-card, .path-grid article, .team-primary article, .comparison-copy article');
  if ('IntersectionObserver' in window && !reduceMotion.matches) {
    const reveal = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.animate([{transform:'translateY(22px)',opacity:.5},{transform:'translateY(0)',opacity:1}], {duration:650,easing:'cubic-bezier(.2,.7,.2,1)'});
        reveal.unobserve(entry.target);
      }
    }), {threshold:.12});
    revealTargets.forEach(el => reveal.observe(el));
    reduceMotion.addEventListener('change', e => { if(e.matches){reveal.disconnect();document.getAnimations().forEach(a=>a.finish());} });
  }
  const progress = document.querySelector('.reading-progress span');
  let scrollQueued = false;
  function updateProgress(){
    const span = document.documentElement.scrollHeight - window.innerHeight;
    if(progress)progress.style.transform = `scaleX(${span>0?Math.min(1,window.scrollY/span):0})`;
    scrollQueued=false;
  }
  window.addEventListener('scroll',()=>{if(!scrollQueued){scrollQueued=true;requestAnimationFrame(updateProgress);}},{passive:true});
  window.addEventListener('resize',updateProgress);updateProgress();

  const operation = document.querySelector('.operation-section');
  if(operation){
    operation.querySelector('.operation-pins').hidden=false;
    const explanations=[['착용·연결','4방향 센서 조끼와 작업자의 스마트폰을 무선으로 연결합니다.'],['접근 감지','거리 센서가 위험 반경으로 접근하는 물체를 감지합니다.'],['카메라 활성화·전송','감지한 방향의 영상은 Wi-Fi, 거리·방향 정보는 BLE로 스마트폰에 전송합니다.'],['스마트폰 AI 판단','스마트폰의 AI가 이동장비 여부와 작업자와의 충돌 위험을 판단합니다.'],['작업자 직접 경고','조끼의 LED와 경고음으로 작업자에게 직접 알리고 위험 인지와 대피를 돕습니다.']];
    operation.querySelectorAll('[data-operation-step]').forEach(button=>button.addEventListener('click',()=>{
      const selected=Number(button.dataset.operationStep);
      operation.querySelectorAll('[data-operation-step]').forEach(b=>b.setAttribute('aria-pressed',String(Number(b.dataset.operationStep)===selected)));
      operation.querySelectorAll('.operation-steps li').forEach((li,i)=>li.classList.toggle('is-active',i===selected));
      document.querySelector('#operation-current-title').textContent=`0${selected+1} / ${explanations[selected][0]}`;
      document.querySelector('#operation-current-text').textContent=explanations[selected][1];
    }));
  }

  const demo=document.querySelector('.safety-demo');
  if(demo){
    demo.hidden=false;
    const range=document.querySelector('#demo-approach');
    const equipment=document.querySelector('#demo-equipment');
    const play=document.querySelector('#demo-play');
    const scene=window.createSafetyScene?.(document.querySelector('#demo-scene'));
    const radar=demo.querySelector('.radar');
    const object=demo.querySelector('.radar-object');
    const badge=document.querySelector('#demo-badge');
    let frame=0,lastStage=-1,playing=false;
    const soundButton=document.querySelector('#demo-sound');
    let audioContext=null,soundEnabled=false;
    const activeTones=new Set();
    function stopTones(){for(const tone of activeTones){try{tone.stop();}catch(_){}}activeTones.clear();}
    function warnSound(){
      if(!soundEnabled||!audioContext||audioContext.state!=='running')return;
      stopTones();
      for(const delay of [0,.23]){
        const tone=audioContext.createOscillator(),gain=audioContext.createGain(),start=audioContext.currentTime+delay;
        tone.frequency.value=740;tone.type='sine';gain.gain.setValueAtTime(0,start);
        gain.gain.linearRampToValueAtTime(.06,start+.015);gain.gain.linearRampToValueAtTime(0,start+.15);
        tone.connect(gain);gain.connect(audioContext.destination);activeTones.add(tone);
        tone.onended=()=>{activeTones.delete(tone);tone.disconnect();gain.disconnect();};tone.start(start);tone.stop(start+.16);
      }
    }
    soundButton.addEventListener('click',async()=>{
      if(soundEnabled){soundEnabled=false;stopTones();}
      else {
        const Audio=window.AudioContext||window.webkitAudioContext;
        if(!Audio){soundButton.textContent='이 브라우저는 경고음을 지원하지 않아요';soundButton.disabled=true;return;}
        try{audioContext??=new Audio();await audioContext.resume();soundEnabled=audioContext.state==='running';}
        catch(_){soundEnabled=false;}
      }
      soundButton.setAttribute('aria-pressed',String(soundEnabled));
      soundButton.textContent=soundEnabled?'경고음 켜짐 · 끄기':'경고음 켜기';
      if(soundEnabled&&lastStage===3)warnSound();
    });
    const icons={forklift:'<path d="M5 15h18v16H5zM14 15V5h16v26M34 2v30h12"/><circle cx="12" cy="33" r="4"/><circle cx="26" cy="33" r="4"/>',truck:'<path d="M3 7h25v24H3zM28 17h10l8 9v5H28M33 17v9h13"/><circle cx="12" cy="33" r="4"/><circle cx="37" cy="33" r="4"/>',excavator:'<path d="M5 25h23v8H5zM10 25V13h12v12M22 14l9-9 10 8 4 11-7 3-3-5h10"/><rect x="4" y="31" width="28" height="6" rx="3"/>'};
    function stop(){cancelAnimationFrame(frame);frame=0;playing=false;play.innerHTML='접근 시나리오 재생 <span aria-hidden="true">▷</span>';play.setAttribute('aria-pressed','false');}
    function render(force=false){
      const value=Number(range.value),{clearance,stage}=window.SafeLierScenario.sample(value);
      demo.dataset.stage=String(stage);
      range.style.setProperty('--approach',value+'%');
      document.querySelector('#demo-distance-label').textContent=['접근 전','후방 접근','큰 원 진입','미리 경고'][stage];
      scene?.update({value,equipment:equipment.value,stage});
      const [label,angle,dx,dy]=['후방',180,0,1];
      const distance=clearance*7;
      object.style.left=`${50+dx*distance}%`;object.style.top=`${50+dy*distance}%`;
      radar.style.setProperty('--direction',angle+'deg');
      const item=equipment.selectedOptions[0].textContent;
      document.querySelector('#demo-object-label').textContent=item;
      const states=[['감지 대기','보이지 않는 뒤쪽을 살피고 있어요.','작업자 뒤에서 장비가 접근합니다. 큰 원 진입 시 스마트폰 AI가 판단하고, 작은 원 도달 전에 조끼가 경고합니다.'],['접근 감지',`${label}에서 접근을 감지했어요.`,`거리 센서가 ${item}의 접근을 감지하고, 해당 방향의 카메라를 활성화하는 단계입니다.`],['AI 판단','큰 원 진입 — 스마트폰이 위험을 판단해요.',`${item}의 앞부분이 큰 원에 들어왔어요. 센서가 전달한 영상·거리·방향 정보를 스마트폰 AI가 분석합니다.`],['직접 경고','작은 원에 닿기 전, 후방 위험을 알려요.','장비와 작업자 사이에 여유가 있을 때 조끼가 LED·경고음으로 미리 알립니다. 체험 속 장비는 작은 원 밖에서 멈춥니다.']];
      badge.textContent=states[stage][0];range.setAttribute('aria-valuetext',`${label} ${item}, ${states[stage][0]}`);
      demo.querySelectorAll('[data-step]').forEach(el=>el.classList.toggle('is-active',Number(el.dataset.step)<=stage));
      if(stage===3&&lastStage!==3)warnSound();
      if(stage!==3)stopTones();
      if(stage!==lastStage||force){document.querySelector('#demo-state-title').textContent=states[stage][1];document.querySelector('#demo-state-description').textContent=states[stage][2];lastStage=stage;}
    }
    equipment.addEventListener('change',()=>{stop();object.querySelector('svg').innerHTML=icons[equipment.value];render(true);});
    range.addEventListener('input',()=>{stop();render();});
    play.setAttribute('aria-pressed','false');
    play.addEventListener('click',()=>{
      if(playing){stop();return;}
      if(reduceMotion.matches){range.value='100';render();return;}
      playing=true;play.innerHTML='재생 멈추기 <span aria-hidden="true">Ⅱ</span>';play.setAttribute('aria-pressed','true');range.value='0';render();
      const start=performance.now();
      function tick(now){range.value=String(Math.min(100,Math.round((now-start)/65)));render();if(Number(range.value)<100)frame=requestAnimationFrame(tick);else stop();}
      frame=requestAnimationFrame(tick);
    });
    document.querySelector('#demo-reset').addEventListener('click',()=>{stop();range.value='0';scene?.resetView();render();});
    document.addEventListener('visibilitychange',()=>{if(document.hidden){stop();stopTones();}});
    reduceMotion.addEventListener('change',e=>{if(e.matches)stop();});render();
  }

  const guide=document.querySelector('.guide-panel');
  if(guide){
    guide.hidden=false;
    const types={investment:{name:'투자',topics:[['development','제품 개발'],['market','시장·사업화'],['validation','PoC 검증']],text:'제품 개발 단계와 사업화 계획을 바탕으로 투자 가능성을 이야기합니다.'},partnership:{name:'사업 제휴',topics:[['distribution','유통·공급'],['technical','기술 협력'],['adoption','사업장 도입']],text:'서로의 역량과 현장 조건을 바탕으로 협업 방향을 함께 찾습니다.'},poc:{name:'PoC·현장 실증',topics:[['forklift','지게차'],['truck','트럭'],['excavator','굴착기']],text:'이동장비와 작업자 동선, 착용 조건 및 후속 실증 범위를 협의합니다.'}};
    let type='investment',topic='development';
    const topics=document.querySelector('#guide-topics');
    function update(){const data=types[type];const title=data.topics.find(t=>t[0]===topic)[1];document.querySelector('#guide-result-title').textContent=`${data.name} · ${title}`;document.querySelector('#guide-result-description').textContent=data.text;document.querySelector('#guide-contact').href=`contact.html?type=${type}&topic=${topic}`;topics.querySelectorAll('button').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.topic===topic)));}
    function makeTopics(){topics.replaceChildren();types[type].topics.forEach(([value,label])=>{const b=document.createElement('button');b.type='button';b.textContent=label;b.dataset.topic=value;b.addEventListener('click',()=>{topic=value;update();});topics.append(b);});update();}
    guide.querySelectorAll('[data-guide-type]').forEach(b=>b.addEventListener('click',()=>{type=b.dataset.guideType;topic=types[type].topics[0][0];guide.querySelectorAll('[data-guide-type]').forEach(x=>x.setAttribute('aria-pressed',String(x===b)));makeTopics();}));makeTopics();
  }

  const form=document.querySelector('#contact-form');
  if(form){
    const message=form.querySelector('textarea[name=message]');
    const params=new URLSearchParams(location.search),topic=params.get('topic');
    const topics={development:'제품 개발',market:'시장·사업화',validation:'PoC 검증',distribution:'유통·공급',technical:'기술 협력',adoption:'사업장 도입',forklift:'지게차',truck:'트럭',excavator:'굴착기'};
    if(topics[topic])message.value=`관심 주제: ${topics[topic]}\n\n상세 문의: `;
    const helper=document.createElement('p');helper.className='inquiry-helper';helper.setAttribute('role','status');form.querySelector('fieldset').after(helper);
    const hints={'투자 문의':'관심 있는 개발 단계나 사업화 주제를 알려주시면 대화를 시작하기 좋습니다.','사업 제휴':'소속과 협업 분야, 함께 만들고 싶은 방향을 편하게 적어주세요.','PoC·현장 실증':'사용 장비와 작업자 동선, 현장 상황을 알려주시면 실증 범위를 논의하는 데 도움이 됩니다.'};
    function hint(){helper.textContent=hints[form.querySelector('input[name=type]:checked').value];}form.querySelectorAll('input[name=type]').forEach(r=>r.addEventListener('change',hint));hint();
    const count=document.createElement('span');count.className='message-count';message.after(count);function updateCount(){count.textContent=`${message.value.length.toLocaleString()} / 3,000`;}message.addEventListener('input',updateCount);updateCount();
  }
})();
