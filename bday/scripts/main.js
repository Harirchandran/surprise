// main.js
const ASSETS = {
  images: [
    'mouse.png',
    'door-funny.png',
    'photo1.jpg',
    'photo2.jpg',
    'photo3.jpg',
    'photo4.jpg',
    'photo5.jpg'
  ],
  audio: [
    'happy-birthday.mp3',
    'voice-message.mp3'
  ]
};

let hasMicAccess = false;
let slideIntervalId = null;
let popperIntervalId = null;

document.addEventListener('DOMContentLoaded', async () => {
  showScreen('permissionScreen');
  await preloadAssets();

  const btn = document.getElementById('startPermissionButton');
  btn.addEventListener('click', async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach(track => track.stop());
      hasMicAccess = true;
      initializeApp();
    } catch (err) {
      handlePermissionError(err);
    }
  });
});


async function preloadAssets() {
  const loadPromises = [];

  ASSETS.images.forEach(img => {
    const image = new Image();
    image.src = `assets/images/${img}`;
    loadPromises.push(new Promise((res, rej) => {
      image.onload = res;
      image.onerror = rej;
    }));
  });

  ASSETS.audio.forEach(file => {
    const audio = new Audio();
    audio.src = `assets/audio/${file}`;
    loadPromises.push(new Promise((res, rej) => {
      audio.addEventListener('loadeddata', res);
      audio.addEventListener('error', rej);
    }));
  });

  await Promise.all(loadPromises);
}

function handlePermissionError(error) {
  const el = document.getElementById('permissionText');
  el.innerHTML = `
    🚫 Microphone permission needed!<br>
    <button onclick="location.reload()" class="btn">Try Again</button>
  `;
}

function initializeApp() {
  hideScreen('permissionScreen');
  showScreen('initialScreen');

  const audioButton = document.getElementById('audioMessageButton');
  const voiceMsg = document.getElementById('voiceMessage');
  const bgMusic = document.getElementById('birthdaySong');

  // Voice message button
  audioButton.addEventListener('click', () => {
    bgMusic.pause();
    voiceMsg.play();
  });

  // When voice message ends, resume background music
  voiceMsg.addEventListener('ended', () => {
    bgMusic.play();
  });

  // Start button
  document.getElementById('startButton').addEventListener('click', () => {
    hideScreen('initialScreen');
    window.startGame();
  });
}

// Screen management
function showScreen(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  const el = document.getElementById(id);
  el.classList.add('active');
  el.style.opacity = '1';
  el.style.pointerEvents = 'all';
}

function hideScreen(id) {
  const el = document.getElementById(id);
  el.classList.remove('active');
  el.style.opacity = '0';
  el.style.pointerEvents = 'none';
}

// Celebration logic
function startCelebration() {
  clearIntervals();
  const bgMusic = document.getElementById('birthdaySong');
  bgMusic.play();
  showScreen('celebrationScreen');

  fireConfetti();
  launchPopper();
  slideIntervalId = setInterval(cycleSlides, 4000);
  popperIntervalId = setInterval(launchPopper, 6000);
}

function clearIntervals() {
  if (slideIntervalId) clearInterval(slideIntervalId);
  if (popperIntervalId) clearInterval(popperIntervalId);
}

function fireConfetti() {
  if (window.confetti) {
    confetti({
      particleCount: 150,
      spread: 90,
      origin: { y: 0.7 },
      colors: ['#FF69B4', '#FFD700', '#7FFF00']
    });
  }
}

function launchPopper() {
  const popper = document.createElement('div');
  popper.className = 'popper';
  popper.textContent = '🎉';
  Object.assign(popper.style, {
    position: 'absolute',
    left: `${Math.random() * 90}%`,
    fontSize: `${Math.random() * 20 + 24}px`,
    animation: `popper 1.5s ease-out forwards`
  });
  document.getElementById('celebrationScreen').appendChild(popper);
  setTimeout(() => popper.remove(), 1500);
}

function cycleSlides() {
  const photos = document.querySelectorAll('#photoSlideshow .photo');
  if (photos.length <= 1) return;
  const active = document.querySelector('#photoSlideshow .photo.active') || photos[0];
  active.classList.remove('active');
  const next = active.nextElementSibling || photos[0];
  next.classList.add('active');
}

// Expose to window
window.showScreen = showScreen;
window.hideScreen = hideScreen;
window.startCelebration = startCelebration;
