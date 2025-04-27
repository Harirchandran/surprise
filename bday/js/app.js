import { initLoader }     from './loader.js';
import { initCountdown }  from './countdown.js';
import { initCandleBlow } from './blow.js';
import { initGallery }    from './gallery.js';
import { initGuestbook }  from './guestbook.js';
import { initRats }       from './rats.js';

document.addEventListener('DOMContentLoaded', () => {
  initLoader();
  initCountdown();
  initCandleBlow();
  initGallery();
  initGuestbook();
  initRats();   // start the rat-emoji snowfall

  // 🔥 Move unlockAudio inside DOMContentLoaded
  const bgMusic = document.getElementById('bgMusic');
  function unlockAudio() {
    if (bgMusic) {
      bgMusic.muted = false;
      bgMusic.play().catch(() => {}); // Ignore play() errors
      window.removeEventListener('click', unlockAudio);
      window.removeEventListener('touchstart', unlockAudio);
    }
  }
  window.addEventListener('click', unlockAudio);
  window.addEventListener('touchstart', unlockAudio);
});
