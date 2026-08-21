import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js';
import { getFirestore, doc, getDoc } from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js';

const firebaseConfig = {
  apiKey: 'AIzaSyBtMB9qs34H8qMjaA_XavJdrUSpOASYBos',
  authDomain: 'ad-diamantina.firebaseapp.com',
  projectId: 'ad-diamantina',
  storageBucket: 'ad-diamantina.firebasestorage.app',
  messagingSenderId: '430449368435',
  appId: '1:430449368435:web:c2d94116f9761fd4c87906'
};

const db = getFirestore(initializeApp(firebaseConfig));
const state = { events: [], carouselEvents: [], currentIndex: 0 };
const $ = (id) => document.getElementById(id);
const escapeHtml = (value) => String(value ?? '').replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));

function safeUrl(raw) {
  const value = String(raw || '').trim();
  if (!value) return '';
  try {
    const url = new URL(value, window.location.href);
    return ['http:', 'https:'].includes(url.protocol) ? url.href : '';
  } catch {
    return '';
  }
}

function parseDate(value) {
  const match = String(value || '').match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!match) return null;
  const [, yearText, monthText, dayText] = match;
  const year = Number(yearText), month = Number(monthText), day = Number(dayText);
  const date = new Date(Date.UTC(year, month - 1, day));
  if (date.getUTCFullYear() !== year || date.getUTCMonth() !== month - 1 || date.getUTCDate() !== day) return null;
  return { iso: `${yearText}-${monthText}-${dayText}`, year, month, day };
}

