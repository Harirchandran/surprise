// scripts/cake.js

let audioContext;
let microphone;
let analyser;
let candlesBlown = 0;
const BLOW_THRESHOLD = 0.7; // Adjust based on testing

function initCakeSection() {
    setupCandles();
    setupAudioAnalysis();
    document.getElementById('blowInstruction').classList.add('show');
}

function setupCandles() {
    const candles = document.querySelectorAll('.candle');
    candles.forEach((candle, index) => {
        candle.style.left = `${20 + (index * 15)}%`;
    });
}

async function setupAudioAnalysis() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
        microphone = audioContext.createMediaStreamSource(stream);
        
        analyser = audioContext.createAnalyser();
        analyser.fftSize = 256;
        microphone.connect(analyser);
        
        detectBlow();
    } catch (error) {
        console.error('Microphone access error:', error);
        showManualBlowButton();
    }
}

function detectBlow() {
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    function checkBlow() {
        analyser.getByteFrequencyData(dataArray);
        const average = dataArray.reduce((a, b) => a + b) / bufferLength / 255;

        if (average > BLOW_THRESHOLD) {
            blowCandle();
        }
        requestAnimationFrame(checkBlow);
    }

    checkBlow();
}

function blowCandle() {
    if (candlesBlown >= 5) return;

    const candles = document.querySelectorAll('.candle:not(.blown)');
    if (candles.length > 0) {
        const candle = candles[0];
        candle.classList.add('blown');
        candle.style.animation = 'candleBlow 0.5s forwards';
        
        candlesBlown++;
        
        if (candlesBlown === 5) {
            handleAllCandlesBlown();
        }
    }
}

function handleAllCandlesBlown() {
    // Stop microphone access
    if (microphone) microphone.disconnect();
    
    // Open door
    document.getElementById('door').style.transform = 'perspective(1000px) rotateY(-90deg)';
    
    // Play birthday song
    const audio = document.getElementById('birthdayAudio');
    audio.play();
    
    // Transition to celebration screen
    setTimeout(() => {
        document.getElementById('cakeScreen').classList.remove('active');
        document.getElementById('celebrationScreen').classList.add('active');
        startCelebration();
    }, 3000);
}

function showManualBlowButton() {
    const button = document.createElement('button');
    button.textContent = 'Click to Blow Candles';
    button.className = 'funny-button';
    button.addEventListener('click', blowCandle);
    document.getElementById('cakeScreen').appendChild(button);
}

// CSS animation for candle blow
const style = document.createElement('style');
style.textContent = `
@keyframes candleBlow {
    0% { opacity: 1; transform: scale(1); }
    100% { opacity: 0; transform: scale(0); }
}
`;
document.head.appendChild(style);
// Add to bottom of cake.js
window.initCakeSection = initCakeSection;