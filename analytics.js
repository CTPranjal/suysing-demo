/* =========================================================================
   SuySing x CleverTap demo analytics layer.

   This is a static front-end demo with no real backend, so anything that
   would normally live in a CRM/order database (order history, points
   balance, RFM segment, etc.) is mocked in localStorage under `ss_profile`.
   Every mocked number is clearly a simplification for demo purposes, not a
   real computation — the point is to give CleverTap's dashboard something
   realistic to show, not to build a commerce backend.
   ========================================================================= */

const SS_PROFILE_KEY = 'ss_profile';
const SS_CART_KEY = 'ss_cart';
const SS_ORDERS_KEY = 'ss_orders';
const FREE_DELIVERY_THRESHOLD = 12000;
const SIMULATED_DELIVERY_MS = 6000; // demo-only stand-in for a real delivery window

function ssLoadProfile() {
  try {
    return JSON.parse(localStorage.getItem(SS_PROFILE_KEY)) || {};
  } catch (e) {
    return {};
  }
}
function ssSaveProfile(p) {
  localStorage.setItem(SS_PROFILE_KEY, JSON.stringify(p));
}
function ssPatchProfile(patch) {
  const p = { ...ssLoadProfile(), ...patch };
  ssSaveProfile(p);
  if (window.clevertap) {
    clevertap.profile.push({ Site: patch });
  }
  return p;
}
function ssToday() {
  return new Date().toISOString().slice(0, 10);
}
function ssDaysBetween(a, b) {
  return Math.max(0, Math.round((new Date(b) - new Date(a)) / 86400000));
}

function ssLoadCart() {
  try {
    return JSON.parse(sessionStorage.getItem(SS_CART_KEY)) || [];
  } catch (e) {
    return [];
  }
}
function ssSaveCart(cart) {
  sessionStorage.setItem(SS_CART_KEY, JSON.stringify(cart));
}
function ssCartValue(cart) {
  return cart.reduce((sum, item) => sum + item.price, 0);
}
function ssRemoveFromCart(index) {
  const cart = ssLoadCart();
  cart.splice(index, 1);
  ssSaveCart(cart);
  return cart;
}

function ssLoadOrders() {
  try {
    return JSON.parse(localStorage.getItem(SS_ORDERS_KEY)) || [];
  } catch (e) {
    return [];
  }
}
function ssSaveOrders(orders) {
  localStorage.setItem(SS_ORDERS_KEY, JSON.stringify(orders));
}

function ssTrackEvent(name, props) {
  if (window.clevertap) {
    clevertap.event.push(name, props || {});
  }
  console.debug('[CleverTap event]', name, props);
}

/* ---------- Site visit (fires on every page) ---------- */
function ssTrackSiteVisited() {
  const profile = ssLoadProfile();
  ssTrackEvent('SuySing Site Visited', {
    page: document.body.getAttribute('data-page') || 'unknown',
    is_registered: !!profile.signedUp,
    referrer_source: document.referrer || 'direct',
  });
}

/* ---------- Social clicks (footer icons) ---------- */
function ssTrackSocialClick(platform) {
  ssTrackEvent('SuySing Social Post Clicked', {
    platform,
    post_id: 'demo-post-' + Math.floor(Math.random() * 1000),
  });
}

/* ---------- Signup ---------- */
function ssTrackSignupCompleted({ storeName, storeFormat, birthday, name, email }) {
  const identity = 'demo-' + Date.now();
  const today = ssToday();

  if (window.clevertap) {
    clevertap.onUserLogin.push({
      Site: { Identity: identity, Name: name || 'Store Owner', Email: email || undefined },
    });
  }

  ssPatchProfile({
    'SuySing Store Name': storeName,
    'SuySing Store Format': storeFormat,
    'SuySing Signup Date': today,
    'SuySing Activation Status': 'Not Activated',
    'SuySing Birthday': birthday || undefined,
    'SuySing Total Orders': 0,
    'SuySing Lifetime Order Value': 0,
    'SuySing Suki Points Balance': 0,
    'SuySing Rebate Balance': 0,
    'SuySing RFM Segment': 'New',
    'SuySing Success Card Tier': 'Bronze',
    signedUp: true,
    identity,
  });

  ssTrackEvent('SuySing Signup Completed', { signup_channel: 'web' });
}

