/* Miniplayer compartilhado da rádio institucional. */
(function () {
  'use strict';

  let pendingConfig = null;

  window.addEventListener('site:radio-config', event => {
    const config = event.detail || {};
    if (typeof window.__radioPlayerApply === 'function') {
      window.__radioPlayerApply(config);
    } else {
      pendingConfig = config;
    }
  });

  function initRadioPlayer() {
    const player = document.getElementById('radio-player');
    const audio = document.getElementById('radio-player-audio');
    const toggle = document.getElementById('radio-player-toggle');
    const icon = document.getElementById('radio-player-toggle-icon');
    const title = document.getElementById('radio-player-title');
    const status = document.getElementById('radio-player-status');
    const link = document.getElementById('radio-player-link');
    const volume = document.getElementById('radio-player-volume');
    const close = document.getElementById('radio-player-close');

    if (!player || !audio || !toggle || !icon || !status || !link) return;

    const volumeKey = 'ad-diamantina-radio-volume';
    const closedKey = 'ad-diamantina-radio-closed';
    const defaultVolume = Number(localStorage.getItem(volumeKey));
    audio.volume = Number.isFinite(defaultVolume) && defaultVolume >= 0 && defaultVolume <= 1
      ? defaultVolume
      : 0.8;
    if (volume) volume.value = String(audio.volume);

    function setStatus(text, state) {
      status.textContent = text;
      status.dataset.state = state || '';
    }

    function setPlaying(isPlaying) {
      icon.className = isPlaying ? 'fas fa-pause' : 'fas fa-play';
      toggle.setAttribute('aria-label', isPlaying ? 'Pausar rádio' : 'Tocar rádio');
      toggle.setAttribute('aria-pressed', String(isPlaying));
      player.dataset.playing = String(isPlaying);
    }

    function showPlayer(config) {
      const stream = String(config?.radioStream || '').trim();
      const radioPage = String(config?.radioPage || '').trim();
      const radioName = String(config?.radioName || 'Diamantina Gospel FM').trim();

      if (!stream) {
        audio.pause();
        audio.removeAttribute('src');
        audio.load();
        player.hidden = true;
        setPlaying(false);
        return;
      }

      if (sessionStorage.getItem(closedKey) === '1') {
        player.hidden = true;
      } else {
        player.hidden = false;
      }

      if (audio.src !== stream) {
        audio.src = stream;
        audio.load();
      }
      if (title) title.textContent = radioName;
      link.href = radioPage || stream;
      link.hidden = false;
      setPlaying(false);
      setStatus('Pronta para ouvir', 'ready');
    }

    window.setRadioConfig = showPlayer;
    window.__radioPlayerApply = showPlayer;
    if (pendingConfig) {
      showPlayer(pendingConfig);
      pendingConfig = null;
    }

    toggle.addEventListener('click', async () => {
      if (!audio.src) {
        setStatus('Rádio ainda não configurada', 'error');
        return;
      }

      if (!audio.paused) {
        audio.pause();
        return;
      }

      setStatus('Conectando…', 'loading');
      try {
        await audio.play();
      } catch (error) {
        console.warn('Não foi possível iniciar a rádio:', error);
        setPlaying(false);
        setStatus('Clique novamente para ouvir', 'error');
      }
    });

    audio.addEventListener('playing', () => {
      setPlaying(true);
      setStatus('Ao vivo agora', 'live');
    });
    audio.addEventListener('pause', () => {
      setPlaying(false);
      if (audio.src) setStatus('Pausada', 'paused');
    });
    audio.addEventListener('waiting', () => setStatus('Conectando…', 'loading'));
    audio.addEventListener('stalled', () => setStatus('Reconectando…', 'loading'));
    audio.addEventListener('error', () => {
      setPlaying(false);
      setStatus('Rádio indisponível no momento', 'error');
    });

    if (volume) {
      volume.addEventListener('input', event => {
        const value = Number(event.target.value);
        audio.volume = value;
        localStorage.setItem(volumeKey, String(value));
      });
    }

    if (close) {
      close.addEventListener('click', () => {
        audio.pause();
        player.hidden = true;
        sessionStorage.setItem(closedKey, '1');
      });
    }

    window.addEventListener('pageshow', () => {
      if (sessionStorage.getItem(closedKey) !== '1' && audio.src) player.hidden = false;
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initRadioPlayer, { once: true });
  } else {
    initRadioPlayer();
  }
})();
