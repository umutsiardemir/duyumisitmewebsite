// Hamburger menü (mobil)
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');
if (hamburger && mobileMenu) {
  hamburger.addEventListener('click', () => {
    mobileMenu.classList.toggle('hidden');
  });
  mobileMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => mobileMenu.classList.add('hidden'));
  });
}

// Navbar aktif link güncelleme (scroll spy)
const sections = Array.from(document.querySelectorAll('section[id]')).filter(sec => {
  return document.querySelector(`a[href="#${sec.id}"]`);
});
const desktopNavLinks = document.querySelectorAll('header nav a[href^="#"]');
const mobileMenuLinks = document.querySelectorAll('#mobileMenu a[href^="#"]');
const bottomNavLinks = document.querySelectorAll('.fixed.bottom-0 a[href^="#"]');

window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(sec => {
    if (window.scrollY >= sec.offsetTop - 150) {
      current = sec.id;
    }
  });

  if (!current) return;

  desktopNavLinks.forEach(link => {
    link.classList.remove('nav-link-active');
    link.classList.add('text-zinc-600');
    if (link.getAttribute('href') === '#' + current) {
      link.classList.add('nav-link-active');
      link.classList.remove('text-zinc-600');
    }
  });

  mobileMenuLinks.forEach(link => {
    link.classList.remove('text-red-700', 'font-bold');
    link.classList.add('text-zinc-600', 'font-medium');
    if (link.getAttribute('href') === '#' + current) {
      link.classList.add('text-red-700', 'font-bold');
      link.classList.remove('text-zinc-600', 'font-medium');
    }
  });

  bottomNavLinks.forEach(link => {
    link.classList.remove('text-red-700', 'scale-110');
    link.classList.add('text-zinc-400');
    if (link.getAttribute('href') === '#' + current) {
      link.classList.add('text-red-700', 'scale-110');
      link.classList.remove('text-zinc-400');
    }
  });
}, { passive: true });

// Smooth scroll
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// Randevu formu
const contactForm = document.getElementById('contactForm');
const formSuccess = document.getElementById('formSuccess');
if (contactForm) {
  contactForm.addEventListener('submit', function (e) {
    e.preventDefault();
    const btn = contactForm.querySelector('button[type="submit"]');
    const original = btn.textContent;
    btn.disabled = true;
    btn.textContent = 'Gönderiliyor...';
    setTimeout(() => {
      formSuccess.classList.remove('hidden');
      contactForm.reset();
      btn.disabled = false;
      btn.textContent = original;
      setTimeout(() => formSuccess.classList.add('hidden'), 5000);
    }, 900);
  });
}

// Scroll fade-in animasyonu tamamen kaldırıldı, öğeler statik yüklüyor.

// Online İşitme Testi (Web Audio API)
let audioCtx;
let testOscillator = null;
let testGain = null;
let isPlaying = false;

window.playHearingTestTone = function(buttonElement) {
  const feedback = document.getElementById('test-feedback');
  const waves = buttonElement.querySelectorAll('.wave');
  const icon = buttonElement.querySelector('.material-symbols-outlined');
  
  if (isPlaying) {
    // Ses çalmayı durdur
    if (testGain) {
      testGain.gain.linearRampToValueAtTime(0, audioCtx.currentTime + 0.3);
      setTimeout(() => {
        if (testOscillator) {
          try { testOscillator.stop(); } catch(e) {}
        }
        isPlaying = false;
        waves.forEach(w => w.classList.add('hidden'));
        icon.textContent = 'play_arrow';
        feedback.textContent = 'Ses duyuyor musunuz?';
      }, 300);
    }
    return;
  }
  
  // Sesi Başlat
  try {
    if (!audioCtx) {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    
    testOscillator = audioCtx.createOscillator();
    testGain = audioCtx.createGain();
    
    testOscillator.type = 'sine';
    testOscillator.frequency.value = 4000; // 4000 Hz, işitme kaybında genelde ilk etkilenen frekans
    
    testGain.gain.setValueAtTime(0, audioCtx.currentTime);
    testGain.gain.linearRampToValueAtTime(0.5, audioCtx.currentTime + 0.5); // Fade in
    
    testOscillator.connect(testGain);
    testGain.connect(audioCtx.destination);
    
    testOscillator.start();
    
    isPlaying = true;
    waves.forEach(w => w.classList.remove('hidden'));
    icon.textContent = 'stop';
    feedback.innerHTML = 'Şu an <strong>4000 Hz</strong> frekansında ince bir tiz ses çalıyor...';
    
    // Otomatik 5 saniye sonra durdur
    testGain.gain.linearRampToValueAtTime(0, audioCtx.currentTime + 4.5);
    testOscillator.stop(audioCtx.currentTime + 5);
    
    setTimeout(() => {
      if (isPlaying) {
        isPlaying = false;
        waves.forEach(w => w.classList.add('hidden'));
        icon.textContent = 'play_arrow';
        feedback.innerHTML = 'Test tamamlandı.<br/>Sesi duymakta zorlandınız mı? Mutlaka ücretsiz detaylı ölçüm için kliniğimize gelin.';
      }
    }, 5000);
    
  } catch(err) {
    console.error('Audio could not play', err);
    feedback.textContent = 'Tarayıcınız ses çalmayı desteklemiyor veya izin verilmedi.';
  }
};
