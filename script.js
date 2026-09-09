// ---- Custom icon set (hand-drawn, stroke-based, no external assets) ----
const ICONS = {
  cart: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M3 4h2l2.4 11.2a2 2 0 0 0 2 1.6h7.2a2 2 0 0 0 2-1.6L20 8H6"/><circle cx="9" cy="20" r="1.3"/><circle cx="17" cy="20" r="1.3"/></svg>',
  beverage: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="7" y="3" width="6" height="3" rx="1"/><path d="M8 6h4l1.4 13.2A2 2 0 0 1 11.4 21H8.6a2 2 0 0 1-2-1.8L6 6"/><path d="M6.5 12h5"/></svg>',
  can: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="4" width="14" height="16" rx="2"/><path d="M5 9h14M5 15h14"/></svg>',
  snack: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M6 8l1-4h10l1 4"/><path d="M6 8a3 3 0 0 0-1 5.6V19a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-5.4A3 3 0 0 0 18 8"/></svg>',
  household: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M10 3h3v3.2l2.3 1.3A3 3 0 0 1 17 10v9a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2v-9a3 3 0 0 1 1.7-2.7L11 6.2z"/><path d="M8.5 13.5h6"/></svg>',
  personal: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="7" width="6" height="14" rx="2"/><rect x="10" y="3" width="4" height="4" rx="1"/></svg>',
  rice: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12a8 8 0 0 0 16 0"/><path d="M4 12c0-1 .4-1.6 1-2M20 12c0-1-.4-1.6-1-2M9 10c-.4-1-.4-2 0-3M15 10c.4-1 .4-2 0-3"/><path d="M4 12h16"/></svg>',
  dairy: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M9 3h6v3.5L17 9v10a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2V9l2-2.5z"/><path d="M7 13h10"/></svg>',
  tissue: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="9" width="16" height="10" rx="1.5"/><path d="M8 9c1-2.5 2.4-4.5 4-6 1.6 1.5 3 3.5 4 6"/></svg>',
  noodles: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M4 11a8 8 0 0 1 16 0v1a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1z"/><path d="M8 9c.6-1 1.4-1 2 0M13 9c.6-1 1.4-1 2 0"/><path d="M6 13l1.5 6M18 13l-1.5 6"/></svg>',
  supplies: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M7 9a5 5 0 0 1 10 0"/><path d="M5.5 9h13l.8 10.2a2 2 0 0 1-2 2.1H6.7a2 2 0 0 1-2-2.1z"/></svg>',
  bottle: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M10 2h4M11 2v4l-2.5 3A3 3 0 0 0 8 11v8a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2v-8a3 3 0 0 0-.5-1.7L13 6V2"/></svg>',
  pack: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="6" y="4" width="12" height="16" rx="2"/><path d="M6 9h12"/></svg>',
  delivery: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M3 7h9v8H3z"/><path d="M12 10h4l3 3v2h-7z"/><circle cx="7" cy="17" r="1.6"/><circle cx="17" cy="17" r="1.6"/></svg>',
  check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M8.5 12.5l2.3 2.3L16 10"/></svg>',
  bulb: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18h6M10 21h4"/><path d="M12 3a6 6 0 0 0-3 11.2c.6.3 1 1 1 1.8h4c0-.8.4-1.5 1-1.8A6 6 0 0 0 12 3z"/></svg>',
  gears: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="14" r="3.2"/><circle cx="17" cy="8" r="2"/><path d="M9 10.8V9M9 17.2V19M6.2 12.2 5 11M11.8 12.2 13 11M6.2 15.8 5 17M11.8 15.8 13 17"/></svg>',
  target: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="4"/><circle cx="12" cy="12" r="0.6" fill="currentColor"/></svg>',
  calendar: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="5" width="16" height="15" rx="2"/><path d="M4 10h16M8 3v4M16 3v4"/></svg>',
  phone: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="7" y="2" width="10" height="20" rx="2"/><path d="M11 18h2"/></svg>',
  pin: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M12 21s7-6.6 7-11.5A7 7 0 0 0 5 9.5C5 14.4 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.3"/></svg>',
  idcard: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="18" height="14" rx="2"/><circle cx="8" cy="11" r="2"/><path d="M5.5 16c.5-1.6 1.6-2.4 2.5-2.4s2 .8 2.5 2.4M14 9h5M14 12.5h5M14 16h3"/></svg>',
  doc: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M7 3h7l3 3v15H7z"/><path d="M14 3v3h3M9.5 12h5M9.5 15.5h5M9.5 8.5h2"/></svg>',
  star: '<svg viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M12 3l2.6 5.6 6.1.7-4.5 4.2 1.2 6-5.4-3-5.4 3 1.2-6-4.5-4.2 6.1-.7z"/></svg>',
  users: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="9" r="3"/><path d="M3.5 19a5.5 5.5 0 0 1 11 0"/><circle cx="17.5" cy="10" r="2.3"/><path d="M15.5 19a4.2 4.2 0 0 1 5-4.1"/></svg>',
  building: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M5 21V8l7-5 7 5v13"/><path d="M5 21h14M9 21v-5h6v5M9 12h.01M15 12h.01M9 9h.01M15 9h.01"/></svg>',
  medicine: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M6.5 9.5l6-6a2.8 2.8 0 0 1 4 4l-6 6z"/><path d="M11 5l4 4"/><path d="M4.5 13.5l6 6a2.8 2.8 0 0 0 4-4l-6-6z"/></svg>',
  search: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="10.5" cy="10.5" r="6.5"/><path d="M20 20l-4.8-4.8"/></svg>',
  megaphone: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M3 10v4a1 1 0 0 0 1 1h2l1.5 5h2L8 15h1l9 4V5l-9 4H4a1 1 0 0 0-1 1z"/><path d="M18 9.5a4 4 0 0 1 0 5"/></svg>',
  chat: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16v12H9l-4 4z"/></svg>',
  info: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8v.01"/></svg>',
  chevronL: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 5l-7 7 7 7"/></svg>',
  chevronR: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 5l7 7-7 7"/></svg>',
};
function iconSVG(name) { return ICONS[name] || ''; }
function initIcons() {
  document.querySelectorAll('[data-icon]').forEach((el) => {
    el.innerHTML = iconSVG(el.getAttribute('data-icon'));
  });
}

