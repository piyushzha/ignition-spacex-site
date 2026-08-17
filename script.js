/* ===================== IGNITION — script.js ===================== */
/* Everything here does exactly one job. Read top to bottom. */

/* 1. TIMELINE ROWS — fade/rise in as they scroll into view */
function initTimelineReveal(){
  const rows = document.querySelectorAll('.t-row');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting){
        entry.target.classList.add('in-view');
        observer.unobserve(entry.target); // only animate once
      }
    });
  }, { threshold: 0.2 });

  rows.forEach(row => observer.observe(row));
}

/* 2. STAT COUNTERS — count up from 0 to target when the stats section
      scrolls into view. Target + unit come from data attributes so the
      HTML stays the single source of truth for the numbers. */
function animateCount(el){
  const target = parseFloat(el.dataset.target);
  const duration = 1400; // ms
  const start = performance.now();

  function frame(now){
    const progress = Math.min((now - start) / duration, 1);
    // ease-out cubic — starts fast, settles gently (feels less mechanical)
    const eased = 1 - Math.pow(1 - progress, 3);
    const value = target * eased;

    el.textContent = target % 1 === 0
      ? Math.floor(value).toLocaleString()
      : value.toFixed(1);

    if (progress < 1) requestAnimationFrame(frame);
    else el.textContent = target.toLocaleString();
  }
  requestAnimationFrame(frame);
}

function initStatCounters(){
  const statsSection = document.querySelector('.stats-wrap');
  if (!statsSection) return;

  const numbers = statsSection.querySelectorAll('.count-target');
  let hasRun = false;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !hasRun){
        hasRun = true;
        numbers.forEach(animateCount);
        observer.disconnect();
      }
    });
  }, { threshold: 0.3 });

  observer.observe(statsSection);
}

/* 3. NAV BACKGROUND — solidify once the hero is scrolled past, so links
      stay readable over whatever section is behind them. */
function initNavBackground(){
  const nav = document.querySelector('nav');
  if (!nav) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > window.innerHeight * 0.7){
      nav.style.background = 'rgba(5,7,12,.92)';
      nav.style.borderBottom = '1px solid var(--line)';
    } else {
      nav.style.background = 'linear-gradient(to bottom, rgba(5,7,12,.85), transparent)';
      nav.style.borderBottom = 'none';
    }
  }, { passive: true });
}

/* 4. COUNTDOWN TIMER — ticks down to the next test-flight target window.
      This is a demo date, not a scraped official schedule — swap TARGET_DATE
      for a real one before Show & Tell if you want it fully accurate. */
function initCountdown(){
  const wrap = document.getElementById('countdown');
  if (!wrap) return;

  const TARGET_DATE = new Date('2026-09-14T15:00:00Z');

  const daysEl = document.getElementById('cd-days');
  const hrsEl  = document.getElementById('cd-hrs');
  const minEl  = document.getElementById('cd-min');
  const secEl  = document.getElementById('cd-sec');
  const pad = n => String(n).padStart(2, '0');

  function tick(){
    const diff = TARGET_DATE - new Date();

    if (diff <= 0){
      daysEl.textContent = hrsEl.textContent = minEl.textContent = secEl.textContent = '00';
      wrap.querySelector('.cd-eyebrow').textContent = 'Launch window open';
      clearInterval(timer);
      return;
    }

    const days = Math.floor(diff / 86400000);
    const hrs  = Math.floor((diff % 86400000) / 3600000);
    const min  = Math.floor((diff % 3600000) / 60000);
    const sec  = Math.floor((diff % 60000) / 1000);

    daysEl.textContent = pad(days);
    hrsEl.textContent  = pad(hrs);
    minEl.textContent  = pad(min);
    secEl.textContent  = pad(sec);
  }

  tick();
  const timer = setInterval(tick, 1000);
}

/* boot */
document.addEventListener('DOMContentLoaded', () => {
  initTimelineReveal();
  initStatCounters();
  initNavBackground();
  initCountdown();
});
