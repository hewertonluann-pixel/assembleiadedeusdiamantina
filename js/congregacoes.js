// congregacoes.js — lê congregações do Firestore e popula a página
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getFirestore, collection, getDocs, orderBy, query }
  from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyBtMB9qs34H8qMjaA_XavJdrUSpOASYBos",
  authDomain: "ad-diamantina.firebaseapp.com",
  projectId: "ad-diamantina",
  storageBucket: "ad-diamantina.firebasestorage.app",
  messagingSenderId: "430449368435",
  appId: "1:430449368435:web:c2d94116f9761fd4c87906"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function loadCongregacoes() {
  try {
    let snap;
    try { snap = await getDocs(query(collection(db,'congregacoes'), orderBy('ordem','asc'))); }
    catch(_) { snap = await getDocs(collection(db,'congregacoes')); }

    const congs = snap.docs.map(d => ({id: d.id, ...d.data()}));
    if(!congs.length) return;

    const countEl = document.getElementById('stat-cong-count');
    if(countEl) countEl.textContent = congs.length < 10 ? '0'+congs.length : congs.length;

    const grid = document.querySelector('.cards-grid');
    if(!grid) return;
    grid.innerHTML = congs.map(c => {
      const foto = c.foto || `https://picsum.photos/seed/${c.id}/800/500`;
      const mapsQuery = encodeURIComponent(c.maps || `${c.endereco||''} ${c.cidade||''}`);
      const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${mapsQuery}`;
      return `
      <article class="cong-card fade-in">
        <div class="cong-card-img">
          <img src="${foto}" alt="${c.nome||''}" width="800" height="500" loading="lazy"
            onerror="this.src='https://picsum.photos/seed/${c.id}church/800/500'" />
          ${c.badge ? `<span class="cong-badge">${c.badge}</span>` : ''}
        </div>
        <div class="cong-card-body">
          <h3>${c.nome||'—'}</h3>
          <div class="cong-address">
            <div class="cong-address-line">
              <i class="fas fa-map-marker-alt" aria-hidden="true"></i>
              <span>${c.endereco||''}${c.cidade ? `<br/>${c.cidade}` : ''}</span>
            </div>
          </div>
          ${c.horario ? `<div class="cong-horario"><i class="fas fa-clock" aria-hidden="true"></i> ${c.horario}</div>` : ''}
          <a class="btn-map" href="${mapsUrl}" target="_blank" rel="noopener noreferrer"
            aria-label="Como chegar em ${c.nome||'congregação'}">
            <i class="fas fa-directions" aria-hidden="true"></i> Como chegar
          </a>
        </div>
      </article>`;
    }).join('');

    const obs = new IntersectionObserver((entries) => {
      entries.forEach((entry, i) => {
        if(entry.isIntersecting) {
          setTimeout(() => entry.target.classList.add('visible'), i * 80);
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    document.querySelectorAll('.fade-in').forEach(el => obs.observe(el));

  } catch(e) {
    console.warn('Firestore indisponível — exibindo dados estáticos.', e);
  }
}

loadCongregacoes();