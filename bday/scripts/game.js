// game.js
const gridSize = 5;
let score = 0;
let gameInterval;
const totalToCatch = 5;

document.addEventListener('DOMContentLoaded', () => {
  createGrid();
  document.getElementById('nextStageButton').addEventListener('click', goToCakeScreen);
});

// Expose startGame globally
window.startGame = () => {
  score = 0;
  updateScore();
  showScreen('gameScreen');
  gameInterval = setInterval(spawnMouse, 1000);
};

function createGrid() {
  const grid = document.getElementById('mouseGrid');
  for (let i = 0; i < gridSize * gridSize; i++) {
    const cell = document.createElement('div');
    cell.classList.add('grid-cell');
    grid.appendChild(cell);
  }
}

function spawnMouse() {
  clearMice();
  const cells = document.querySelectorAll('.grid-cell');
  const index = Math.floor(Math.random() * cells.length);
  const cell = cells[index];

  const mouseImg = document.createElement('img');
  mouseImg.src = 'assets/images/mouse.png';
  mouseImg.alt = 'mouse';
  mouseImg.classList.add('mouse');
  mouseImg.addEventListener('click', catchMouse);

  cell.appendChild(mouseImg);
}

function clearMice() {
  document.querySelectorAll('.grid-cell').forEach(cell => {
    cell.innerHTML = '';
  });
}

function catchMouse(e) {
  score++;
  updateScore();
  e.target.remove();

  if (score >= totalToCatch) {
    clearInterval(gameInterval);
    document.getElementById('victoryOverlay').classList.remove('hidden');
    document.getElementById('victoryOverlay').classList.add('show');
  }
}

function updateScore() {
  document.getElementById('score').textContent = score;
}

function goToCakeScreen() {
  document.getElementById('victoryOverlay').classList.add('hidden');
  hideScreen('gameScreen');
  showScreen('cakeScreen');
}
