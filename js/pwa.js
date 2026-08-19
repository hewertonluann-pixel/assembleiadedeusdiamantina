(() => {
  const canRegister = 'serviceWorker' in navigator &&
    (window.location.protocol === 'https:' || window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');

  if (!canRegister) return;

  window.addEventListener('load', async () => {
    try {
      const registration = await navigator.serviceWorker.register('/service-worker.js', {
        scope: '/',
        updateViaCache: 'none'
      });

      registration.update().catch(() => {});
      registration.addEventListener('updatefound', () => {
        const worker = registration.installing;
        if (!worker) return;
        worker.addEventListener('statechange', () => {
          if (worker.state === 'installed' && navigator.serviceWorker.controller) {
            console.info('Nova versão do site disponível. Ela será usada na próxima abertura.');
          }
        });
      });
    } catch (error) {
      console.warn('Não foi possível ativar o modo PWA:', error);
    }
  });
})();
