// js/rats.js
export function initRats() {
    const container = document.getElementById('rats-container');
    const rats = [];
    const G = 0.2;           // gravity acceleration (px/frame²)
    const shakeThreshold = 15; // m/s²
  
    // 1) Spawn 5 emojis at random x, just above the top edge
    for (let i = 0; i < 5; i++) {
      const el = document.createElement('div');
      el.className = 'rat';
      el.textContent = '🐀'; // or 🐁 
      container.appendChild(el);
      rats.push({
        el,
        x: Math.random() * window.innerWidth,
        y: -50 - Math.random() * 100,
        vx: (Math.random() - 0.5) * 2,
        vy: 0
      });
    }
  
    // 2) Animation loop
    function step() {
      rats.forEach(r => {
        r.vy += G;            // apply gravity
        r.x  += r.vx;
        r.y  += r.vy;
  
        // respawn at top if out of view
        if (r.y > window.innerHeight + 50) {
          r.y  = -50;
          r.vy = 0;
        }
        // wrap horizontally
        if (r.x < -50) r.x = window.innerWidth + 50;
        if (r.x > window.innerWidth + 50) r.x = -50;
  
        r.el.style.transform = `translate(${r.x}px, ${r.y}px)`;
      });
      requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  
    // 3) Shake detection
    function handleMotion(e) {
      const a = e.accelerationIncludingGravity;
      if (!a) return;
      const mag = Math.hypot(a.x, a.y, a.z);
      if (mag > shakeThreshold) {
        rats.forEach(r => {
          // random impulse on shake
          r.vx += (Math.random() - 0.5) * 10;
          r.vy += (Math.random() - 0.5) * 10;
        });
      }
    }
    if (typeof DeviceMotionEvent?.requestPermission === 'function') {
      DeviceMotionEvent.requestPermission()
        .then(res => {
          if (res === 'granted') window.addEventListener('devicemotion', handleMotion);
        }).catch(() => window.addEventListener('devicemotion', handleMotion));
    } else {
      window.addEventListener('devicemotion', handleMotion);
    }
  
    // 4) Keep them on top on resize
    window.addEventListener('resize', () => {
      rats.forEach(r => { 
        r.x = Math.min(r.x, window.innerWidth);
        r.y = Math.min(r.y, window.innerHeight);
      });
    });
  }
  