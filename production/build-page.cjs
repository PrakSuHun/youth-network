const fs=require('fs');
const path=require('path');
const section=name=>fs.readFileSync(path.join(__dirname,'sections',name+'.html'),'utf8');
const nav=[['index','홈'],['solution','솔루션·기술'],['team','팀 소개'],['partnership','투자·제휴'],['faq','FAQ'],['contact','문의']];
const imageInfo={
 'home-sensor-sculpture':['곡선형 라임 아크릴과 단일 센서의 제품 연출 이미지','AI 생성 제품 연출 이미지'],
 'home-design-dialogue':['소재와 조끼 스케치를 함께 검토하는 협업 연출 이미지','AI 생성 디자인 협업 연출 이미지'],
 'home-partner-space':['산업 현장을 바라보는 밝은 미팅 공간 연출 이미지','AI 생성 파트너십 공간 연출 이미지'],
 'validation-lane':['독립된 시험 구역에서 착용 상태를 확인하는 개발 검증 개념 이미지','AI 생성 통제 시험 개념 이미지'],
 'team-evening-purpose':['저녁빛 아래 안전 조끼를 입고 건물로 향하는 작업자 연출 이미지','AI 생성 브랜드 스토리 연출 이미지'],
 'faq-hands-on':['센서와 스마트폰 설정 화면을 손으로 확인하는 사용 안내 개념 이미지','AI 생성 사용 안내 개념 이미지'],
 'contact-shared-next':['센서를 조심스럽게 건네는 협업 연출 이미지','AI 생성 협업 연출 이미지'],
 'worker-field':['현장에서 안전 조끼를 착용한 작업자의 AI 생성 개념 이미지','AI 생성 착용·현장 개념 이미지'],
 'sensor-kit':['4개의 거리 센서·카메라 단말 구성 개발 개념 이미지','AI 생성 제품 구성 개념 이미지'],
 'phone-ai':['스마트폰에서 이동장비의 접근 위험을 판단하는 앱 개발 개념 이미지','AI 생성 앱·제품 개발 개념 이미지'],
 'vest-rear':['어깨 뒤쪽 센서가 장착된 안전 조끼의 후면 개발 개념 이미지','AI 생성 제품 개발 개념 이미지'],
 'led-detail':['어깨 센서의 LED가 켜진 경고 기능 개발 개념 이미지','AI 생성 경고 기능 개념 이미지'],
 'test-bench':['조끼의 센서 장착 구조를 조정하는 개발 과정 연출 이미지','AI 생성 개발 과정 연출 이미지 · 실제 연구실 사진이 아닙니다'],
 'factory-wide':['제조 현장과 안전 조끼를 함께 보여주는 적용 환경 개념 이미지','AI 생성 적용 환경 개념 이미지'],
 'partnership-table':['안전 조끼, 스마트폰, 안전모를 배치한 파트너십 연출 이미지','AI 생성 파트너십 연출 이미지']
};
function photo(name,cls='',eager=false){const [alt,note]=imageInfo[name];return `<figure class="editorial-photo ${cls}"><img src="assets/generated/${name}.webp" srcset="assets/generated/${name}-800.webp 800w, assets/generated/${name}.webp 1536w" sizes="(max-width: 700px) 100vw, 60vw" width="1536" height="1024" alt="${alt}" loading="${eager?'eager':'lazy'}" ${eager?'fetchpriority="high"':''}><figcaption>${note}</figcaption></figure>`;}
function link(href,label,style='text-link'){return `<a class="${style}" href="${href}">${label}<span aria-hidden="true">↗</span></a>`;}
function masthead(eyebrow,title,description,img,extra=''){return `<section class="page-masthead ${img?'has-image':'text-masthead'}" id="top"><div class="masthead-copy"><p class="eyebrow">${eyebrow}</p><h1>${title}</h1><p class="masthead-description">${description}</p>${extra}</div>${img?photo(img,'masthead-photo',true):''}</section>`;}
function cta(title='더 안전한 내일을,<br>함께 만들어갑니다.',desc='투자와 제휴, PoC·현장 실증을 함께할 파트너를 기다립니다.'){return `<section class="page-cta section-shell"><div><p class="eyebrow">LET’S MAKE WORK SAFER</p><h2>${title}</h2><p>${desc}</p></div>${link('contact.html','이야기 나누기','button navy')}</section>`;}
function editorial(eyebrow,title,body,img,reverse=false,extra=''){return `<section class="editorial-row ${reverse?'reverse':''}">${photo(img)}<div class="editorial-copy"><p class="eyebrow">${eyebrow}</p><h2>${title}</h2><p>${body}</p>${extra}</div></section>`;}
const home=section('hero')+`<div class="sense-strip" aria-label="감지, 판단, 경고"><span>SENSE</span><i aria-hidden="true">→</i><span>UNDERSTAND</span><i aria-hidden="true">→</i><span>ALERT</span></div>`+
 `<section class="home-product section-shell" id="product" aria-labelledby="product-title"><div class="section-intro"><div><p class="eyebrow">MEET SAFE-LIER</p><h2 id="product-title">입는 안전장치,<br>세이플라이어를 만나보세요.</h2></div><p>조끼의 4방향 센서와 스마트폰 AI.<br>감지부터 경고까지, 작업자 곁에서 연결됩니다.</p></div><div class="home-product-grid">${[
  ['sensor-kit','01 / SENSE','조끼에 담은 네 방향의 감지','전·후·좌·우에 장착하는 4개의 센서 단말. 작업자 주변의 접근 위험을 감지하도록 설계합니다.'],
  ['phone-ai','02 / UNDERSTAND','스마트폰으로 연결되는 AI','센서가 전달한 영상과 거리 정보를 바탕으로, 스마트폰의 온디바이스 AI가 충돌 위험을 판단합니다.'],
  ['led-detail','03 / ALERT','작업자에게 바로 닿는 경고','위험을 판단하면 조끼의 LED와 경고음으로 알립니다. 작업자가 위험을 인지하고 대피하도록 돕습니다.']
 ].map(([img,step,title,desc])=>`<article>${photo(img).replace('sizes="(max-width: 700px) 100vw, 60vw"','sizes="(max-width: 600px) 100vw, (max-width: 1920px) 33vw, 560px"')}<div class="home-product-copy"><p class="eyebrow">${step}</p><h3>${title}</h3><p>${desc}</p></div></article>`).join('')}</div><div class="home-product-footer"><p>현재 시제품 개발 중이며, 이미지는 개발 방향을 보여주는 AI 생성 개념 이미지입니다.</p>${link('solution.html#configuration','제품 구성과 작동 원리 보기')}</div></section>`+
 editorial('SAFETY, WHERE YOU ARE','안전은,<br>사람이 있는 곳에.','세이플라이어는 작업자를 따라 움직이는 안전을 생각합니다. 조끼의 4방향 센서와 스마트폰 AI를 연결해, 위험을 감지하고 작업자에게 직접 알리는 웨어러블 안전장치를 개발합니다.','worker-field',true,link('solution.html','솔루션·기술 알아보기'))+
 section('home-explanation')+
 `<section class="explore section-shell"><div class="section-intro"><div><p class="eyebrow">DISCOVER SAFE-LIER</p><h2>기술과 사람,<br>함께 만드는 다음.</h2></div><p>제품의 원리부터 함께할 기회까지.<br>세이플라이어를 더 가까이 만나보세요.</p></div><div class="explore-grid">${[['solution','home-sensor-sculpture','01 / SOLUTION & TECHNOLOGY','작은 장치에 담긴 기술','제품 구성과 작동 원리를 살펴보세요.'],['team','home-design-dialogue','02 / OUR TEAM','안전을 만드는 사람들','상용화 경험과 AI 연구 역량을 소개합니다.'],['partnership','home-partner-space','03 / PARTNERSHIP','현장을 바꿀 새로운 가능성','투자·제휴와 현장 실증을 함께합니다.']].map(([page,img,eye,title,desc])=>`<a href="${page}.html" class="explore-card">${photo(img)}<div><p class="eyebrow">${eye}</p><h3>${title}<span aria-hidden="true">↗</span></h3><p>${desc}</p></div></a>`).join('')}</div></section>`+cta();
