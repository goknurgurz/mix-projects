// ===== CHAMPION THEMES =====
const champThemes = {
  nunu: {
    emoji: '🐻',
    name: 'Nunu & Willump Teması',
    words: ['Nunu', 'Willump', 'Freljord', 'Yeti', 'Snowball'],
    color: '#5BC8F5'
  },
  jinx: {
    emoji: '💥',
    name: 'Jinx Teması',
    words: ['Jinx', 'Fishbones', 'Pow', 'Chaos', 'Zap'],
    color: '#FF6EC7'
  },
  yasuo: {
    emoji: '🌪️',
    name: 'Yasuo Teması',
    words: ['Yasuo', 'Windwall', 'Exile', 'Steel', 'Tempest'],
    color: '#4ECDC4'
  },
  lux: {
    emoji: '✨',
    name: 'Lux Teması',
    words: ['Lux', 'Demacia', 'Light', 'Prisma', 'Radiance'],
    color: '#FFD700'
  },
  thresh: {
    emoji: '⛓️',
    name: 'Thresh Teması',
    words: ['Thresh', 'Chain', 'Lantern', 'Soul', 'Warden'],
    color: '#39FF14'
  },
  ahri: {
    emoji: '🦊',
    name: 'Ahri Teması',
    words: ['Ahri', 'Ninetail', 'Charm', 'Orb', 'Spirit'],
    color: '#C77DFF'
  }
};

let currentTheme = 'nunu';
let passwordHistory = [];

// ===== CHARACTER SETS =====
const CHARS = {
  upper:   'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  lower:   'abcdefghijklmnopqrstuvwxyz',
  numbers: '0123456789',
  symbols: '!@#$%^&*()-_=+[]{}|;:,.<>?'
};

// ===== SET CHAMPION THEME =====
function setChampTheme(champ) {
  currentTheme = champ;
  const theme = champThemes[champ];

  // Update badge
  document.getElementById('champEmoji').textContent = theme.emoji;
  document.getElementById('champName').textContent = theme.name;

  // Update gen-box class
  const genBox = document.getElementById('genBox');
  genBox.className = 'gen-box theme-' + champ;

  // Highlight selected card
  document.querySelectorAll('.champion-card').forEach(card => {
    card.style.borderColor = '';
    card.style.boxShadow = '';
  });
  const selectedCard = document.querySelector(`[data-champ="${champ}"]`);
  if (selectedCard) {
    selectedCard.style.borderColor = theme.color;
    selectedCard.style.boxShadow = `0 0 30px ${theme.color}33`;
  }

  // Scroll to generator
  document.getElementById('generator').scrollIntoView({ behavior: 'smooth', block: 'center' });

  // Auto-generate with new theme
  generatePassword();
}

// ===== UPDATE LENGTH DISPLAY =====
function updateLength(val) {
  document.getElementById('lengthVal').textContent = val;
}

// ===== GENERATE PASSWORD =====
function generatePassword() {
  const length     = parseInt(document.getElementById('lengthSlider').value);
  const useUpper   = document.getElementById('useUpper').checked;
  const useLower   = document.getElementById('useLower').checked;
  const useNumbers = document.getElementById('useNumbers').checked;
  const useSymbols = document.getElementById('useSymbols').checked;
  const champWord  = document.getElementById('champWord').value.trim();

  // Build character pool
  let pool = '';
  if (useUpper)   pool += CHARS.upper;
  if (useLower)   pool += CHARS.lower;
  if (useNumbers) pool += CHARS.numbers;
  if (useSymbols) pool += CHARS.symbols;

  // Fallback if nothing selected
  if (!pool) {
    pool = CHARS.lower + CHARS.numbers;
  }

  // Generate random base password
  let password = '';
  const array = new Uint32Array(length);
  window.crypto.getRandomValues(array);
  for (let i = 0; i < length; i++) {
    password += pool[array[i] % pool.length];
  }

  // Optionally weave in champion word
  if (champWord && champWord.length > 0) {
    const insertPos = Math.floor(password.length / 2);
    password = password.slice(0, insertPos) + champWord + password.slice(insertPos + champWord.length);
    // Trim to desired length
    password = password.slice(0, length);
  }

  // Display password
  document.getElementById('passwordOutput').value = password;

  // Update strength
  updateStrength(password);

  // Add to history
  addToHistory(password);
}

