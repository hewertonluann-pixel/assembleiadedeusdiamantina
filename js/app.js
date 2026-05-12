// app.js — lê dados do Firestore e popula o index.html dinamicamente
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getFirestore, doc, getDoc, collection, getDocs, orderBy, query }
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

async function loadSite() {
  try {
    await Promise.all([loadHome(), loadAgenda(), loadMinisterios(), loadRedes(), loadContato()]);
  } catch(e) { console.warn('Firebase indisponível — conteúdo padrão exibido.', e); }
}

async function loadHome() {
  const snap = await getDoc(doc(db,'site','home'));
  if(!snap.exists()) return;
  const d = snap.data();
  if(d.verse) { const v=document.querySelector('.hero-verse'); if(v) v.textContent=d.verse; }
  if(d.title) { const t=document.querySelector('.hero-title'); if(t) t.innerHTML=d.title.replace(/\n/g,'<br/>'); }
  if(d.subtitle) { const s=document.querySelector('.hero-sub'); if(s) s.textContent=d.subtitle; }
  if(d.sobre_p1||d.sobre_p2) {
    const ps=document.querySelectorAll('.sobre-texto > p');
    if(ps[0]&&d.sobre_p1) ps[0].textContent=d.sobre_p1;
    if(ps[1]&&d.sobre_p2) ps[1].textContent=d.sobre_p2;
  }
  if(d.cultos&&d.cultos.length) {
    const cards=document.querySelectorAll('.culto-card');
    d.cultos.forEach((c,i) => {
      if(cards[i]) {
        const strong=cards[i].querySelector('strong');
        const span=cards[i].querySelector('span');
        if(strong) strong.textContent=c.label;
        if(span) span.textContent=c.hora;
      }
    });
  }
}

async function loadAgenda() {
  const snap = await getDoc(doc(db,'site','agenda'));
  if(!snap.exists()) return;
  const eventos = snap.data().eventos||[];
  const lista = document.getElementById('agenda-lista');
  if(!lista||!eventos.length) return;
  lista.innerHTML = eventos.map(ev=>`
    <li>
      <span class="agenda-data">${(ev.data||'').replace('/',`<br/>`)}</span>
      <div class="agenda-info"><strong>${ev.titulo||''}</strong><span>${ev.local||''}</span></div>
    </li>`).join('');
}

async function loadMinisterios() {
  const snap = await getDoc(doc(db,'site','ministerios'));
  if(!snap.exists()) return;
  const lista = snap.data().lista||[];
  const cards = document.querySelectorAll('.ministerio-card');
  lista.forEach((m,i) => {
    if(cards[i]) {
      const h3=cards[i].querySelector('h3');
      const p=cards[i].querySelector('p');
      if(h3) h3.textContent=m.nome;
      if(p) p.textContent=m.desc;
    }
  });
}

async function loadRedes() {
  const snap = await getDoc(doc(db,'site','redes'));
  if(!snap.exists()) return;
  const d = snap.data();
  if(d.instagram) document.querySelectorAll('a[href*="instagram"]').forEach(a=>a.href=d.instagram);
  if(d.facebook)  document.querySelectorAll('a[href*="facebook"]').forEach(a=>a.href=d.facebook);
  if(d.youtube)   document.querySelectorAll('a[href*="youtube"]').forEach(a=>a.href=d.youtube);
  if(d.whatsapp)  document.querySelectorAll('a[href*="wa.me"]').forEach(a=>a.href=`https://wa.me/${d.whatsapp}`);
}

async function loadContato() {
  const snap = await getDoc(doc(db,'site','contato'));
  if(!snap.exists()) return;
  const d = snap.data();
  if(d.rua||d.bairro||d.cidade) {
    const endEl=document.querySelector('.contato-info p');
    if(endEl) endEl.innerHTML=`${d.rua||''}<br/>${d.bairro||''}<br/>${d.cidade||''}, CEP ${d.cep||''}`;
  }
  if(d.maps) {
    const iframe=document.querySelector('.mapa iframe');
    if(iframe) iframe.src=d.maps;
  }
}

loadSite();