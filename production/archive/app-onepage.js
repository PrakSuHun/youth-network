'use strict';
const menuToggle = document.querySelector('.menu-toggle');
const mobileNav = document.querySelector('#mobile-nav');
function setMenu(open) {
  menuToggle.setAttribute('aria-expanded', String(open));
  menuToggle.setAttribute('aria-label', open ? '메뉴 닫기' : '메뉴 열기');
  mobileNav.hidden = !open;
}
menuToggle.addEventListener('click', () => setMenu(menuToggle.getAttribute('aria-expanded') !== 'true'));
mobileNav.addEventListener('click', event => { if (event.target.closest('a')) setMenu(false); });
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && !mobileNav.hidden) { setMenu(false); menuToggle.focus(); }
});
document.addEventListener('click', event => { if (!event.target.closest('.site-header')) setMenu(false); });
window.matchMedia('(min-width: 801px)').addEventListener('change', event => { if (event.matches) setMenu(false); });

const form = document.querySelector('#contact-form');
const status = document.querySelector('#form-status');
const fallback = document.querySelector('#email-fallback');
const preview = document.querySelector('#inquiry-preview');
function inquiry() {
  for (const field of form.querySelectorAll('input[required], textarea[required]')) {
    field.setCustomValidity(field.value.trim() ? '' : '내용을 입력해주세요.');
  }
  if (!form.reportValidity()) return null;
  const data = new FormData(form);
  const subject = `[Safe-Lier ${data.get('type')}] ${data.get('name').trim()}`;
  const body = `문의 유형: ${data.get('type')}\n이름: ${data.get('name').trim()}\n회사 / 소속: ${data.get('company').trim() || '미기재'}\n회신 이메일: ${data.get('email').trim()}\n\n문의 내용\n${data.get('message').trim()}`;
  return { subject, body };
}
form.addEventListener('input', event => {
  if (event.target.setCustomValidity) event.target.setCustomValidity('');
  status.textContent = '';
  fallback.hidden = true;
});
form.addEventListener('submit', event => {
  event.preventDefault();
  const message = inquiry();
  if (!message) return;
  preview.value = `${message.subject}\n\n${message.body}`;
  fallback.hidden = false;
  status.textContent = '이메일 앱 연결을 요청했습니다. 앱에서 보내기를 눌러야 문의가 전달됩니다.';
  window.location.href = `mailto:kaebbi@gmail.com?subject=${encodeURIComponent(message.subject)}&body=${encodeURIComponent(message.body)}`;
});
document.querySelector('#copy-inquiry').addEventListener('click', async () => {
  const message = inquiry();
  if (!message) return;
  const text = `${message.subject}\n\n${message.body}`;
  preview.value = text;
  fallback.hidden = false;
  try {
    if (!navigator.clipboard?.writeText) throw new Error('Clipboard unavailable');
    await navigator.clipboard.writeText(text);
    status.textContent = '문의 내용을 복사했습니다. kaebbi@gmail.com으로 이메일을 보내주세요.';
  } catch {
    preview.focus();
    preview.select();
    status.textContent = '아래 문의 내용을 선택했습니다. 복사하여 이메일로 보내주세요.';
  }
});