// ===== STRENGTH CALCULATOR =====
function updateStrength(password) {
  let score = 0;
  const len = password.length;

  if (len >= 8)  score += 1;
  if (len >= 12) score += 1;
  if (len >= 16) score += 1;
  if (len >= 24) score += 1;

  if (/[A-Z]/.test(password)) score += 1;
  if (/[a-z]/.test(password)) score += 1;
  if (/[0-9]/.test(password)) score += 1;
  if (/[^A-Za-z0-9]/.test(password)) score += 1;

  const fill = document.getElementById('strengthFill');
  const text = document.getElementById('strengthText');

  let label, cls, width;

  if (score <= 2) {
    label = '🔴 Zayıf';
    cls   = 'weak';
    width = '20%';
  } else if (score <= 4) {
    label = '🟠 Orta';
    cls   = 'fair';
    width = '40%';
  } else if (score <= 5) {
    label = '🟡 İyi';
    cls   = 'good';
    width = '60%';
  } else if (score <= 6) {
    label = '🟢 Güçlü';
    cls   = 'strong';
    width = '80%';
  } else {
    label = '⭐ Efsanevi';
    cls   = 'max';
    width = '100%';
  }

  text.textContent = label;
  fill.className   = 'strength-fill ' + cls;
  fill.style.width = width;
}

// ===== COPY PASSWORD =====
function copyPassword() {
  const output = document.getElementById('passwordOutput');
  const val = output.value;
  if (!val) return;

  navigator.clipboard.writeText(val).then(() => {
    const icon = document.getElementById('copyIcon');
    icon.textContent = '✅';
    setTimeout(() => { icon.textContent = '📋'; }, 2000);
  }).catch(() => {
    // Fallback
    output.select();
    document.execCommand('copy');
    const icon = document.getElementById('copyIcon');
    icon.textContent = '✅';
    setTimeout(() => { icon.textContent = '📋'; }, 2000);
  });
}

// ===== PASSWORD HISTORY =====
function addToHistory(password) {
  passwordHistory.unshift(password);
  if (passwordHistory.length > 5) passwordHistory.pop();

  const section = document.getElementById('historySection');
  const list    = document.getElementById('historyList');

  section.style.display = 'block';
  list.innerHTML = '';

  passwordHistory.forEach((pw, idx) => {
    const li = document.createElement('li');
    li.innerHTML = `
      <span class="pw-text">${maskPassword(pw)}</span>
      <button class="history-copy" onclick="copyHistoryItem('${escapeHtml(pw)}')" title="Kopyala">📋</button>
    `;
    li.addEventListener('mouseenter', () => {
      li.querySelector('.pw-text').textContent = pw;
    });
    li.addEventListener('mouseleave', () => {
      li.querySelector('.pw-text').textContent = maskPassword(pw);
    });
    list.appendChild(li);
  });
}

function maskPassword(pw) {
  if (pw.length <= 4) return '••••';
  return pw.slice(0, 3) + '•'.repeat(pw.length - 6) + pw.slice(-3);
}

function escapeHtml(str) {
  return str.replace(/'/g, "\\'").replace(/"/g, '"');
}

function copyHistoryItem(pw) {
  navigator.clipboard.writeText(pw).catch(() => {});
}

// ===== NAVBAR SCROLL EFFECT =====
window.addEventListener('scroll', () => {
  const navbar = document.querySelector('.navbar');
  if (window.scrollY > 50) {
    navbar.style.background = 'rgba(1,10,19,0.99)';
    navbar.style.borderBottomColor = 'rgba(200,155,60,0.5)';
  } else {
    navbar.style.background = '';
    navbar.style.borderBottomColor = '';
  }
});

// ===== SMOOTH ACTIVE NAV =====
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');

window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(section => {
    const sectionTop = section.offsetTop - 100;
    if (window.scrollY >= sectionTop) {
      current = section.getAttribute('id');
    }
  });

  navLinks.forEach(link => {
    link.style.color = '';
    if (link.getAttribute('href') === '#' + current) {
      link.style.color = 'var(--gold)';
    }
  });
});

// ===== CARD ENTRANCE ANIMATION =====
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.champion-card, .tip-card').forEach(card => {
  card.style.opacity = '0';
  card.style.transform = 'translateY(30px)';
  card.style.transition = 'opacity 0.6s ease, transform 0.6s ease, border-color 0.4s, box-shadow 0.4s';
  observer.observe(card);
});

// ===== INIT =====
document.addEventListener('DOMContentLoaded', () => {
  setChampTheme('nunu');
  updateLength(16);
});