// ---- Partial include loader ----
async function loadPartials() {
  const nodes = document.querySelectorAll('[data-include]');
  await Promise.all(Array.from(nodes).map(async (node) => {
    const url = node.getAttribute('data-include');
    try {
      const res = await fetch(url);
      node.innerHTML = await res.text();
    } catch (e) {
      console.error('Failed to load partial', url, e);
    }
  }));
  document.dispatchEvent(new Event('partials:loaded'));
}

function initNavHighlight() {
  const page = document.body.getAttribute('data-page');
  if (!page) return;
  document.querySelectorAll('[data-nav]').forEach((a) => {
    if (a.getAttribute('data-nav') === page) a.classList.add('nav-active');
  });
}

function initAgeGate() {
  const ageGate = document.getElementById('ageGate');
  if (!ageGate) return;
  const ageYes = document.getElementById('ageYes');
  const ageNo = document.getElementById('ageNo');
  ageGate.hidden = !!sessionStorage.getItem('ss_age_confirmed');

  ageYes.addEventListener('click', () => {
    sessionStorage.setItem('ss_age_confirmed', 'true');
    ageGate.hidden = true;
  });

  ageNo.addEventListener('click', () => {
    ageGate.querySelector('.modal-card').innerHTML = `
      <div class="cat-icon">🙏</div>
      <h3>Thanks for letting us know</h3>
      <p>Some sections of this site are only available to visitors 18 years old and above. You can still browse our general grocery catalog.</p>
      <button class="btn btn-primary btn-block" id="ageOk">Continue browsing</button>
    `;
    document.getElementById('ageOk').addEventListener('click', () => {
      ageGate.hidden = true;
    });
  });
}

