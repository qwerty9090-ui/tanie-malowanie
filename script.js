// ========== PRELOADER ==========
window.addEventListener('load', () => {
  const preloader = document.getElementById('preloader');
  setTimeout(() => {
    preloader.style.opacity = '0';
    setTimeout(() => {
      preloader.style.display = 'none';
    }, 500);
  }, 1200);
});

// ========== BUBBLES GENERATOR ==========
function createBubbles() {
  const container = document.getElementById('bubbles');
  if (!container) return;
  
  for (let i = 0; i < 35; i++) {
    const bubble = document.createElement('div');
    bubble.classList.add('bubble');
    const size = Math.random() * 120 + 30;
    bubble.style.width = size + 'px';
    bubble.style.height = size + 'px';
    bubble.style.left = Math.random() * 100 + '%';
    bubble.style.top = Math.random() * 100 + '%';
    bubble.style.animationDelay = Math.random() * 8 + 's';
    bubble.style.animationDuration = Math.random() * 10 + 6 + 's';
    container.appendChild(bubble);
  }
}
createBubbles();

// ========== CUSTOM CURSOR ==========
const cursor = document.querySelector('.cursor');
const cursorFollower = document.querySelector('.cursor-follower');

if (cursor && cursorFollower && window.innerWidth > 1024) {
  document.addEventListener('mousemove', (e) => {
    cursor.style.transform = `translate(${e.clientX - 5}px, ${e.clientY - 5}px)`;
    cursorFollower.style.transform = `translate(${e.clientX - 17}px, ${e.clientY - 17}px)`;
  });
  
  const hoverElements = document.querySelectorAll('a, button, .service-card, .gallery-card, .btn');
  hoverElements.forEach(el => {
    el.addEventListener('mouseenter', () => cursorFollower.classList.add('hover'));
    el.addEventListener('mouseleave', () => cursorFollower.classList.remove('hover'));
  });
}

// ========== SCROLL PROGRESS ==========
window.addEventListener('scroll', () => {
  const winScroll = document.documentElement.scrollTop;
  const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
  const scrolled = (winScroll / height) * 100;
  document.querySelector('.scroll-progress').style.width = scrolled + '%';
});

// ========== HEADER SCROLL EFFECT ==========
const header = document.getElementById('header');
window.addEventListener('scroll', () => {
  if (window.scrollY > 50) {
    header.classList.add('scrolled');
  } else {
    header.classList.remove('scrolled');
  }
});

// ========== MOBILE MENU ==========
const menuToggle = document.getElementById('menuToggle');
const mobileMenu = document.getElementById('mobileMenu');

if (menuToggle) {
  menuToggle.addEventListener('click', () => {
    menuToggle.classList.toggle('active');
    mobileMenu.classList.toggle('active');
    document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
  });
}

document.querySelectorAll('.mobile-menu a').forEach(link => {
  link.addEventListener('click', () => {
    menuToggle.classList.remove('active');
    mobileMenu.classList.remove('active');
    document.body.style.overflow = '';
  });
});

// ========== ACTIVE NAV LINK ==========
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link');

window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(section => {
    const sectionTop = section.offsetTop - 120;
    const sectionHeight = section.clientHeight;
    if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
      current = section.getAttribute('id');
    }
  });
  
  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === `#${current}`) {
      link.classList.add('active');
    }
  });
});

// ========== ANIMATE NUMBERS ON SCROLL ==========
const animateNumbers = () => {
  const numbers = document.querySelectorAll('.stat-number');
  numbers.forEach(el => {
    const target = parseInt(el.getAttribute('data-count'));
    let current = 0;
    const increment = target / 60;
    const updateNumber = () => {
      current += increment;
      if (current < target) {
        el.textContent = Math.floor(current);
        requestAnimationFrame(updateNumber);
      } else {
        el.textContent = target;
      }
    };
    updateNumber();
  });
};

const statsObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateNumbers();
      statsObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.3 });

const statsContainer = document.querySelector('.hero-stats');
if (statsContainer) statsObserver.observe(statsContainer);

// ========== SWIPER GALLERY ==========
const gallerySwiper = new Swiper('.gallerySwiper', {
  slidesPerView: 1,
  spaceBetween: 25,
  loop: true,
  pagination: { el: '.swiper-pagination', clickable: true },
  navigation: { nextEl: '.swiper-button-next', prevEl: '.swiper-button-prev' },
  breakpoints: { 640: { slidesPerView: 2 }, 1024: { slidesPerView: 3 } }
});

