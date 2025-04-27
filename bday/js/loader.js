// js/loader.js
import { initCountdown } from './countdown.js';

/**
 * Preloads key assets (audio & images), updates the progress bar,
 * hides the loader overlay, and starts the countdown.
 */
export function initLoader() {
  const loaderEl = document.getElementById('loader');
  const progressBar = loaderEl.querySelector('.progress-bar');

  // List of assets to preload
  const assets = [
    'audio/blow-sound.mp3',
    'audio/voice-message.mp3',
    'img/photo1.jpg', 'img/photo2.jpg', 'img/photo3.jpg',
    'img/photo4.jpg', 'img/photo5.jpg', 'img/photo6.jpg'
  ];

  let loadedCount = 0;
  const total = assets.length;

  function track() {
    loadedCount++;
    progressBar.style.width = `${(loadedCount / total) * 100}%`;

    if (loadedCount === total) {
      // All assets loaded: hide loader and start countdown
      loaderEl.style.display = 'none';
      initCountdown();
    }
  }

  assets.forEach(src => {
    if (/\.(jpe?g|png|webp)$/i.test(src)) {
      const img = new Image();
      img.src = src;
      img.onload = img.onerror = track;
    } else {
      const xhr = new XMLHttpRequest();
      xhr.open('HEAD', src);
      xhr.onload = xhr.onerror = track;
      xhr.send();
    }
  });
}
