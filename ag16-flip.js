// AG16 Flip Card — Scroll-triggered flip with sparkle effects, click to navigate
document.addEventListener('DOMContentLoaded', function () {
  var flipCards = document.querySelectorAll('[data-ag-flip]');
  if (!flipCards.length) return;

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
        if (entry.isIntersecting && entry.intersectionRatio >= 0.5) {
          // Delay the flip slightly so the user sees the card first
          setTimeout(function () {
            entry.target.classList.add('ag-flipped');
          }, 750);
        }
      });
    }, {
      threshold: 0.5,
      rootMargin: '0px 0px -10% 0px'
    });

    flipCards.forEach(function (card) {
      observer.observe(card);
    });
  } else {
    // Fallback: flip all immediately
    flipCards.forEach(function (card) {
      card.classList.add('ag-flipped');
    });
  }
});