/* ---------- Login / activation ---------- */
function ssTrackLoginAndMaybeActivate() {
  const profile = ssLoadProfile();
  if (profile.signedUp && profile['SuySing Activation Status'] !== 'Activated') {
    const days = profile['SuySing Signup Date'] ? ssDaysBetween(profile['SuySing Signup Date'], ssToday()) : 0;
    ssPatchProfile({ 'SuySing Activation Status': 'Activated' });
    ssTrackEvent('SuySing Account Activated', { days_since_signup: days });
  }
}

/* ---------- Product view / cart ---------- */
function ssTrackProductViewed(skuId, category) {
  const key = 'ss_view_' + skuId;
  const count = (parseInt(localStorage.getItem(key) || '0', 10) + 1);
  localStorage.setItem(key, String(count));
  ssTrackEvent('SuySing Product Viewed', { sku_id: skuId, category, view_count_7d: count });
}

function ssAddToCart(skuId, category, price) {
  const cart = ssLoadCart();
  cart.push({ skuId, category, price });
  ssSaveCart(cart);
  ssTrackEvent('SuySing Added To Cart', { sku_id: skuId, category, cart_value: ssCartValue(cart) });
  return cart;
}

/* ---------- Checkout ---------- */
let ssAbandonTimer = null;
let ssCheckoutOutcome = null; // 'placed' | null

function ssTrackCheckoutStarted() {
  const cart = ssLoadCart();
  const cartValue = ssCartValue(cart);
  ssCheckoutOutcome = null;
  ssTrackEvent('SuySing Checkout Started', {
    cart_value: cartValue,
    sku_count: cart.length,
    gap_to_free_delivery: Math.max(0, FREE_DELIVERY_THRESHOLD - cartValue),
  });
  clearTimeout(ssAbandonTimer);
  ssAbandonTimer = setTimeout(() => {
    if (ssCheckoutOutcome !== 'placed') ssTrackCheckoutAbandoned();
  }, 45000);
}

function ssTrackCheckoutAbandoned() {
  if (ssCheckoutOutcome === 'placed') return;
  const cart = ssLoadCart();
  const cartValue = ssCartValue(cart);
  ssTrackEvent('SuySing Checkout Abandoned', {
    cart_value: cartValue,
    gap_to_free_delivery: Math.max(0, FREE_DELIVERY_THRESHOLD - cartValue),
  });
}

function ssTrackPaymentMethodUsed(method) {
  const discountEligible = method !== 'Cash on Delivery';
  ssPatchProfile({
    'SuySing Preferred Payment Method': method,
    'SuySing Discount Payment Adopted': discountEligible,
  });
  ssTrackEvent('SuySing Payment Method Used', { payment_method: method, is_discount_eligible: discountEligible });
  return discountEligible;
}

function ssTrackOrderPlaced(paymentMethod) {
  clearTimeout(ssAbandonTimer);
  ssCheckoutOutcome = 'placed';

  const cart = ssLoadCart();
  const cartValue = ssCartValue(cart);
  const categories = [...new Set(cart.map((i) => i.category))];
  const profile = ssLoadProfile();
  const priorOrders = profile['SuySing Total Orders'] || 0;
  const orderId = 'SS' + Date.now();
  const isFirstOrder = priorOrders === 0;
  const today = ssToday();
  const now = Date.now();

  ssTrackEvent('SuySing Order Placed', {
    order_id: orderId,
    order_value: cartValue,
    sku_count: cart.length,
    categories,
    is_first_order: isFirstOrder,
    is_reorder: !isFirstOrder,
  });

  const totalOrders = priorOrders + 1;
  const lifetimeValue = (profile['SuySing Lifetime Order Value'] || 0) + cartValue;
  const tier = lifetimeValue > 20000 ? 'Gold' : lifetimeValue > 5000 ? 'Silver' : 'Bronze';
  // Simplified demo heuristic — not a real RFM model.
  const rfm = totalOrders >= 3 ? 'Loyal' : totalOrders >= 1 ? 'At Risk' : 'New';
  const topCategories = [...new Set([...(profile['SuySing Top Categories'] || []), ...categories])].slice(0, 5);
  const avgCycle = profile['SuySing Last Order Date']
    ? Math.round(((profile['SuySing Avg Reorder Cycle Days'] || 14) + ssDaysBetween(profile['SuySing Last Order Date'], today)) / 2)
    : 14;

  ssPatchProfile({
    'SuySing Total Orders': totalOrders,
    'SuySing Lifetime Order Value': lifetimeValue,
    'SuySing First Order Date': profile['SuySing First Order Date'] || today,
    'SuySing Last Order Date': today,
    'SuySing Avg Reorder Cycle Days': avgCycle,
    'SuySing Success Card Tier': tier,
    'SuySing RFM Segment': rfm,
    'SuySing Top Categories': topCategories,
  });

  ssEarnPoints(Math.round(cartValue / 50), 'order');

  const orders = ssLoadOrders();
  orders.unshift({
    orderId,
    value: cartValue,
    skuCount: cart.length,
    categories,
    paymentMethod,
    placedAt: now,
    deliverAt: now + SIMULATED_DELIVERY_MS,
    status: 'Processing',
    csatScore: null,
  });
  ssSaveOrders(orders);

  ssSaveCart([]);
  return orderId;
}

