'use strict';

/* ============================================================
   AHORCADO · Arcade de palabras
   HTML5 + CSS3 + JavaScript vanilla. Sin dependencias externas.
   ============================================================ */

(() => {

  /* ==========================================================
     1. CONFIGURACIÓN
     ========================================================== */
  const MAX_ERRORS = 7;
  const POINTS = {
    base: 100,
    perLife: 20,
    perStreak: 25,
    streakCap: 10,
    perfect: 150,
    hint: 75
  };
  const STORAGE_KEY = 'ahorcado.arcade.v1';
  const LETTER_ROWS = ['QWERTYUIOP', 'ASDFGHJKLÑ', 'ZXCVBNM'];
  const GUESSABLE = /^[A-ZÑ]$/;

  const ACCENTS = {
    'Á': 'A', 'À': 'A', 'Ä': 'A', 'Â': 'A', 'Ã': 'A',
    'É': 'E', 'È': 'E', 'Ë': 'E', 'Ê': 'E',
    'Í': 'I', 'Ì': 'I', 'Ï': 'I', 'Î': 'I',
    'Ó': 'O', 'Ò': 'O', 'Ö': 'O', 'Ô': 'O', 'Õ': 'O',
    'Ú': 'U', 'Ù': 'U', 'Ü': 'U', 'Û': 'U',
    'Ç': 'C', 'Ñ': 'Ñ'
  };

  const ALL_CATEGORY = { id: 'all', label: 'Aleatorio', color: '#8b7bff' };

  const CATEGORIES = [
    { id: 'animales', label: 'Animales', color: '#3ddc97' },
    { id: 'comida', label: 'Comida', color: '#ffc857' },
    { id: 'tecnologia', label: 'Tecnología', color: '#5ad2ff' },
    { id: 'cine', label: 'Cine', color: '#ff5d73' },
    { id: 'viajes', label: 'Viajes', color: '#8b7bff' },
    { id: 'naturaleza', label: 'Naturaleza', color: '#2ec4b6' },
    { id: 'objetos', label: 'Objetos', color: '#f78fb3' },
    { id: 'profesiones', label: 'Profesiones', color: '#ff9f68' },
    { id: 'deportes', label: 'Deportes', color: '#a3e635' },
    { id: 'cultura', label: 'Cultura', color: '#c084fc' }
  ];

  /* ==========================================================
     2. BASE DE PALABRAS (todas en mayúsculas, con acentos y Ñ)
     ========================================================== */
  const WORDS = {
    animales: [
      'ELEFANTE', 'JIRAFA', 'TIBURÓN', 'MARIPOSA', 'PINGÜINO', 'DELFÍN',
      'CANGURO', 'HORMIGA', 'COCODRILO', 'LECHUZA', 'PANDA', 'RINOCERONTE',
      'MEDUSA', 'TORTUGA', 'MURCIÉLAGO', 'ABEJA', 'LOBO', 'FOCA',
      'CAMALEÓN', 'ÁGUILA', 'BALLENA', 'ZORRO'
    ],
    comida: [
      'PAELLA', 'TORTILLA', 'GUACAMOLE', 'CROQUETA', 'CHOCOLATE', 'ESPAGUETI',
      'PIZZA', 'SUSHI', 'TACOS', 'LASAGNA', 'GAZPACHO', 'CHURROS',
      'HELADO', 'AGUACATE', 'QUESADILLA', 'CEREZA', 'MERENGUE', 'HAMBURGUESA',
      'FIDEUÁ', 'BIZCOCHO', 'EMPANADA', 'SALSA'
    ],
    tecnologia: [
      'ORDENADOR', 'INTERNET', 'TECLADO', 'PANTALLA', 'ROBOT', 'ALGORITMO',
      'SATÉLITE', 'MICRÓFONO', 'IMPRESORA', 'SOFTWARE', 'HARDWARE', 'CONTRASEÑA',
      'NAVEGADOR', 'SERVIDOR', 'PÍXEL', 'WIFI', 'DRON', 'VIDEOJUEGO',
      'APLICACIÓN', 'BATERÍA', 'CIRCUITO', 'CÁMARA'
    ],
    cine: [
      'EL PADRINO', 'TITANIC', 'PARQUE JURÁSICO', 'EL REY LEÓN', 'MATRIX',
      'GLADIATOR', 'CASABLANCA', 'ALIEN', 'INTERESTELAR', 'TOY STORY',
      'PSICOSIS', 'VÉRTIGO', 'ROCKY', 'VOLVER', 'AMELIE', 'ROMA', 'COCO',
      'DEL REVÉS', 'UP', 'METRÓPOLIS', 'BLADE RUNNER'
    ],
    viajes: [
      'MALETA', 'PASAPORTE', 'AEROPUERTO', 'HOTEL', 'MAPA', 'BRÚJULA',
      'VACACIONES', 'AVENTURA', 'TURISTA', 'GUÍA', 'HOSTAL', 'MOCHILA',
      'BILLETE', 'FRONTERA', 'CRUCERO', 'SAFARI', 'EXCURSIÓN', 'DESTINO',
      'ITINERARIO', 'EQUIPAJE', 'AEROLÍNEA', 'MOCHILERO'
    ],
    naturaleza: [
      'MONTAÑA', 'RÍO', 'BOSQUE', 'VOLCÁN', 'CASCADA', 'DESIERTO', 'SELVA',
      'TORMENTA', 'ARCOIRIS', 'AMANECER', 'ATARDECER', 'GLACIAR', 'CACTUS',
      'ORQUÍDEA', 'TRUENO', 'RELÁMPAGO', 'NIEBLA', 'SEMILLA', 'ECOSISTEMA',
      'PRADERA', 'MANGLAR', 'ACANTILADO'
    ],
    objetos: [
      'ESPEJO', 'PARAGUAS', 'GUITARRA', 'RELOJ', 'TIJERAS', 'CEPILLO',
      'LINTERNA', 'VENTILADOR', 'ALMOHADA', 'CUCHARA', 'TAZA', 'LLAVERO',
      'CARTERA', 'BOLÍGRAFO', 'VELA', 'ESCALERA', 'BOTELLA', 'CINTURÓN',
      'MARTILLO', 'CALCETÍN', 'GAFAS', 'PARLANTE'
    ],
    profesiones: [
      'BOMBERO', 'ASTRONAUTA', 'CARPINTERO', 'DENTISTA', 'INGENIERA',
      'PERIODISTA', 'FARMACÉUTICO', 'ARQUITECTO', 'PELUQUERO', 'VETERINARIO',
      'PANADERO', 'JUEZ', 'PILOTO', 'PESCADOR', 'GRANJERO', 'PROFESOR',
      'CIRUJANA', 'MÚSICO', 'CIENTÍFICA', 'ELECTRICISTA', 'FOTÓGRAFA', 'CARTERO'
    ],
    deportes: [
      'BALONCESTO', 'NATACIÓN', 'ATLETISMO', 'GIMNASIA', 'ESGRIMA', 'CICLISMO',
      'SURF', 'KARATE', 'VOLEIBOL', 'TENIS', 'BOXEO', 'RUGBY', 'GOLF',
      'PATINAJE', 'ESCALADA', 'REMO', 'JABALINA', 'BALONMANO', 'HALTEROFILIA',
      'ARQUERÍA', 'FÚTBOL', 'ESQUÍ'
    ],
    cultura: [
      'MÚSICA', 'PINTURA', 'ESCULTURA', 'TEATRO', 'POESÍA', 'NOVELA',
      'ORQUESTA', 'FESTIVAL', 'CARNAVAL', 'TRADICIÓN', 'MITOLOGÍA',
      'FILOSOFÍA', 'HISTORIA', 'IDIOMA', 'DANZA', 'ÓPERA', 'ARTESANÍA',
      'BALLET', 'LEYENDA', 'MONUMENTO', 'MURAL', 'ESCENARIO'
    ]
  };

  const CORRECT_MESSAGES = ['¡Buena!', '¡Esa sí!', '¡Bien visto!', '¡Vas fino!', '¡Correcto!', '¡Sigue así!'];
  const WRONG_MESSAGES = ['¡Casi!', 'Uy, esa no…', '¡Esa era difícil!', 'Frío, frío…', 'No era esa.', '¡Sigue intentando!'];
  const WIN_MESSAGES = ['¡Palabra salvada!', '¡Eres una máquina!', '¡Bien jugado!', '¡Resuelto con estilo!'];
  const LOSE_MESSAGES = ['La próxima es tuya.', 'Casi lo tenías…', 'El bicho confía en ti.', 'Toca revancha.'];

  /* ==========================================================
     3. REFERENCIAS AL DOM
     ========================================================== */
  const $ = (selector) => document.querySelector(selector);

  const board = $('#board');
  const hangman = $('#hangman');
  const wordEl = $('#wordEl');
  const keyboardEl = $('#keyboardEl');
  const toastEl = $('#toastEl');
  const livesPips = $('#livesPips');
  const livesEl = $('#livesEl');
  const livesText = $('#livesText');
  const categoryChip = $('#categoryChip');
  const progressEl = $('.progress');
  const progressBar = $('#progressBar');

  const scoreVal = $('#scoreVal');
  const streakVal = $('#streakVal');
  const bestVal = $('#bestVal');
  const bestStreakVal = $('#bestStreakVal');
  const streakStat = $('#streakStat');

  const soundBtn = $('#soundBtn');
  const newGameBtn = $('#newGameBtn');
  const hintBtn = $('#hintBtn');
  const skipBtn = $('#skipBtn');

  const welcomeDialog = $('#welcomeDialog');
  const winDialog = $('#winDialog');
  const loseDialog = $('#loseDialog');
  const confirmDialog = $('#confirmDialog');
  const categoryPicker = $('#categoryPicker');
  const playBtn = $('#playBtn');
  const welcomeBest = $('#welcomeBest');
  const welcomeBestStreak = $('#welcomeBestStreak');
  const welcomeWins = $('#welcomeWins');

  const winWord = $('#winWord');
  const winPoints = $('#winPoints');
  const winBreakdown = $('#winBreakdown');
  const winKicker = $('#winKicker');
  const nextWordBtn = $('#nextWordBtn');
  const winNewGameBtn = $('#winNewGameBtn');
  const loseWord = $('#loseWord');
  const loseMessage = $('#loseMessage');
  const retryBtn = $('#retryBtn');
  const loseNewGameBtn = $('#loseNewGameBtn');

  const confirmNewBtn = $('#confirmNewBtn');
  const confirmCancelBtn = $('#confirmCancelBtn');

  const confettiLayer = $('#confetti');
  const vignette = $('#vignette');
  const streakFx = $('#streakFx');
  const streakFxText = $('#streakFxText');
  const srStatus = $('#srStatus');

  /* ==========================================================
     4. UTILIDADES
     ========================================================== */
  const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  const reducedMotion = () => motionQuery.matches;

  const numberFormat = new Intl.NumberFormat('es-ES');
  const formatNumber = (value) => numberFormat.format(value);

  function normalizeChar(char) {
    const upper = char.toUpperCase();
    return ACCENTS[upper] || upper;
  }

  function toLetter(key) {
    if (typeof key !== 'string' || key.length !== 1) return null;
    const normalized = normalizeChar(key);
    return GUESSABLE.test(normalized) ? normalized : null;
  }

  const pickRandom = (list) => list[Math.floor(Math.random() * list.length)];

  const lastMessage = { text: '' };
  function pickMessage(list) {
    let message = pickRandom(list);
    let guard = 0;
    while (message === lastMessage.text && guard < 8) {
      message = pickRandom(list);
      guard += 1;
    }
    lastMessage.text = message;
    return message;
  }

  const displayedValues = new WeakMap();
  function animateNumber(element, target, duration = 650) {
    const from = displayedValues.get(element) ?? 0;
    displayedValues.set(element, target);

    if (reducedMotion() || from === target) {
      element.textContent = formatNumber(target);
      return;
    }

    const startTime = performance.now();

    const tick = (now) => {
      const progress = Math.min(1, (now - startTime) / duration);
      const eased = 1 - Math.pow(1 - progress, 3);
      element.textContent = formatNumber(Math.round(from + (target - from) * eased));

      if (progress < 1) {
        requestAnimationFrame(tick);
      } else {
        element.classList.remove('is-bump');
        void element.offsetWidth;
        element.classList.add('is-bump');
      }
    };

    requestAnimationFrame(tick);
  }

  /* ==========================================================
     5. ALMACENAMIENTO (localStorage con fallback seguro)
     ========================================================== */
  const Storage = {
    read() {
      try {
        const raw = window.localStorage.getItem(STORAGE_KEY);
        return raw ? JSON.parse(raw) : {};
      } catch (error) {
        return {};
      }
    },
    write(data) {
      try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      } catch (error) {
        /* modo privado o file:// restringido: el juego sigue funcionando */
      }
    }
  };

  const progress = {
    bestScore: 0,
    bestStreak: 0,
    wins: 0,
    sound: true,
    category: 'all'
  };

  function loadProgress() {
    const stored = Storage.read();
    progress.bestScore = Number(stored.bestScore) || 0;
    progress.bestStreak = Number(stored.bestStreak) || 0;
    progress.wins = Number(stored.wins) || 0;
    progress.sound = stored.sound !== false;
    progress.category = CATEGORIES.some((c) => c.id === stored.category) || stored.category === 'all'
      ? stored.category
      : 'all';
  }

  function saveProgress() {
    Storage.write({
      bestScore: progress.bestScore,
      bestStreak: progress.bestStreak,
      wins: progress.wins,
      sound: progress.sound,
      category: progress.category
    });
  }

  /* ==========================================================
     6. MOTOR DE SONIDO (Web Audio API, sin archivos externos)
     ========================================================== */
  const Sound = (() => {
    const AudioCtor = window.AudioContext || window.webkitAudioContext;
    let context = null;
    let master = null;
    let enabled = true;

    function ensure() {
      if (!enabled || !AudioCtor) return null;
      try {
        if (!context) {
          context = new AudioCtor();
          master = context.createGain();
          master.gain.value = 0.5;
          master.connect(context.destination);
        }
        if (context.state === 'suspended') context.resume();
        return context;
      } catch (error) {
        return null;
      }
    }

    function note(frequency, delay = 0, duration = 0.12, type = 'triangle', volume = 0.25, glide = 0) {
      const audio = ensure();
      if (!audio) return;

      const startAt = audio.currentTime + delay;
      const oscillator = audio.createOscillator();
      const gain = audio.createGain();

      oscillator.type = type;
      oscillator.frequency.setValueAtTime(frequency, startAt);
      if (glide) {
        oscillator.frequency.exponentialRampToValueAtTime(
          Math.max(40, frequency + glide),
          startAt + duration
        );
      }

      gain.gain.setValueAtTime(0.0001, startAt);
      gain.gain.exponentialRampToValueAtTime(volume, startAt + 0.012);
      gain.gain.exponentialRampToValueAtTime(0.0001, startAt + duration);

      oscillator.connect(gain);
      gain.connect(master);
      oscillator.start(startAt);
      oscillator.stop(startAt + duration + 0.06);
    }

    const bank = {
      correct() {
        note(523.25, 0, 0.09);
        note(783.99, 0.07, 0.15);
      },
      wrong() {
        note(196, 0, 0.18, 'sawtooth', 0.16, -60);
        note(146.83, 0.08, 0.22, 'sawtooth', 0.14, -40);
      },
      win() {
        [523.25, 659.25, 783.99, 1046.5].forEach((freq, i) => note(freq, i * 0.09, 0.22, 'triangle', 0.26));
        note(1567.98, 0.42, 0.42, 'sine', 0.16);
      },
      lose() {
        [392, 349.23, 311.13, 261.63].forEach((freq, i) => note(freq, i * 0.13, 0.3, 'sine', 0.22));
      },
      newGame() {
        note(220, 0, 0.18, 'triangle', 0.18, 260);
        note(440, 0.1, 0.2, 'triangle', 0.2, 260);
      },
      streak() {
        [659.25, 880, 1318.51].forEach((freq, i) => note(freq, i * 0.08, 0.18, 'square', 0.09));
      },
      hint() {
        note(880, 0, 0.08, 'sine', 0.18);
        note(1174.66, 0.09, 0.14, 'sine', 0.16);
      },
      tick() {
        note(620, 0, 0.05, 'sine', 0.1);
      }
    };

    return {
      play(name) {
        if (!enabled) return;
        try {
          if (bank[name]) bank[name]();
        } catch (error) {
          /* el juego funciona igual sin audio */
        }
      },
      setEnabled(value) {
        enabled = value;
        if (value) ensure();
      },
      get enabled() {
        return enabled;
      }
    };
  })();

  /* ==========================================================
     7. ESTADO DE LA PARTIDA
     ========================================================== */
  const state = {
    status: 'welcome', // welcome | playing | won | lost
    category: 'all',
    word: '',
    letters: [],
    revealed: [],
    guessed: new Set(),
    wrong: 0,
    score: 0,
    streak: 0,
    hintUsed: false,
    assisted: false,
    busy: false,
    lastWord: ''
  };

  /* ==========================================================
     8. RENDER
     ========================================================== */
  function buildKeyboard() {
    keyboardEl.innerHTML = '';

    LETTER_ROWS.forEach((row, rowIndex) => {
      const rowEl = document.createElement('div');
      rowEl.className = 'keyboard__row';
      rowEl.style.setProperty('--row', String(rowIndex));

      for (const letter of row) {
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'key';
        button.dataset.letter = letter;
        button.textContent = letter;
        button.setAttribute('aria-label', `Letra ${letter}`);
        rowEl.appendChild(button);
      }

      keyboardEl.appendChild(rowEl);
    });
  }

  function buildWord() {
    const chars = state.word.split('');
    state.letters = chars.map(normalizeChar);
    state.revealed = chars.map(() => false);

    wordEl.innerHTML = '';
    wordEl.classList.remove('is-won', 'is-lost', 'is-perfect');

    const fragment = document.createDocumentFragment();
    let letterIndex = 0;

    chars.forEach((char, index) => {
      if (char === ' ') {
        const gap = document.createElement('span');
        gap.className = 'word__gap';
        gap.setAttribute('aria-hidden', 'true');
        fragment.appendChild(gap);
        return;
      }

      const slot = document.createElement('span');
      slot.className = 'slot';
      slot.dataset.index = String(index);

      const inner = document.createElement('span');
      inner.className = 'slot__char';
      inner.textContent = char;
      slot.appendChild(inner);

      if (GUESSABLE.test(state.letters[index])) {
        slot.style.setProperty('--i', String(letterIndex));
        letterIndex += 1;
      } else {
        slot.classList.add('slot--static');
      }

      fragment.appendChild(slot);
    });

    wordEl.appendChild(fragment);
    updateWordAria();
    updateProgress();
    fitWord();
  }

  /* Ajusta el tamaño de las cajitas para que la palabra quepa siempre en una sola línea */
  function fitWord() {
    const slots = [...wordEl.querySelectorAll('.slot')];
    if (!slots.length) return;

    const available = wordEl.clientWidth;
    if (!available) return;

    const children = [...wordEl.children];
    const spaceWidth = [...wordEl.querySelectorAll('.word__gap')]
      .reduce((sum, el) => sum + el.getBoundingClientRect().width, 0);
    const gapCount = Math.max(0, children.length - 1);

    let gap = parseFloat(getComputedStyle(wordEl).columnGap) || 0;
    let width = (available - spaceWidth - gap * gapCount) / slots.length;

    if (width < 28 && gap > 3) {
      gap = Math.max(3, gap * 0.55);
      width = (available - spaceWidth - gap * gapCount) / slots.length;
    }

    width = Math.min(52, Math.max(14, width));

    wordEl.style.setProperty('--slot-w', `${width.toFixed(2)}px`);
    wordEl.style.setProperty('--slot-h', `${(width * 1.34).toFixed(2)}px`);
    wordEl.style.setProperty('--slot-font', `${(width * 0.6).toFixed(2)}px`);
    wordEl.style.setProperty('--word-gap', `${gap.toFixed(2)}px`);
    wordEl.style.setProperty('--word-space', `${Math.max(8, width * 0.5).toFixed(2)}px`);
  }

  function buildCategoryPicker() {
    categoryPicker.innerHTML = '';

    [ALL_CATEGORY, ...CATEGORIES].forEach((category) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'picker';
      button.dataset.category = category.id;
      button.style.setProperty('--pc', category.color);
      button.setAttribute('aria-pressed', String(state.category === category.id));

      const dot = document.createElement('span');
      dot.className = 'picker__dot';
      dot.setAttribute('aria-hidden', 'true');

      const label = document.createElement('span');
      label.textContent = category.label;

      button.append(dot, label);
      categoryPicker.appendChild(button);
    });
  }

  function initLives() {
    livesPips.innerHTML = '';
    for (let i = 0; i < MAX_ERRORS; i += 1) {
      const pip = document.createElement('span');
      pip.className = 'pip';
      livesPips.appendChild(pip);
    }
  }

  function renderLives() {
    [...livesPips.children].forEach((pip, index) => {
      pip.classList.toggle('is-off', index < state.wrong);
    });
    livesText.textContent = `Fallos ${state.wrong}/${MAX_ERRORS}`;
    livesEl.setAttribute('aria-label', `${state.wrong} de ${MAX_ERRORS} fallos`);
  }

  function renderStats() {
    animateNumber(scoreVal, state.score);
    streakVal.textContent = String(state.streak);
    bestVal.textContent = formatNumber(progress.bestScore);
    bestStreakVal.textContent = formatNumber(progress.bestStreak);
    streakStat.classList.toggle('is-hot', state.streak >= 3);
  }

  function renderCategory() {
    const category = state.category === 'all'
      ? ALL_CATEGORY
      : CATEGORIES.find((item) => item.id === state.category) || ALL_CATEGORY;

    categoryChip.textContent = category.label;
    categoryChip.style.setProperty('--chip', category.color);
  }

  function renderWinBreakdown(lines, total) {
    winWord.textContent = state.word;
    winPoints.textContent = `+${formatNumber(total)}`;
    winBreakdown.innerHTML = '';

    lines.forEach(([label, value, negative]) => {
      const item = document.createElement('li');
      if (negative) item.classList.add('is-neg');

      const left = document.createElement('span');
      left.textContent = label;
      const right = document.createElement('span');
      right.textContent = value;

      item.append(left, right);
      winBreakdown.appendChild(item);
    });
  }

  function updateWordAria() {
    const total = state.letters.filter((letter) => GUESSABLE.test(letter)).length;
    const found = state.letters.filter((letter, i) => GUESSABLE.test(letter) && state.revealed[i]).length;
    const label = state.status === 'playing'
      ? `Palabra de ${total} letras, ${found} reveladas`
      : `Palabra: ${state.word}`;
    wordEl.setAttribute('aria-label', label);
  }

  function updateProgress() {
    const total = state.letters.filter((letter) => GUESSABLE.test(letter)).length;
    const found = state.letters.filter((letter, i) => GUESSABLE.test(letter) && state.revealed[i]).length;
    const percent = total ? Math.round((found / total) * 100) : 0;
    progressBar.style.width = `${percent}%`;
    progressEl.setAttribute('aria-valuenow', String(percent));
  }

  function setMood(mood) {
    if (mood) {
      hangman.dataset.mood = mood;
      return;
    }
    const wrong = state.wrong;
    hangman.dataset.mood = wrong <= 1 ? 'ok' : wrong <= 3 ? 'worry' : wrong <= 5 ? 'scared' : 'panic';
  }

  function updateHintAvailability() {
    const available = state.status === 'playing' && !state.hintUsed && state.score >= POINTS.hint;
    hintBtn.disabled = !available;
    hintBtn.title = state.hintUsed
      ? 'Ya usaste la pista de esta palabra'
      : state.score < POINTS.hint
        ? `Necesitas ${POINTS.hint} puntos`
        : `Revela una letra por ${POINTS.hint} puntos`;
  }

  let toastTimer = null;
  let enterTimer = null;

  function showToast(message, type = 'neutral') {
    toastEl.textContent = message;
    toastEl.className = 'toast';
    void toastEl.offsetWidth;
    if (type !== 'neutral') toastEl.classList.add(`is-${type}`);
    toastEl.classList.add('is-pop');
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(() => toastEl.classList.remove('is-pop'), 500);
  }

  /* ==========================================================
     9. LÓGICA DEL JUEGO
     ========================================================== */
  function pickWord() {
    const pool = state.category === 'all'
      ? CATEGORIES.flatMap((category) => WORDS[category.id])
      : WORDS[state.category];

    let word = pickRandom(pool);
    let guard = 0;
    while (word === state.lastWord && guard < 15 && pool.length > 1) {
      word = pickRandom(pool);
      guard += 1;
    }

    state.lastWord = word;
    return word;
  }

  function resetParts() {
    hangman.querySelectorAll('.part.is-on').forEach((part) => part.classList.remove('is-on'));
    hangman.classList.remove('has-parts');
  }

  function revealPart(index) {
    const part = hangman.querySelector(`.part[data-part="${index}"]`);
    if (part) part.classList.add('is-on');
    hangman.classList.add('has-parts');
  }

  function revealIndices(indices, isHint = false) {
    let order = 0;
    indices.forEach((index) => {
      state.revealed[index] = true;
      const slot = wordEl.querySelector(`.slot[data-index="${index}"]`);
      if (!slot) return;
      slot.classList.add('is-revealed');
      if (isHint) slot.classList.add('is-hint');
      slot.style.setProperty('--r', String(order));
      order += 1;
    });
    updateWordAria();
    updateProgress();
  }

  function countRemaining() {
    return state.letters.reduce(
      (total, letter, i) => total + (GUESSABLE.test(letter) && !state.revealed[i] ? 1 : 0),
      0
    );
  }

  function markKey(letter, kind) {
    const key = keyboardEl.querySelector(`.key[data-letter="${letter}"]`);
    if (!key) return;
    key.classList.add(`key--${kind}`);
    key.disabled = true;

    const labels = { correct: 'correcta', wrong: 'incorrecta', hint: 'revelada con pista' };
    key.setAttribute('aria-label', `Letra ${letter}, ${labels[kind]}`);
  }

  function lockKeyboard() {
    keyboardEl.querySelectorAll('.key:not(:disabled)').forEach((key) => {
      key.disabled = true;
    });
  }

  function shakeBoard() {
    if (reducedMotion() || typeof board.animate !== 'function') return;
    board.animate(
      [
        { transform: 'translateX(0)' },
        { transform: 'translateX(-6px)' },
        { transform: 'translateX(5px)' },
        { transform: 'translateX(-4px)' },
        { transform: 'translateX(3px)' },
        { transform: 'translateX(0)' }
      ],
      { duration: 380, easing: 'ease-out' }
    );
  }

  function pressVisual(letter) {
    const key = keyboardEl.querySelector(`.key[data-letter="${letter}"]`);
    if (!key || key.disabled) return;
    key.classList.add('is-pressed');
    window.setTimeout(() => key.classList.remove('is-pressed'), 140);
  }

  function spawnConfetti(count = 90) {
    if (reducedMotion()) return;

    const colors = ['#ff5d73', '#3ddc97', '#ffc857', '#8b7bff', '#5ad2ff', '#f2f4ff'];

    for (let i = 0; i < count; i += 1) {
      const piece = document.createElement('i');
      const width = 6 + Math.random() * 8;

      piece.style.left = `${Math.random() * 100}vw`;
      piece.style.width = `${width}px`;
      piece.style.height = `${width * (1.2 + Math.random() * 1.4)}px`;
      piece.style.background = colors[i % colors.length];
      piece.style.setProperty('--dur', `${1.5 + Math.random() * 1.4}s`);
      piece.style.setProperty('--delay', `${Math.random() * 0.35}s`);
      piece.style.setProperty('--rot', `${Math.round(Math.random() * 900 - 450)}deg`);
      piece.style.setProperty('--drift', `${Math.round(Math.random() * 180 - 90)}px`);

      piece.addEventListener('animationend', () => piece.remove(), { once: true });
      confettiLayer.appendChild(piece);
    }
  }

  function triggerStreakFx() {
    streakFxText.textContent = `Racha x${state.streak}`;
    streakFx.classList.remove('is-active');
    void streakFx.offsetWidth;
    streakFx.classList.add('is-active');
    Sound.play('streak');
    window.setTimeout(() => streakFx.classList.remove('is-active'), 1600);
  }

  function startRound() {
    closeAllDialogs();
    document.body.classList.remove('is-defeat');
    vignette.classList.remove('is-victory', 'is-defeat');
    hangman.classList.remove('is-win', 'is-lose');
    wordEl.classList.remove('is-won', 'is-lost', 'is-perfect');

    state.status = 'playing';
    state.busy = false;
    state.word = pickWord();
    state.wrong = 0;
    state.hintUsed = false;
    state.assisted = false;
    state.guessed = new Set();

    resetParts();
    buildWord();
    buildKeyboard();
    renderLives();
    renderCategory();
    setMood();
    updateHintAvailability();
    renderStats();

    skipBtn.disabled = false;
    showToast('¡A jugar! Adivina la palabra.', 'neutral');
    Sound.play('newGame');

    window.clearTimeout(enterTimer);
    wordEl.classList.remove('is-enter');
    void wordEl.offsetWidth;
    wordEl.classList.add('is-enter');
    enterTimer = window.setTimeout(() => wordEl.classList.remove('is-enter'), 1200);
  }

  function newGame() {
    state.score = 0;
    state.streak = 0;
    renderStats();
    startRound();
  }

  function guess(letter) {
    if (state.status !== 'playing' || state.busy) return;
    if (!GUESSABLE.test(letter) || state.guessed.has(letter)) return;

    state.guessed.add(letter);

    if (state.letters.includes(letter)) {
      markKey(letter, 'correct');
      const indices = [];
      state.letters.forEach((value, index) => {
        if (value === letter) indices.push(index);
      });
      revealIndices(indices);
      Sound.play('correct');

      const remaining = countRemaining();
      if (remaining === 0) {
        finishWin();
      } else {
        showToast(remaining === 1 ? '¡Última letra!' : pickMessage(CORRECT_MESSAGES), 'good');
      }
    } else {
      state.wrong += 1;
      markKey(letter, 'wrong');
      revealPart(state.wrong);
      renderLives();
      setMood();
      shakeBoard();
      Sound.play('wrong');

      if (state.wrong >= MAX_ERRORS) {
        setMood('panic');
        finishLose();
      } else {
        showToast(
          state.wrong === MAX_ERRORS - 1 ? '¡Cuidado! Último intento' : pickMessage(WRONG_MESSAGES),
          'bad'
        );
      }
    }

    updateHintAvailability();
  }

  function useHint() {
    if (state.status !== 'playing' || state.busy || state.hintUsed) return;
    if (state.score < POINTS.hint) {
      showToast(`Necesitas ${POINTS.hint} puntos para una pista`, 'bad');
      return;
    }

    const candidates = [];
    state.letters.forEach((letter, index) => {
      if (GUESSABLE.test(letter) && !state.revealed[index]) candidates.push(letter);
    });
    if (!candidates.length) return;

    const letter = pickRandom(candidates);
    state.hintUsed = true;
    state.assisted = true;
    state.guessed.add(letter);

    state.score = Math.max(0, state.score - POINTS.hint);
    animateNumber(scoreVal, state.score);

    markKey(letter, 'hint');
    const indices = [];
    state.letters.forEach((value, index) => {
      if (value === letter) indices.push(index);
    });
    revealIndices(indices, true);
    Sound.play('hint');
    updateHintAvailability();

    if (countRemaining() === 0) {
      showToast(`La pista era «${letter}». ¡Palabra completada!`, 'gold');
      finishWin();
    } else {
      showToast(`Pista: la letra «${letter}»`, 'gold');
    }
  }

  function finishWin() {
    state.status = 'won';
    state.busy = true;

    wordEl.classList.add('is-won');
    hangman.classList.add('is-win');
    setMood('win');
    Sound.play('win');
    lockKeyboard();

    const lines = [];
    let earned = 0;

    if (state.assisted) {
      earned = POINTS.base;
      lines.push(['Palabra resuelta', `+${POINTS.base}`]);
      lines.push(['Con pista: sin bonus', '+0']);
      lines.push([`Pista usada`, `-${POINTS.hint}`, true]);
      showToast('¡Con ayuda, pero salvado!', 'good');
    } else {
      const livesBonus = (MAX_ERRORS - state.wrong) * POINTS.perLife;
      state.streak += 1;
      const streakBonus = Math.min(state.streak, POINTS.streakCap) * POINTS.perStreak;
      const perfect = state.wrong === 0;
      const perfectBonus = perfect ? POINTS.perfect : 0;
      earned = POINTS.base + livesBonus + streakBonus + perfectBonus;

      lines.push(['Palabra resuelta', `+${POINTS.base}`]);
      lines.push([`Bonus precisión (${MAX_ERRORS - state.wrong} vidas)`, `+${livesBonus}`]);
      lines.push([`Bonus racha x${state.streak}`, `+${streakBonus}`]);
      if (perfect) lines.push(['¡Sin fallos!', `+${perfectBonus}`]);

      if (perfect) {
        wordEl.classList.add('is-perfect');
        showToast('¡PERFECTO! Sin un solo fallo.', 'gold');
      } else if (state.wrong >= 5) {
        showToast('¡Sobreviviste por poco!', 'gold');
      } else {
        showToast(pickMessage(WIN_MESSAGES), 'good');
      }
    }

    state.score += earned;
    if (state.score > progress.bestScore) progress.bestScore = state.score;
    if (state.streak > progress.bestStreak) progress.bestStreak = state.streak;
    progress.wins += 1;
    saveProgress();
    renderStats();
    updateHintAvailability();
    renderWinBreakdown(lines, earned);

    winKicker.textContent = state.assisted ? 'Palabra resuelta con pista' : 'Palabra resuelta';
    srStatus.textContent = `Victoria. La palabra era ${state.word}. Has ganado ${earned} puntos.`;

    vignette.classList.add('is-victory');
    spawnConfetti(state.assisted ? 50 : 100);
    window.setTimeout(() => vignette.classList.remove('is-victory'), 1500);

    if (!state.assisted && state.streak > 0 && state.streak % 3 === 0) {
      triggerStreakFx();
    }

    window.setTimeout(() => {
      state.busy = false;
      openDialog(winDialog);
    }, reducedMotion() ? 200 : 1000);
  }

  function finishLose() {
    state.status = 'lost';
    state.busy = true;

    wordEl.classList.add('is-lost');
    revealMissedLetters();
    hangman.classList.add('is-lose');
    setMood('dead');
    Sound.play('lose');
    lockKeyboard();
    showToast(`La palabra era «${state.word}»`, 'bad');

    document.body.classList.add('is-defeat');
    vignette.classList.add('is-defeat');

    state.streak = 0;
    saveProgress();
    renderStats();
    updateHintAvailability();

    loseWord.textContent = state.word;
    loseMessage.textContent = pickMessage(LOSE_MESSAGES);
    srStatus.textContent = `Derrota. La palabra era ${state.word}.`;

    window.setTimeout(() => {
      document.body.classList.remove('is-defeat');
      vignette.classList.remove('is-defeat');
    }, reducedMotion() ? 150 : 1000);

    window.setTimeout(() => {
      state.busy = false;
      openDialog(loseDialog);
    }, reducedMotion() ? 250 : 1200);
  }

  function revealMissedLetters() {
    let order = 0;
    state.word.split('').forEach((char, index) => {
      if (!GUESSABLE.test(state.letters[index])) return;
      if (state.revealed[index]) return;

      const slot = wordEl.querySelector(`.slot[data-index="${index}"]`);
      if (!slot) return;

      slot.classList.add('is-revealed', 'is-missed');
      slot.style.setProperty('--r', String(order));
      order += 1;
    });
  }

  /* ==========================================================
     10. DIÁLOGOS Y SONIDO
     ========================================================== */
  function openDialog(dialog) {
    if (!dialog.open) {
      try {
        dialog.showModal();
      } catch (error) {
        dialog.setAttribute('open', '');
      }
    }
  }

  function closeAllDialogs() {
    document.querySelectorAll('dialog[open]').forEach((dialog) => dialog.close());
  }

  function refreshWelcomeRecords() {
    welcomeBest.textContent = formatNumber(progress.bestScore);
    welcomeBestStreak.textContent = formatNumber(progress.bestStreak);
    welcomeWins.textContent = formatNumber(progress.wins);
  }

  function hasRoundProgress() {
    return state.score > 0 || state.streak > 0 || state.guessed.size > 0 || state.wrong > 0;
  }

  /* Vuelve al menú principal para elegir categoría */
  function openMenu() {
    closeAllDialogs();
    document.body.classList.remove('is-defeat');
    vignette.classList.remove('is-victory', 'is-defeat');
    state.status = 'welcome';
    state.busy = false;
    skipBtn.disabled = true;
    updateHintAvailability();
    refreshWelcomeRecords();
    openDialog(welcomeDialog);
  }

  function requestNewGame() {
    if (state.status === 'welcome') {
      openDialog(welcomeDialog);
      return;
    }
    if (hasRoundProgress()) {
      openDialog(confirmDialog);
    } else {
      openMenu();
    }
  }

  function setSound(enabled, { persist = true } = {}) {
    progress.sound = enabled;
    Sound.setEnabled(enabled);
    soundBtn.setAttribute('aria-pressed', String(enabled));
    soundBtn.setAttribute('aria-label', enabled ? 'Desactivar sonido' : 'Activar sonido');
    soundBtn.title = enabled ? 'Silenciar' : 'Activar sonido';
    if (persist) saveProgress();
    if (enabled) Sound.play('tick');
  }

  /* ==========================================================
     11. EVENTOS
     ========================================================== */
  function bindEvents() {
    // Teclado virtual
    keyboardEl.addEventListener('click', (event) => {
      const key = event.target.closest('.key');
      if (!key || key.disabled) return;
      guess(key.dataset.letter);
    });

    // Teclado físico
    document.addEventListener('keydown', (event) => {
      if (event.ctrlKey || event.metaKey || event.altKey || event.repeat) return;

      if (document.querySelector('dialog[open]')) return;
      if (state.status !== 'playing') return;

      const letter = toLetter(event.key);
      if (!letter) return;

      event.preventDefault();
      pressVisual(letter);
      guess(letter);
    });

    // Selector de categoría
    categoryPicker.addEventListener('click', (event) => {
      const picker = event.target.closest('.picker');
      if (!picker) return;

      state.category = picker.dataset.category;
      progress.category = state.category;
      saveProgress();
      renderCategory();

      categoryPicker.querySelectorAll('.picker').forEach((element) => {
        element.setAttribute('aria-pressed', String(element === picker));
      });

      Sound.play('tick');
    });

    // Cabecera
    soundBtn.addEventListener('click', () => setSound(!progress.sound));

    newGameBtn.addEventListener('click', requestNewGame);

    // Controles de ronda
    hintBtn.addEventListener('click', useHint);

    skipBtn.addEventListener('click', () => {
      if (state.status !== 'playing' || state.busy) return;
      startRound();
    });

    // Diálogos
    playBtn.addEventListener('click', newGame);
    nextWordBtn.addEventListener('click', startRound);
    retryBtn.addEventListener('click', startRound);
    winNewGameBtn.addEventListener('click', requestNewGame);
    loseNewGameBtn.addEventListener('click', requestNewGame);

    confirmNewBtn.addEventListener('click', () => {
      confirmDialog.close();
      state.score = 0;
      state.streak = 0;
      renderStats();
      openMenu();
    });
    confirmCancelBtn.addEventListener('click', () => confirmDialog.close());

    // Los diálogos de juego no se cierran con Escape
    [welcomeDialog, winDialog, loseDialog].forEach((dialog) => {
      dialog.addEventListener('cancel', (event) => event.preventDefault());
    });

    // La palabra se reajusta a una sola línea al cambiar el tamaño de la ventana
    let fitFrame = null;
    window.addEventListener('resize', () => {
      window.cancelAnimationFrame(fitFrame);
      fitFrame = window.requestAnimationFrame(fitWord);
    });
  }

  /* ==========================================================
     12. ARRANQUE
     ========================================================== */
  function init() {
    loadProgress();
    state.category = progress.category;

    setSound(progress.sound, { persist: false });
    buildCategoryPicker();
    buildKeyboard();
    initLives();

    skipBtn.disabled = true;
    renderStats();
    renderCategory();
    renderLives();
    setMood('ok');
    updateHintAvailability();
    updateProgress();
    refreshWelcomeRecords();

    bindEvents();
    openDialog(welcomeDialog);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }
})();
