// scripts/game.js
const GRID_SIZE = 5;
const MOUSE_APPEAR_INTERVAL = 1000;
let score = 0;
let gameInterval;

document.getElementById('startButton').addEventListener('click', startGame);

function startGame() {
    // Hide initial screen
    document.getElementById('initialScreen').classList.remove('active');
    // Show game screen
    document.getElementById('gameScreen').classList.add('active');
    
    createGrid();
    startMouseGame();
}

function createGrid() {
    const grid = document.getElementById('mouseGrid');
    grid.innerHTML = '';
    
    for(let i = 0; i < GRID_SIZE * GRID_SIZE; i++) {
        const cell = document.createElement('div');
        cell.className = 'grid-cell';
        grid.appendChild(cell);
    }
}

function startMouseGame() {
    gameInterval = setInterval(spawnMouse, MOUSE_APPEAR_INTERVAL);
    
    // Add click listener to entire grid
    document.getElementById('mouseGrid').addEventListener('click', handleMouseClick);
}

function spawnMouse() {
    // Remove existing mice
    document.querySelectorAll('.mouse').forEach(mouse => mouse.remove());
    
    // Get random cell
    const cells = document.getElementsByClassName('grid-cell');
    const randomIndex = Math.floor(Math.random() * cells.length);
    const selectedCell = cells[randomIndex];
    
    // Create mouse image
    const mouse = document.createElement('img');
    mouse.src = 'assets/images/mouse.png';
    mouse.className = 'mouse';
    selectedCell.appendChild(mouse);
}

function handleMouseClick(event) {
    if(event.target.closest('.mouse')) {
        // Remove clicked mouse
        event.target.remove();
        score++;
        
        // Update score display
        document.getElementById('scoreDisplay').textContent = `Caught: ${score}/5`;
        
        if(score === 5) {
            endGame();
        }
    }
}

function endGame() {
    clearInterval(gameInterval);
    document.getElementById('victoryOverlay').classList.remove('hidden');
    
    // Remove grid click listener
    document.getElementById('mouseGrid').removeEventListener('click', handleMouseClick);
    
    // Update next stage button handler
    document.getElementById('nextStageButton').addEventListener('click', () => {
        document.getElementById('gameScreen').classList.remove('active');
        document.getElementById('cakeScreen').classList.add('active');
        window.initCakeSection(); // Initialize cake section
    });
}