(() => {
  const FALLBACK_FAVICON = 'favicon.svg';
  const FALLBACK_TOUCH_ICON = 'icons/icon-192.png';

  function applyFavicon(rawUrl, rawTouchUrl) {
    const configuredUrl = String(rawUrl || '').trim();
    const configuredTouchUrl = String(rawTouchUrl || '').trim();
    const faviconLinks = [...document.querySelectorAll('link[rel~="icon"]')];
    const touchLinks = [...document.querySelectorAll('link[rel="apple-touch-icon"]')];
    const iconUrl = configuredUrl || FALLBACK_FAVICON;
    const touchUrl = configuredTouchUrl || configuredUrl || FALLBACK_TOUCH_ICON;

    faviconLinks.forEach(link => {
      link.href = iconUrl;
      link.type = /\.svg(?:$|\?)/i.test(iconUrl) ? 'image/svg+xml' : 'image/png';
      if (!link.dataset.fallbackHandler) {
        link.addEventListener('error', () => {
          if (link.dataset.faviconFallbackApplied === 'true') return;
          link.dataset.faviconFallbackApplied = 'true';
          link.href = FALLBACK_FAVICON;
          link.type = 'image/svg+xml';
        });
        link.dataset.fallbackHandler = 'true';
      }
    });

    touchLinks.forEach(link => {
      link.href = touchUrl;
      if (!link.dataset.fallbackHandler) {
        link.addEventListener('error', () => {
          if (link.dataset.touchFallbackApplied === 'true') return;
          link.dataset.touchFallbackApplied = 'true';
          link.href = FALLBACK_TOUCH_ICON;
        });
        link.dataset.fallbackHandler = 'true';
      }
    });
  }

  window.setSiteFavicon = applyFavicon;
})();
