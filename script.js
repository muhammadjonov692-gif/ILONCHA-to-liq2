const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('score');
const highScoreElement = document.getElementById('highScore');
const levelDisplay = document.getElementById('levelDisplay');
const topCenterTimer = document.getElementById('topCenterTimer');
const timerLabel = document.getElementById('timerLabel');
const shieldSeconds = document.getElementById('shieldSeconds');
const levelBanner = document.getElementById('levelBanner');
const levelBannerText = document.getElementById('levelBannerText');

const homeScreen = document.getElementById('homeScreen');
const resumeBtn = document.getElementById('resumeBtn');
const newGameBtn = document.getElementById('newGameBtn');
const mainSettingsBtn = document.getElementById('mainSettingsBtn');
const settingsModal = document.getElementById('settingsModal');
const closeSettings = document.getElementById('closeSettings');
const homeBtn = document.getElementById('homeBtn');
const restartBtn = document.getElementById('restartBtn');
const soundToggleBtn = document.getElementById('soundToggleBtn');
const diffBtns = document.querySelectorAll('.diff-btn');
const langBtns = document.querySelectorAll('.lang-btn');

let soundEnabled = true;
let currentLang = 'uz';

const translations = {
  uz: {
    title: "ILON O'YINI",
    resume: "▶ Davom ettirish",
    newGame: "🎮 Yangi o'yin",
    level: "DAROJA",
    settings: "⚙️ Sozlamalar",
    highScore: "Rekord",
    score: "Achko",
    home: "🏠 Bosh ekran",
    restart: "🔄 Qayta boshlash",
    soundOn: "🔊 Ovoz: Yoqilgan",
    soundOff: "🔇 Ovoz: O'chirilgan",
    languageTitle: "Tilni Tanlash",
    difficultyTitle: "Qiyinlik Darajasi",
    diffEasy: "Oson",
    diffMedium: "O'rtacha",
    diffHard: "Qiyin",
    diffSuper: "☠️ Super Qiyin",
    close: "Yopish",
    shield: "🛡️ ZASHITA",
    speed: "⚡ TEZLIK",
    slow: "❄️ SEKIN",
    kichrayish: "📉 JUDA KICHIK",
    kattalashish: "📈 JUDA KATTA"
  },
  ru: {
    title: "ИГРА ЗМЕЙКА",
    resume: "▶ Продолжить",
    newGame: "🎮 Новая игра",
    level: "УРОВЕНЬ",
    settings: "⚙️ Настройки",
    highScore: "Рекорд",
    score: "Очки",
    home: "🏠 Главная",
    restart: "🔄 Перезапуск",
    soundOn: "🔊 Звук: Вкл",
    soundOff: "🔇 Звук: Выкл",
    languageTitle: "Выберите Язык",
    difficultyTitle: "Уровень Сложности",
    diffEasy: "Легко",
    diffMedium: "Средне",
    diffHard: "Сложно",
    diffSuper: "☠️ Кошмар (Хардкор)",
    close: "Закрыть",
    shield: "🛡️ ЩИТ",
    speed: "⚡ СКОРОСТЬ",
    slow: "❄️ ЗАМЕДЛЕНИЕ",
    kichrayish: "📉 ОЧЕНЬ МАЛЕНЬКИЙ",
    kattalashish: "📈 ОЧЕНЬ БОЛЬШОЙ"
  },
  en: {
    title: "SNAKE GAME",
    resume: "▶ Resume",
    newGame: "🎮 New Game",
    level: "LEVEL",
    settings: "⚙️ Settings",
    highScore: "High Score",
    score: "Score",
    home: "🏠 Home",
    restart: "🔄 Restart",
    soundOn: "🔊 Sound: On",
    soundOff: "🔇 Sound: Off",
    languageTitle: "Select Language",
    difficultyTitle: "Difficulty Level",
    diffEasy: "Easy",
    diffMedium: "Medium",
    diffHard: "Hard",
    diffSuper: "☠️ Nightmare",
    close: "Close",
    shield: "🛡️ SHIELD",
    speed: "⚡ SPEED",
    slow: "❄️ SLOW",
    kichrayish: "📉 VERY SMALL",
    kattalashish: "📈 VERY LARGE"
  }
};