/* ---------- Delivery (simulated — this step is a backend event in reality) ---------- */
function ssMarkOrderDelivered(orderId) {
  const orders = ssLoadOrders();
  const order = orders.find((o) => o.orderId === orderId);
  if (!order || order.status === 'Delivered') return false;
  order.status = 'Delivered';
  ssSaveOrders(orders);
  ssTrackEvent('SuySing Delivery Completed', { order_id: orderId, delivery_date: ssToday() });
  return true;
}

/* Call on any page that lists orders — delivers anything whose simulated
   window has elapsed, and schedules timers for the ones still pending so
   the page updates live if left open. */
function ssProcessDueDeliveries(onDelivered) {
  const orders = ssLoadOrders();
  const now = Date.now();
  orders.forEach((o) => {
    if (o.status === 'Processing') {
      const remaining = o.deliverAt - now;
      if (remaining <= 0) {
        ssMarkOrderDelivered(o.orderId);
        if (onDelivered) onDelivered(o.orderId);
      } else {
        setTimeout(() => {
          ssMarkOrderDelivered(o.orderId);
          if (onDelivered) onDelivered(o.orderId);
        }, remaining);
      }
    }
  });
}

/* ---------- Survey ---------- */
function ssTrackSurveySubmitted(orderId, score) {
  const orders = ssLoadOrders();
  const order = orders.find((o) => o.orderId === orderId);
  if (order) {
    order.csatScore = score;
    ssSaveOrders(orders);
  }
  ssTrackEvent('SuySing Survey Submitted', { order_id: orderId, csat_score: score });
  ssEarnPoints(20, 'survey');
}

/* ---------- Suki Points ---------- */
function ssEarnPoints(points, sourceAction) {
  const profile = ssLoadProfile();
  const balance = (profile['SuySing Suki Points Balance'] || 0) + points;
  ssPatchProfile({ 'SuySing Suki Points Balance': balance });
  ssTrackEvent('SuySing Suki Points Earned', { points, source_action: sourceAction });
}

function ssRedeemPoints(points, reward) {
  const profile = ssLoadProfile();
  const balance = Math.max(0, (profile['SuySing Suki Points Balance'] || 0) - points);
  ssPatchProfile({ 'SuySing Suki Points Balance': balance });
  ssTrackEvent('SuySing Suki Points Redeemed', { points_redeemed: points, reward });
  return balance;
}

/* ---------- Retail Academy ---------- */
function ssTrackRetailAcademyAttended(sessionName) {
  const profile = ssLoadProfile();
  const count = (profile['SuySing Retail Academy Attended Count'] || 0) + 1;
  ssPatchProfile({ 'SuySing Retail Academy Attended Count': count });
  ssTrackEvent('SuySing Retail Academy Attended', { session_name: sessionName });
}

/* ---------- Rebate (batch/backend event in reality — simulated here) ---------- */
function ssTrackRebateCredited(amount) {
  const profile = ssLoadProfile();
  const balance = (profile['SuySing Rebate Balance'] || 0) + amount;
  const expiry = new Date();
  expiry.setDate(expiry.getDate() + 30);
  ssPatchProfile({ 'SuySing Rebate Balance': balance });
  ssTrackEvent('SuySing Rebate Credited', { rebate_amount: amount, expiry_date: expiry.toISOString().slice(0, 10) });
}

/* =========================================================================
   Demo-only convenience: fires every event from the taxonomy that a single
   linear browse → cart → checkout → survey session can't naturally reach
   (a second login session, an abandoned cart that doesn't conflict with a
   completed one, a points balance that clears the redemption threshold, and
   a monthly rebate batch job). Clearly a demo shortcut, not a real user
   action — for making sure one CleverTap profile shows the full taxonomy.
   ========================================================================= */