const solution=masthead('SOLUTION & TECHNOLOGY','조끼가 감지하고,<br>스마트폰이 판단합니다.','지게차·트럭·굴착기의 접근 위험을 감지하고,<br>조끼의 LED·경고음으로 작업자에게 직접 알리는 안전장치.','vest-rear',`<span class="tag">시제품/MVP 개발 중</span>`)+
 `<nav class="section-nav" aria-label="솔루션·기술 페이지 내 메뉴"><a href="#technology">작동 원리</a><a href="#experience">직접 체험</a><a href="#solution">핵심 기능</a><a href="#configuration">제품 구성</a><a href="#field">현장의 문제</a><a href="#roadmap">개발 계획</a></nav>`+
 section('technology')+section('experience')+section('features')+
 `<div id="configuration">${editorial('ONE WORKER, ONE SET','네 방향의 감지.<br>하나로 연결된 안전.','1세트는 센서 단말 4개와 스마트폰 앱·온디바이스 AI로 구성합니다. 어깨 전·후·좌·우의 접근 위험을 감지하고, 작업자가 보유한 스마트폰과 연결합니다. 조끼 등 착용 구조는 현장 조건에 따라 협의합니다.','sensor-kit',false,`<dl class="spec-lines"><div><dt>감지 장치</dt><dd>4방향 거리 센서·카메라</dd></div><div><dt>판단 장치</dt><dd>작업자 스마트폰의 온디바이스 AI</dd></div><div><dt>알림 방식</dt><dd>조끼의 LED 경고등·경고음</dd></div></dl>`)}</div>`+
 
 editorial('INTELLIGENCE, ON YOUR PHONE','위험을 판단하는 곳은,<br>작업자의 스마트폰.','거리 센서가 접근을 감지하면 해당 방향의 카메라가 활성화됩니다. 영상은 Wi-Fi로, 거리·방향 정보는 BLE로 전송됩니다. 스마트폰의 AI가 지게차·트럭·굴착기 등 이동장비와 충돌 위험 여부를 판단하도록 개발합니다.','phone-ai',true)+
 editorial('A WARNING THAT REACHES YOU','경고의 마지막 목적지.<br>바로, 작업자.','위험 판단 후 조끼의 LED와 경고음으로 작업자에게 직접 알립니다. 관제실과 관리자를 거치는 경로를 줄이고, 작업자가 위험을 인지해 대피하도록 돕는 것이 목표입니다.','led-detail',false,`<p class="fine-print">경고 지연시간·인지율은 3개월차 통제 시험에서 측정할 예정입니다.</p>`)+
 section('why').replace('class="why section-shell"','class="why section-shell" id="field"')+
 `<div class="development-banner">${photo('validation-lane')}<div><p class="eyebrow">BUILD. TEST. IMPROVE.</p><h2>만들고, 시험하고,<br>현장에서 개선합니다.</h2></div></div>`+section('roadmap')+cta('다음 검증은,<br>당신의 현장에서.','현장 조건에 맞는 PoC·실증 가능성을 함께 이야기합니다.');
