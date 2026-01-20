// Mobile menu smooth navigation
document.addEventListener('DOMContentLoaded', function() {
  const navToggle = document.getElementById('nav-toggle');
  const navLinks = document.querySelectorAll('.nav-links a');
  
  // Hero avatar scroll animation (home page only)
  const heroAvatar = document.getElementById('hero-avatar');
  const heroAvatarContainer = document.getElementById('hero-avatar-container');
  
  if (heroAvatar && heroAvatarContainer) {
    document.body.classList.add('has-hero-avatar');
    
    // Configuration
    const scrollDistance = 300; // pixels over which animation completes
    
    function lerp(start, end, t) {
      return start + (end - start) * t;
    }
    
    function easeOutCubic(t) {
      return 1 - Math.pow(1 - t, 3);
    }
    
    function updateAvatarPosition() {
      const scrollY = window.scrollY || window.pageYOffset;
      
      // Clamp scroll to 0 minimum to prevent overshoot during iOS bounce/pull-to-refresh
      const clampedScrollY = Math.max(0, scrollY);
      const progress = Math.min(clampedScrollY / scrollDistance, 1);
      const easedProgress = easeOutCubic(progress);
      
      const isMobile = window.innerWidth <= 768;
      
      // Start values (centered in viewport, large)
      const startSize = isMobile ? 180 : 250;
      const startTop = isMobile ? 115 : 120; // Mobile a bit lower
      const startLeft = (window.innerWidth - startSize) / 2; // centered horizontally
      
      // End values (nav position - matches .nav-brand img)
      // Nav has padding: 20px 40px on desktop, 16px 20px on mobile
      const endSize = 80;
      const endTop = 20; // nav padding top
      const endLeft = 40; // nav padding left
      
      // Mobile end adjustments - larger size, vertically centered
      // Mobile nav is about 70px tall, center a 64px image
      const mEndSize = isMobile ? 80 : endSize;
      const mEndTop = isMobile ? 16 : endTop; // centered in mobile nav
      const mEndLeft = isMobile ? 20 : endLeft;
      
      // Calculate position values (clamped - don't move past center)
      const currentTop = lerp(startTop, mEndTop, easedProgress);
      const currentLeft = lerp(startLeft, mEndLeft, easedProgress);
      
      // Size can continue to grow during overscroll for a nice effect
      // Allow negative scroll to make it slightly bigger
      const sizeProgress = Math.min(Math.max(scrollY, -100) / scrollDistance, 1);
      const easedSizeProgress = scrollY < 0 
        ? scrollY / 500 // Gentle size increase during overscroll
        : easeOutCubic(sizeProgress);
      const currentSize = scrollY < 0
        ? startSize * (1 - easedSizeProgress * 0.15) // Grow up to 15% larger during bounce
        : lerp(startSize, mEndSize, easeOutCubic(progress));
      
      // Border width interpolation (4px -> 2px)
      const borderWidth = scrollY < 0 ? 4 : lerp(4, 2, easedProgress);
      
      // Apply styles
      heroAvatar.style.width = currentSize + 'px';
      heroAvatar.style.height = currentSize + 'px';
      heroAvatar.style.borderWidth = borderWidth + 'px';
      
      // Use transform for better iOS performance
      // Position stays fixed at center during overscroll
      heroAvatarContainer.style.webkitTransform = 'translate3d(' + currentLeft + 'px, ' + currentTop + 'px, 0)';
      heroAvatarContainer.style.transform = 'translate3d(' + currentLeft + 'px, ' + currentTop + 'px, 0)';
    }
    
    // Listen for scroll and resize
    window.addEventListener('scroll', updateAvatarPosition, { passive: true });
    window.addEventListener('resize', updateAvatarPosition, { passive: true });
    
    // Also use touchmove for iOS
    document.addEventListener('touchmove', updateAvatarPosition, { passive: true });
    
    // Initial position
    updateAvatarPosition();
  }
  
  // Hide hero avatar when mobile nav is open
  function updateMobileNavState() {
    if (navToggle && navToggle.checked) {
      document.body.classList.add('mobile-nav-open');
    } else {
      document.body.classList.remove('mobile-nav-open');
    }
  }
  
  if (navToggle) {
    // Listen for both change and click events for better iOS compatibility
    navToggle.addEventListener('change', updateMobileNavState);
    navToggle.addEventListener('click', function() {
      // Small delay to let checked state update
      setTimeout(updateMobileNavState, 10);
    });
    
    // Also watch for label clicks (hamburger)
    const hamburger = document.querySelector('.hamburger');
    if (hamburger) {
      hamburger.addEventListener('click', function() {
        setTimeout(updateMobileNavState, 10);
      });
    }
  }
  
  navLinks.forEach(function(link) {
    link.addEventListener('click', function(e) {
      // Only handle if mobile menu is open
      if (navToggle && navToggle.checked) {
        e.preventDefault();
        const href = this.getAttribute('href');
        
        // Uncheck to trigger slide-out animation
        navToggle.checked = false;
        
        // Manually update the nav state since programmatic change doesn't fire event
        updateMobileNavState();
        
        // Wait for animation to complete before navigating
        setTimeout(function() {
          window.location.href = href;
        }, 300);
      }
    });
  });
});

// Initialize particles.js with warm minimal theme
particlesJS("particles-js", {
  "particles": {
    "number": {
      "value": 50,
      "density": {
        "enable": true,
        "value_area": 1000
      }
    },
    "color": {
      "value": "#d4a574"
    },
    "shape": {
      "type": "circle",
      "stroke": {
        "width": 0,
        "color": "#000000"
      }
    },
    "opacity": {
      "value": 0.3,
      "random": true,
      "anim": {
        "enable": true,
        "speed": 0.5,
        "opacity_min": 0.1,
        "sync": false
      }
    },
    "size": {
      "value": 2,
      "random": true,
      "anim": {
        "enable": false,
        "speed": 4,
        "size_min": 0.5,
        "sync": false
      }
    },
    "line_linked": {
      "enable": true,
      "distance": 180,
      "color": "#d4a574",
      "opacity": 0.15,
      "width": 1
    },
    "move": {
      "enable": true,
      "speed": 1.5,
      "direction": "none",
      "random": true,
      "straight": false,
      "out_mode": "out",
      "bounce": false,
      "attract": {
        "enable": false,
        "rotateX": 600,
        "rotateY": 1200
      }
    }
  },
  "interactivity": {
    "detect_on": "canvas",
    "events": {
      "onhover": {
        "enable": true,
        "mode": "grab"
      },
      "onclick": {
        "enable": true,
        "mode": "push"
      },
      "resize": true
    },
    "modes": {
      "grab": {
        "distance": 140,
        "line_linked": {
          "opacity": 0.4
        }
      },
      "push": {
        "particles_nb": 3
      }
    }
  },
  "retina_detect": true
});
