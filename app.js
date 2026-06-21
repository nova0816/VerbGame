// Word Explorer Game Logic

// 10 Levels Definition
const levels = [
  {
    statement: "throw a ball",
    words: ["throw", "a", "ball"],
    distractors: ["catch", "they"],
    image: "assets/throw_ball.png",
    emoji: "⚽"
  },
  {
    statement: "ride a bicycle",
    words: ["ride", "a", "bicycle"],
    distractors: ["drive", "he"],
    image: "assets/ride_bicycle.png",
    emoji: "🚲"
  },
  {
    statement: "read a book",
    words: ["read", "a", "book"],
    distractors: ["write", "she"],
    image: "assets/read_book.png",
    emoji: "📖"
  },
  {
    statement: "paint a picture",
    words: ["paint", "a", "picture"],
    distractors: ["draw", "we"],
    image: "assets/paint_picture.png",
    emoji: "🎨"
  },
  {
    statement: "drink some water",
    words: ["drink", "some", "water"],
    distractors: ["eat", "it"],
    image: "assets/drink_water.png",
    emoji: "💧"
  },
  {
    statement: "eat an apple",
    words: ["eat", "an", "apple"],
    distractors: ["peel", "you"],
    image: "assets/eat_apple.png",
    emoji: "🍎"
  },
  {
    statement: "fly a kite",
    words: ["fly", "a", "kite"],
    distractors: ["make", "sky"],
    image: "assets/fly_kite.png",
    emoji: "🪁"
  },
  {
    statement: "climb a tree",
    words: ["climb", "a", "tree"],
    distractors: ["jump", "up"],
    image: "assets/climb_tree.png",
    emoji: "🌳"
  },
  {
    statement: "wash your hands",
    words: ["wash", "your", "hands"],
    distractors: ["brush", "soap"],
    image: "assets/wash_hands.png",
    emoji: "🧼"
  },
  {
    statement: "brush your teeth",
    words: ["brush", "your", "teeth"],
    distractors: ["wash", "clean"],
    image: "assets/brush_teeth.png",
    emoji: "🪥"
  },
  {
    statement: "blow a bubble",
    words: ["blow", "a", "bubble"],
    distractors: ["pop", "water"],
    image: "assets/blow_bubble.png",
    emoji: "🫧"
  },
  {
    statement: "bounce a ball",
    words: ["bounce", "a", "ball"],
    distractors: ["throw", "toy"],
    image: "assets/bounce_ball.png",
    emoji: "🏀"
  },
  {
    statement: "hug a teddy",
    words: ["hug", "a", "teddy"],
    distractors: ["hold", "friend"],
    image: "assets/hug_teddy.png",
    emoji: "🧸"
  },
  {
    statement: "kick a ball",
    words: ["kick", "a", "ball"],
    distractors: ["catch", "run"],
    image: "assets/kick_ball.png",
    emoji: "⚽"
  },
  {
    statement: "draw a flower",
    words: ["draw", "a", "flower"],
    distractors: ["paint", "sun"],
    image: "assets/draw_flower.png",
    emoji: "🖍️"
  },
  {
    statement: "dig in dirt",
    words: ["dig", "in", "dirt"],
    distractors: ["plant", "sand"],
    image: "assets/dig_dirt.png",
    emoji: "🌱"
  },
  {
    statement: "feed the dog",
    words: ["feed", "the", "dog"],
    distractors: ["walk", "cat"],
    image: "assets/feed_dog.png",
    emoji: "🐶"
  },
  {
    statement: "slide down slide",
    words: ["slide", "down", "slide"],
    distractors: ["climb", "up"],
    image: "assets/slide_slide.png",
    emoji: "🛝"
  },
  {
    statement: "swing on swing",
    words: ["swing", "on", "swing"],
    distractors: ["jump", "high"],
    image: "assets/swing_swing.png",
    emoji: "🌳"
  },
  {
    statement: "open the door",
    words: ["open", "the", "door"],
    distractors: ["close", "key"],
    image: "assets/open_door.png",
    emoji: "🚪"
  },
  {
    statement: "close the box",
    words: ["close", "the", "box"],
    distractors: ["open", "toy"],
    image: "assets/close_box.png",
    emoji: "📦"
  },
  {
    statement: "sweep the floor",
    words: ["sweep", "the", "floor"],
    distractors: ["clean", "dust"],
    image: "assets/sweep_floor.png",
    emoji: "🧹"
  },
  {
    statement: "comb your hair",
    words: ["comb", "your", "hair"],
    distractors: ["brush", "head"],
    image: "assets/comb_hair.png",
    emoji: "🪮"
  },
  {
    statement: "wear your shoes",
    words: ["wear", "your", "shoes"],
    distractors: ["tie", "socks"],
    image: "assets/wear_shoes.png",
    emoji: "👟"
  },
  {
    statement: "plant a seed",
    words: ["plant", "a", "seed"],
    distractors: ["grow", "pot"],
    image: "assets/plant_seed.png",
    emoji: "🪴"
  },
  {
    statement: "fold the clothes",
    words: ["fold", "the", "clothes"],
    distractors: ["wash", "basket"],
    image: "assets/fold_clothes.png",
    emoji: "👕"
  },
  {
    statement: "water the plants",
    words: ["water", "the", "plants"],
    distractors: ["dig", "flower"],
    image: "assets/water_plants.png",
    emoji: "💦"
  },
  {
    statement: "bake a cake",
    words: ["bake", "a", "cake"],
    distractors: ["cook", "chef"],
    image: "assets/bake_cake.png",
    emoji: "🍰"
  },
  {
    statement: "jump on bed",
    words: ["jump", "on", "bed"],
    distractors: ["sleep", "play"],
    image: "assets/jump_bed.png",
    emoji: "🛏️"
  },
  {
    statement: "sing a song",
    words: ["sing", "a", "song"],
    distractors: ["dance", "mic"],
    image: "assets/sing_song.png",
    emoji: "🎤"
  }
];