const team=masthead('THE PEOPLE BEHIND SAFE-LIER','기술의 시작도,<br>끝도 사람입니다.','현장을 이해하는 제품 상용화 경험과<br>새로운 가능성을 찾는 AI 연구 역량이 만났습니다.','test-bench')+
 section('team')+
 editorial('OUR REASON TO BUILD','반딧불처럼 밝히고,<br>위험한 순간을 지키다.','Safe-Lier는 안전을 뜻하는 Safely와 사람을 뜻하는 -er에서 출발했습니다. 반딧불처럼 어둠을 밝히는 장비, 작업자 곁에서 위험을 먼저 알리는 기술. 세이플라이어가 만들어가는 방향입니다.','team-evening-purpose',true)+
 `<section class="team-values section-shell"><p class="eyebrow">WHAT WE BELIEVE</p><h2>우리가 만드는 기술의 기준.</h2><div class="home-principles"><div><span>01</span><h3>작업자를 중심에</h3><p>장비와 공간의 관점에서 한 걸음 더 나아가, 작업자의 이동과 주변 위험을 기준으로 생각합니다.</p></div><div><span>02</span><h3>현장의 목소리에서</h3><p>안전관리 담당자 5명의 심층 인터뷰에서 확인한 경고 지연과 설치 부담을 개발의 출발점으로 삼았습니다.</p></div><div><span>03</span><h3>검증으로 쌓는 신뢰</h3><p>감지 여부, 오경보, 경고 지연시간을 기록하고 통제 시험과 후속 현장 실증으로 개선합니다.</p></div></div>${link('solution.html#roadmap','개발·검증 계획 보기')}</section>`+cta();