// ========== SWIPER OPINIONS ==========
const opinionsSwiper = new Swiper('.opinionsSwiper', {
  slidesPerView: 1,
  spaceBetween: 25,
  loop: true,
  navigation: { nextEl: '.opinions-next', prevEl: '.opinions-prev' },
  breakpoints: { 768: { slidesPerView: 2 }, 1024: { slidesPerView: 3 } }
});

// ========== AOS INIT ==========
AOS.init({ duration: 800, once: true, offset: 50 });

// ============================================================
// ========== ADMIN SYSTEM - IP ZASZYTY W KODZIE ==========
// ============================================================

// 🔐 TWOJ IP - ZASZYTY NA STAŁE (NIE MOŻNA ZMIENIĆ PRZEZ UŻYTKOWNIKA)
const ALLOWED_IP = '46.205.203.179'; // ← TWÓJ IP ZASZYTY W KODZIE

const ADMIN_PASSWORD = 'T9#vK2!mQ7@xL4$p';
let isAdminLogged = false;
let userIP = '';
let clickCount = 0;
let clickTimer = null;

// ========== POBIERAMY IP UŻYTKOWNIKA ==========
async function getUserIP() {
  try {
    const response = await fetch('https://api.ipify.org?format=json');
    const data = await response.json();
    userIP = data.ip;
    console.log('🔍 Twój IP:', userIP);
    console.log('🔐 Dozwolony IP:', ALLOWED_IP);
    return userIP;
  } catch (error) {
    userIP = 'unknown';
    return 'unknown';
  }
}

// ========== SPRAWDZAMY IP ==========
function isIPAllowed() {
  if (userIP === 'unknown') {
    // Jeśli nie udało się pobrać IP - sprawdzamy czy to localhost
    return window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
  }
  return userIP === ALLOWED_IP;
}

// ========== KLIKNIĘCIA W STOPKĘ (5 razy) ==========
const footer = document.querySelector('.footer');
if (footer) {
  footer.addEventListener('click', async (e) => {
    if (e.target.closest('a')) return;
    
    // Jeśli IP jeszcze nie pobrany - pobieramy
    if (!userIP) {
      await getUserIP();
    }
    
    clickCount++;
    clearTimeout(clickTimer);
    clickTimer = setTimeout(() => { clickCount = 0; }, 2000);
    
    if (clickCount >= 5) {
      clickCount = 0;
      
      // ========== SPRAWDZAMY IP ==========
      if (!isIPAllowed()) {
        showToast('⛔ Dostęp zabroniony', 'Twój IP nie ma uprawnień do panelu admina');
        console.log('⛔ Nieautoryzowany IP:', userIP);
        console.log('✅ Dozwolony IP:', ALLOWED_IP);
        return;
      }
      
      // ========== PROSIMY O HASŁO ==========
      if (!isAdminLogged) {
        const pwd = prompt('🔐 Wprowadź hasło administratora:');
        if (pwd === ADMIN_PASSWORD) {
          isAdminLogged = true;
          renderAdminMessages();
          document.getElementById('adminModal').style.display = 'flex';
          showToast('✅ Witaj Adminie!', 'Panel administracyjny otwarty');
        } else {
          showToast('❌ Błąd', 'Nieprawidłowe hasło!');
        }
      } else {
        renderAdminMessages();
        document.getElementById('adminModal').style.display = 'flex';
      }
    }
  });
}

// ========== SYSTEM WIADOMOŚCI ==========
let messages = JSON.parse(localStorage.getItem('tanie_malowanie_messages') || '[]');

function saveMessages() {
  localStorage.setItem('tanie_malowanie_messages', JSON.stringify(messages));
}

function addMessage(data) {
  const newMsg = {
    id: Date.now(),
    date: new Date().toLocaleString('pl-PL'),
    name: data.name,
    phone: data.phone,
    description: data.description || '—',
    files: data.files || []
  };
  messages.unshift(newMsg);
  saveMessages();
  showToast('📬 Nowe zapytanie!', `${data.name} (${data.phone})`);
}

