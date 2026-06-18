'use strict';

const GAS_URL = 'https://script.google.com/macros/s/YOUR_SCRIPT_ID_HERE/exec';
const KAKAO_CHAT_URL = 'http://pf.kakao.com/_dBrxbX/chat';

document.addEventListener('DOMContentLoaded', () => {
  initHeader();
  initMobileMenu();
  initForms();
  initKakaoLinks();
  initLanguageSwitcher();
  initReviewsClone();
  initModal();
  initScrollAnimations();
  initCounterAnimation();
  initFeeCalculator();
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
    if (type === 'inquiry') {
      window.open(KAKAO_CHAT_URL, '_blank', 'noopener');
      return;
    }
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

function initKakaoLinks() {
  document.querySelectorAll('[data-kakao-link]').forEach(button => {
    button.addEventListener('click', () => {
      window.open(KAKAO_CHAT_URL, '_blank', 'noopener');
    });
  });
}

function initLanguageSwitcher() {
  const langButtons = document.querySelectorAll('[data-lang]');
  if (!langButtons.length) return;

  const htmlTranslations = [
    ['.hero-h1', '한국 부동산의 가치를<br>신뢰 있게 평가합니다', 'Trusted valuation<br>for Korean real estate'],
    ['.hero-sub', 'W 감정평가사무소는 국내외 고객을 위한 독립 감정평가와 전문 자문 서비스를 제공합니다. 대표 감정평가사가 직접 수행합니다.', 'W Appraisal Company provides independent valuation and advisory services for domestic and international clients, led directly by the principal appraiser.'],
    ['.hero-btns .btn-primary', '프라이빗 상담 신청 →', 'Private consultation →'],
    ['.hero-btns .btn-secondary', '업무분야 보기', 'View services'],
    ['#services .section-title', '의뢰 목적에 맞는<br>감정평가 및 자문 서비스', 'Valuation and advisory<br>for your purpose'],
    ['#services .section-sub', '각 서비스는 대표 감정평가사가 직접 수행합니다.', 'Each service is handled directly by the principal appraiser.'],
    ['#principles .section-title-light', 'W 감정평가사무소가<br>지키는 원칙', 'The principles<br>W Appraisal keeps'],
    ['#principles .section-sub-light', '중요한 부동산 판단 앞에서,<br>신뢰할 수 있는 가치의견을 제공합니다.', 'For important real estate decisions,<br>we provide reliable valuation opinions.'],
    ['#fees .section-title', '감정평가 수수료를<br>간단히 가늠해보세요', 'Estimate appraisal fees<br>before consultation'],
    ['#fees .section-sub', '평가액 기준의 참고용 계산기입니다. 평가 목적, 물건 종류, 난이도, 출장 여부 등에 따라 실제 견적은 달라질 수 있습니다.', 'This reference calculator is based on the appraised value. The final quote may vary by purpose, property type, complexity, and travel.'],
    ['.fee-source-note', '<a href="https://www.law.go.kr/LSW/admRulLsInfoP.do?admRulNm=%EA%B0%90%EC%A0%95%ED%8F%89%EA%B0%80%EB%B2%95%EC%9D%B8%EB%93%B1%EC%9D%98%20%EB%B3%B4%EC%88%98%EC%97%90%20%EA%B4%80%ED%95%9C%20%EA%B8%B0%EC%A4%80" target="_blank" rel="noopener">감정평가법인등의 보수에 관한 기준</a>의 기본수수료표를 기준으로 계산합니다.', 'Calculated from the basic fee table in the <a href="https://www.law.go.kr/LSW/admRulLsInfoP.do?admRulNm=%EA%B0%90%EC%A0%95%ED%8F%89%EA%B0%80%EB%B2%95%EC%9D%B8%EB%93%B1%EC%9D%98%20%EB%B3%B4%EC%88%98%EC%97%90%20%EA%B4%80%ED%95%9C%20%EA%B8%B0%EC%A4%80" target="_blank" rel="noopener">Standards on Remuneration for Appraisal Firms</a>.'],
    ['#company .section-title', '대표 감정평가사가<br>직접 검토하고 수행합니다', 'Reviewed and handled<br>by the principal appraiser'],
    ['#company .principal-p', 'W 감정평가사무소는 의뢰 목적과 대상 부동산의 특성을 면밀히 검토하고, 감정평가사의 전문적 판단에 따라 독립적인 가치의견을 제공합니다.', 'W Appraisal Company carefully reviews the purpose and property characteristics, then provides an independent value opinion based on professional judgment.'],
    ['.inquiry-section .section-title-light', '프라이빗 상담<br>및 문의', 'Private consultation<br>and inquiry'],
  ];

  const textTranslations = [
    ['header nav a[href="#company"], .mobile-nav a[href="#company"]', 'W 소개', 'About W'],
    ['header nav a[href="#services"], .mobile-nav a[href="#services"]', '업무분야', 'Services'],
    ['header nav a[href="#fees"]', '수수료', 'Fees'],
    ['.mobile-nav a[href="#fees"], footer a[href="#fees"]', '수수료 안내', 'Fees'],
    ['header nav a[href="#inquiry"]', 'FAQ', 'FAQ'],
    ['header nav a[href="#case-studies"]', '사례', 'Cases'],
    ['.header-cta', '프라이빗 상담 →', 'Consultation →'],
    ['.svc-card:nth-child(1) .svc-name', '해외고객 자산평가', 'Cross-border valuation'],
    ['.svc-card:nth-child(2) .svc-name', '재무보고 목적 평가', 'Financial reporting valuation'],
    ['.svc-card:nth-child(3) .svc-name', '소송·분쟁 관련 평가', 'Litigation and dispute valuation'],
    ['.svc-card:nth-child(4) .svc-name', '상속·증여 감정', 'Inheritance and gift valuation'],
    ['.svc-card:nth-child(5) .svc-name', '담보·대출 평가', 'Lending valuation'],
    ['.svc-card:nth-child(6) .svc-name', '검토 감정 & 자문', 'Review and advisory'],
    ['.fee-input-row label', '예상 평가액', 'Estimated value'],
    ['.fee-input-wrap span', '원', 'KRW'],
    ['.fee-result div:nth-child(1) dt', '기준 수수료', 'Base fee'],
    ['.fee-result div:nth-child(2) dt', '부가가치세', 'VAT'],
    ['.fee-result-total dt', '예상 합계', 'Estimated total'],
    ['.fee-disclaimer', '본 계산 결과는 상담 전 참고용이며, 공식 견적 또는 청구 금액이 아닙니다.', 'This result is for pre-consultation reference only and is not an official quote or invoice.'],
    ['.pc-title', '대표 감정평가사 · 자격번호 제3280호', 'Principal appraiser · License No. 3280'],
    ['.pc-stat-label', '누적 자문·평가 규모 (2010–현재)', 'Cumulative advisory and valuation volume (2010-present)'],
    ['.btn-kakao span', '카카오로 바로 상담하기', 'Chat on Kakao'],
    ['[data-kakao-link]', '상담 신청하기', 'Start Kakao consultation'],
  ];

  const placeholderTranslations = [
    ['#appraisal-amount', '예) 1,000,000,000', 'e.g. 1,000,000,000'],
  ];

  function applyLanguage(lang) {
    const isEnglish = lang === 'en';
    document.documentElement.lang = isEnglish ? 'en' : 'ko';
    htmlTranslations.forEach(([selector, ko, en]) => {
      document.querySelectorAll(selector).forEach(el => { el.innerHTML = isEnglish ? en : ko; });
    });
    textTranslations.forEach(([selector, ko, en]) => {
      document.querySelectorAll(selector).forEach(el => { el.textContent = isEnglish ? en : ko; });
    });
    placeholderTranslations.forEach(([selector, ko, en]) => {
      document.querySelectorAll(selector).forEach(el => { el.placeholder = isEnglish ? en : ko; });
    });
    langButtons.forEach(button => button.classList.toggle('current', button.dataset.lang === lang));
    localStorage.setItem('wac-lang', lang);
  }

  langButtons.forEach(button => {
    button.addEventListener('click', () => applyLanguage(button.dataset.lang));
  });
  document.querySelectorAll('[data-mobile-lang], [data-footer-lang]').forEach(link => {
    link.addEventListener('click', event => {
      event.preventDefault();
      applyLanguage('en');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  });
  applyLanguage(localStorage.getItem('wac-lang') || 'ko');
}

/* ─── FEE CALCULATOR ─── */
function initFeeCalculator() {
  const input = document.getElementById('appraisal-amount');
  const baseEl = document.getElementById('fee-base');
  const vatEl = document.getElementById('fee-vat');
  const totalEl = document.getElementById('fee-total');
  const presetButtons = document.querySelectorAll('.fee-presets button');
  if (!input || !baseEl || !vatEl || !totalEl) return;

  const formatter = new Intl.NumberFormat('ko-KR');

  function formatWon(value) {
    return `${formatter.format(Math.round(value))}원`;
  }

  function parseAmount(value) {
    return Number(String(value).replace(/[^\d]/g, '')) || 0;
  }

  function calculateAppraisalFee(amount) {
    // 기준: 국가법령정보센터 "감정평가법인등의 보수에 관한 기준"
    // 링크: https://www.law.go.kr/LSW/admRulLsInfoP.do?admRulNm=감정평가법인등의%20보수에%20관한%20기준
    // 확인 기준: [시행 2026. 2. 9.] [국토교통부공고 제2026-145호, 2026. 2. 9., 일부개정]
    // 계산 설명: 별표의 "기본수수료" 산정표처럼 각 구간별 기준액에 초과액 요율을 더합니다.
    // 주의 1: 여비, 공부발급비, 실비, 특수조건, 복수 물건, 영문 보고서 등은 이 계산에서 제외합니다.
    // 주의 2: 부가가치세는 기준 수수료의 10%로 별도 계산해 화면에 표시합니다.
    const feeTable = [
      { upTo: 50000000, base: 200000, threshold: 0, rate: 0 },
      { upTo: 500000000, base: 200000, threshold: 50000000, rate: 11 / 10000 },
      { upTo: 1000000000, base: 695000, threshold: 500000000, rate: 9 / 10000 },
      { upTo: 5000000000, base: 1145000, threshold: 1000000000, rate: 8 / 10000 },
      { upTo: 10000000000, base: 4345000, threshold: 5000000000, rate: 7 / 10000 },
      { upTo: 50000000000, base: 7845000, threshold: 10000000000, rate: 6 / 10000 },
      { upTo: 100000000000, base: 31845000, threshold: 50000000000, rate: 5 / 10000 },
      { upTo: 300000000000, base: 56845000, threshold: 100000000000, rate: 4 / 10000 },
      { upTo: 600000000000, base: 136845000, threshold: 300000000000, rate: 3 / 10000 },
      { upTo: 1000000000000, base: 226845000, threshold: 600000000000, rate: 2 / 10000 },
      { upTo: Infinity, base: 306845000, threshold: 1000000000000, rate: 1 / 10000 },
    ];
    const row = feeTable.find(item => amount <= item.upTo);
    return row.base + Math.max(amount - row.threshold, 0) * row.rate;
  }

  function renderFee() {
    const amount = parseAmount(input.value);
    input.value = amount ? formatter.format(amount) : '';
    presetButtons.forEach(button => {
      button.classList.toggle('active', Number(button.dataset.amount) === amount);
    });

    if (!amount) {
      baseEl.textContent = '-';
      vatEl.textContent = '-';
      totalEl.textContent = '-';
      return;
    }

    const baseFee = calculateAppraisalFee(amount);
    const vat = baseFee * 0.1;
    baseEl.textContent = formatWon(baseFee);
    vatEl.textContent = formatWon(vat);
    totalEl.textContent = formatWon(baseFee + vat);
  }

  input.addEventListener('input', renderFee);
  presetButtons.forEach(button => {
    button.addEventListener('click', () => {
      input.value = button.dataset.amount;
      renderFee();
    });
  });
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