// Game State
let currentLevelIndex = 0;
let score = 0;
let selectedWords = []; // Array of strings currently placed in slots
let soundMuted = false;
let isCurrentLevelSolved = false;
let currentDifficulty = 'easy';
let listenChoicesMemo = [];

// Audio Context for sound synthesis (no external assets needed)
let audioCtx = null;

function initAudio() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
}

// Play synthesized sound effects
function playSound(type) {
  if (soundMuted) return;
  try {
    initAudio();
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    
    const now = audioCtx.currentTime;
    
    switch (type) {
      case 'click': {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(600, now);
        osc.frequency.exponentialRampToValueAtTime(150, now + 0.08);
        gain.gain.setValueAtTime(0.15, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.08);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start(now);
        osc.stop(now + 0.08);
        break;
      }
      case 'correct': {
        // Ascending major chord (C5 -> E5 -> G5 -> C6)
        const notes = [523.25, 659.25, 783.99, 1046.50];
        notes.forEach((freq, index) => {
          const osc = audioCtx.createOscillator();
          const gain = audioCtx.createGain();
          osc.type = 'triangle';
          osc.frequency.value = freq;
          gain.gain.setValueAtTime(0, now + index * 0.08);
          gain.gain.linearRampToValueAtTime(0.1, now + index * 0.08 + 0.02);
          gain.gain.exponentialRampToValueAtTime(0.001, now + index * 0.08 + 0.3);
          osc.connect(gain);
          gain.connect(audioCtx.destination);
          osc.start(now + index * 0.08);
          osc.stop(now + index * 0.08 + 0.3);
        });
        break;
      }
      case 'incorrect': {
        // Low disappointed sliding tone
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(220, now);
        osc.frequency.linearRampToValueAtTime(130, now + 0.25);
        gain.gain.setValueAtTime(0.1, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start(now);
        osc.stop(now + 0.3);
        break;
      }
      case 'victory': {
        // Fast cheerful arpeggio sequence
        const notes = [261.63, 329.63, 392.00, 523.25, 659.25, 783.99, 1046.50, 1318.51];
        notes.forEach((freq, index) => {
          const osc = audioCtx.createOscillator();
          const gain = audioCtx.createGain();
          osc.type = 'triangle';
          osc.frequency.value = freq;
          gain.gain.setValueAtTime(0, now + index * 0.06);
          gain.gain.linearRampToValueAtTime(0.15, now + index * 0.06 + 0.02);
          gain.gain.exponentialRampToValueAtTime(0.001, now + index * 0.06 + 0.4);
          osc.connect(gain);
          gain.connect(audioCtx.destination);
          osc.start(now + index * 0.06);
          osc.stop(now + index * 0.06 + 0.4);
        });
        break;
      }
    }
  } catch (e) {
    console.error("Audio Synthesis error: ", e);
  }
}

// Text-to-Speech synthesis
function speak(text, slow = false) {
  if (soundMuted) return;
  if ('speechSynthesis' in window) {
    // Cancel any current speaking
    window.speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    // Kids learn better when language is read slightly slower and clear
    utterance.rate = slow ? 0.7 : 0.85;
    utterance.pitch = 1.1; // Slights higher pitch sounds friendlier
    
    // Attempt to select a high quality natural English voice if available
    const voices = window.speechSynthesis.getVoices();
    const englishVoice = voices.find(v => v.lang.startsWith('en') && v.name.includes('Google')) ||
                         voices.find(v => v.lang.startsWith('en') && v.name.includes('Natural')) ||
                         voices.find(v => v.lang.startsWith('en'));
    if (englishVoice) {
      utterance.voice = englishVoice;
    }
    
    window.speechSynthesis.speak(utterance);
  }
}

// Make sure voices are loaded in Chrome
if ('speechSynthesis' in window) {
  window.speechSynthesis.onvoiceschanged = () => {};
}

// Confetti Particle System
const canvas = document.getElementById('confettiCanvas');
const ctx = canvas.getContext('2d');
let confettiActive = false;
let confettiParticles = [];

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

class ConfettiParticle {
  constructor() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * -canvas.height - 20;
    this.size = Math.random() * 10 + 10;
    this.color = `hsl(${Math.random() * 360}, 90%, 65%)`;
    this.rotation = Math.random() * 360;
    this.rotationSpeed = Math.random() * 6 - 3;
    this.speedX = Math.random() * 4 - 2;
    this.speedY = Math.random() * 5 + 4;
    this.shape = Math.random() > 0.5 ? 'rect' : 'circle';
  }

  update() {
    this.x += this.x > canvas.width || this.x < 0 ? -this.speedX : this.speedX;
    this.y += this.speedY;
    this.rotation += this.rotationSpeed;
  }

  draw() {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate((this.rotation * Math.PI) / 180);
    ctx.fillStyle = this.color;
    
    if (this.shape === 'rect') {
      ctx.fillRect(-this.size / 2, -this.size / 2, this.size, this.size);
    } else {
      ctx.beginPath();
      ctx.arc(0, 0, this.size / 2, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }
}

function startConfetti() {
  confettiParticles = [];
  for (let i = 0; i < 120; i++) {
    confettiParticles.push(new ConfettiParticle());
  }
  confettiActive = true;
  animateConfetti();
  setTimeout(() => {
    confettiActive = false;
  }, 1500);
}

function animateConfetti() {
  if (!confettiActive && confettiParticles.length === 0) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    return;
  }
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  confettiParticles.forEach((p, index) => {
    p.update();
    p.draw();
    if (p.y > canvas.height) {
      if (confettiActive) {
        confettiParticles[index] = new ConfettiParticle();
      } else {
        confettiParticles.splice(index, 1);
      }
    }
  });
  
  requestAnimationFrame(animateConfetti);
}

// DOM Elements
const startScreen = document.getElementById('startScreen');
const gameContainer = document.getElementById('gameContainer');
const levelGrid = document.getElementById('levelGrid');
const menuBtn = document.getElementById('menuBtn');
const victoryMenuBtn = document.getElementById('victoryMenuBtn');

const verbImage = document.getElementById('verbImage');
const speakPhraseBtn = document.getElementById('speakPhraseBtn');
const slotsTray = document.getElementById('slotsTray');
const wordDeck = document.getElementById('wordDeck');
const messageBanner = document.getElementById('messageBanner');
const messageText = document.getElementById('messageText');
const nextLevelBtn = document.getElementById('nextLevelBtn');
const scoreValue = document.getElementById('scoreValue');
const progressFill = document.getElementById('progressFill');
const levelIndicator = document.getElementById('levelIndicator');
const soundToggle = document.getElementById('soundToggle');
const soundOnIcon = document.getElementById('soundOnIcon');
const soundOffIcon = document.getElementById('soundOffIcon');
const victoryModal = document.getElementById('victoryModal');
const playAgainBtn = document.getElementById('playAgainBtn');

// Listen Mode DOM Elements
const listenMain = document.getElementById('listenMain');
const listenGrid = document.getElementById('listenGrid');
const listenReplayBtn = document.getElementById('listenReplayBtn');
const listenMessageBanner = document.getElementById('listenMessageBanner');
const listenMessageText = document.getElementById('listenMessageText');
const listenNextLevelBtn = document.getElementById('listenNextLevelBtn');

// Fisher-Yates Shuffle
function shuffle(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// Generate the level selector grid dynamically
function renderLevelGrid() {
  levelGrid.innerHTML = '';
  levels.forEach((level, index) => {
    const card = document.createElement('button');
    card.className = 'level-card';
    card.setAttribute('aria-label', `Play level ${index + 1}: ${level.statement}`);
    
    card.innerHTML = `
      <span class="level-card-icon">${level.emoji}</span>
      <span class="level-card-title">${level.statement}</span>
      <span class="level-card-num">${index + 1}</span>
    `;
    
    card.addEventListener('click', () => {
      playSound('click');
      currentLevelIndex = index;
      initLevel();
      
      // Screen transition
      startScreen.classList.add('hidden');
      gameContainer.classList.remove('hidden');
    });
    
    levelGrid.appendChild(card);
  });
}

// Get 3 unique random verbs from other levels as distractors
function getRandomVerbDistractors(correctVerb) {
  const otherVerbs = [];
  levels.forEach(lvl => {
    const verb = lvl.words[0];
    if (verb !== correctVerb && !otherVerbs.includes(verb)) {
      otherVerbs.push(verb);
    }
  });
  return shuffle(otherVerbs).slice(0, 3);
}

// Get 2 unique random level indices as distractors for Listen mode
function getRandomListenDistractors(correctIndex) {
  const otherIndices = [];
  for (let i = 0; i < levels.length; i++) {
    if (i !== correctIndex) {
      otherIndices.push(i);
    }
  }
  const shuffled = shuffle(otherIndices);
  return [shuffled[0], shuffled[1]];
}

// Render Listen & Match Stage pictures
function renderListenStage() {
  const currentLevel = levels[currentLevelIndex];
  listenGrid.innerHTML = '';
  
  listenMessageBanner.classList.add('hidden');
  listenNextLevelBtn.classList.add('hidden');
  
  listenChoicesMemo.forEach(lvlIndex => {
    const optLevel = levels[lvlIndex];
    
    const card = document.createElement('button');
    card.className = 'listen-pic-card';
    card.setAttribute('aria-label', `Choose picture: ${optLevel.statement}`);
    
    const img = document.createElement('img');
    img.src = optLevel.image;
    img.alt = `Illustration choice`;
    img.className = 'listen-pic-img';
    img.draggable = false;
    
    const fallback = document.createElement('div');
    fallback.className = 'listen-pic-fallback hidden';
    fallback.innerHTML = `<span class="fallback-emoji-small">${optLevel.emoji}</span>`;
    
    img.onerror = () => {
      img.classList.add('hidden');
      fallback.classList.remove('hidden');
    };
    
    card.appendChild(img);
    card.appendChild(fallback);
    
    card.addEventListener('click', () => {
      if (isCurrentLevelSolved) return;
      
      if (lvlIndex === currentLevelIndex) {
        // Correct choice!
        isCurrentLevelSolved = true;
        score += 10;
        scoreValue.textContent = score;
        card.classList.add('correct');
        playSound('correct');
        startConfetti();
        
        setTimeout(() => {
          speak(currentLevel.statement);
        }, 400);
        
        const congratsMessages = [
          "Excellent job! 🎉",
          "Fantastic! You got it! 🌟",
          "Super star! ⭐",
          "You are amazing! 🎈",
          "Wow! Spot on! 🌈"
        ];
        listenMessageText.textContent = congratsMessages[Math.floor(Math.random() * congratsMessages.length)];
        listenMessageBanner.classList.remove('hidden');
        listenNextLevelBtn.classList.remove('hidden');
      } else {
        // Incorrect choice!
        card.classList.add('incorrect');
        playSound('incorrect');
        
        listenMessageText.textContent = "Oops! Try again. 💡";
        listenMessageBanner.classList.remove('hidden');
        
        setTimeout(() => {
          card.classList.remove('incorrect');
        }, 800);
      }
    });
    
    listenGrid.appendChild(card);
  });
}

// Initialize Level
function initLevel() {
  const currentLevel = levels[currentLevelIndex];
  isCurrentLevelSolved = false;
  selectedWords = [];
  
  // Hide UI elements from previous solved level
  messageBanner.classList.add('hidden');
  nextLevelBtn.classList.add('hidden');
  listenMessageBanner.classList.add('hidden');
  listenNextLevelBtn.classList.add('hidden');
  slotsTray.classList.remove('correct', 'incorrect');
  
  // Update indicators (used by both modes)
  levelIndicator.textContent = `Level ${currentLevelIndex + 1} of ${levels.length}`;
  progressFill.style.width = `${((currentLevelIndex) / levels.length) * 100}%`;
  scoreValue.textContent = score;

  if (currentDifficulty === 'listen') {
    document.getElementById('gameMain').classList.add('hidden');
    listenMain.classList.remove('hidden');
    
    // Set up options with distractors
    const distractors = getRandomListenDistractors(currentLevelIndex);
    listenChoicesMemo = shuffle([currentLevelIndex, ...distractors]);
    
    renderListenStage();
    
    // Auto-read the target phrase
    setTimeout(() => {
      speak(currentLevel.statement);
    }, 500);
  } else {
    document.getElementById('gameMain').classList.remove('hidden');
    listenMain.classList.add('hidden');
    
    // Reset fallback image state
    verbImage.classList.remove('hidden');
    document.getElementById('imageFallback').classList.add('hidden');
    
    verbImage.src = currentLevel.image;
    verbImage.alt = `Illustration for action: ${currentLevel.statement}`;
    
    // Toggle voice help overlay button visibility
    if (currentDifficulty === 'easy') {
      speakPhraseBtn.classList.remove('hidden');
    } else {
      speakPhraseBtn.classList.add('hidden');
    }

    // Compile choice list based on difficulty
    if (currentDifficulty === 'normal') {
      const correctVerb = currentLevel.words[0];
      const dists = getRandomVerbDistractors(correctVerb);
      levelChoicesMemo = shuffle([correctVerb, ...dists]);
    } else {
      levelChoicesMemo = shuffle([...currentLevel.words, ...currentLevel.distractors]);
    }

    renderSlotsTray();
    renderWordDeck(levelChoicesMemo);
  }
}

// Render slots tray
function renderSlotsTray() {
  slotsTray.innerHTML = '';
  const currentLevel = levels[currentLevelIndex];
  
  // Render slots based on difficulty (1 slot for Normal, full sentence length for Easy/Hard)
  const slotsCount = currentDifficulty === 'normal' ? 1 : currentLevel.words.length;
  for (let i = 0; i < slotsCount; i++) {
    const slot = document.createElement('div');
    slot.className = 'slot-placeholder';
    
    // If a word is selected for this slot, render it as an interactive card
    if (selectedWords[i]) {
      const card = document.createElement('div');
      card.className = 'word-card';
      card.textContent = selectedWords[i];
      
      // Let kids click word in slots to remove it and return to pool
      card.addEventListener('click', () => {
        if (isCurrentLevelSolved) return;
        playSound('click');
        // Remove the word from selected array
        selectedWords.splice(i, 1);
        updateGameFlow();
      });
      slot.appendChild(card);
    } else {
      slot.textContent = '?';
    }
    slotsTray.appendChild(slot);
  }
}

// Render deck of word options
function renderWordDeck(availableChoices) {
  wordDeck.innerHTML = '';
  
  let tempSelected = [...selectedWords];
  const remainingChoices = [];
  
  availableChoices.forEach(choice => {
    const index = tempSelected.indexOf(choice);
    if (index > -1) {
      tempSelected.splice(index, 1);
    } else {
      remainingChoices.push(choice);
    }
  });

  remainingChoices.forEach(word => {
    const card = document.createElement('button');
    card.className = 'word-card';
    card.textContent = word;
    
    card.addEventListener('click', () => {
      if (isCurrentLevelSolved) return;
      const currentLevel = levels[currentLevelIndex];
      const maxSlots = currentDifficulty === 'normal' ? 1 : currentLevel.words.length;
      
      if (selectedWords.length < maxSlots) {
        playSound('click');
        speak(word);
        selectedWords.push(word);
        updateGameFlow();
      }
    });
    
    wordDeck.appendChild(card);
  });
}

// Update game flow when card is selected or deselected
function updateGameFlow() {
  renderSlotsTray();
  const choices = getLevelChoices();
  renderWordDeck(choices);
  
  slotsTray.classList.remove('correct', 'incorrect');
  messageBanner.classList.add('hidden');
  
  // Auto-check once all slots are filled
  const maxSlots = currentDifficulty === 'normal' ? 1 : levels[currentLevelIndex].words.length;
  if (selectedWords.length === maxSlots) {
    checkAnswer();
  }
}

// Gather all choices (ordered consistently per level session)
let levelChoicesMemo = [];
function getLevelChoices() {
  return levelChoicesMemo;
}

// Check Answer
function checkAnswer() {
  const currentLevel = levels[currentLevelIndex];
  
  let isCorrect = false;
  if (currentDifficulty === 'normal') {
    isCorrect = (selectedWords[0] === currentLevel.words[0]);
  } else {
    isCorrect = (selectedWords.join(' ') === currentLevel.statement);
  }
  
  if (isCorrect) {
    // CORRECT!
    isCurrentLevelSolved = true;
    score += 10;
    scoreValue.textContent = score;
    slotsTray.classList.add('correct');
    
    playSound('correct');
    startConfetti();
    setTimeout(() => {
      speak(currentLevel.statement);
    }, 400);

    const congratsMessages = [
      "Excellent job! 🎉",
      "Fantastic! You got it! 🌟",
      "Super star! ⭐",
      "You are amazing! 🎈",
      "Wow! Spot on! 🌈"
    ];
    messageText.textContent = congratsMessages[Math.floor(Math.random() * congratsMessages.length)];
    messageBanner.classList.remove('hidden');
    nextLevelBtn.classList.remove('hidden');
  } else {
    // INCORRECT!
    slotsTray.classList.add('incorrect');
    playSound('incorrect');
    
    messageText.textContent = "Oops! Try arranging the cards again. 💡";
    messageBanner.classList.remove('hidden');
  }
}

// Event Listeners
speakPhraseBtn.addEventListener('click', () => {
  playSound('click');
  const currentLevel = levels[currentLevelIndex];
  speak(currentLevel.statement);
});

listenReplayBtn.addEventListener('click', () => {
  playSound('click');
  const currentLevel = levels[currentLevelIndex];
  speak(currentLevel.statement);
});

function handleNextLevel() {
  playSound('click');
  currentLevelIndex++;
  
  if (currentLevelIndex < levels.length) {
    initLevel();
  } else {
    // Completed all levels! Show Victory Modal
    progressFill.style.width = '100%';
    playSound('victory');
    startConfetti();
    victoryModal.classList.remove('hidden');
  }
}

nextLevelBtn.addEventListener('click', handleNextLevel);
listenNextLevelBtn.addEventListener('click', handleNextLevel);

// Sound Volume Mute Control
soundToggle.addEventListener('click', () => {
  soundMuted = !soundMuted;
  if (soundMuted) {
    soundOnIcon.classList.add('hidden');
    soundOffIcon.classList.remove('hidden');
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  } else {
    soundOnIcon.classList.remove('hidden');
    soundOffIcon.classList.add('hidden');
    playSound('click');
  }
});

// Navigation Back to Menu Click Bindings
menuBtn.addEventListener('click', () => {
  playSound('click');
  gameContainer.classList.add('hidden');
  startScreen.classList.remove('hidden');
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
});

victoryMenuBtn.addEventListener('click', () => {
  playSound('click');
  victoryModal.classList.add('hidden');
  gameContainer.classList.add('hidden');
  startScreen.classList.remove('hidden');
});

// Reset Game (Play Again from victory modal starts game from level 1 directly)
function resetGame() {
  currentLevelIndex = 0;
  score = 0;
  victoryModal.classList.add('hidden');
  initLevel();
  
  // Transitions
  startScreen.classList.add('hidden');
  gameContainer.classList.remove('hidden');
}

playAgainBtn.addEventListener('click', () => {
  playSound('click');
  resetGame();
});

// Difficulty Tab Switcher Controller
function initDifficultySelector() {
  const tabs = document.querySelectorAll('.diff-tab');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      playSound('click');
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      currentDifficulty = tab.dataset.diff;
    });
  });
}

// Bootstrap game initialization
window.addEventListener('load', () => {
  renderLevelGrid();
  initDifficultySelector();
  scoreValue.textContent = score;
});

// Image load error handler (fallback to emoji card)
function handleImageError() {
  const currentLevel = levels[currentLevelIndex];
  const verbImage = document.getElementById('verbImage');
  const imageFallback = document.getElementById('imageFallback');
  const fallbackEmoji = document.getElementById('fallbackEmoji');
  
  verbImage.classList.add('hidden');
  imageFallback.classList.remove('hidden');
  fallbackEmoji.textContent = currentLevel.emoji;
}
