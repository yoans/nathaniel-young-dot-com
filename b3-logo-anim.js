/**
 * Build Beyond Belief fan logo — continuous loop inspired by
 * buildbeyondbelief.com hero + logo-dance Smooth Fanout.
 * Stays visible (no opacity collapse). Autoplays on [data-b3-logo].
 */
(function () {
  const B_PATH = 'M-16,-28 L-16,28 L12,14 L-4,0 L12,-14 Z';
  // Noticeable but smooth — closer to a living mark than a slow studio sweep
  const SPEED = 1.35;

  function uid() {
    return 'b3-' + Math.random().toString(36).slice(2, 9);
  }

  function mount(el) {
    const id = uid();
    const ns = 'http://www.w3.org/2000/svg';

    const svg = document.createElementNS(ns, 'svg');
    svg.setAttribute('class', 'b3-logo-svg');
    svg.setAttribute('viewBox', '40 30 220 220');
    svg.setAttribute('role', 'img');
    svg.setAttribute('aria-label', 'Build Beyond Belief');

    svg.innerHTML = `
      <defs>
        <linearGradient id="${id}-g1" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="#6366f1"/>
          <stop offset="100%" stop-color="#06b6d4"/>
        </linearGradient>
        <linearGradient id="${id}-g2" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#818cf8"/>
          <stop offset="100%" stop-color="#22d3ee"/>
        </linearGradient>
        <linearGradient id="${id}-g3" x1="100%" y1="100%" x2="0%" y2="0%">
          <stop offset="0%" stop-color="#6366f1"/>
          <stop offset="50%" stop-color="#a78bfa"/>
          <stop offset="100%" stop-color="#06b6d4"/>
        </linearGradient>
        <filter id="${id}-glow" x="-80%" y="-80%" width="260%" height="260%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="blur"/>
          <feMerge>
            <feMergeNode in="blur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>`;

    const layers = [
      { grad: `url(#${id}-g1)`, sw: 2.0, op: 0.7, glow: false },
      { grad: `url(#${id}-g2)`, sw: 2.5, op: 0.85, glow: false },
      { grad: `url(#${id}-g3)`, sw: 3.0, op: 1, glow: true },
    ].map((cfg) => {
      const g = document.createElementNS(ns, 'g');
      g.setAttribute('opacity', String(cfg.op));
      if (cfg.glow) g.setAttribute('filter', `url(#${id}-glow)`);
      const path = document.createElementNS(ns, 'path');
      path.setAttribute('d', B_PATH);
      path.setAttribute('fill', 'none');
      path.setAttribute('stroke', cfg.grad);
      path.setAttribute('stroke-width', String(cfg.sw));
      path.setAttribute('stroke-linejoin', 'round');
      path.setAttribute('stroke-linecap', 'round');
      g.appendChild(path);
      svg.appendChild(g);
      return g;
    });

    el.replaceChildren(svg);

    let animTime = 0;
    let lastTs = 0;
    let raf = null;
    let running = false;

    function apply(fanAngle, baseTilt, scale) {
      const angles = [baseTilt - fanAngle, baseTilt, baseTilt + fanAngle];
      layers.forEach((g, i) => {
        g.setAttribute(
          'transform',
          `translate(150,140) rotate(${angles[i]},-10,0) scale(${scale})`
        );
      });
    }

    // Resting pose matches BBB brand mark
    apply(28, -27, 2);

    function tick(ts) {
      if (!running) {
        raf = null;
        return;
      }
      const dt = lastTs ? Math.min((ts - lastTs) / 1000, 0.05) : 0.016;
      lastTs = ts;
      animTime += dt * SPEED;

      // Smooth fan breathe — always visible, clearly moving
      const fanAngle = 18 + 16 * (0.5 + 0.5 * Math.sin(animTime * 0.9));
      const baseTilt = -27 + 8 * Math.sin(animTime * 0.55 + 0.8);
      const scale = 1.95 + 0.12 * Math.sin(animTime * 0.7 + 1.4);

      apply(fanAngle, baseTilt, scale);
      raf = requestAnimationFrame(tick);
    }

    function start() {
      if (running) return;
      running = true;
      lastTs = 0;
      raf = requestAnimationFrame(tick);
    }

    function stop() {
      running = false;
      if (raf) cancelAnimationFrame(raf);
      raf = null;
    }

    const reduce =
      window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)');
    if (reduce && reduce.matches) {
      return;
    }

    // Start immediately — don't wait on intersection (that was too easy to miss)
    start();

    if (typeof IntersectionObserver !== 'undefined') {
      const io = new IntersectionObserver(
        (entries) => {
          const onScreen = entries.some((e) => e.isIntersecting);
          if (onScreen) start();
          else stop();
        },
        { threshold: 0.05, rootMargin: '40px' }
      );
      io.observe(el);
    }

    if (reduce) {
      const onChange = () => {
        if (reduce.matches) {
          stop();
          apply(28, -27, 2);
        } else {
          start();
        }
      };
      if (reduce.addEventListener) reduce.addEventListener('change', onChange);
      else if (reduce.addListener) reduce.addListener(onChange);
    }
  }

  function init() {
    document.querySelectorAll('[data-b3-logo]').forEach(mount);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
