(() => {
  const FALLBACK_FAVICON = 'favicon.svg';

  function applyFavicon(rawUrl) {
    const link = document.getElementById('site-favicon') || document.querySelector('link[rel~="icon"]');
    if (!link) return;

    const url = String(rawUrl || '').trim() || FALLBACK_FAVICON;
    link.href = url;
    link.type = /\.svg(?:$|\?)/i.test(url) ? 'image/svg+xml' : 'image/png';

    if (!link.dataset.fallbackHandler) {
      link.addEventListener('error', () => {
        if (link.dataset.faviconFallbackApplied === 'true') return;
        link.dataset.faviconFallbackApplied = 'true';
        link.href = FALLBACK_FAVICON;
        link.type = 'image/svg+xml';
      });
      link.dataset.fallbackHandler = 'true';
    }
  }

  window.setSiteFavicon = applyFavicon;
})();