function ssRunRemainingLifecycleEvents() {
  const fired = [];

  ssTrackSocialClick('facebook');
  fired.push('SuySing Social Post Clicked');

  const before = ssLoadProfile()['SuySing Activation Status'];
  ssTrackLoginAndMaybeActivate();
  if (before !== 'Activated') fired.push('SuySing Account Activated');

  ssTrackEvent('SuySing Checkout Abandoned', { cart_value: 850, gap_to_free_delivery: 11150 });
  fired.push('SuySing Checkout Abandoned (simulated cart)');

  const profile = ssLoadProfile();
  const balance = profile['SuySing Suki Points Balance'] || 0;
  if (balance < 500) ssEarnPoints(500 - balance, 'demo_topup');
  ssRedeemPoints(500, '₱50 delivery discount');
  fired.push('SuySing Suki Points Redeemed');

  const lifetimeValue = ssLoadProfile()['SuySing Lifetime Order Value'] || 0;
  ssTrackRebateCredited(Math.max(100, Math.round(lifetimeValue * 0.02)));
  fired.push('SuySing Rebate Credited');

  return fired;
}

/* =========================================================================
   Demo personas — lets the walkthrough show three different profiles
   without re-typing a signup form each time. Each persona gets its own
   stable CleverTap Identity (so onUserLogin.push actually switches to a
   distinct profile, not just patches the current one) and a dedicated
   `SuySing Persona Segment` property to segment/target campaigns by.
   ========================================================================= */
const PERSONAS = {
  rosa: {
    identity: 'persona-rosa',
    name: 'Rosa Santos',
    email: 'rosa@example.com',
    segment: 'Sari-Sari Starter',
    profile: {
      'SuySing Store Name': "Aling Rosa's Store",
      'SuySing Store Format': 'Sari-sari Store',
      'SuySing Activation Status': 'Activated',
      'SuySing Total Orders': 1,
      'SuySing Lifetime Order Value': 850,
      'SuySing Suki Points Balance': 17,
      'SuySing Rebate Balance': 0,
      'SuySing RFM Segment': 'New',
      'SuySing Success Card Tier': 'Bronze',
      'SuySing Top Categories': ['Snacks & Sweets', 'Beverages'],
      'SuySing Preferred Payment Method': 'Cash on Delivery',
      signupDaysAgo: 10,
    },
    heroImages: [
      { image: 'https://placehold.co/1600x460/6a3fb5/ffffff?text=Welcome+Back%2C+Rosa', href: 'products.html' },
      { image: 'https://placehold.co/1600x460/f28d00/ffffff?text=Starter+Bundles+For+You', href: 'products.html' },
      { image: 'https://placehold.co/1600x460/1440b8/ffffff?text=Free+Delivery%2C+First+Order', href: 'cart.html' },
    ],
  },
  jun: {
    identity: 'persona-jun',
    name: 'Jun Reyes',
    email: 'jun@example.com',
    segment: 'Growing Grocery',
    profile: {
      'SuySing Store Name': 'Reyes Mini-Grocery',
      'SuySing Store Format': 'Mid-size Grocery',
      'SuySing Activation Status': 'Activated',
      'SuySing Total Orders': 6,
      'SuySing Lifetime Order Value': 18500,
      'SuySing Suki Points Balance': 210,
      'SuySing Rebate Balance': 150,
      'SuySing RFM Segment': 'Loyal',
      'SuySing Success Card Tier': 'Silver',
      'SuySing Top Categories': ['Rice & Staples', 'Household Care'],
      'SuySing Preferred Payment Method': 'Bank Transfer',
      signupDaysAgo: 90,
    },
    heroImages: [
      { image: 'https://placehold.co/1600x460/1440b8/ffffff?text=Restock+Rice+%26+Staples', href: 'products.html' },
      { image: 'https://placehold.co/1600x460/0f7a63/ffffff?text=Bulk+Discounts+This+Week', href: 'promotions.html' },
      { image: 'https://placehold.co/1600x460/cc7600/ffffff?text=Your+Rebate+Is+Ready', href: 'orders.html' },
    ],
  },
  amy: {
    identity: 'persona-amy',
    name: 'Amy Cruz',
    email: 'amy@example.com',
    segment: 'Loyal Multi-Store',
    profile: {
      'SuySing Store Name': 'Cruz Grocery Group',
      'SuySing Store Format': 'Mid-size Grocery',
      'SuySing Activation Status': 'Activated',
      'SuySing Total Orders': 14,
      'SuySing Lifetime Order Value': 42000,
      'SuySing Suki Points Balance': 640,
      'SuySing Rebate Balance': 480,
      'SuySing RFM Segment': 'Loyal',
      'SuySing Success Card Tier': 'Gold',
      'SuySing Top Categories': ['Personal Care', 'Canned Goods'],
      'SuySing Preferred Payment Method': 'GCash / E-wallet',
      signupDaysAgo: 240,
    },
    heroImages: [
      { image: 'https://placehold.co/1600x460/e07c00/ffffff?text=60+pts+To+Your+Next+Reward', href: 'index.html' },
      { image: 'https://placehold.co/1600x460/6a3fb5/ffffff?text=Gold+Tier+Perks+Inside', href: 'retail-academy.html' },
      { image: 'https://placehold.co/1600x460/1440b8/ffffff?text=Reorder+Your+Favorites', href: 'products.html' },
    ],
  },
};

