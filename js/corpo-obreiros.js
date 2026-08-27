import { doc, getDoc } from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js';
import { db } from './firebase-client.js';

const COMPONENT_URL = 'components/corpo-obreiros.html';

function escapeHtml(value) {
  return String(value ?? '').replace(/[&<>"']/g, char => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  }[char]));
}

function safeImageUrl(value) {
  const raw = String(value || '').trim();
  if (!raw) return '';
  try {
    const url = new URL(raw, document.baseURI);
    if (url.protocol === 'data:') return /^data:image\//i.test(url.href) ? url.href : '';
    return ['http:', 'https:'].includes(url.protocol) ? url.href : '';
  } catch (_) {
    return '';
  }
}

function activeCards(list) {
  return [...list.querySelectorAll('.corpo-obreiros__card')];
}

function clearActiveCards(list) {
  activeCards(list).forEach(card => card.classList.remove('is-active'));
}

function toggleCard(list, card) {
  const wasActive = card.classList.contains('is-active');
  clearActiveCards(list);
  if (!wasActive) card.classList.add('is-active');
}

const photoDialogState = { trigger: null };

function cardHasPhoto(card) {
  return Boolean(card?.querySelector('.corpo-obreiros__photo img'));
}

function closePhotoDialog(restoreFocus = true) {
  const dialog = document.getElementById('obreiro-photo-dialog');
  if (!dialog) return;
  const image = document.getElementById('obreiro-photo-dialog-image');
  if (image) {
    image.removeAttribute('src');
    image.alt = '';
  }
  dialog.hidden = true;
  document.body.classList.remove('corpo-obreiros-dialog-open');
  const trigger = photoDialogState.trigger;
  photoDialogState.trigger = null;
  if (restoreFocus && trigger?.isConnected) trigger.focus();
}

function openPhotoDialog(card) {
  const source = card?.querySelector('.corpo-obreiros__photo img');
  const dialog = document.getElementById('obreiro-photo-dialog');
  const image = document.getElementById('obreiro-photo-dialog-image');
  const title = document.getElementById('obreiro-photo-dialog-title');
  const role = document.getElementById('obreiro-photo-dialog-role');
  const close = dialog?.querySelector('[data-obreiro-dialog-close]');
  if (!source || !dialog || !image || !title || !role) return;

  const name = card.querySelector('.corpo-obreiros__info strong')?.textContent.trim() || 'Pastor';
  const details = card.querySelector('.corpo-obreiros__info span')?.textContent.trim() || 'Corpo de obreiros';
  image.src = source.currentSrc || source.src;
  image.alt = source.alt || `Foto de ${name}`;
  title.textContent = name;
  role.textContent = details;
  photoDialogState.trigger = card;
  dialog.hidden = false;
  document.body.classList.add('corpo-obreiros-dialog-open');
  close?.focus();
}

function initPhotoDialog() {
  const dialog = document.getElementById('obreiro-photo-dialog');
  const close = dialog?.querySelector('[data-obreiro-dialog-close]');
  if (!dialog || !close) return;
  close.addEventListener('click', () => closePhotoDialog());
  dialog.addEventListener('click', event => {
    if (event.target === dialog) closePhotoDialog();
  });
  document.addEventListener('keydown', event => {
    if (dialog.hidden) return;
    if (event.key === 'Escape') {
      event.preventDefault();
      closePhotoDialog();
    }
  });
}

function initInteractions(list) {
  initPhotoDialog();
  list.addEventListener('click', event => {
    const card = event.target.closest('.corpo-obreiros__card');
    if (!card) return;
    if (card.classList.contains('is-active') && cardHasPhoto(card)) openPhotoDialog(card);
    else toggleCard(list, card);
  });

  list.addEventListener('keydown', event => {
    const card = event.target.closest('.corpo-obreiros__card');
    if (!card) return;
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      if (card.classList.contains('is-active') && cardHasPhoto(card)) openPhotoDialog(card);
      else toggleCard(list, card);
    } else if (event.key === 'Escape') {
      clearActiveCards(list);
    }
  });

  document.addEventListener('click', event => {
    if (!event.target.closest('.corpo-obreiros__card')) clearActiveCards(list);
  });
}

function renderPresident(presidente) {
  const heroPresident = document.getElementById('hero-president');
  if (!heroPresident) return false;
  const p = presidente || {};
  const hasPresident = Boolean(p.nome || p.funcao || p.bio || p.fotoUrl);
  heroPresident.hidden = !hasPresident;
  if (!hasPresident) return false;

  const name = document.getElementById('hero-president-name');
  const role = document.getElementById('hero-president-role');
  const photo = document.getElementById('hero-president-photo');
  if (name) name.textContent = p.nome || '';
  if (role) role.textContent = p.funcao || '';
  if (photo) {
    const alt = p.alt || p.nome || 'Foto do pastor presidente';
    const photoUrl = safeImageUrl(p.fotoUrl);
    photo.innerHTML = photoUrl
      ? `<img src="${escapeHtml(photoUrl)}" alt="${escapeHtml(alt)}" />`
      : '<i class="fas fa-user-tie" aria-hidden="true"></i><span>Foto do pastor presidente</span>';
  }
  return true;
}

function renderObreiros(list, obreiros) {
  list.innerHTML = obreiros.map(obreiro => {
    const nome = String(obreiro.nome || 'Pastor').trim();
    const details = [obreiro.funcao, obreiro.local].filter(Boolean).join(' · ');
    const detailsLabel = details || 'Corpo de obreiros';
    const alt = obreiro.alt || nome || 'Foto do pastor';
    const photoUrl = safeImageUrl(obreiro.fotoUrl);
    const photo = photoUrl
      ? `<img src="${escapeHtml(photoUrl)}" alt="${escapeHtml(alt)}" loading="lazy" />`
      : '<div class="corpo-obreiros__placeholder"><span>Foto em breve</span></div>';
    return `<article class="corpo-obreiros__card" tabindex="0" aria-label="${escapeHtml([nome, detailsLabel].filter(Boolean).join(' — '))}">
      <div class="corpo-obreiros__photo">${photo}<div class="corpo-obreiros__info"><strong>${escapeHtml(nome)}</strong><span>${escapeHtml(detailsLabel)}</span></div></div>
    </article>`;
  }).join('');
}

async function loadCorpoObreiros() {
  const section = document.getElementById('lideranca');
  const mount = document.getElementById('lideranca-mount');
  if (!section || !mount) return;

  try {
    const [templateResponse, snapshot] = await Promise.all([
      fetch(COMPONENT_URL),
      getDoc(doc(db, 'site', 'lideranca'))
    ]);
    if (!templateResponse.ok) throw new Error(`Componente não carregado (${templateResponse.status})`);

    mount.innerHTML = await templateResponse.text();
    const team = document.getElementById('lideranca-team');
    const list = document.getElementById('lideranca-list');
    if (!team || !list) throw new Error('Estrutura do componente incompleta');

    const data = snapshot.data() || {};
    const presidente = data.presidente || {};
    const obreiros = Array.isArray(data.obreiros)
      ? data.obreiros.filter(item => item && (item.nome || item.funcao || item.fotoUrl))
      : [];
    const hasPresident = renderPresident(presidente);

    section.hidden = !obreiros.length;
    team.hidden = !obreiros.length;
    if (!obreiros.length) return;

    renderObreiros(list, obreiros);
    initInteractions(list);
    if (hasPresident) section.dataset.hasPresident = 'true';
  } catch (error) {
    section.hidden = true;
    console.warn('loadCorpoObreiros:', error);
  }
}

loadCorpoObreiros();
