// js/blow.js

/**
 * Handles blowing out the candle via device motion, touch, or microphone,
 * then triggers post-blow effects (letter reveal, confetti, play button).
 */
export function initCandleBlow() {
    const flame = document.querySelector('.flame');
    const letterEl = document.getElementById('letter');
    const playBtn = document.getElementById('playMessage');
    const messageAudio = document.getElementById('messageAudio');
  
    // Dynamically load blow sound
    const blowSound = new Audio('audio/blow-sound.mp3');
    blowSound.preload = 'auto';
  
    // Extinguish logic
    function extinguish() {
      if (navigator.vibrate) navigator.vibrate(100);
      if (!flame.classList.contains('extinguished')) {
        flame.classList.add('extinguished');
        blowSound.play();
        onBlown();
        localStorage.setItem('candleBlown', 'true');
      }
    }
  
    // Post-blow effects
    function onBlown() {
      // Reveal letter
      letterEl.classList.add('visible');
      // Show play button
      playBtn.classList.add('visible');
      // Launch confetti
      for (let i = 0; i < 100; i++) {
        const c = document.createElement('div');
        c.className = 'confetti-piece';
        c.style.background = `hsl(${Math.random() * 360}, 100%, 50%)`;
        document.body.appendChild(c);
        let x = window.innerWidth / 2, y = window.innerHeight;
        const angle = Math.random() * 2 * Math.PI;
        let vx = Math.cos(angle) * (2 + Math.random() * 5);
        let vy = Math.sin(angle) * (2 + Math.random() * 5);
        let life = 0;
        (function anim() {
          x += vx; y -= vy; vy -= 0.1;
          c.style.transform = `translate(${x}px, ${y}px)`;
          c.style.opacity = 1 - life / 100;
          if (++life < 100) requestAnimationFrame(anim);
          else c.remove();
        })();
      }
    }
  
    // Device motion
    function handleMotion(e) {
      const a = e.accelerationIncludingGravity;
      if (Math.hypot(a.x, a.y, a.z) > 25) extinguish();
    }
    // Request motion permission (iOS)
    if (typeof DeviceMotionEvent?.requestPermission === 'function') {
      DeviceMotionEvent.requestPermission()
        .then(resp => { if (resp === 'granted') window.addEventListener('devicemotion', handleMotion); })
        .catch(() => window.addEventListener('devicemotion', handleMotion));
    } else {
      window.addEventListener('devicemotion', handleMotion);
    }
  
    // Touch-based blow
    let touchStart = 0;
    const blowThreshold = 500;
    const area = document.getElementById('touch-blow-area');
    area.addEventListener('touchstart', e => {
      touchStart = Date.now();
      const fx = document.createElement('div');
      fx.className = 'blow-effect';
      fx.style.left = `${e.touches[0].clientX - 50}px`;
      fx.style.top = `${e.touches[0].clientY - 50}px`;
      document.body.appendChild(fx);
    });
    area.addEventListener('touchend', () => {
      if (Date.now() - touchStart > blowThreshold) extinguish();
    });
  
    // Microphone blow
    if (navigator.mediaDevices?.getUserMedia) {
      navigator.mediaDevices.getUserMedia({ audio: true })
        .then(stream => {
          const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
          const analyser = audioCtx.createAnalyser();
          const mic = audioCtx.createMediaStreamSource(stream);
          mic.connect(analyser);
          analyser.fftSize = 2048;
          const data = new Uint8Array(analyser.frequencyBinCount);
          (function detect() {
            analyser.getByteTimeDomainData(data);
            let sum = 0;
            data.forEach(v => { const n = (v - 128) / 128; sum += n * n; });
            if (Math.sqrt(sum / data.length) > 0.2) extinguish();
            else requestAnimationFrame(detect);
          })();
        })
        .catch(() => console.warn('Microphone unavailable'));
    }
  
    // Persisted state (if page reload)
    if (localStorage.getItem('candleBlown')) {
      flame.classList.add('extinguished');
      letterEl.classList.add('visible');
      playBtn.classList.add('visible');
    }
  
    // Play voice message
    playBtn.addEventListener('click', () => messageAudio.play());
  }
  