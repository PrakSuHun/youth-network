'use strict';
(() => {
  const HIDE_KEY = 'creditPopupHiddenUntil';
  const SEEN_KEY = 'creditPopupSeen';
  const store = (area, fn) => { try { return fn(window[area]); } catch { return null; } };

  const markup = `
<div class="credit-dialog" role="dialog" aria-modal="true" aria-labelledby="credit-title">
  <button class="credit-close" type="button" aria-label="닫기">×</button>
  <div class="credit-head">
    <img src="assets/partner/djyouth-foundation.png" width="800" height="161" alt="대전청년내일재단 Daejeon Youth Futures Foundation">
    <span class="credit-badge">2026 청년네트워크 지원사업 · 협업 프로젝트</span>
    <h2 id="credit-title">대전청년내일재단과 함께<br><em>청년의 아이디어가 현실이 되었습니다</em></h2>
  </div>
  <div class="credit-body">
    <p class="credit-lead">이 웹사이트는 <strong>대전청년내일재단 「청년네트워크 지원사업」</strong>의 일환으로 만들어진 <strong>테크놀로지아 × 프로젠</strong> 팀의 협업 결과물입니다. 재단이 맺어준 청년 네트워크 덕분에, 서로 다른 강점을 가진 두 팀이 만나 하나의 성과를 완성했습니다.</p>
    <div class="credit-teams">
      <article class="credit-team">
        <p class="role">창업동아리 · 예비창업팀</p>
        <h3>테크놀로지아</h3>
        <p>산업 현장의 충돌 사고 문제에서 출발해 AI 웨어러블 안전장치 <strong>세이플라이어</strong>를 창업 아이템으로 발굴·개발했습니다.</p>
      </article>
      <span class="credit-x" aria-hidden="true">×</span>
      <article class="credit-team">
        <p class="role">AI 활용 단체</p>
        <h3><img src="assets/partner/progen-wordmark.png" width="400" height="67" alt="프로젠"></h3>
        <p>AI를 활용해 창업 아이템을 세상에 알릴 수 있는 <strong>홍보 웹사이트</strong>를 기획하고 제작했습니다.</p>
      </article>
    </div>
    <ol class="credit-steps" aria-label="협업 과정">
      <li><b>05월</b>예비창업팀과 대학생 매칭</li>
      <li><b>06월</b>창업 아이템 홍보 웹사이트 기획</li>
      <li><b>07월</b>웹사이트 완성 · 게시 및 홍보</li>
    </ol>
    <p class="credit-thanks">청년이 청년을 돕고, 아이디어가 실제 결과물로 이어질 수 있었던 것은 <strong>대전청년내일재단</strong>의 든든한 지원 덕분입니다. 대전 청년들의 도전을 응원해 주셔서 감사합니다.</p>
    <div class="credit-actions">
      <label><input type="checkbox" class="credit-hide-today"> 오늘 하루 보지 않기</label>
      <button class="button navy credit-confirm" type="button">사이트 둘러보기 <span aria-hidden="true">→</span></button>
    </div>
  </div>
</div>`;

  let backdrop = null;
  let lastFocus = null;

  function close() {
    if (!backdrop) return;
    if (backdrop.querySelector('.credit-hide-today').checked) {
      const until = new Date(); until.setHours(24, 0, 0, 0);
      store('localStorage', s => s.setItem(HIDE_KEY, String(until.getTime())));
    }
    const el = backdrop; backdrop = null;
    el.classList.remove('is-open');
    document.removeEventListener('keydown', onKey);
    setTimeout(() => el.remove(), 300);
    document.body.style.overflow = '';
    if (lastFocus) lastFocus.focus();
  }

  function onKey(event) {
    if (event.key === 'Escape') close();
    if (event.key === 'Tab' && backdrop) {
      const items = [...backdrop.querySelectorAll('button, input')];
      const first = items[0], last = items[items.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    }
  }

  function open() {
    if (backdrop) return;
    lastFocus = document.activeElement;
    backdrop = document.createElement('div');
    backdrop.className = 'credit-backdrop';
    backdrop.innerHTML = markup;
    backdrop.addEventListener('click', event => {
      if (event.target === backdrop || event.target.closest('.credit-close, .credit-confirm')) close();
    });
    document.body.appendChild(backdrop);
    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', onKey);
    requestAnimationFrame(() => backdrop.classList.add('is-open'));
    backdrop.querySelector('.credit-confirm').focus({ preventScroll: true });
    store('sessionStorage', s => s.setItem(SEEN_KEY, '1'));
  }

  const footerBottom = document.querySelector('.footer-bottom');
  if (footerBottom) {
    const link = document.createElement('button');
    link.type = 'button';
    link.className = 'credit-footer-link';
    link.innerHTML = '<img src="assets/partner/djyouth-foundation.png" width="800" height="161" alt=""><span>대전청년내일재단 청년네트워크 지원사업 · 테크놀로지아 × 프로젠 협업 결과물</span>';
    link.addEventListener('click', open);
    footerBottom.after(link);
  }

  const hiddenUntil = Number(store('localStorage', s => s.getItem(HIDE_KEY)) || 0);
  const seen = store('sessionStorage', s => s.getItem(SEEN_KEY));
  if (Date.now() >= hiddenUntil && !seen) setTimeout(open, 700);
})();