const partnership=masthead('GROW WITH SAFE-LIER','한 사람의 안전이,<br>현장의 변화가 되도록.','투자, 사업 제휴, PoC·현장 실증.<br>작업자 중심 안전의 다음 단계를 함께 만들어갑니다.','partnership-table',link('contact.html','투자·제휴 문의','button lime'))+
 `<section class="partner-paths section-shell"><div class="section-intro"><div><p class="eyebrow">WAYS TO WORK TOGETHER</p><h2>함께할 수 있는 세 가지 길.</h2></div><p>현재 시제품/MVP를 개발하고 있습니다.<br>관심 분야에 맞춰 이야기를 시작해주세요.</p></div><div class="path-grid">${[['01','투자','웨어러블 안전장치의 개발 방향, 시장 가정과 사업화 계획을 함께 검토합니다.','investment','투자 문의'],['02','사업 제휴','산업안전용품 유통사·안전설비 공급업체 등과 제품 공급 및 판로 가능성을 논의합니다.','partnership','제휴 문의'],['03','PoC·현장 실증','이동장비와 작업자 동선이 겹치는 현장에서 착용 구조와 실증 범위를 협의합니다.','poc','현장 실증 문의']].map(([n,title,desc,type,cta])=>`<article><span>${n}</span><h3>${title}</h3><p>${desc}</p>${link('contact.html?type='+type,cta)}</article>`).join('')}</div></section>`+
 section('business')+
 editorial('FOR MANUFACTURING WORKPLACES','기존 현장에,<br>새로운 안전의 가능성을.','특히 안전 인프라 구축 부담이 큰 중소 제조사업장과 50인 미만 사업장을 우선으로 생각합니다. 사업장 단위 계약과 작업자 수에 맞춘 세트 공급을 계획합니다.','factory-wide',true,link('solution.html#roadmap','개발 및 실증 계획 확인'))+cta();
const faq=masthead('QUESTIONS, ANSWERED','세이플라이어에 대해<br>궁금하신가요?','제품의 원리와 도입 조건, 현재 개발 단계를 확인하세요.',null)+section('faq')+
 editorial('TAKE A CLOSER LOOK','구성부터 작동 원리까지,<br>더 자세히 살펴보세요.','조끼의 센서에서 스마트폰 AI, 작업자에게 직접 닿는 경고까지. 감지·판단·경고가 이어지는 과정을 소개합니다.','faq-hands-on',true,link('solution.html','솔루션·기술 보기'))+cta('찾으시는 답이<br>아직 없으신가요?','대표 이메일과 문의 폼으로 편하게 남겨주세요.');
const contact=masthead('CONTACT SAFE-LIER','안전을 위한 다음 대화,<br>여기서 시작합니다.','투자와 사업 제휴, PoC·현장 실증에 관한 이야기를 기다립니다.',null)+section('contact')+
 `<section class="contact-bottom">${photo('contact-shared-next')}<div><p class="eyebrow">A SAFER TOMORROW, TOGETHER</p><h2>작업자를 지키는 기술.<br>함께 넓혀갈 가능성.</h2><p>세이플라이어 · Safe-Lier</p></div></section>`;
