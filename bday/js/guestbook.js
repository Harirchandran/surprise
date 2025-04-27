// js/guestbook.js

/**
 * Initializes the guestbook: loads saved messages, handles new submissions,
 * sanitizes input with DOMPurify, and persists to localStorage.
 */
export function initGuestbook() {
    const listEl = document.getElementById('guestbookList');
    const form = document.getElementById('guestbookForm');
    const input = document.getElementById('guestbookInput');
  
    // Load and render saved messages
    let messages = JSON.parse(localStorage.getItem('guestMessages') || '[]');
    messages.forEach(msg => {
      const li = document.createElement('li');
      li.textContent = msg;
      listEl.appendChild(li);
    });
  
    // Handle new submissions
    form.addEventListener('submit', event => {
      event.preventDefault();
      const raw = input.value.trim();
      const clean = DOMPurify.sanitize(raw).substring(0, 140);
      if (!clean) return;
  
      messages.push(clean);
      localStorage.setItem('guestMessages', JSON.stringify(messages));
  
      const li = document.createElement('li');
      li.textContent = clean;
      listEl.appendChild(li);
  
      input.value = '';
    });
  }
  