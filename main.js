'use strict';

const GAS_URL = 'https://script.google.com/macros/s/YOUR_SCRIPT_ID_HERE/exec';

document.addEventListener('DOMContentLoaded', () => {
  initHeader();
  initMobileMenu();
  initForms();
  initReviewsClone();
  initModal();
  initScrollAnimations();
  initCounterAnimation();
  initFilterTabs();
  initRipple();
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
  nav.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      nav.classList.remove('open');
      btn.classList.remove('open');
      btn.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    });
  });
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
  const mainForm = document.getElementById('inquiry-form');
  if (mainForm) handleForm(mainForm, 'inquiry');
  const contactForm = document.getElementById('contact-form');
  if (contactForm) handleForm(contactForm, 'contact');
}

function handleForm(form, type) {
  form.addEventListener('submit', async e => {
    e.preventDefault();
    const btn = form.querySelector('.form-submit');
    const successEl = form.parentElement.querySelector('.form-success') || form.nextElementSibling;
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
        method: 'POST', mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      showSuccess(form, successEl);
    } catch {
      const subject = encodeURIComponent('[W 감정평가사무소] 상담 문의');
      const body = encodeURIComponent(Object.entries(data).map(([k, v]) => `${k}: ${v}`).join('\n'));
      window.location.href = `mailto:wac@hometax.go.kr?subject=${subject}&body=${body}`;
      btn.disabled = false;
      btn.textContent = '상담 신청';
    }
  });
}

function showSuccess(form, successEl) {
  form.style.display = 'none';
  if (successEl) successEl.style.display = 'block';
}

/* ─── REVIEWS CLONE (infinite scroll) ─── */
function initReviewsClone() {
  const track = document.querySelector('.reviews-track');
  if (!track) return;
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
    window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - 72, behavior: 'smooth' });
  });
});

/* ─── TRACK RECORD MODAL ─── */
function initModal() {
  const openBtn = document.getElementById('open-track-modal');
  const overlay = document.getElementById('modal-track');
  const closeBtn = document.getElementById('modal-close');
  if (!openBtn || !overlay) return;

  function openModal() {
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
    closeBtn && closeBtn.focus();
  }
  function closeModal() {
    overlay.classList.remove('open');
    document.body.style.overflow = '';
    openBtn.focus();
  }

  openBtn.addEventListener('click', openModal);
  closeBtn && closeBtn.addEventListener('click', closeModal);

  overlay.addEventListener('click', e => {
    if (e.target === overlay) closeModal();
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && overlay.classList.contains('open')) closeModal();
  });
}

/* ─── FILTER TABS (modal) ─── */
function initFilterTabs() {
  const tabs = document.querySelectorAll('.filter-tab');
  const rows = document.querySelectorAll('.projects-table tbody tr');
  if (!tabs.length) return;

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const filter = tab.dataset.filter;
      rows.forEach(row => {
        if (filter === 'all' || row.dataset.type === filter) {
          row.classList.remove('hidden');
        } else {
          row.classList.add('hidden');
        }
      });
    });
  });
}

/* ─── SCROLL ANIMATIONS ─── */
function initScrollAnimations() {
  const targets = document.querySelectorAll('.svc-card, .trust-item, .process-step, .review-card, .pc-stat');
  targets.forEach((el, i) => {
    el.classList.add('fade-up');
    if (i % 3 === 1) el.classList.add('d1');
    if (i % 3 === 2) el.classList.add('d2');
  });

  const sectionTitles = document.querySelectorAll('.section-title, .hero-h1, .section-title-light');
  sectionTitles.forEach(el => el.classList.add('fade-up'));

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.fade-up').forEach(el => observer.observe(el));
}

/* ─── COUNTER ANIMATION ─── */
function initCounterAnimation() {
  const statEl = document.querySelector('.pc-stat-num');
  if (!statEl) return;

  const target = 701;
  let started = false;

  const observer = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting && !started) {
      started = true;
      animateCount(statEl, 0, target, 1600);
      observer.disconnect();
    }
  }, { threshold: 0.5 });

  observer.observe(statEl);
}

function animateCount(el, from, to, duration) {
  const start = performance.now();
  const originalText = el.textContent;
  function step(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const ease = 1 - Math.pow(1 - progress, 3);
    const current = Math.round(from + (to - from) * ease);
    el.textContent = `₩${current}조`;
    if (progress < 1) requestAnimationFrame(step);
    else el.textContent = originalText;
  }
  requestAnimationFrame(step);
}

/* ─── RIPPLE EFFECT ─── */
function initRipple() {
  document.querySelectorAll('.btn-primary, .btn-secondary, .btn-kakao').forEach(btn => {
    btn.addEventListener('click', function(e) {
      const rect = this.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      const ripple = document.createElement('span');
      ripple.className = 'ripple';
      Object.assign(ripple.style, {
        width: size + 'px', height: size + 'px',
        left: (e.clientX - rect.left - size / 2) + 'px',
        top: (e.clientY - rect.top - size / 2) + 'px',
      });
      this.appendChild(ripple);
      ripple.addEventListener('animationend', () => ripple.remove());
    });
  });
}
