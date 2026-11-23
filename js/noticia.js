import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js';
import { getFirestore, doc, getDoc, getDocs, collection, query, where } from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js';

const firebaseConfig = {
  apiKey: 'AIzaSyBtMB9qs34H8qMjaA_XavJdrUSpOASYBos',
  authDomain: 'ad-diamantina.firebaseapp.com',
  projectId: 'ad-diamantina',
  storageBucket: 'ad-diamantina.firebasestorage.app',
  messagingSenderId: '430449368435',
  appId: '1:430449368435:web:c2d94116f9761fd4c87906'
};

const db = getFirestore(initializeApp(firebaseConfig));
const $ = id => document.getElementById(id);

function escapeHtml(value) {
  return String(value ?? '').replace(/[&<>"']/g, char => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[char]));
}
function safeUrl(value) {
  const raw = String(value || '').trim();
  if (!raw) return '';
  try {
    const url = new URL(raw, window.location.href);
    return ['http:', 'https:'].includes(url.protocol) ? url.href : '';
  } catch (_) { return ''; }
}
function slugify(value) {
  return String(value || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
}
function parseDate(value) {
  const raw = String(value || '').trim();
  if (!raw) return null;
  const date = new Date(`${raw.slice(0, 10)}T12:00:00`);
  return Number.isNaN(date.getTime()) ? null : date;
}
function formatDate(value) {
  const date = parseDate(value);
  return date ? date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' }) : '';
}
function dateValue(value) { return parseDate(value)?.getTime() || 0; }
function articleHref(item) { return `noticia.html?id=${encodeURIComponent(item.id)}`; }
function normalizeNews(snapshot) {
  const data = snapshot.data() || {};
  const title = String(data.titulo || data.title || '').trim();
  return {
    id: snapshot.id,
    titulo: title,
    slug: String(data.slug || slugify(title)).trim(),
    categoria: String(data.categoria || data.category || 'Notícias').trim(),
    autor: String(data.autor || data.author || '').trim(),
    dataPublicacao: String(data.dataPublicacao || data.data || '').trim(),
    resumo: String(data.resumo || data.excerpt || data.linhaFina || '').trim(),
    conteudo: String(data.conteudo || data.content || data.texto || '').trim(),
    imagemUrl: safeUrl(data.imagemUrl || data.imagem || data.imageUrl || data.capaUrl),
    imagemAlt: String(data.imagemAlt || data.imageAlt || data.capaAlt || title || 'Imagem da notícia').trim(),
    publicado: data.publicado === true
  };
}
const RICH_TAGS = new Set(['P', 'BR', 'STRONG', 'B', 'EM', 'I', 'U', 'S', 'H2', 'H3', 'UL', 'OL', 'LI', 'A', 'IMG', 'SPAN', 'DIV', 'FONT']);
const RICH_STYLES = /^(font-size|color|text-align|width)\s*:\s*(?:[a-z#(),.%\s-]+)$/i;
function safeColor(value) { return /^#[0-9a-f]{3,8}$/i.test(String(value || '').trim()) ? String(value).trim() : ''; }
function sanitizeRichHtml(value) {
  const template = document.createElement('template');
  template.innerHTML = String(value || '');
  const clean = document.createElement('div');
  const visit = (source, target) => {
    source.childNodes.forEach(node => {
      if (node.nodeType === Node.TEXT_NODE) { target.appendChild(document.createTextNode(node.nodeValue || '')); return; }
      if (node.nodeType !== Node.ELEMENT_NODE) return;
      const tag = node.tagName.toUpperCase();
      if (!RICH_TAGS.has(tag)) { visit(node, target); return; }
      const element = document.createElement(tag.toLowerCase());
      if (tag === 'A') {
        const href = safeUrl(node.getAttribute('href'));
        if (href) { element.setAttribute('href', href); element.setAttribute('target', '_blank'); element.setAttribute('rel', 'noopener noreferrer'); }
      }
      if (tag === 'IMG') {
        const src = safeUrl(node.getAttribute('src'));
        if (!src) return;
        element.setAttribute('src', src);
        element.setAttribute('alt', String(node.getAttribute('alt') || 'Imagem inserida na notícia').slice(0, 180));
        element.setAttribute('loading', 'lazy');
      }
      if (tag !== 'A') {
        const style = String(node.getAttribute('style') || '').split(';').map(rule => rule.trim()).filter(rule => RICH_STYLES.test(rule)).join('; ');
        if (style) element.setAttribute('style', style);
      }
      if (tag === 'FONT') {
        const color = safeColor(node.getAttribute('color'));
        if (color) element.setAttribute('style', `color: ${color}`);
        const fontSizes = { '1': '0.75rem', '2': '0.875rem', '3': '1rem', '4': '1.25rem', '5': '1.5rem', '6': '1.875rem', '7': '2.25rem' };
        const size = fontSizes[node.getAttribute('size') || ''];
        if (size) element.setAttribute('style', `${element.getAttribute('style') || ''}${element.getAttribute('style') ? '; ' : ''}font-size: ${size}`);
      }
      visit(node, element);
      target.appendChild(element);
    });
  };
  visit(template.content, clean);
  return clean.innerHTML;
}
function renderBody(text) {
  const raw = String(text || '').trim();
  if (!raw) return '';
  if (!/<[a-z][\s\S]*>/i.test(raw)) {
    const paragraphs = raw.split(/\n\s*\n/).map(item => item.trim()).filter(Boolean);
    return paragraphs.map(paragraph => `<p>${escapeHtml(paragraph).replace(/\n/g, '<br />')}</p>`).join('');
  }
  return sanitizeRichHtml(raw);
}
function showNotFound() {
  $('news-loading').hidden = true;
  $('news-not-found').hidden = false;
  $('news-content').hidden = true;
}
function renderNavigation(allNews, current) {
  const published = allNews.filter(item => item.publicado && item.titulo).sort((a, b) => dateValue(b.dataPublicacao) - dateValue(a.dataPublicacao) || a.titulo.localeCompare(b.titulo, 'pt-BR'));
  const index = published.findIndex(item => item.id === current.id);
  const previous = index > 0 ? published[index - 1] : null;
  const next = index >= 0 && index < published.length - 1 ? published[index + 1] : null;
  const nav = $('news-navigation');
  const previousLink = $('news-previous');
  const nextLink = $('news-next');
  const setLink = (element, item) => {
    if (!element) return;
    element.hidden = !item;
    if (!item) return;
    element.href = articleHref(item);
    element.querySelector('.news-detail-nav__title').textContent = item.titulo;
  };
  setLink(previousLink, previous);
  setLink(nextLink, next);
  if (nav) nav.hidden = !previous && !next;
}
async function shareNews(title) {
  const shareData = { title, text: `${title} — Assembleia de Deus Ministério de Diamantina`, url: window.location.href };
  try {
    if (navigator.share) { await navigator.share(shareData); return; }
    if (navigator.clipboard?.writeText) { await navigator.clipboard.writeText(window.location.href); window.alert('Link da notícia copiado.'); return; }
  } catch (error) {
    if (error?.name === 'AbortError') return;
  }
  window.prompt('Copie o link desta notícia:', window.location.href);
}
async function loadNews() {
  const requestedId = new URLSearchParams(window.location.search).get('id') || '';
  if (!requestedId.trim()) { showNotFound(); return; }

  let current;
  try {
    const requestedSnapshot = await getDoc(doc(db, 'noticias', requestedId));
    if (!requestedSnapshot.exists()) { showNotFound(); return; }
    current = normalizeNews(requestedSnapshot);
    if (!current.publicado || !current.titulo || !current.resumo || !current.conteudo) { showNotFound(); return; }

    $('news-category').textContent = current.categoria || 'Notícias';
    $('news-breadcrumb-title').textContent = current.titulo;
    $('news-title').textContent = current.titulo;
    $('news-summary').textContent = current.resumo;
    $('news-body').innerHTML = renderBody(current.conteudo);
    const date = formatDate(current.dataPublicacao);
    $('news-date').textContent = date;
    $('news-date-wrap').hidden = !date;
    const cover = $('news-cover');
    if (current.imagemUrl) {
      $('news-image').src = current.imagemUrl;
      $('news-image').alt = current.imagemAlt;
      cover.hidden = false;
    } else {
      cover.hidden = true;
    }
    $('news-author').textContent = current.autor;
    $('news-author-wrap').hidden = !current.autor;
    document.title = `${current.titulo} — AD Diamantina`;
    const description = current.resumo.slice(0, 155);
    document.querySelector('meta[name="description"]')?.setAttribute('content', description);
    $('news-share').addEventListener('click', () => shareNews(current.titulo));

    // A matéria já está pronta para ser exibida. A navegação lateral é
    // complementar e não pode transformar uma notícia válida em 404 se a
    // consulta da lista falhar temporariamente ou estiver indisponível.
    $('news-loading').hidden = true;
    $('news-content').hidden = false;
  } catch (error) {
    console.warn('loadNews:', error);
    showNotFound();
    return;
  }

  try {
    const allSnapshot = await getDocs(query(collection(db, 'noticias'), where('publicado', '==', true)));
    renderNavigation(allSnapshot.docs.map(normalizeNews), current);
  } catch (error) {
    console.warn('loadNews navigation:', error);
    renderNavigation([], current);
  }
}

loadNews();
