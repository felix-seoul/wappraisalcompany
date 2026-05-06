/* W Appraisal Company — main.js */
'use strict';

/* ─── GOOGLE APPS SCRIPT ENDPOINT ─── */
/* 배포 후 이 URL을 실제 Apps Script Web App URL로 교체하세요 */
const GAS_URL = 'https://script.google.com/macros/s/YOUR_SCRIPT_ID_HERE/exec';

/* ─── DOM READY ─── */
document.addEventListener('DOMContentLoaded', () => {
  initHeader();
  initMobileMenu();
  initForms();
  initReviewsClone();
});

/* ─── HEADER SCROLL ─── */
function initHeader() {
  const header = document.querySelector('header');
  if (!header) return;
  const onScroll = () => header.classList.toggle('scrolled', window.scrollY > 40);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

/* ─── MOBILE MENU ─── */
function initMobileMenu() {
  const btn = document.getElementById('mobile-menu-btn');
  const nav = document.getElementById('mobile-nav');
  if (!btn || !nav) return;

  btn.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('open');
    btn.classList.toggle('open', isOpen);
    btn.setAttribute('aria-expanded', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  /* Close on link click */
  nav.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      nav.classList.remove('open');
      btn.classList.remove('open');
      btn.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    });
  });

  /* Close on outside click */
  document.addEventListener('click', e => {
    if (!btn.contains(e.target) && !nav.contains(e.target)) {
      nav.classList.remove('open');
      btn.classList.remove('open');
      btn.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    }
  });
}

/* ─── FORMS ─── */
function initForms() {
  /* Main inquiry form (homepage) */
  const mainForm = document.getElementById('inquiry-form');
  if (mainForm) handleForm(mainForm, 'inquiry');

  /* Contact page form */
  const contactForm = document.getElementById('contact-form');
  if (contactForm) handleForm(contactForm, 'contact');
}

function handleForm(form, type) {
  form.addEventListener('submit', async e => {
    e.preventDefault();
    const btn = form.querySelector('.form-submit');
    const successEl = form.parentElement.querySelector('.form-success') ||
                      form.nextElementSibling;

    /* Basic validation */
    const required = form.querySelectorAll('[required]');
    let valid = true;
    required.forEach(el => {
      el.style.borderColor = '';
      if (!el.value.trim()) { el.style.borderColor = '#B04040'; valid = false; }
    });
    if (!valid) return;

    btn.disabled = true;
    btn.textContent = '전송 중...';

    const data = Object.fromEntries(new FormData(form));
    data._type = type;
    data._time = new Date().toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' });

    try {
      await fetch(GAS_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      /* no-cors always returns opaque — treat as success */
      showSuccess(form, successEl);
    } catch (err) {
      /* Fallback: open mailto */
      const subject = encodeURIComponent('[W 감정평가사무소] 상담 문의');
      const body = encodeURIComponent(Object.entries(data).map(([k,v]) => `${k}: ${v}`).join('\n'));
      window.location.href = `mailto:wac@hometax.go.kr?subject=${subject}&body=${body}`;
      btn.disabled = false;
      btn.textContent = '상담 신청';
    }
  });
}

function showSuccess(form, successEl) {
  form.style.display = 'none';
  if (successEl) {
    successEl.style.display = 'block';
  }
}

/* ─── REVIEWS AUTO-CLONE (infinite scroll) ─── */
function initReviewsClone() {
  const track = document.querySelector('.reviews-track');
  if (!track) return;
  /* Clone for seamless loop */
  const clone = track.cloneNode(true);
  clone.setAttribute('aria-hidden', 'true');
  track.parentElement.appendChild(clone);
}

/* ─── SMOOTH ANCHOR SCROLL ─── */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const offset = 72;
    window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - offset, behavior: 'smooth' });
  });
});