function renderAdminMessages() {
  const container = document.getElementById('adminMessages');
  if (!container) return;
  
  if (messages.length === 0) {
    container.innerHTML = '<p style="text-align:center; color:#94a3b8; padding:40px;">Brak zapytań</p>';
    return;
  }
  
  container.innerHTML = messages.map(msg => `
    <div class="admin-message">
      <div class="message-date">📅 ${msg.date}</div>
      <div><strong>👤 Imię:</strong> ${escapeHtml(msg.name)}</div>
      <div><strong>📞 Telefon:</strong> ${escapeHtml(msg.phone)}</div>
      <div><strong>📝 Opis:</strong> ${escapeHtml(msg.description)}</div>
    </div>
  `).join('');
}

function escapeHtml(str) {
  if (!str) return '';
  return str.replace(/[&<>]/g, function(m) {
    if (m === '&') return '&amp;';
    if (m === '<') return '&lt;';
    if (m === '>') return '&gt;';
    return m;
  });
}

function showToast(title, message) {
  const toast = document.getElementById('toast');
  if (!toast) return;
  toast.innerHTML = `<strong>${title}</strong><br>${message}`;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 4000);
}

// ========== STEROWANIE MODAL ADMINA ==========
const closeModal = document.querySelector('.close-modal');
const clearMsgs = document.getElementById('clearMsgs');
const refreshMsgs = document.getElementById('refreshMsgs');

if (closeModal) {
  closeModal.addEventListener('click', () => {
    document.getElementById('adminModal').style.display = 'none';
  });
}

window.addEventListener('click', (e) => {
  if (e.target === document.getElementById('adminModal')) {
    document.getElementById('adminModal').style.display = 'none';
  }
});

if (clearMsgs) {
  clearMsgs.addEventListener('click', () => {
    if (confirm('Czy na pewno chcesz usunąć WSZYSTKIE zapytania?')) {
      messages = [];
      saveMessages();
      renderAdminMessages();
      showToast('🗑️ Usunięto', 'Wszystkie zapytania zostały usunięte');
    }
  });
}

if (refreshMsgs) {
  refreshMsgs.addEventListener('click', () => {
    messages = JSON.parse(localStorage.getItem('tanie_malowanie_messages') || '[]');
    renderAdminMessages();
    showToast('🔄 Odświeżono', 'Lista zapytań została odświeżona');
  });
}

// ========== OBSŁUGA FORMULARZA ==========
const form = document.getElementById('mainForm');
const formStatus = document.getElementById('formStatus');
const fileInput = document.getElementById('userFiles');
const fileList = document.getElementById('fileList');

if (fileInput) {
  fileInput.addEventListener('change', (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      fileList.innerHTML = `✅ ${files.length} plik(i) wybrano: ${files.map(f => f.name).join(', ')}`;
    } else {
      fileList.innerHTML = 'Nie wybrano plików';
    }
  });
}

if (form) {
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const name = document.getElementById('userName').value.trim();
    const phone = document.getElementById('userPhone').value.trim();
    const description = document.getElementById('userDesc').value.trim();
    
    if (!name || !phone) {
      formStatus.innerHTML = '<span style="color:#ef4444;">❌ Proszę wypełnić imię i numer telefonu!</span>';
      return;
    }
    
    addMessage({
      name: name,
      phone: phone,
      description: description,
      files: fileInput && fileInput.files.length ? Array.from(fileInput.files).map(f => f.name) : []
    });
    
    formStatus.innerHTML = '<span style="color:#22c55e;">✅ Dziękujemy! Skontaktujemy się z Tobą w ciągu 30 minut.</span>';
    form.reset();
    if (fileList) fileList.innerHTML = 'Nie wybrano plików';
    
    setTimeout(() => {
      formStatus.innerHTML = '';
    }, 6000);
  });
}

// ========== PŁYNNE PRZEWIJANIE ==========
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// ========== PRZYCISKI ==========
document.getElementById('openFormBtn')?.addEventListener('click', () => {
  document.getElementById('contact').scrollIntoView({ behavior: 'smooth' });
});

document.getElementById('moreGalleryBtn')?.addEventListener('click', () => {
  gallerySwiper.slideNext();
});

// ========== START ==========
renderAdminMessages();
getUserIP();

console.log('✅ Strona Tanie Malowanie załadowana!');
console.log('🔑 Admin: kliknij 5 razy w stopkę');
console.log('🔐 Tylko autoryzowany IP może otworzyć panel');
console.log('🛡️ Twój IP jest zaszyty w kodzie i nie jest pytany przy starcie');