const DEFAULT_HERO_IMAGES = [
  { image: 'https://placehold.co/1600x460/f28d00/ffffff?text=Slide+1', href: 'products.html' },
  { image: 'https://placehold.co/1600x460/1440b8/ffffff?text=Slide+2', href: 'promotions.html' },
  { image: 'https://placehold.co/1600x460/0f7a63/ffffff?text=Slide+3', href: 'branches.html' },
];

function ssLoginAsPersona(key) {
  const persona = PERSONAS[key];
  if (!persona) return;

  if (window.clevertap) {
    clevertap.onUserLogin.push({
      Site: { Identity: persona.identity, Name: persona.name, Email: persona.email },
    });
  }

  const signupDate = new Date();
  signupDate.setDate(signupDate.getDate() - persona.profile.signupDaysAgo);

  const fullProfile = {
    ...persona.profile,
    'SuySing Persona Segment': persona.segment,
    'SuySing Signup Date': signupDate.toISOString().slice(0, 10),
    signedUp: true,
    identity: persona.identity,
    activePersona: key,
  };
  delete fullProfile.signupDaysAgo;

  ssSaveProfile(fullProfile);
  if (window.clevertap) {
    clevertap.profile.push({ Site: fullProfile });
  }

  // Fresh cart/order history per persona switch — this is a "log in as a
  // different person" action, not a merge with whoever was active before.
  ssSaveCart([]);
  ssSaveOrders([]);
}

/* =========================================================================
   CleverTap Web Native Display — real integration.
   Docs: https://developer.clevertap.com/docs/web-native-display

   CleverTap dispatches a `CT_web_native_display` DOM event when a display
   unit campaign (configured server-side, targeted by segment — e.g. our
   `SuySing Persona Segment` property) is ready to render. This listener
   routes by `data.kv.topic` ("Hero Slide 1/2/3") to the matching homepage
   carousel slide, swaps that slide's <img src> to the campaign's image
   seamlessly (fades out, preloads, swaps, fades in — only for the slide
   currently on screen), and reports the required renderNotificationViewed
   / renderNotificationClicked calls back to CleverTap.
   ========================================================================= */
const ndSlideData = {}; // slide index -> last-received CT_web_native_display payload, for click reporting

document.addEventListener('CT_web_native_display', function (event) {
  const data = event.detail;
  if (!data || !data.kv || !data.kv.topic) return;

  const match = /^Hero Slide (\d)$/.exec(data.kv.topic);
  if (!match) return;
  const index = parseInt(match[1], 10) - 1;
  const slide = document.querySelector(`.promo-slide[data-nd-topic="${data.kv.topic}"]`);
  const img = slide && slide.querySelector('img');
  if (!img || !data.kv.image) return;

  ndSlideData[index] = data;

  // Seamless swap: fade the slide's current image out, swap the src only
  // once the new one has actually loaded, then fade back in. A slide that
  // isn't the currently-visible one just gets its src updated silently —
  // there's nothing on screen to flash.
  const isVisible = slide.classList.contains('active');
  const applySrc = () => {
    img.src = data.kv.image;
    if (isVisible) img.style.opacity = '1';
  };
  if (isVisible) {
    img.style.transition = 'opacity 0.25s ease';
    img.style.opacity = '0';
    const preload = new Image();
    preload.onload = () => setTimeout(applySrc, 250);
    preload.onerror = () => { img.style.opacity = '1'; };
    preload.src = data.kv.image;
  } else {
    applySrc();
  }

  // Real SDK methods, not stub-queue arrays like event.push — they only
  // exist once clevertap.min.js has actually loaded from the CDN, so a
  // plain `if (window.clevertap)` check isn't enough.
  if (typeof clevertap !== 'undefined' && typeof clevertap.renderNotificationViewed === 'function') {
    clevertap.renderNotificationViewed(data);
  }
});

