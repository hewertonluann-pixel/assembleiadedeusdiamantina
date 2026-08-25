// === NAV SCROLL EFFECT ===
const header = document.getElementById('header');
window.addEventListener('scroll', () => {
  header.style.boxShadow = window.scrollY > 40
    ? '0 4px 24px rgba(26,58,143,0.15)'
    : '0 2px 16px rgba(26,58,143,0.08)';
});

// === HAMBURGER MENU ===
const hamburger = document.getElementById('hamburger');
const nav = document.getElementById('nav');
hamburger.addEventListener('click', () => {
  nav.classList.toggle('open');
  hamburger.setAttribute('aria-expanded', nav.classList.contains('open'));
});
document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    nav.classList.remove('open');
  });
});

// === ACTIVE NAV LINK ON SCROLL ===
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link');
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navLinks.forEach(link => link.classList.remove('active'));
      const active = document.querySelector(`.nav-link[href="#${entry.target.id}"], .nav-link[href$="#${entry.target.id}"]`);
      if (active) active.classList.add('active');
    }
  });
}, { threshold: 0.4 });
sections.forEach(s => observer.observe(s));

// === FORMULÁRIO DE CONTATO ===
function enviarFormulario(e) {
  e.preventDefault();
  const feedback = document.getElementById('form-feedback');
  const nome = document.getElementById('nome').value.trim();
  const email = document.getElementById('email').value.trim();
  const mensagem = document.getElementById('mensagem').value.trim();

  if (!nome || !email || !mensagem) {
    feedback.className = 'form-feedback error';
    feedback.textContent = 'Por favor, preencha todos os campos obrigatórios.';
    return;
  }

  const waNum = String(window._waNum || '').replace(/\D/g, '');
  if (!waNum) {
    feedback.className = 'form-feedback error';
    feedback.textContent = 'O WhatsApp institucional ainda não foi configurado. Entre em contato pelas redes sociais ou pelo telefone da igreja.';
    return;
  }

  // Abre WhatsApp com a mensagem formatada
  const assunto = document.getElementById('assunto').value;
  const tel = document.getElementById('telefone').value;
  const texto = `Olá! Mensagem do site:\n\n*Nome:* ${nome}\n*E-mail:* ${email}\n*Telefone:* ${tel || 'Não informado'}\n*Assunto:* ${assunto}\n*Mensagem:* ${mensagem}`;
  const url = `https://wa.me/${waNum}?text=${encodeURIComponent(texto)}`;
  window.open(url, '_blank');

  feedback.className = 'form-feedback success';
  feedback.textContent = 'Redirecionando para o WhatsApp... Obrigado pelo contato!';
  document.getElementById('form-contato').reset();
}

// === COPIAR CHAVE PIX ===
function copiarPix() {
  const chave = document.getElementById('pix-chave').textContent;
  navigator.clipboard.writeText(chave).then(() => {
    alert('Chave PIX copiada: ' + chave);
  }).catch(() => {
    const ta = document.createElement('textarea');
    ta.value = chave;
    document.body.appendChild(ta);
    ta.select();
    document.execCommand('copy');
    document.body.removeChild(ta);
    alert('Chave PIX copiada!');
  });
}

// === FADE IN ANIMATION ON SCROLL ===
const fadeEls = document.querySelectorAll('.culto-card, .ministerio-card, .agenda-lista li, .rede-card');
const fadeObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }, i * 80);
      fadeObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });
fadeEls.forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(20px)';
  el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
  fadeObserver.observe(el);
});
