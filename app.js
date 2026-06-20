// Word Explorer Game Logic

// 10 Levels Definition
const levels = [
  {
    statement: "throw a ball",
    words: ["throw", "a", "ball"],
    distractors: ["catch", "they"],
    image: "assets/throw_ball.png"
  },
  {
    statement: "ride a bicycle",
    words: ["ride", "a", "bicycle"],
    distractors: ["drive", "he"],
    image: "assets/ride_bicycle.png"
  },
  {
    statement: "read a book",
    words: ["read", "a", "book"],
    distractors: ["write", "she"],
    image: "assets/read_book.png"
  },
  {
    statement: "paint a picture",
    words: ["paint", "a", "picture"],
    distractors: ["draw", "we"],
    image: "assets/paint_picture.png"
  },
  {
    statement: "drink some water",
    words: ["drink", "some", "water"],
    distractors: ["eat", "it"],
    image: "assets/drink_water.png"
  },
  {
    statement: "eat an apple",
    words: ["eat", "an", "apple"],
    distractors: ["peel", "you"],
    image: "assets/eat_apple.png"
  },
  {
    statement: "fly a kite",
    words: ["fly", "a", "kite"],
    distractors: ["make", "sky"],
    image: "assets/fly_kite.png"
  },
  {
    statement: "climb a tree",
    words: ["climb", "a", "tree"],
    distractors: ["jump", "up"],
    image: "assets/climb_tree.png"
  },
  {
    statement: "wash your hands",
    words: ["wash", "your", "hands"],
    distractors: ["brush", "soap"],
    image: "assets/wash_hands.png"
  },
  {
    statement: "brush your teeth",
    words: ["brush", "your", "teeth"],
    distractors: ["wash", "clean"],
    image: "assets/brush_teeth.png"
  }
];

// Game State
let currentLevelIndex = 0;
let score = 0;
let selectedWords = []; // Array of strings currently placed in slots
let soundMuted = false;
let isCurrentLevelSolved = false;

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
  }, 4000);
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

// Fisher-Yates Shuffle
function shuffle(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// Initialize Level
function initLevel() {
  const currentLevel = levels[currentLevelIndex];
  isCurrentLevelSolved = false;
  selectedWords = [];
  
  // Hide UI elements from previous solved level
  messageBanner.classList.add('hidden');
  nextLevelBtn.classList.add('hidden');
  slotsTray.classList.remove('correct', 'incorrect');
  
  // Set image and accessibility content
  verbImage.src = currentLevel.image;
  verbImage.alt = `Illustration for action: ${currentLevel.statement}`;
  
  // Update indicators
  levelIndicator.textContent = `Level ${currentLevelIndex + 1} of ${levels.length}`;
  progressFill.style.width = `${((currentLevelIndex) / levels.length) * 100}%`;
  scoreValue.textContent = score;

  // Compile full choice list (correct words + distractors)
  const choices = shuffle([...currentLevel.words, ...currentLevel.distractors]);

  renderSlotsTray();
  renderWordDeck(choices);
}

// Render slots tray
function renderSlotsTray() {
  slotsTray.innerHTML = '';
  const currentLevel = levels[currentLevelIndex];
  
  // Render slots
  for (let i = 0; i < currentLevel.words.length; i++) {
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
  
  // Filter out words that have already been placed in slots
  // We want to make sure if a word is used, it's hidden from the choice deck
  let tempSelected = [...selectedWords];
  const remainingChoices = [];
  
  availableChoices.forEach(choice => {
    const index = tempSelected.indexOf(choice);
    if (index > -1) {
      // Word is selected, omit from choice deck
      tempSelected.splice(index, 1);
    } else {
      remainingChoices.push(choice);
    }
  });

  // Render remaining cards
  remainingChoices.forEach(word => {
    const card = document.createElement('button');
    card.className = 'word-card';
    card.textContent = word;
    
    card.addEventListener('click', () => {
      if (isCurrentLevelSolved) return;
      const currentLevel = levels[currentLevelIndex];
      
      if (selectedWords.length < currentLevel.words.length) {
        playSound('click');
        speak(word); // Read word aloud when kid taps it
        selectedWords.push(word);
        updateGameFlow();
      }
    });
    
    wordDeck.appendChild(card);
  });
}

// Update game flow when card is selected or deselected
function updateGameFlow() {
  const currentLevel = levels[currentLevelIndex];
  
  // Re-render components
  renderSlotsTray();
  
  // To keep choices deck stable, we gather original choices and filter
  const choices = getLevelChoices();
  renderWordDeck(choices);
  
  // Reset feedback state while they adjust cards
  slotsTray.classList.remove('correct', 'incorrect');
  messageBanner.classList.add('hidden');
  
  // Auto-check once all slots are filled
  if (selectedWords.length === currentLevel.words.length) {
    checkAnswer();
  }
}

// Gather all choices (ordered consistently per level session)
let levelChoicesMemo = [];
function getLevelChoices() {
  // Memoize deck scramble per level to avoid items bouncing around randomly
  return levelChoicesMemo;
}

// Check Answer
function checkAnswer() {
  const currentLevel = levels[currentLevelIndex];
  const joinedAnswer = selectedWords.join(' ');
  const correctAnswer = currentLevel.statement;
  
  if (joinedAnswer === correctAnswer) {
    // CORRECT!
    isCurrentLevelSolved = true;
    score += 10;
    scoreValue.textContent = score;
    slotsTray.classList.add('correct');
    
    // Play sound, celebrate, and speak complete phrase
    playSound('correct');
    startConfetti();
    setTimeout(() => {
      speak(correctAnswer);
    }, 400);

    // Show banner & next button
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
    
    // Show supportive feedback
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

nextLevelBtn.addEventListener('click', () => {
  playSound('click');
  currentLevelIndex++;
  
  if (currentLevelIndex < levels.length) {
    // Reset memoized choices for the next level
    const nextLevel = levels[currentLevelIndex];
    levelChoicesMemo = shuffle([...nextLevel.words, ...nextLevel.distractors]);
    initLevel();
  } else {
    // Completed all levels! Show Victory Modal
    progressFill.style.width = '100%';
    playSound('victory');
    startConfetti();
    victoryModal.classList.remove('hidden');
  }
});

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

// Reset Game
function resetGame() {
  currentLevelIndex = 0;
  score = 0;
  victoryModal.classList.add('hidden');
  
  // Set up memoized choices for first level
  const firstLevel = levels[0];
  levelChoicesMemo = shuffle([...firstLevel.words, ...firstLevel.distractors]);
  
  initLevel();
}

playAgainBtn.addEventListener('click', () => {
  playSound('click');
  resetGame();
});

// Bootstrap game initialization
window.addEventListener('load', () => {
  resetGame();
});