/* Called from the onclick on each hero slide <img> (see index.html). */
function ndSlideClick(index) {
  const data = ndSlideData[index];
  if (data) {
    if (typeof clevertap !== 'undefined' && typeof clevertap.renderNotificationClicked === 'function') {
      clevertap.renderNotificationClicked(data);
    }
    location.href = data.kv.href || 'products.html';
  } else {
    location.href = DEFAULT_HERO_IMAGES[index]?.href || 'products.html';
  }
}

/* Demo-only stand-in for the dashboard side of a Web Native Display
   campaign — dispatches the exact same `CT_web_native_display` event the
   real CleverTap SDK would fire once 3 display units ("Hero Slide 1/2/3")
   are configured to target the active persona's `SuySing Persona Segment`.
   The listener above doesn't know or care that this event came from a
   simulation instead of CleverTap's servers — that's the point: the
   render/viewed/clicked pipeline is the real integration, only the
   trigger is mocked.

   Per CleverTap's own docs: "Ensure that the default/fallback banner is
   configured on your website to render in case of delayed response from
   CleverTap servers." That's exactly what the 3 <img> tags already in
   index.html are — real default creative, not placeholders waiting to be
   filled. So with no persona (no segment to target), there's no campaign
   to simulate, and this intentionally does nothing, leaving those defaults
   on screen untouched. Only a logged-in persona — a real targetable
   segment — gets a simulated campaign that overrides them. */
function ssSimulateNativeDisplay() {
  const profile = ssLoadProfile();
  const persona = PERSONAS[profile.activePersona];
  if (!persona) return false;

  persona.heroImages.forEach((slideImage, i) => {
    const data = {
      kv: { topic: `Hero Slide ${i + 1}`, image: slideImage.image, href: slideImage.href },
      msgId: 'demo-nd-' + Date.now() + '-' + i,
      wzrk_pivot: 'wzrk_default',
    };
    document.dispatchEvent(new CustomEvent('CT_web_native_display', { detail: data }));
  });
  return true;
}

/* Header "Sign Up" is a hover/click dropdown of demo personas now — there's
   no standalone signup form page anymore. Works on every page since the
   header is a shared partial. */
function initSignupDropdown() {
  const wrap = document.getElementById('signupDropdown');
  const btn = document.getElementById('signUpDropdownBtn');
  const panel = document.getElementById('signupDropdownPanel');
  if (!wrap || !btn || !panel) return;

  const selectPersona = (key) => {
    ssLoginAsPersona(key);
    panel.classList.remove('open');
    showToast('Logged in as ' + PERSONAS[key].name + ' (' + PERSONAS[key].segment + ')');
    setTimeout(() => location.reload(), 600);
  };

  // Hover-open is handled purely in CSS (.signup-dropdown:hover). Click is
  // for touch/keyboard users and toggles independently of hover state.
  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    panel.classList.toggle('open');
  });
  document.addEventListener('click', (e) => {
    if (panel.classList.contains('open') && !wrap.contains(e.target)) {
      panel.classList.remove('open');
    }
  });
  panel.querySelectorAll('.sdp-persona').forEach((el) => {
    el.addEventListener('click', () => selectPersona(el.getAttribute('data-persona')));
  });

  document.querySelectorAll('.mobile-persona-btn').forEach((el) => {
    el.addEventListener('click', () => selectPersona(el.getAttribute('data-persona')));
  });
}

/* Cross-page helper for any old "Create Free Account" style CTA that used
   to link to the (now removed) signup page — scrolls to the header and
   opens the same persona dropdown instead of dead-linking. */
function openHeaderPersonaMenu() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
  setTimeout(() => {
    const panel = document.getElementById('signupDropdownPanel');
    if (panel) panel.classList.add('open');
  }, 300);
}

function ssRefreshCartBadge() {
  const badge = document.getElementById('headerCartBadge');
  if (!badge) return;
  const count = ssLoadCart().length;
  badge.textContent = count;
  badge.hidden = count === 0;
}

/* Wait for partials:loaded (dispatched by script.js after header/footer are
   injected) rather than DOMContentLoaded directly — the header partial (and
   its cart badge element) isn't in the DOM yet at DOMContentLoaded since
   loadPartials() fetches it asynchronously. */
document.addEventListener('partials:loaded', () => {
  ssTrackSiteVisited();
  ssRefreshCartBadge();
  initSignupDropdown();
});
