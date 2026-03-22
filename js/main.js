(() => {
  const container = document.getElementById('scroll-container');
  const dots = document.querySelectorAll('.nav-dot');
  const slides = document.querySelectorAll('.slide');
  const sectionLabel = document.getElementById('section-label');
  const landscapeOverlay = document.getElementById('landscape-overlay');
  const landscapeDismiss = document.getElementById('landscape-dismiss');

  const sectionNames = [
    'Introduction',
    'What I do',
    'Career journey',
    'Beyond the day job',
    'AI & Innovation',
    'Contact'
  ];

  // ============================================
  // Landscape overlay dismiss
  // ============================================

  if (landscapeDismiss) {
    landscapeDismiss.addEventListener('click', () => {
      landscapeOverlay.style.display = 'none';
    });
  }

  // ============================================
  // Horizontal scroll via mouse wheel
  // ============================================

  const isHorizontalMode = () => {
    return window.innerWidth > 768 || window.matchMedia('(orientation: landscape)').matches;
  };

  let isScrolling = false;
  let scrollTimeout;

  container.addEventListener('wheel', (e) => {
    if (!isHorizontalMode()) return;

    e.preventDefault();

    if (isScrolling) return;

    const delta = Math.abs(e.deltaY) > Math.abs(e.deltaX) ? e.deltaY : e.deltaX;

    if (Math.abs(delta) < 10) return;

    isScrolling = true;

    const currentIndex = Math.round(container.scrollLeft / window.innerWidth);
    const direction = delta > 0 ? 1 : -1;
    const targetIndex = Math.max(0, Math.min(slides.length - 1, currentIndex + direction));

    scrollToSlide(targetIndex);

    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(() => {
      isScrolling = false;
    }, 800);
  }, { passive: false });

  // ============================================
  // Keyboard navigation
  // ============================================

  document.addEventListener('keydown', (e) => {
    if (!isHorizontalMode()) return;

    const currentIndex = Math.round(container.scrollLeft / window.innerWidth);
    let targetIndex = currentIndex;

    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      targetIndex = Math.min(slides.length - 1, currentIndex + 1);
      e.preventDefault();
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      targetIndex = Math.max(0, currentIndex - 1);
      e.preventDefault();
    }

    if (targetIndex !== currentIndex) {
      scrollToSlide(targetIndex);
    }
  });

  // ============================================
  // Dot navigation
  // ============================================

  dots.forEach(dot => {
    dot.addEventListener('click', () => {
      const index = parseInt(dot.dataset.index, 10);
      scrollToSlide(index);
    });
  });

  function scrollToSlide(index) {
    if (isHorizontalMode()) {
      container.scrollTo({
        left: index * window.innerWidth,
        behavior: 'smooth'
      });
    } else {
      slides[index].scrollIntoView({ behavior: 'smooth' });
    }
  }

  // ============================================
  // Active dot and section label update
  // ============================================

  let labelTimeout;

  function updateActiveDot() {
    let activeIndex;

    if (isHorizontalMode()) {
      activeIndex = Math.round(container.scrollLeft / window.innerWidth);
    } else {
      const scrollTop = container.scrollTop || window.scrollY;
      activeIndex = 0;
      slides.forEach((slide, i) => {
        if (slide.offsetTop <= scrollTop + window.innerHeight / 2) {
          activeIndex = i;
        }
      });
    }

    dots.forEach((dot, i) => {
      dot.classList.toggle('active', i === activeIndex);
    });

    if (sectionLabel && sectionNames[activeIndex]) {
      sectionLabel.textContent = sectionNames[activeIndex];
      sectionLabel.classList.add('visible');
      clearTimeout(labelTimeout);
      labelTimeout = setTimeout(() => {
        sectionLabel.classList.remove('visible');
      }, 2000);
    }
  }

  container.addEventListener('scroll', updateActiveDot, { passive: true });
  window.addEventListener('scroll', updateActiveDot, { passive: true });

  // ============================================
  // Intersection Observer for animations
  // ============================================

  const animItems = document.querySelectorAll('.anim-item');

  const observerOptions = {
    root: isHorizontalMode() ? container : null,
    threshold: 0.15,
    rootMargin: '0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const siblings = el.closest('.slide').querySelectorAll('.anim-item');
        const elIndex = Array.from(siblings).indexOf(el);
        setTimeout(() => {
          el.classList.add('visible');
        }, elIndex * 100);
      }
    });
  }, observerOptions);

  animItems.forEach(item => observer.observe(item));

  // ============================================
  // Animated number counters
  // ============================================

  const statNumbers = document.querySelectorAll('.stat-card__number[data-target]');

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !entry.target.dataset.counted) {
        entry.target.dataset.counted = 'true';
        animateNumber(entry.target);
      }
    });
  }, {
    root: isHorizontalMode() ? container : null,
    threshold: 0.3
  });

  statNumbers.forEach(num => counterObserver.observe(num));

  function animateNumber(el) {
    const target = parseFloat(el.dataset.target);
    const decimals = parseInt(el.dataset.decimals || '0', 10);
    const prefix = el.dataset.prefix || '';
    const duration = 1500;
    const start = performance.now();

    function update(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = target * eased;

      el.textContent = prefix + current.toFixed(decimals);

      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        el.textContent = prefix + target.toFixed(decimals);
      }
    }

    requestAnimationFrame(update);
  }

  // ============================================
  // Touch swipe support for horizontal mode
  // ============================================

  let touchStartX = 0;
  let touchStartY = 0;

  container.addEventListener('touchstart', (e) => {
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
  }, { passive: true });

  container.addEventListener('touchend', (e) => {
    if (!isHorizontalMode()) return;

    const touchEndX = e.changedTouches[0].clientX;
    const touchEndY = e.changedTouches[0].clientY;
    const diffX = touchStartX - touchEndX;
    const diffY = touchStartY - touchEndY;

    if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 50) {
      const currentIndex = Math.round(container.scrollLeft / window.innerWidth);
      const direction = diffX > 0 ? 1 : -1;
      const targetIndex = Math.max(0, Math.min(slides.length - 1, currentIndex + direction));
      scrollToSlide(targetIndex);
    }
  }, { passive: true });

  // ============================================
  // Re-initialize observer on orientation change
  // ============================================

  window.addEventListener('orientationchange', () => {
    setTimeout(() => {
      location.reload();
    }, 300);
  });

  // ============================================
  // Initial state: trigger hero animations
  // ============================================

  setTimeout(() => {
    const heroItems = document.querySelectorAll('#hero .anim-item');
    heroItems.forEach((item, i) => {
      setTimeout(() => item.classList.add('visible'), i * 150);
    });
  }, 300);
})();
