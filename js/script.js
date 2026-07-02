
// Loading
window.addEventListener('load', () => {
  setTimeout(() => {
    document.getElementById('loader').classList.add('hidden');
  }, 1400);
});

// Cursor
const cursor = document.getElementById('cursor');
const ring = document.getElementById('cursor-ring');
document.addEventListener('mousemove', e => {
  cursor.style.transform = `translate(${e.clientX - 6}px, ${e.clientY - 6}px)`;
  ring.style.transform = `translate(${e.clientX - 18}px, ${e.clientY - 18}px)`;
});
document.querySelectorAll('a,button').forEach(el => {
  el.addEventListener('mouseenter', () => { cursor.style.transform += ' scale(2)'; });
  el.addEventListener('mouseleave', () => {});
});

// Particles
const canvas = document.getElementById('particles-canvas');
const ctx = canvas.getContext('2d');
let particles = [];
function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);
class Particle {
  constructor() { this.reset(); }
  reset() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.vx = (Math.random() - 0.5) * 0.3;
    this.vy = (Math.random() - 0.5) * 0.3;
    this.r = Math.random() * 1.5 + 0.5;
    this.alpha = Math.random() * 0.3 + 0.1;
  }
  update() {
    this.x += this.vx; this.y += this.vy;
    if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) this.reset();
  }
  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(201,151,43,${this.alpha})`;
    ctx.fill();
  }
}
for (let i = 0; i < 80; i++) particles.push(new Particle());
function animateParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles.forEach(p => { p.update(); p.draw(); });
  // Draw connections
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x;
      const dy = particles[i].y - particles[j].y;
      const dist = Math.sqrt(dx*dx + dy*dy);
      if (dist < 120) {
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.strokeStyle = `rgba(201,151,43,${0.06 * (1 - dist/120)})`;
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }
    }
  }
  requestAnimationFrame(animateParticles);
}
animateParticles();

// Navbar scroll
window.addEventListener('scroll', () => {
  document.getElementById('navbar').classList.toggle('scrolled', window.scrollY > 50);
  document.getElementById('back-top').classList.toggle('visible', window.scrollY > 400);
});

// Notification close
document.getElementById('close-notif').onclick = () => {
  document.getElementById('notif-banner').style.display = 'none';
};

// Mobile menu
function closeMobile() { document.getElementById('mobile-menu').classList.remove('open'); }
document.getElementById('hamburger').onclick = () => {
  document.getElementById('mobile-menu').classList.toggle('open');
};

// Dark mode - disabled (dark mode only)
const themeBtn = document.getElementById('theme-toggle');
// Theme toggle disabled - dark mode only
if (themeBtn) themeBtn.onclick = () => {};

// Typing animation
const phrases = [
  'Where Innovation Meets Excellence',
  'Shaping Engineers of Tomorrow',
  'NAAC Accredited · AICTE Approved',
  'Top Placement Record · Chennai'
];
let pi = 0, ci = 0, del = false;
const el = document.getElementById('typing-text');
function typeLoop() {
  const phrase = phrases[pi];
  if (!del) {
    el.textContent = phrase.slice(0, ci++);
    if (ci > phrase.length) { del = true; setTimeout(typeLoop, 2000); return; }
  } else {
    el.textContent = phrase.slice(0, ci--);
    if (ci < 0) { del = false; pi = (pi + 1) % phrases.length; ci = 0; }
  }
  setTimeout(typeLoop, del ? 40 : 80);
}
setTimeout(typeLoop, 2000);

// Animated Counters
const counterEls = document.querySelectorAll('.counter');
const counterObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const el = entry.target;
      const target = parseInt(el.dataset.target);
      let current = 0;
      const step = Math.ceil(target / 60);
      const timer = setInterval(() => {
        current = Math.min(current + step, target);
        el.textContent = current.toLocaleString();
        if (current >= target) clearInterval(timer);
      }, 30);
      counterObserver.unobserve(el);
    }
  });
}, { threshold: 0.5 });
counterEls.forEach(el => counterObserver.observe(el));

// Dept filter
document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const filter = btn.dataset.filter;
    document.querySelectorAll('.dept-card').forEach(card => {
      const cats = card.dataset.cat || '';
      card.classList.toggle('hidden', filter !== 'all' && !cats.includes(filter));
    });
  });
});

// Table sort
let sortDir = {};
function sortTable(col) {
  const table = document.getElementById('fee-table');
  const tbody = table.tBodies[0];
  const rows = Array.from(tbody.rows);
  const dir = sortDir[col] = !(sortDir[col]);
  rows.sort((a, b) => {
    let va = a.cells[col].textContent.trim();
    let vb = b.cells[col].textContent.trim();
    const numA = parseFloat(va.replace(/[^\d.]/g, ''));
    const numB = parseFloat(vb.replace(/[^\d.]/g, ''));
    if (!isNaN(numA) && !isNaN(numB)) return dir ? numA - numB : numB - numA;
    return dir ? va.localeCompare(vb) : vb.localeCompare(va);
  });
  rows.forEach(r => tbody.appendChild(r));
}

// Lightbox
function openLightbox(src) {
  document.getElementById('lightbox-img').src = src;
  document.getElementById('lightbox').classList.add('open');
}
function closeLightbox(e) {
  if (!e || e.target !== document.getElementById('lightbox-img')) {
    document.getElementById('lightbox').classList.remove('open');
  }
}
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    document.getElementById('lightbox').classList.remove('open');
    document.getElementById('apply-modal').classList.remove('open');
  }
});

// Form validation helpers
function validateEmail(e) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e); }
function showError(id, show) {
  document.getElementById(id).classList.toggle('show', show);
}

// Contact form
function submitContactForm() {
  const name = document.getElementById('cf-name').value.trim();
  const email = document.getElementById('cf-email').value.trim();
  const subject = document.getElementById('cf-subject').value.trim();
  const message = document.getElementById('cf-message').value.trim();
  let valid = true;
  showError('err-name', !name); if (!name) valid = false;
  showError('err-email', !validateEmail(email)); if (!validateEmail(email)) valid = false;
  showError('err-subject', !subject); if (!subject) valid = false;
  showError('err-message', !message); if (!message) valid = false;
  if (valid) document.getElementById('form-success').style.display = 'block';
}

// Apply modal
function submitApplication() {
  const name = document.getElementById('m-name').value.trim();
  const email = document.getElementById('m-email').value.trim();
  const program = document.getElementById('m-program').value;
  let valid = true;
  showError('m-err-name', !name); if (!name) valid = false;
  showError('m-err-email', !validateEmail(email)); if (!validateEmail(email)) valid = false;
  showError('m-err-program', !program); if (!program) valid = false;
  if (valid) document.getElementById('m-success').style.display = 'block';
}

// AI Chatbot
function toggleChat() {
  document.getElementById('chatbot-window').classList.toggle('open');
}

const chatKB = {
  'fee': 'Annual fees range from ₹70,000 (M.E.) to ₹95,000 (AI & DS). Scholarships are available for merit and SC/ST candidates.',
  'eligibility': 'For B.E/B.Tech: 10+2 with PCM, min 45% aggregate. For M.E: B.E/B.Tech in relevant branch with min 50%.',
  'hostel': 'Yes! We have separate boys\' and girls\' hostels with 24/7 security, mess, Wi-Fi and study rooms.',
  'placement': 'Our placement rate is 80.28% with top recruiters like TCS, Infosys, Wipro, HCL, Cognizant, Zoho and more.',
  'counseling': 'Our TNEA Counseling Code is 1442. Enter this code during TNEA counseling to select PDKVCET.',
  'course': 'We offer B.E. CSE, B.E. CSE (Cyber Security), B.E. Biomedical Engineering, B.Tech AI & Data Sciences, and M.E. CSE.',
  'contact': 'Call us at 044-2499 1414 or 9840100400. Email: prince@princedrkvasudevan.com',
  'location': 'We are at Medavakkam-Mambakkam Road, Ponmar, Chennai – 600 127. Well-connected by college buses.',
  'naac': 'Yes, PDKVCET is NAAC Accredited and AICTE Approved, affiliated with Anna University, Chennai.',
  'transport': 'College buses cover Chennai, Tambaram, OMR, ECR and surrounding areas. GPS-tracked routes available.',
};

function sendChat() {
  const input = document.getElementById('chat-input');
  const msg = input.value.trim();
  if (!msg) return;
  const messages = document.getElementById('chat-messages');
  messages.innerHTML += `<div class="chat-msg user">${msg}</div>`;
  input.value = '';
  const dots = document.createElement('div');
  dots.className = 'chat-msg bot'; dots.id = 'typing';
  dots.innerHTML = '<div class="typing-dots"><span></span><span></span><span></span></div>';
  messages.appendChild(dots);
  messages.scrollTop = messages.scrollHeight;
  setTimeout(() => {
    dots.remove();
    const lower = msg.toLowerCase();
    let reply = "I'm not sure about that. Please call us at 044-2499 1414 or email prince@princedrkvasudevan.com for more details!";
    for (const [key, val] of Object.entries(chatKB)) {
      if (lower.includes(key)) { reply = val; break; }
    }
    messages.innerHTML += `<div class="chat-msg bot">${reply}</div>`;
    messages.scrollTop = messages.scrollHeight;
  }, 900);
}

// Company Logo Carousel
let currentLogoIndex = 0;
const totalLogos = 10;
let autoScrollTimeout;

function updateLogoCarousel() {
  // Update slides
  document.querySelectorAll('.logo-slide').forEach((slide, idx) => {
    slide.classList.remove('active', 'prev');
    if (idx === currentLogoIndex) {
      slide.classList.add('active');
    } else if (idx === (currentLogoIndex - 1 + totalLogos) % totalLogos) {
      slide.classList.add('prev');
    }
  });

  // Update dots
  document.querySelectorAll('.carousel-dot').forEach((dot, idx) => {
    dot.classList.toggle('active', idx === currentLogoIndex);
  });

  resetAutoScroll();
}

function nextLogo() {
  currentLogoIndex = (currentLogoIndex + 1) % totalLogos;
  updateLogoCarousel();
}

function prevLogo() {
  currentLogoIndex = (currentLogoIndex - 1 + totalLogos) % totalLogos;
  updateLogoCarousel();
}

function goToLogo(index) {
  currentLogoIndex = index;
  updateLogoCarousel();
}

function autoScroll() {
  nextLogo();
}

function resetAutoScroll() {
  clearTimeout(autoScrollTimeout);
  autoScrollTimeout = setTimeout(autoScroll, 4000);
}

// Start auto-scroll when page loads
document.addEventListener('DOMContentLoaded', () => {
  resetAutoScroll();
});

// Stop auto-scroll when user interacts
document.querySelector('.carousel-arrow.prev').addEventListener('click', (e) => {
  e.stopPropagation();
  prevLogo();
});

document.querySelector('.carousel-arrow.next').addEventListener('click', (e) => {
  e.stopPropagation();
  nextLogo();
});

document.querySelectorAll('.carousel-dot').forEach(dot => {
  dot.addEventListener('click', (e) => {
    e.stopPropagation();
    const idx = Number(dot.dataset.index);
    goToLogo(idx);
  });
});

// Image load error handling: show text fallback when logos are missing
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.logo-slide img').forEach(img => {
    img.addEventListener('error', () => {
      const alt = img.alt || 'Partner';
      const parent = img.parentElement;
      console.warn('Logo failed to load:', img.src);
      parent.innerHTML = `<div class="logo-fallback">${alt.replace(/ Logo$/i, '')}</div>`;
    });
  });
});