const pages={index:{label:'홈',title:'안전의 중심에, 사람을 놓다',body:home},solution:{label:'솔루션·기술',title:'작업자 곁의 감지·판단·경고',body:solution},team:{label:'팀 소개',title:'안전을 만드는 사람들',body:team},partnership:{label:'투자·제휴',title:'현장의 변화를 함께 만드는 파트너십',body:partnership},faq:{label:'FAQ',title:'자주 묻는 질문',body:faq},contact:{label:'문의',title:'투자·제휴 및 현장 실증 문의',body:contact}};
const anchorPages={solution:'solution.html#solution',technology:'solution.html#technology',roadmap:'solution.html#roadmap',team:'team.html#team',business:'partnership.html#business',faq:'faq.html#faq',contact:'contact.html#contact'};
// Keep each page visually varied; the home overview shares product images with solution details.
for(const [page,content] of Object.entries(pages)){
 const imageHashes=new Map();
 for(const match of content.body.matchAll(/<img\b[^>]*\bsrc="([^"]+)"/g)){
  const src=match[1];
  const hash=require('crypto').createHash('sha256').update(fs.readFileSync(src)).digest('hex');
  if(imageHashes.has(hash))throw new Error(`Repeated content image: ${page}/${src} and ${imageHashes.get(hash)}`);
  imageHashes.set(hash,`${page}/${src}`);
 }
}
for(const [key,p] of Object.entries(pages)){
 const navHTML=nav.map(([slug,label])=>`<a href="${slug}.html"${slug===key?' aria-current="page"':''}>${label}</a>`).join('');
 let body=p.body.replace(/href="#(solution|technology|roadmap|team|business|faq|contact)"/g,(_,id)=>`href="${anchorPages[id]}"`);
 // The solution subnavigation stays local; each top-level navigation item is a separate document.
 if(key==='solution')body=body.replaceAll('href="solution.html#','href="#');
 const html=`<!doctype html><html lang="ko"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${p.label} | Safe-Lier 세이플라이어 — ${p.title}</title><meta name="description" content="${p.title}. 4방향 센서와 스마트폰 온디바이스 AI를 연결하는 작업자 중심 웨어러블 안전장치, 세이플라이어."><meta name="theme-color" content="#f6f7f9"><meta property="og:title" content="Safe-Lier — ${p.title}"><meta property="og:description" content="작업자 곁의 AI 웨어러블 안전장치. 세이플라이어."><meta property="og:type" content="website"><meta property="og:locale" content="ko_KR"><link rel="icon" href="assets/brand-mark.png" type="image/png"><link rel="preload" href="assets/PretendardVariable.woff2" as="font" type="font/woff2" crossorigin>${key==='index'?'<link rel="preload" href="assets/hero-product.webp" as="image">':''}<link rel="stylesheet" href="styles.css"><link rel="stylesheet" href="multipage.css"><link rel="stylesheet" href="experience.css"><script src="app.js" defer></script>${key==='solution'?'<link rel="stylesheet" href="experience-3d.css"><script src="assets/vendor/three-0.160.1.min.js" defer></script><script src="assets/vendor/worker-loader.min.js" defer></script><script src="assets/models/worker-data.js" defer></script><script src="experience-3d.js" defer></script>':''}<script src="experience.js" defer></script></head><body class="page-${key}"><a class="skip-link" href="#main">본문으로 바로가기</a><header class="site-header"><div class="header-inner"><a class="wordmark" href="index.html" aria-label="Safe-Lier 홈">Safe-Lier<span class="brand-dot"></span></a><nav class="desktop-nav" aria-label="주 메뉴">${navHTML}</nav><a class="button lime header-cta" href="contact.html">투자·제휴 문의 <span aria-hidden="true">↗</span></a><button class="menu-toggle" aria-label="메뉴 열기" aria-expanded="false" aria-controls="mobile-nav"><span></span><span></span></button></div><nav id="mobile-nav" class="mobile-nav" aria-label="모바일 메뉴" hidden>${navHTML}</nav></header><div class="reading-progress" aria-hidden="true"><span></span></div><main id="main">${key==='index'?'':`<div class="breadcrumb"><a href="index.html">홈</a><span aria-hidden="true">/</span><span>${p.label}</span></div>`}${body}</main><footer class="site-footer"><div class="footer-top"><a class="wordmark" href="index.html">Safe-Lier<span class="brand-dot"></span></a><p>반딧불처럼 어둠 속을 밝히고,<br>위험한 순간 작업자를 지키는 기술.</p><a class="back-top" href="#top">맨 위로 <span aria-hidden="true">↑</span></a></div><nav class="footer-nav" aria-label="하단 메뉴">${navHTML}</nav><div class="footer-bottom"><p>세이플라이어 · 대표자 송경순 · 예비창업 / 시제품 개발 중</p><p>© 2026 Safe-Lier. All rights reserved.</p></div></footer></body></html>`;
 fs.writeFileSync(key+'.html',html);
}
console.log('Built '+Object.keys(pages).length+' pages.');
