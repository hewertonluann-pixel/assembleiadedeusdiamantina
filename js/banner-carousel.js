(() => {
  'use strict';

  const initializeBannerCarousel = (container) => {
    if (!container || container.dataset.carouselInitialized === 'true') return;

    const slides = [...container.querySelectorAll('[data-banner-slide]')];
    const dots = [...container.querySelectorAll('[data-banner-dot]')];
    const previousButton = container.querySelector('[data-banner-prev]');
    const nextButton = container.querySelector('[data-banner-next]');
    const counter = container.querySelector('[data-banner-counter]');
    const liveRegion = container.querySelector('[data-banner-live]');
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const autoplayDelay = 5000;
    let currentIndex = 0;
    let autoplayId = null;
    let pointerStartX = null;
    let pointerStartY = null;
    let isPointerDown = false;

    if (!slides.length) return;
    container.dataset.carouselInitialized = 'true';

    const stopAutoplay = () => {
      if (autoplayId) {
        window.clearInterval(autoplayId);
        autoplayId = null;
      }
    };

    const startAutoplay = () => {
      if (slides.length < 2 || reduceMotion.matches || document.hidden) return;
      stopAutoplay();
      autoplayId = window.setInterval(() => setCurrentSlide(currentIndex + 1, false), autoplayDelay);
    };

    const restartAutoplay = () => {
      stopAutoplay();
      startAutoplay();
    };

    const setCurrentSlide = (nextIndex, shouldRestartAutoplay = true) => {
      currentIndex = (nextIndex + slides.length) % slides.length;

      slides.forEach((slide, index) => {
        const isActive = index === currentIndex;
        slide.classList.toggle('is-active', isActive);
        slide.setAttribute('aria-hidden', String(!isActive));
        slide.inert = !isActive;

        const image = slide.querySelector('img[data-src]');
        if (isActive && image) {
          image.src = image.dataset.src;
          image.removeAttribute('data-src');
        }
      });

      dots.forEach((dot, index) => {
        const isCurrent = index === currentIndex;
        dot.setAttribute('aria-current', String(isCurrent));
        dot.tabIndex = isCurrent ? 0 : -1;
      });

      const activeSlide = slides[currentIndex];
      const label = activeSlide?.dataset.bannerLabel || `Destaque ${currentIndex + 1}`;
      if (counter) counter.textContent = `${String(currentIndex + 1).padStart(2, '0')} / ${String(slides.length).padStart(2, '0')}`;
      if (liveRegion) liveRegion.textContent = label;

      if (shouldRestartAutoplay) restartAutoplay();
    };

    const handlePointerDown = (event) => {
      if (event.pointerType === 'mouse' && event.button !== 0) return;
      isPointerDown = true;
      pointerStartX = event.clientX;
      pointerStartY = event.clientY;
      // Não capturamos o ponteiro no container: o clique precisa continuar
      // chegando ao link do slide ativo em navegadores desktop.
      stopAutoplay();
    };

    const handlePointerUp = (event) => {
      if (!isPointerDown || pointerStartX === null || pointerStartY === null) return;
      const distance = event.clientX - pointerStartX;
      const verticalDistance = event.clientY - pointerStartY;
      isPointerDown = false;
      pointerStartX = null;
      pointerStartY = null;

      if (Math.abs(distance) >= 50 && Math.abs(distance) > Math.abs(verticalDistance) + 20) {
        setCurrentSlide(currentIndex + (distance < 0 ? 1 : -1));
      } else {
        startAutoplay();
      }
    };

    const handlePointerCancel = () => {
      isPointerDown = false;
      pointerStartX = null;
      pointerStartY = null;
      startAutoplay();
    };

    previousButton?.addEventListener('click', () => setCurrentSlide(currentIndex - 1));
    nextButton?.addEventListener('click', () => setCurrentSlide(currentIndex + 1));
    dots.forEach((dot, index) => dot.addEventListener('click', () => setCurrentSlide(index)));

    container.addEventListener('keydown', (event) => {
      if (event.key === 'ArrowLeft') {
        event.preventDefault();
        setCurrentSlide(currentIndex - 1);
      }
      if (event.key === 'ArrowRight') {
        event.preventDefault();
        setCurrentSlide(currentIndex + 1);
      }
    });

    container.addEventListener('mouseenter', stopAutoplay);
    container.addEventListener('mouseleave', startAutoplay);
    container.addEventListener('focusin', stopAutoplay);
    container.addEventListener('focusout', (event) => {
      if (!container.contains(event.relatedTarget)) startAutoplay();
    });
    container.addEventListener('pointerdown', handlePointerDown);
    container.addEventListener('pointerup', handlePointerUp);
    container.addEventListener('pointercancel', handlePointerCancel);

    document.addEventListener('visibilitychange', () => {
      if (document.hidden) stopAutoplay();
      else startAutoplay();
    });

    reduceMotion.addEventListener?.('change', () => {
      if (reduceMotion.matches) stopAutoplay();
      else startAutoplay();
    });

    container.dataset.carouselSingle = String(slides.length === 1);
    setCurrentSlide(0, false);
    startAutoplay();
  };

  window.initBannerCarousel = initializeBannerCarousel;
  initializeBannerCarousel(document.querySelector('[data-banner-carousel]'));
})();