function initCarousel() {
  const root = document.getElementById('promoCarousel');
  if (!root) return;
  const slides = Array.from(root.querySelectorAll('.promo-slide'));
  const dots = Array.from(root.querySelectorAll('.carousel-dots span'));
  const prevBtn = root.querySelector('.carousel-arrow.left');
  const nextBtn = root.querySelector('.carousel-arrow.right');
  if (!slides.length) return;
  let index = slides.findIndex((s) => s.classList.contains('active'));
  if (index < 0) index = 0;
  let timer = null;

  function show(i) {
    index = (i + slides.length) % slides.length;
    slides.forEach((s, n) => s.classList.toggle('active', n === index));
    dots.forEach((d, n) => d.classList.toggle('active', n === index));
  }
  function next() { show(index + 1); }
  function prev() { show(index - 1); }
  function restartAutoplay() {
    clearInterval(timer);
    timer = setInterval(next, 6000);
  }

  prevBtn?.addEventListener('click', () => { prev(); restartAutoplay(); });
  nextBtn?.addEventListener('click', () => { next(); restartAutoplay(); });
  dots.forEach((d, n) => d.addEventListener('click', () => { show(n); restartAutoplay(); }));

  show(index);
  restartAutoplay();
}

function initChatBubble() {
  const bubble = document.querySelector('.fw-chat-bubble');
  if (!bubble) return;
  const closeBtn = bubble.querySelector('button');
  closeBtn.addEventListener('click', () => { bubble.style.display = 'none'; });
}

function initAnnounceBar() {
  const bar = document.getElementById('announceBar');
  const closeBtn = document.getElementById('announceClose');
  if (!bar || !closeBtn) return;
  if (sessionStorage.getItem('ss_announce_dismissed')) bar.hidden = true;
  closeBtn.addEventListener('click', () => {
    bar.hidden = true;
    sessionStorage.setItem('ss_announce_dismissed', 'true');
  });
}

function initMobileNav() {
  const mobileNav = document.getElementById('mobileNav');
  const openBtn = document.getElementById('openMobileNav');
  const closeBtn = document.getElementById('closeMobileNav');
  if (!mobileNav || !openBtn) return;
  openBtn.addEventListener('click', () => mobileNav.classList.add('open'));
  closeBtn.addEventListener('click', () => mobileNav.classList.remove('open'));
  mobileNav.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => mobileNav.classList.remove('open')));
}

function showToast(msg) {
  const toast = document.getElementById('toast');
  const toastMsg = document.getElementById('toastMsg');
  if (!toast) return;
  toastMsg.textContent = msg;
  toast.classList.add('show');
  clearTimeout(window._toastTimer);
  window._toastTimer = setTimeout(() => toast.classList.remove('show'), 2800);
}

function initDemoButtons() {
  document.querySelectorAll('.btn[data-demo]').forEach((btn) => {
    btn.addEventListener('click', () => {
      showToast(btn.getAttribute('data-demo') || "This is a front-end demo — connect it to your backend to enable this action.");
    });
  });
}

function initForms() {
  document.querySelectorAll('form[data-demo-form]').forEach((form) => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      showToast(form.getAttribute('data-demo-form'));
      form.reset();
    });
  });
}

function initAccordions() {
  document.querySelectorAll('.accordion-item .accordion-q').forEach((q) => {
    q.addEventListener('click', () => {
      const item = q.closest('.accordion-item');
      const wasOpen = item.classList.contains('open');
      item.parentElement.querySelectorAll('.accordion-item').forEach((i) => i.classList.remove('open'));
      if (!wasOpen) item.classList.add('open');
    });
  });
}

function initBranchSelector() {
  const branchItems = document.querySelectorAll('.branch-item');
  branchItems.forEach((item) => {
    item.addEventListener('click', () => {
      branchItems.forEach((i) => i.classList.remove('active'));
      item.classList.add('active');
    });
  });
}

document.addEventListener('DOMContentLoaded', async () => {
  await loadPartials();
  initIcons();
  initNavHighlight();
  initAgeGate();
  initAnnounceBar();
  initCarousel();
  initChatBubble();
  initMobileNav();
  initDemoButtons();
  initForms();
  initAccordions();
  initBranchSelector();
});
