

// To:
// No import needed, access via window object if needed

// Page Initialization
document.addEventListener('DOMContentLoaded', () => {
    initializePage();
    setupAudioMessageButton();
});

function initializePage() {
    // Hide all screens except initial
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });
    document.getElementById('initialScreen').classList.add('active');
}

// Celebration Effects
let popperInterval;
function startCelebration() {
    triggerPopperEffect();
    startSlideshow();
    popperInterval = setInterval(triggerPopperEffect, 1500);
}

function triggerPopperEffect() {
    const popper = document.createElement('div');
    popper.className = 'popper';
    popper.innerHTML = '🎉';
    
    Object.assign(popper.style, {
        position: 'fixed',
        left: `${Math.random() * 100}%`,
        fontSize: `${Math.random() * 20 + 20}px`,
        animation: `popper ${Math.random() * 1 + 1}s ease-out forwards`
    });
    
    document.getElementById('celebrationScreen').appendChild(popper);
    setTimeout(() => popper.remove(), 1000);
}

// Background Slideshow
let slideIndex = 0;
function startSlideshow() {
    const slides = document.querySelectorAll('.bg-slide');
    setInterval(() => {
        slides.forEach(slide => slide.style.opacity = 0);
        slides[slideIndex].style.opacity = 1;
        slideIndex = (slideIndex + 1) % slides.length;
    }, 5000);
}

// Audio Message Handling
function setupAudioMessageButton() {
    const audioButton = document.getElementById('audioMessageButton');
    const voiceMessage = document.getElementById('voiceMessage');
    
    audioButton.addEventListener('click', () => {
        if (voiceMessage.paused) {
            voiceMessage.play();
            audioButton.textContent = '🔊 Tap to pause message';
        } else {
            voiceMessage.pause();
            audioButton.textContent = '🎵 Tap to hear the message';
        }
    });
}

// Cross-Screen Management
export function showCelebrationScreen() {
    clearInterval(popperInterval);
    document.getElementById('celebrationScreen').classList.add('active');
}

// Mobile Touch Handling
document.addEventListener('touchstart', handleTouch, { passive: true });

function handleTouch(e) {
    // Convert touch events to click-like behavior
    const touch = e.touches[0];
    const target = document.elementFromPoint(touch.clientX, touch.clientY);
    
    if (target) {
        target.dispatchEvent(new MouseEvent('click', {
            view: window,
            bubbles: true,
            cancelable: true
        }));
    }
}

document.getElementById('cakeScreen').addEventListener('transitionend', () => {
    if(typeof initCakeSection === 'function') {
        initCakeSection();
    }
});