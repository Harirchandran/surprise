// js/countdown.js

/**
 * Shows the 3-2-1 countdown overlay and hides it after completion.
 */
export function initCountdown() {
    const countdownEl = document.getElementById('countdown');
    if (!countdownEl) return;
  
    // After the countdown animation ends on the last number, hide the overlay
    const numbers = countdownEl.querySelectorAll('.countdown-number');
    if (numbers.length) {
      const last = numbers[numbers.length - 1];
      last.addEventListener('animationend', () => {
        countdownEl.style.display = 'none';
      });
    }
  
    // Safety fallback: hide after 3 seconds if animations fail
    setTimeout(() => {
      countdownEl.style.display = 'none';
    }, 3000);
  }
  