const months = ['', 'jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];
function formatDate(event) {
  const start = parseDate(event?.dataInicio) || parseDate(event?.data);
  const end = parseDate(event?.dataFim) || start;
  if (!start) return 'Data a confirmar';
  if (!end || start.iso === end.iso) return `${String(start.day).padStart(2, '0')} ${months[start.month]}`;
  if (start.year === end.year && start.month === end.month) return `${String(start.day).padStart(2, '0')}–${String(end.day).padStart(2, '0')} ${months[start.month]}`;
  return `${String(start.day).padStart(2, '0')} ${months[start.month]} – ${String(end.day).padStart(2, '0')} ${months[end.month]}`;
}

function eventDateSortValue(event) {
  const parsed = parseDate(event?.dataInicio) || parseDate(event?.data);
  return parsed ? Date.UTC(parsed.year, parsed.month - 1, parsed.day) : Number.MAX_SAFE_INTEGER;
}

function eventTitle(event) { return String(event?.titulo || 'Evento sem título').trim(); }
function eventLocation(event) { return String(event?.local || '').trim(); }
function eventDescription(event) { return String(event?.descricao || '').trim(); }
function posterUrl(event) { return safeUrl(event?.cartazUrl); }

function showToast(message) {
  const toast = $('lab-toast');
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add('is-visible');
  window.clearTimeout(showToast.timer);
  showToast.timer = window.setTimeout(() => toast.classList.remove('is-visible'), 2600);
}

function sortEvents(events) {
  const sort = $('sort-events')?.value || 'date';
  return [...events].sort((a, b) => {
    if (sort === 'name') return eventTitle(a).localeCompare(eventTitle(b), 'pt-BR', { sensitivity: 'base' });
    return eventDateSortValue(a) - eventDateSortValue(b);
  });
}

function filteredEvents() {
  const filter = $('filter-events')?.value || 'all';
  const active = state.events.filter((event) => event?.ativo !== false);
  return sortEvents(filter === 'posters' ? active.filter((event) => posterUrl(event)) : active);
}

function renderSummary(events) {
  const withPoster = state.events.filter((event) => event?.ativo !== false && posterUrl(event)).length;
  const summary = $('results-summary');
  if (!summary) return;
  summary.textContent = `${events.length} ${events.length === 1 ? 'evento visível' : 'eventos visíveis'} · ${withPoster} com cartaz`;
}

function makePosterCard(event, variant = 'carousel') {
  const url = posterUrl(event);
  const title = escapeHtml(eventTitle(event));
  const location = escapeHtml(eventLocation(event));
  const date = escapeHtml(formatDate(event));
  const alt = escapeHtml(event.cartazAlt || `Cartaz do evento: ${eventTitle(event)}`);
  const locationHtml = location ? `<p><i class="fas fa-location-dot" aria-hidden="true"></i>${location}</p>` : '';
  const click = `data-poster-url="${escapeHtml(url)}" data-poster-title="${title}" data-poster-date="${date}" data-poster-location="${location}"`;

  if (variant === 'collection') {
    return `<article class="collection-card">
      <div class="collection-card__image" role="button" tabindex="0" ${click} aria-label="Abrir cartaz de ${title}">
        <img src="${escapeHtml(url)}" alt="${alt}" loading="lazy" />
        <span class="collection-card__date">${date}</span>
      </div>
      <div class="collection-card__body"><h3>${title}</h3>${locationHtml}</div>
    </article>`;
  }

  return `<div class="carousel-slide">
    <div class="event-poster-card" role="button" tabindex="0" ${click} aria-label="Abrir cartaz de ${title}">
      <img src="${escapeHtml(url)}" alt="${alt}" loading="lazy" />
      <span class="event-date-badge">${date}</span>
      <div class="event-poster-card__caption"><h3>${title}</h3>${locationHtml}</div>
    </div>
  </div>`;
}

function renderCarousel(events) {
  state.carouselEvents = events.filter((event) => posterUrl(event));
  state.currentIndex = Math.min(state.currentIndex, Math.max(0, state.carouselEvents.length - 1));
  const stage = $('carousel-stage');
  const dots = $('carousel-dots');
  const position = $('carousel-position');
  const prev = $('carousel-prev');
  const next = $('carousel-next');
  if (!stage || !dots || !position || !prev || !next) return;

  if (!state.carouselEvents.length) {
    stage.innerHTML = `<div class="carousel-slide"><div class="carousel-empty"><i class="fas fa-image" aria-hidden="true"></i><strong>Nenhum cartaz disponível</strong><span>Envie um cartaz no painel para testar esta visualização.</span></div></div>`;
    dots.innerHTML = '';
    position.textContent = 'Sem cartazes';
    prev.disabled = true;
    next.disabled = true;
    return;
  }

  stage.innerHTML = state.carouselEvents.map((event) => makePosterCard(event)).join('');
  dots.innerHTML = state.carouselEvents.map((event, index) => `<button class="carousel-dot" type="button" data-carousel-index="${index}" aria-label="Mostrar ${escapeHtml(eventTitle(event))}" aria-current="${index === state.currentIndex ? 'true' : 'false'}"></button>`).join('');
  prev.disabled = state.carouselEvents.length < 2;
  next.disabled = state.carouselEvents.length < 2;
  updateCarouselPosition();
}

function updateCarouselPosition() {
  const stage = $('carousel-stage');
  const position = $('carousel-position');
  if (!stage || !position || !state.carouselEvents.length) return;
  stage.style.transform = `translateX(-${state.currentIndex * 100}%)`;
  position.textContent = `${state.currentIndex + 1} / ${state.carouselEvents.length}`;
  document.querySelectorAll('.carousel-dot').forEach((dot, index) => dot.setAttribute('aria-current', String(index === state.currentIndex)));
}

function moveCarousel(step) {
  if (!state.carouselEvents.length) return;
  state.currentIndex = (state.currentIndex + step + state.carouselEvents.length) % state.carouselEvents.length;
  updateCarouselPosition();
}

function renderCollection(events) {
  const collection = $('event-collection');
  if (!collection) return;
  if (!events.length) {
    collection.innerHTML = `<div class="collection-card--no-poster"><i class="fas fa-calendar-xmark" aria-hidden="true"></i>Nenhum evento corresponde ao filtro selecionado.</div>`;
    return;
  }

  const cards = events.filter((event) => posterUrl(event)).map((event) => makePosterCard(event, 'collection')).join('');
  const withoutPoster = events.filter((event) => !posterUrl(event));
  const note = withoutPoster.length ? `<div class="collection-card--no-poster"><i class="fas fa-circle-info" aria-hidden="true"></i>${withoutPoster.length} evento(s) sem cartaz não aparecem nas imagens desta vitrine.</div>` : '';
  collection.innerHTML = cards + note || `<div class="collection-card--no-poster">Nenhum cartaz disponível.</div>`;
}

function makeTimelineCard(event) {
  const url = posterUrl(event);
  const title = escapeHtml(eventTitle(event));
  const location = escapeHtml(eventLocation(event));
  const description = escapeHtml(eventDescription(event));
  const date = escapeHtml(formatDate(event));
  const alt = escapeHtml(event.cartazAlt || `Cartaz do evento: ${eventTitle(event)}`);
  const locationHtml = location ? `<p class="timeline-card__location"><i class="fas fa-location-dot" aria-hidden="true"></i><span>${location}</span></p>` : '';
  const descriptionHtml = description ? `<p class="timeline-card__description">${description}</p>` : '<p class="timeline-card__description timeline-card__description--empty">Descrição a confirmar</p>';
  const media = url
    ? `<div class="timeline-card__media" role="button" tabindex="0" data-poster-url="${escapeHtml(url)}" data-poster-title="${title}" data-poster-date="${date}" data-poster-location="${location}" aria-label="Abrir cartaz de ${title}"><img src="${escapeHtml(url)}" alt="${alt}" loading="lazy" /><span class="timeline-card__expand"><i class="fas fa-expand" aria-hidden="true"></i></span></div>`
    : `<div class="timeline-card__media timeline-card__media--empty" aria-label="Cartaz não enviado"><i class="fas fa-image" aria-hidden="true"></i><span>Cartaz não enviado</span></div>`;

  return `<article class="timeline-card">
    ${media}
    <div class="timeline-card__body">
      <span class="timeline-card__date"><i class="fas fa-calendar-day" aria-hidden="true"></i>${date}</span>
      <h3>${title}</h3>
      ${locationHtml}
      ${descriptionHtml}
    </div>
  </article>`;
}

function renderTimeline(events) {
  const timeline = $('event-timeline');
  if (!timeline) return;
  if (!events.length) {
    timeline.innerHTML = `<div class="timeline-empty"><i class="fas fa-calendar-xmark" aria-hidden="true"></i><strong>Nenhum evento corresponde ao filtro selecionado.</strong><span>Ajuste os filtros para visualizar a agenda cronológica.</span></div>`;
    return;
  }
  timeline.innerHTML = events.map(makeTimelineCard).join('');
}

function render() {
  const events = filteredEvents();
  renderSummary(events);
  renderCarousel(events);
  renderCollection(events);
  renderTimeline(events);
}

function openPoster(target) {
  const url = safeUrl(target.dataset.posterUrl);
  if (!url) return;
  const dialog = $('poster-dialog');
  const image = $('poster-dialog-image');
  if (!dialog || !image) return;
  image.src = url;
  image.alt = target.dataset.posterTitle ? `Cartaz do evento: ${target.dataset.posterTitle}` : 'Cartaz do evento';
  $('poster-dialog-date').textContent = target.dataset.posterDate || '';
  $('poster-dialog-title').textContent = target.dataset.posterTitle || 'Cartaz do evento';
  $('poster-dialog-location').textContent = target.dataset.posterLocation ? `Local: ${target.dataset.posterLocation}` : '';
  if (typeof dialog.showModal === 'function') dialog.showModal();
  else dialog.setAttribute('open', '');
}

function closePoster() {
  const dialog = $('poster-dialog');
  if (!dialog) return;
  if (typeof dialog.close === 'function') dialog.close();
  else dialog.removeAttribute('open');
}

function handlePosterActivation(event) {
  const target = event.target.closest('[data-poster-url]');
  if (!target) return;
  if (event.type === 'keydown' && !['Enter', ' '].includes(event.key)) return;
  if (event.type === 'keydown') event.preventDefault();
  openPoster(target);
}

async function loadBranding() {
  try {
    const snap = await getDoc(doc(db, 'site', 'imagens'));
    const logo = safeUrl(snap.data()?.logo);
    if (logo && $('lab-logo')) {
      $('lab-logo').src = logo;
      $('lab-logo').hidden = false;
    }
  } catch (error) {
    console.warn('Não foi possível carregar a logo do laboratório:', error);
  }
}

async function loadAgenda() {
  try {
    const snap = await getDoc(doc(db, 'site', 'agenda'));
    const events = snap.data()?.eventos;
    state.events = Array.isArray(events) ? events : [];
    render();
  } catch (error) {
    console.error('Erro ao carregar a agenda experimental:', error);
    state.events = [];
    render();
    showToast('Não foi possível carregar os eventos agora.');
  }
}

$('filter-events')?.addEventListener('change', render);
$('sort-events')?.addEventListener('change', render);
$('carousel-prev')?.addEventListener('click', () => moveCarousel(-1));
$('carousel-next')?.addEventListener('click', () => moveCarousel(1));
$('carousel-dots')?.addEventListener('click', (event) => {
  const dot = event.target.closest('[data-carousel-index]');
  if (!dot) return;
  state.currentIndex = Number(dot.dataset.carouselIndex) || 0;
  updateCarouselPosition();
});
$('carousel-stage')?.addEventListener('click', handlePosterActivation);
$('carousel-stage')?.addEventListener('keydown', handlePosterActivation);
$('event-collection')?.addEventListener('click', handlePosterActivation);
$('event-collection')?.addEventListener('keydown', handlePosterActivation);
$('event-timeline')?.addEventListener('click', handlePosterActivation);
$('event-timeline')?.addEventListener('keydown', handlePosterActivation);
$('poster-dialog-close')?.addEventListener('click', closePoster);
$('poster-dialog')?.addEventListener('click', (event) => {
  if (event.target === $('poster-dialog')) closePoster();
});
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && $('poster-dialog')?.open) closePoster();
  if ($('poster-dialog')?.open) return;
  if (event.key === 'ArrowLeft') moveCarousel(-1);
  if (event.key === 'ArrowRight') moveCarousel(1);
});

loadBranding();
loadAgenda();
