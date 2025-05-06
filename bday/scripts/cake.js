let blowDetected = false;
let audioContext, analyser, microphone, microphoneStream;

document.addEventListener('DOMContentLoaded', () => {
  const blowBtn = document.getElementById('manualBlow');

  blowBtn.addEventListener('click', () => {
    if (!blowDetected) handleBlow();
  });

  const observer = new MutationObserver(() => {
    if (document.getElementById('cakeScreen').classList.contains('active')) {
      listenForBlow();
    }
  });
  observer.observe(document.body, { subtree: true, attributes: true, attributeFilter: ['class'] });
});

function listenForBlow() {
  if (blowDetected) return;

  navigator.mediaDevices.getUserMedia({ audio: true })
    .then(stream => {
      audioContext = new AudioContext();
      analyser = audioContext.createAnalyser();
      analyser.fftSize = 2048;

      microphone = audioContext.createMediaStreamSource(stream);
      microphoneStream = stream;

      microphone.connect(analyser);
      detectBlowVolume();
    })
    .catch(err => {
      document.getElementById('manualBlow').classList.remove('hidden');
      console.warn('Mic blow detection failed, fallback enabled:', err);
    });
}

function detectBlowVolume() {
  const data = new Uint8Array(analyser.fftSize);
  const threshold = 30;

  const check = () => {
    analyser.getByteTimeDomainData(data);
    let sum = 0;
    for (let i = 0; i < data.length; i++) {
      sum += Math.abs(data[i] - 128);
    }

    if (sum / data.length > threshold) {
      if (!blowDetected) handleBlow();
    } else if (!blowDetected) {
      requestAnimationFrame(check);
    }
  };

  check();
}

function handleBlow() {
  blowDetected = true;

  // Stop mic stream
  if (microphoneStream) {
    microphoneStream.getTracks().forEach(track => track.stop());
  }

  // Animate candles
  document.querySelectorAll('.candle').forEach(candle => {
    candle.classList.remove('lit');
  });

  // Animate door
  const door = document.getElementById('door');
  door.style.transform = 'rotateY(-100deg)';

  // Delay to start celebration
  setTimeout(() => {
    window.showScreen('celebrationScreen');
    window.startCelebration();
  }, 2000);
}
