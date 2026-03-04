// AG16 Flip Card — Scroll-triggered flip with sparkle effects, click to navigate
document.addEventListener('DOMContentLoaded', function () {
  var flipCards = document.querySelectorAll('[data-ag-flip]');
  if (!flipCards.length) return;

  function scheduleFlip(card, delayMs) {
    if (card.classList.contains('ag-flipped') || card.dataset.flipScheduled === 'true') {
      return;
    }

    card.dataset.flipScheduled = 'true';
    setTimeout(function () {
      card.classList.add('ag-flipped');
      card.dataset.flipScheduled = 'false';
    }, delayMs);
  }

  function isCardInViewport(card) {
    var rect = card.getBoundingClientRect();
    var viewportHeight = window.innerHeight || document.documentElement.clientHeight;
    var visiblePx = Math.min(rect.bottom, viewportHeight) - Math.max(rect.top, 0);
    var visibleRatio = visiblePx / Math.max(rect.height, 1);
    return visibleRatio >= 0.2;
  }

  // Generate sparkle particles for each card
  flipCards.forEach(function (card) {
    var sparkleContainer = card.querySelector('.ag-sparkles');
    if (sparkleContainer) {
      for (var i = 0; i < 12; i++) {
        var sparkle = document.createElement('span');
        sparkle.className = 'ag-sparkle';
        sparkleContainer.appendChild(sparkle);
      }
    }

    // Click handler — navigate to ag16.html when the card is flipped (back face showing)
    card.addEventListener('click', function (e) {
      if (card.classList.contains('ag-flipped')) {
        e.preventDefault();
        window.location.href = 'ag16.html';
      }
    });

    // Also let keyboard users trigger it
    card.setAttribute('tabindex', '0');
    card.setAttribute('role', 'button');
    card.setAttribute('aria-label', 'Arrowgrid to AG16 transformation — scroll to reveal, click to learn more');
    card.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        if (card.classList.contains('ag-flipped')) {
          window.location.href = 'ag16.html';
        } else {
          card.classList.add('ag-flipped');
        }
      }
    });
  });

  // IntersectionObserver for scroll-triggered flip
  if ('IntersectionObserver' in window) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting && entry.intersectionRatio >= 0.15) {
          // Delay the flip slightly so the user sees the card first
          scheduleFlip(entry.target, 750);
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: [0, 0.15, 0.3],
      rootMargin: '0px 0px -5% 0px'
    });

    flipCards.forEach(function (card) {
      observer.observe(card);
    });
  }

  // Additional viewport fallback for environments where IntersectionObserver is inconsistent
  var checkScheduled = false;
  function checkViewportFallback() {
    flipCards.forEach(function (card) {
      if (!card.classList.contains('ag-flipped') && isCardInViewport(card)) {
        scheduleFlip(card, 750);
      }
    });
    checkScheduled = false;
  }

  function requestViewportCheck() {
    if (checkScheduled) return;
    checkScheduled = true;
    window.requestAnimationFrame(checkViewportFallback);
  }

  requestViewportCheck();
  window.addEventListener('scroll', requestViewportCheck, { passive: true });
  window.addEventListener('resize', requestViewportCheck, { passive: true });
});