function updateLanguage(lang) {
  currentLang = lang;
  const t = translations[lang];
  
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (t[key]) {
      if (key === 'soundOn' || key === 'soundOff') {
        el.innerText = soundEnabled ? t.soundOn : t.soundOff;
      } else {
        el.innerText = t[key];
      }
    }
  });

  const titleEl = document.querySelector('.game-title');
  if (titleEl) titleEl.innerText = t.title;
}

langBtns.forEach(btn => {
  btn.onclick = () => {
    langBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    updateLanguage(btn.dataset.lang);
  };
});

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

function playEatSound() {
  if (!soundEnabled) return;
  if (audioCtx.state === 'suspended') audioCtx.resume();
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.type = 'sine';
  osc.frequency.setValueAtTime(600, audioCtx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(900, audioCtx.currentTime + 0.1);
  gain.gain.setValueAtTime(0.2, audioCtx.currentTime);
  gain.gain.linearRampToValueAtTime(0.01, audioCtx.currentTime + 0.1);
  osc.connect(gain); gain.connect(audioCtx.destination);
  osc.start(); osc.stop(audioCtx.currentTime + 0.1);
}

function playBonusSound() {
  if (!soundEnabled) return;
  if (audioCtx.state === 'suspended') audioCtx.resume();
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.type = 'triangle';
  osc.frequency.setValueAtTime(800, audioCtx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(1400, audioCtx.currentTime + 0.2);
  gain.gain.setValueAtTime(0.2, audioCtx.currentTime);
  gain.gain.linearRampToValueAtTime(0.01, audioCtx.currentTime + 0.2);
  osc.connect(gain); gain.connect(audioCtx.destination);
  osc.start(); osc.stop(audioCtx.currentTime + 0.2);
}

function playBombSound() {
  if (!soundEnabled) return;
  if (audioCtx.state === 'suspended') audioCtx.resume();
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.type = 'sawtooth';
  osc.frequency.setValueAtTime(200, audioCtx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(50, audioCtx.currentTime + 0.3);
  gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
  gain.gain.linearRampToValueAtTime(0.01, audioCtx.currentTime + 0.3);
  osc.connect(gain); gain.connect(audioCtx.destination);
  osc.start(); osc.stop(audioCtx.currentTime + 0.3);
}

function playGameOverSound() {
  if (!soundEnabled) return;
  if (audioCtx.state === 'suspended') audioCtx.resume();
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.type = 'sawtooth';
  osc.frequency.setValueAtTime(300, audioCtx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(100, audioCtx.currentTime + 0.3);
  gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
  gain.gain.linearRampToValueAtTime(0.01, audioCtx.currentTime + 0.3);
  osc.connect(gain); gain.connect(audioCtx.destination);
  osc.start(); osc.stop(audioCtx.currentTime + 0.3);
}

let isPlaying = false;
let isGameOver = false;

const mouse = { x: canvas.width / 2, y: canvas.height / 2 };
window.addEventListener('mousemove', (e) => {
  if (isPlaying) {
    mouse.x = Math.max(20, Math.min(canvas.width - 20, e.clientX));
    mouse.y = Math.max(20, Math.min(canvas.height - 20, e.clientY));
  }
});

let difficulty = 'easy'; 
const diffSpeeds = {
  easy: 0.5,
  medium: 0.85,
  hard: 1.4,
  super: 3.8
};

mainSettingsBtn.onclick = () => settingsModal.classList.remove('hidden');
closeSettings.onclick = () => settingsModal.classList.add('hidden');

soundToggleBtn.onclick = () => {
  soundEnabled = !soundEnabled;
  updateLanguage(currentLang);
};

homeBtn.onclick = () => {
  isPlaying = false;
  homeScreen.classList.remove('hidden');
  settingsModal.classList.add('hidden');
};

restartBtn.onclick = () => {
  settingsModal.classList.add('hidden');
  homeScreen.classList.add('hidden');
  resetGame();
  isGameOver = false;
  isPlaying = true;
};

resumeBtn.onclick = () => {
  if (isGameOver) {
    resetGame();
    isGameOver = false;
  }
  homeScreen.classList.add('hidden');
  isPlaying = true;
};

newGameBtn.onclick = () => {
  resetGame();
  isGameOver = false;
  homeScreen.classList.add('hidden');
  isPlaying = true;
};

diffBtns.forEach(btn => {
  btn.onclick = () => {
    diffBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    difficulty = btn.dataset.diff;
    settingsModal.classList.add('hidden');
  };
});

const joystickBase = document.getElementById('joystickBase');
const joystickStick = document.getElementById('joystickStick');

if (joystickBase) {
  joystickBase.addEventListener('touchstart', handleTouch, { passive: false });
  joystickBase.addEventListener('touchmove', handleTouch, { passive: false });
  joystickBase.addEventListener('touchend', () => {
    joystickStick.style.transform = `translate(0px, 0px)`;
  });
}

function handleTouch(e) {
  e.preventDefault();
  if (!isPlaying) return;
  const touch = e.touches[0];
  const rect = joystickBase.getBoundingClientRect();
  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;

  let deltaX = touch.clientX - centerX;
  let deltaY = touch.clientY - centerY;
  const maxDistance = 40;
  const distance = Math.hypot(deltaX, deltaY);

  if (distance > maxDistance) {
    deltaX = (deltaX / distance) * maxDistance;
    deltaY = (deltaY / distance) * maxDistance;
  }

  joystickStick.style.transform = `translate(${deltaX}px, ${deltaY}px)`;
  mouse.x = Math.max(30, Math.min(canvas.width - 30, snake.body[0].x + deltaX * 1.6));
  mouse.y = Math.max(30, Math.min(canvas.height - 30, snake.body[0].y + deltaY * 1.6));
}

const colors = ['#00FFCC', '#FF007F', '#9D00FF', '#00E5FF', '#76FF03', '#FFEA00', '#FF3D00'];

let currentScore = 0;
let highScore = localStorage.getItem('snake_high_score') || 0;
highScoreElement.innerText = highScore;

let shieldExpiryTime = 0;
let speedExpiryTime = 0;
let slowExpiryTime = 0;

let lastBonusSpawnTime = Date.now();
let activeBonuses = [];
let particles = [];

let snake = createSnake();
let previousLevel = 1;

function createSnake() {
  return {
    body: [],
    length: 12,
    segmentRadius: 13,
    color: '#00FFCC',
    speed: 0.045
  };
}

for (let i = 0; i < 12; i++) {
  snake.body.push({ x: canvas.width / 2, y: canvas.height / 2 });
}

let foods = [];
for (let i = 0; i < 5; i++) foods.push(createFood());

function createFood() {
  const margin = 80;
  const x = margin + Math.random() * (canvas.width - margin * 2);
  const y = margin + Math.random() * (canvas.height - margin * 2);
  const color = colors[Math.floor(Math.random() * colors.length)];
  let body = [];
  for (let i = 0; i < 6; i++) body.push({ x: x, y: y });
  return {
    x: x, y: y,
    vx: (Math.random() - 0.5) * 2,
    vy: (Math.random() - 0.5) * 2,
    radius: 13,
    color: color,
    body: body,
    blinkTimer: Math.floor(Math.random() * 100)
  };
}

let blackSnakes = [];

function createBlackSnake() {
  const margin = 100;
  const startX = Math.random() < 0.5 ? margin : canvas.width - margin;
  const startY = Math.random() < 0.5 ? margin : canvas.height - margin;
  let body = [];
  for (let i = 0; i < 25; i++) body.push({ x: startX, y: startY });
  return {
    body: body,
    segmentRadius: 20,
    eatenCount: 0
  };
}

function spawnBonus() {
  const generalTypes = ['yulduz', 'zashita', 'bomba', 'tezlik', 'sekin'];
  const sizeTypes = ['kichrayish', 'kattalashish'];
  const margin = 100;
  
  // 1 ta umumiy bonus chiqarish
  const type1 = generalTypes[Math.floor(Math.random() * generalTypes.length)];
  const x1 = margin + Math.random() * (canvas.width - margin * 2);
  const y1 = margin + Math.random() * (canvas.height - margin * 2);
  activeBonuses.push({
    x: x1, y: y1, type: type1, radius: 16,
    expiryTime: Date.now() + 6000
  });

  // Katta/kichik qiladigan bonus alohida tez-tez va ora-orada chiqishi uchun
  const type2 = sizeTypes[Math.floor(Math.random() * sizeTypes.length)];
  const x2 = margin + Math.random() * (canvas.width - margin * 2);
  const y2 = margin + Math.random() * (canvas.height - margin * 2);
  activeBonuses.push({
    x: x2, y: y2, type: type2, radius: 16,
    expiryTime: Date.now() + 6000
  });
}

function createExplosion(x, y, color) {
  for (let i = 0; i < 12; i++) {
    particles.push({
      x: x, y: y,
      vx: (Math.random() - 0.5) * 6,
      vy: (Math.random() - 0.5) * 6,
      radius: Math.random() * 3 + 2,
      color: color,
      alpha: 1
    });
  }
}

function resetGame() {
  currentScore = 0;
  previousLevel = 1;
  scoreElement.innerText = currentScore;
  shieldExpiryTime = 0;
  speedExpiryTime = 0;
  slowExpiryTime = 0;
  activeBonuses = [];
  particles = [];
  lastBonusSpawnTime = Date.now();
  snake = createSnake();
  for (let i = 0; i < 12; i++) snake.body.push({ x: canvas.width/2, y: canvas.height/2 });
  blackSnakes = [];
  foods = [];
  for (let i = 0; i < 5; i++) foods.push(createFood());
}

function triggerLevelBanner(level) {
  levelBannerText.innerText = `LEVEL ${level}! 🚀`;
  levelBanner.classList.remove('hidden');
  setTimeout(() => {
    levelBanner.classList.add('hidden');
  }, 1500);
}

function animate() {
  const now = Date.now();
  const t = translations[currentLang];

  if (!isPlaying) {
    if (foods.length > 0) {
      mouse.x += (foods[0].x - mouse.x) * 0.05;
      mouse.y += (foods[0].y - mouse.y) * 0.05;
    }
  }

  let speedMultiplier = 1;
  if (now < speedExpiryTime) speedMultiplier = 1.6;
  if (now < slowExpiryTime) speedMultiplier = 0.6;

  let currentSpeed = (snake.speed + (currentScore * 0.0004)) * speedMultiplier;
  if (currentSpeed > 0.1) currentSpeed = 0.1;
  if (currentSpeed < 0.02) currentSpeed = 0.02;

  let currentLevel = 1;
  let bgGradientColor = '#0b0b14';
  if (currentScore >= 20 && currentScore < 50) {
    currentLevel = 2; bgGradientColor = '#120b1c';
  } else if (currentScore >= 50 && currentScore < 100) {
    currentLevel = 3; bgGradientColor = '#1a0b0b';
  } else if (currentScore >= 100) {
    currentLevel = 4; bgGradientColor = '#05181a';
  }

  if (difficulty === 'super') {
    bgGradientColor = '#05020a';
  }

  if (currentLevel !== previousLevel) {
    triggerLevelBanner(currentLevel);
    previousLevel = currentLevel;
  }

  levelDisplay.innerHTML = `<span data-i18n="level">${t.level}</span>: ${currentLevel}`;

  ctx.fillStyle = bgGradientColor;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.strokeStyle = difficulty === 'super' ? 'rgba(255, 0, 0, 0.06)' : 'rgba(255, 255, 255, 0.03)';
  ctx.lineWidth = 1;
  const gridSize = 50;
  for (let x = 0; x < canvas.width; x += gridSize) {
    ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, canvas.height); ctx.stroke();
  }
  for (let y = 0; y < canvas.height; y += gridSize) {
    ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(canvas.width, y); ctx.stroke();
  }

  for (let i = particles.length - 1; i >= 0; i--) {
    let p = particles[i];
    p.x += p.vx; p.y += p.vy;
    p.alpha -= 0.03;
    if (p.alpha <= 0) { particles.splice(i, 1); continue; }
    ctx.save();
    ctx.globalAlpha = p.alpha;
    ctx.fillStyle = p.color;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  let activeTimerText = "";
  let remainingTime = 0;
  if (now < shieldExpiryTime && isPlaying) {
    activeTimerText = t.shield;
    remainingTime = Math.ceil((shieldExpiryTime - now) / 1000);
  } else if (now < speedExpiryTime && isPlaying) {
    activeTimerText = t.speed;
    remainingTime = Math.ceil((speedExpiryTime - now) / 1000);
  } else if (now < slowExpiryTime && isPlaying) {
    activeTimerText = t.slow;
    remainingTime = Math.ceil((slowExpiryTime - now) / 1000);
  }

  if (remainingTime > 0) {
    topCenterTimer.classList.remove('hidden');
    timerLabel.innerText = activeTimerText;
    shieldSeconds.innerText = remainingTime;
  } else {
    topCenterTimer.classList.add('hidden');
  }

  // Daraja oshgani sari bonuslar haddan tashqari ko'payib ketmaydigan, barqaror vaqt oralig'i (4 sekund)
  let bonusInterval = 4000;
  if (now - lastBonusSpawnTime > bonusInterval && isPlaying) {
    spawnBonus();
    lastBonusSpawnTime = now;
  }

  const head = snake.body[0];
  head.x += (mouse.x - head.x) * currentSpeed;
  head.y += (mouse.y - head.y) * currentSpeed;

  head.x = Math.max(15, Math.min(canvas.width - 15, head.x));
  head.y = Math.max(15, Math.min(canvas.height - 15, head.y));

  for (let i = 1; i < snake.body.length; i++) {
    const prev = snake.body[i - 1];
    const curr = snake.body[i];
    curr.x += (prev.x - curr.x) * 0.55;
    curr.y += (prev.y - curr.y) * 0.55;
  }

  for (let i = activeBonuses.length - 1; i >= 0; i--) {
    let b = activeBonuses[i];
    if (now > b.expiryTime) { activeBonuses.splice(i, 1); continue; }

    ctx.save();
    ctx.beginPath();
    ctx.arc(b.x, b.y, b.radius, 0, Math.PI * 2);
    let bColor = '#FFD700';
    if (b.type === 'zashita') bColor = '#00FFFF';
    else if (b.type === 'tezlik') bColor = '#FF9900';
    else if (b.type === 'sekin') bColor = '#3399FF';
    else if (b.type === 'bomba') bColor = '#FF0000';
    else if (b.type === 'kichrayish') bColor = '#FF0055'; // Qizil - juda kichik
    else if (b.type === 'kattalashish') bColor = '#00FF55'; // Yashil - ota katta

    ctx.fillStyle = bColor;
    ctx.shadowColor = bColor;
    ctx.shadowBlur = 15; ctx.fill(); ctx.closePath();

    ctx.fillStyle = '#000';
    ctx.font = 'bold 12px Segoe UI';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    let symbol = '⭐';
    if (b.type === 'zashita') symbol = '🛡️';
    else if (b.type === 'tezlik') symbol = '⚡';
    else if (b.type === 'sekin') symbol = '❄️';
    else if (b.type === 'bomba') symbol = '💣';
    else if (b.type === 'kichrayish') symbol = '📉';
    else if (b.type === 'kattalashish') symbol = '📈';
    
    ctx.fillText(symbol, b.x, b.y);
    ctx.restore();

    if (isPlaying) {
      const distToBonus = Math.hypot(head.x - b.x, head.y - b.y);
      if (distToBonus < snake.segmentRadius + b.radius) {
        createExplosion(b.x, b.y, bColor);
        if (b.type === 'yulduz') { playBonusSound(); currentScore += 10; }
        else if (b.type === 'zashita') { playBonusSound(); shieldExpiryTime = now + 8000; }
        else if (b.type === 'tezlik') { playBonusSound(); speedExpiryTime = now + 7000; }
        else if (b.type === 'sekin') { playBonusSound(); slowExpiryTime = now + 7000; }
        else if (b.type === 'bomba') { playBombSound(); currentScore -= 15; if (currentScore < 0) currentScore = 0; }
        else if (b.type === 'kichrayish') {
          playBonusSound();
          snake.segmentRadius = 4.5; // 3 baravar kichik
        }
        else if (b.type === 'kattalashish') {
          playBonusSound();
          snake.segmentRadius = 36; // 3 baravar katta
        }
        
        scoreElement.innerText = currentScore;
        if (currentScore > highScore) {
          highScore = currentScore;
          highScoreElement.innerText = highScore;
          localStorage.setItem('snake_high_score', highScore);
        }
        activeBonuses.splice(i, 1);
      }
    }
  }

  foods.forEach((food, index) => {
    const distToHead = Math.hypot(head.x - food.x, head.y - food.y);
    let escapeRadius = difficulty === 'super' ? 320 : 160;
    let escapeSpeed = difficulty === 'super' ? 8.5 : 3.5;

    if (distToHead < escapeRadius) {
      const angle = Math.atan2(food.y - head.y, food.x - head.x);
      food.vx = Math.cos(angle) * escapeSpeed;
      food.vy = Math.sin(angle) * escapeSpeed;
    } else {
      food.vx += (Math.random() - 0.5) * 0.2;
      food.vy += (Math.random() - 0.5) * 0.2;
      food.vx = Math.max(-2, Math.min(2, food.vx));
      food.vy = Math.max(-2, Math.min(2, food.vy));
    }

    food.x += food.vx; food.y += food.vy;

    const padding = 20;
    if (food.x < padding) { food.x = padding; food.vx = Math.abs(food.vx); }
    if (food.x > canvas.width - padding) { food.x = canvas.width - padding; food.vx = -Math.abs(food.vx); }
    if (food.y < padding) { food.y = padding; food.vy = Math.abs(food.vy); }
    if (food.y > canvas.height - padding) { food.y = canvas.height - padding; food.vy = -Math.abs(food.vy); }

    food.body[0].x = food.x; food.body[0].y = food.y;
    for (let j = 1; j < food.body.length; j++) {
      const p = food.body[j - 1]; const c = food.body[j];
      c.x += (p.x - c.x) * 0.4; c.y += (p.y - c.y) * 0.4;
    }

    if (distToHead < snake.segmentRadius + food.radius) {
      if (isPlaying) playEatSound();
      createExplosion(food.x, food.y, food.color);
      snake.color = food.color;
      currentScore += 1;
      scoreElement.innerText = currentScore;

      if (currentScore > highScore) {
        highScore = currentScore;
        highScoreElement.innerText = highScore;
        localStorage.setItem('snake_high_score', highScore);
      }

      if (currentScore > 0 && currentScore % 10 === 0) {
        blackSnakes.push(createBlackSnake());
      }

      snake.length += 2;
      for (let k = 0; k < 2; k++) {
        const last = snake.body[snake.body.length - 1];
        snake.body.push({ x: last.x, y: last.y });
      }
      foods[index] = createFood();
    }
  });

  const baseDiffSpeed = diffSpeeds[difficulty];
  const isSuperDark = difficulty === 'super';

  blackSnakes.forEach((bs) => {
    const bHead = bs.body[0];
    const moveAngle = Math.atan2(head.y - bHead.y, head.x - bHead.x);
    let speedMult = 1;
    if (currentLevel === 2) speedMult = 1.3;
    if (currentLevel === 3) speedMult = 1.6; 
    if (currentLevel >= 4) speedMult = 2.0;

    const targetX = head.x + Math.cos(moveAngle + (bs.eatenCount * 0.5)) * 140;
    const targetY = head.y + Math.sin(moveAngle + (bs.eatenCount * 0.5)) * 140;
    const angleToTarget = Math.atan2(targetY - bHead.y, targetX - bHead.x);

    bHead.x += Math.cos(angleToTarget) * (baseDiffSpeed * speedMult);
    bHead.y += Math.sin(angleToTarget) * (baseDiffSpeed * speedMult);

    for (let i = 1; i < bs.body.length; i++) {
      const p = bs.body[i - 1]; const c = bs.body[i];
      c.x += (p.x - c.x) * 0.4; c.y += (p.y - c.y) * 0.4;
    }

    if (bs.eatenCount < 5) {
      foods.forEach((food, fIndex) => {
        const distToFood = Math.hypot(bHead.x - food.x, bHead.y - food.y);
        if (distToFood < bs.segmentRadius + food.radius) {
          bs.eatenCount += 1;
          for (let b = 0; b < 10; b++) {
            const lastBsSeg = bs.body[bs.body.length - 1];
            bs.body.push({ x: lastBsSeg.x, y: lastBsSeg.y });
          }
          foods[fIndex] = createFood();
        }
      });
    }

    if (isPlaying) {
      for (let i = 0; i < bs.body.length; i++) {
        const dist = Math.hypot(head.x - bs.body[i].x, head.y - bs.body[i].y);
        if (dist < snake.segmentRadius + bs.segmentRadius) {
          if (now > shieldExpiryTime) {
            playGameOverSound();
            createExplosion(head.x, head.y, '#FF0000');
            isGameOver = true;
            isPlaying = false;
            homeScreen.classList.remove('hidden');
            return;
          }
        }
      }
    }
  });

  foods.forEach((food) => {
    food.blinkTimer++;
    const isEyesOpen = food.blinkTimer % 100 > 15;
    for (let j = food.body.length - 1; j >= 0; j--) {
      const seg = food.body[j];
      const r = Math.max(3, food.radius * (1 - j / food.body.length));
      ctx.beginPath(); ctx.arc(seg.x, seg.y, r, 0, Math.PI * 2);
      ctx.fillStyle = food.color; ctx.shadowBlur = 10; ctx.shadowColor = food.color;
      ctx.fill(); ctx.shadowBlur = 0;
    }
    if (isEyesOpen) {
      ctx.fillStyle = '#ffffff';
      ctx.beginPath(); ctx.arc(food.x - 4, food.y - 3, 3.5, 0, Math.PI * 2); ctx.arc(food.x + 4, food.y - 3, 3.5, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#000000';
      ctx.beginPath(); ctx.arc(food.x - 4, food.y - 3, 1.5, 0, Math.PI * 2); ctx.arc(food.x + 4, food.y - 3, 1.5, 0, Math.PI * 2); ctx.fill();
    }
  });

  blackSnakes.forEach((bs) => {
    for (let j = bs.body.length - 1; j >= 0; j--) {
      const seg = bs.body[j];
      const r = Math.max(5, bs.segmentRadius * (1 - j / (bs.body.length * 1.2)));
      ctx.beginPath(); ctx.arc(seg.x, seg.y, r, 0, Math.PI * 2);
      ctx.fillStyle = isSuperDark ? '#150000' : '#222233';
      ctx.shadowBlur = isSuperDark ? 10 : 10; 
      ctx.shadowColor = isSuperDark ? '#FF0000' : 'rgba(255,255,255,0.15)';
      ctx.fill(); ctx.shadowBlur = 0;
    }
    const bHead = bs.body[0];
    const bAngle = Math.atan2(head.y - bHead.y, head.x - bHead.x);
    ctx.fillStyle = '#ff0000'; ctx.shadowBlur = isSuperDark ? 15 : 10; ctx.shadowColor = '#ff0000';
    ctx.beginPath();
    ctx.arc(bHead.x + Math.cos(bAngle - 0.5) * 8, bHead.y + Math.sin(bAngle - 0.5) * 8, 3.5, 0, Math.PI * 2);
    ctx.arc(bHead.x + Math.cos(bAngle + 0.5) * 8, bHead.y + Math.sin(bAngle + 0.5) * 8, 3.5, 0, Math.PI * 2);
    ctx.fill(); ctx.shadowBlur = 0;
  });

  let isShieldActive = now < shieldExpiryTime && isPlaying;
  for (let i = snake.body.length - 1; i > 0; i--) {
    const seg = snake.body[i];
    const r = Math.max(2, snake.segmentRadius * (1 - i / (snake.body.length * 1.3)));
    ctx.beginPath(); ctx.arc(seg.x, seg.y, r, 0, Math.PI * 2);
    ctx.fillStyle = snake.color; ctx.shadowBlur = isShieldActive ? 20 : 10;
    ctx.shadowColor = isShieldActive ? '#00FFFF' : snake.color;
    ctx.fill(); ctx.shadowBlur = 0;
  }

  ctx.beginPath();
  ctx.arc(head.x, head.y, snake.segmentRadius + 2, 0, Math.PI * 2);
  ctx.fillStyle = snake.color; ctx.shadowBlur = isShieldActive ? 30 : 20;
  ctx.shadowColor = isShieldActive ? '#00FFFF' : snake.color;
  ctx.fill(); ctx.shadowBlur = 0;

  const angle = Math.atan2(mouse.y - head.y, mouse.x - head.x);
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.arc(head.x + Math.cos(angle - 0.5) * (snake.segmentRadius * 0.4), head.y + Math.sin(angle - 0.5) * (snake.segmentRadius * 0.4), Math.max(1.5, snake.segmentRadius * 0.25), 0, Math.PI * 2);
  ctx.arc(head.x + Math.cos(angle + 0.5) * (snake.segmentRadius * 0.4), head.y + Math.sin(angle + 0.5) * (snake.segmentRadius * 0.4), Math.max(1.5, snake.segmentRadius * 0.25), 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#000000';
  ctx.beginPath();
  ctx.arc(head.x + Math.cos(angle - 0.5) * (snake.segmentRadius * 0.4) + Math.cos(angle), head.y + Math.sin(angle - 0.5) * (snake.segmentRadius * 0.4) + Math.sin(angle), Math.max(0.8, snake.segmentRadius * 0.12), 0, Math.PI * 2);
  ctx.arc(head.x + Math.cos(angle + 0.5) * (snake.segmentRadius * 0.4) + Math.cos(angle), head.y + Math.sin(angle + 0.5) * (snake.segmentRadius * 0.4) + Math.sin(angle), Math.max(0.8, snake.segmentRadius * 0.12), 0, Math.PI * 2);
  ctx.fill();

  requestAnimationFrame(animate);
}

animate();