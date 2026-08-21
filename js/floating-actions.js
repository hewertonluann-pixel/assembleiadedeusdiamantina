// Ações flutuantes — configuração compartilhada entre as páginas públicas.
(() => {
  const state = {
    config: {
      whatsappFloatEnabled: true,
      contributionFloatEnabled: false
    },
    whatsappNumber: '',
    contribution: {
      key: '',
      receiver: '',
      city: '',
      ready: false
    }
  };
  let initialized = false;

  const get = (id) => document.getElementById(id);

  function closeContributionPopover() {
    const popover = get('contribution-float-popover');
    const button = get('contribution-float');
    if (popover) popover.hidden = true;
    if (button) button.setAttribute('aria-expanded', 'false');
  }

  function refresh() {
    const actions = get('floating-actions');
    const whatsapp = get('whatsapp-float');
    const contribution = get('contribution-float');
    const whatsappVisible = Boolean(state.whatsappNumber) && state.config.whatsappFloatEnabled !== false;
    const contributionVisible = state.contribution.ready && state.config.contributionFloatEnabled === true;

    if (whatsapp) whatsapp.hidden = !whatsappVisible;
    if (contribution) contribution.hidden = !contributionVisible;
    if (actions) actions.hidden = !(whatsappVisible || contributionVisible);

    if (!contributionVisible) closeContributionPopover();
  }

  function setConfig(config = {}) {
    state.config = {
      whatsappFloatEnabled: config.whatsappFloatEnabled !== false,
      contributionFloatEnabled: config.contributionFloatEnabled === true
    };
    refresh();
  }

  function setWhatsappNumber(rawNumber) {
    state.whatsappNumber = String(rawNumber || '').replace(/\D/g, '');
    const whatsapp = get('whatsapp-float');
    if (whatsapp) {
      if (state.whatsappNumber) whatsapp.href = `https://wa.me/${state.whatsappNumber}`;
      else whatsapp.removeAttribute('href');
    }
    refresh();
  }

  function copyText(text) {
    if (navigator.clipboard?.writeText) {
      return navigator.clipboard.writeText(text).then(() => true).catch(() => false);
    }
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.setAttribute('readonly', '');
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    let copied = false;
    try { copied = document.execCommand('copy'); } catch (_) { copied = false; }
    textarea.remove();
    return Promise.resolve(copied);
  }

  function bindCopyButton(key) {
    const button = get('contribuicao-float-copy');
    if (!button) return;
    button.onclick = async () => {
      if (!key) return;
      const originalLabel = button.innerHTML;
      const copied = await copyText(key);
      button.innerHTML = copied
        ? '<i class="fas fa-check"></i> Copiada!'
        : '<i class="fas fa-copy"></i> Copiar chave';
      if (!copied) window.alert('Não foi possível copiar automaticamente. Pressione e segure a chave para copiá-la.');
      window.setTimeout(() => { button.innerHTML = originalLabel; }, 2200);
    };
  }

  function setContributionData(data = {}) {
    const key = String(data.key || data.pixKey || '').trim();
    const receiver = String(data.receiver || data.receiverName || '').trim();
    const city = String(data.city || data.receiverCity || '').trim();
    state.contribution = {
      key,
      receiver,
      city,
      ready: Boolean(key && receiver && city)
    };

    const recipient = get('contribuicao-float-recipient');
    const keyElement = get('contribuicao-float-key');
    if (recipient) recipient.textContent = [receiver, city].filter(Boolean).join(' · ');
    if (keyElement) keyElement.textContent = key;
    bindCopyButton(key);
    refresh();
  }

  function initializeInteractions() {
    if (initialized) return;
    initialized = true;
    const contributionFloat = get('contribution-float');
    const contributionPopover = get('contribution-float-popover');
    const contributionClose = get('contribution-float-close');

    contributionFloat?.addEventListener('click', (event) => {
      event.stopPropagation();
      if (!state.contribution.ready || state.config.contributionFloatEnabled !== true) return;
      const isOpen = contributionPopover && !contributionPopover.hidden;
      if (contributionPopover) contributionPopover.hidden = isOpen;
      contributionFloat.setAttribute('aria-expanded', isOpen ? 'false' : 'true');
    });
    contributionClose?.addEventListener('click', closeContributionPopover);
    document.addEventListener('click', (event) => {
      if (contributionPopover && !contributionPopover.hidden && !contributionPopover.contains(event.target) && event.target !== contributionFloat && !contributionFloat?.contains(event.target)) {
        closeContributionPopover();
      }
    });
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') closeContributionPopover();
    });
    bindCopyButton(state.contribution.key);
    refresh();
  }

  window.siteFloatingActions = {
    refresh,
    setConfig,
    setWhatsappNumber,
    setContributionData,
    closeContributionPopover
  };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initializeInteractions, { once: true });
  else initializeInteractions();
})();
