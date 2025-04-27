// Game constants
const TILE_SIZE = 50;
const VIEWPORT_SIZE = 15; //grid t x t
const TILE_TYPES = ['grass', 'water', 'stone', 'dirt'];
const KEY_COOLDOWN = 500; // 200ms cooldown for keyboard inputs

// Game state
const mapSize = 50; // 100x100 world
let playerX = 0; // Center of the map
let playerY = 0;
let worldMap = {};
let lastKeyTime = 0; // Track last keyboard movement time

// DOM elements
const mapElement = document.getElementById('map');
const characterElement = document.getElementById('character');
const coordinatesElement = document.getElementById('coordinates');
const upBtn = document.getElementById('up-btn');
const downBtn = document.getElementById('down-btn');
const leftBtn = document.getElementById('left-btn');
const rightBtn = document.getElementById('right-btn');

// Initialize the game
function initGame() {
  // Generate a random world map
  generateWorld();
  console.log(worldMap);
  // Render the initial view
  renderMap();
  updateCoordinates();

  // Set up event listeners for buttons
  upBtn.addEventListener('click', () => {
    const now = Date.now();
    if (now - lastKeyTime < KEY_COOLDOWN) return;
    movePlayer(0, -1)
    lastKeyTime = now;
  }
);
  downBtn.addEventListener('click', () =>  {
    const now = Date.now();
    if (now - lastKeyTime < KEY_COOLDOWN) return;
    movePlayer(0, 1)
    lastKeyTime = now;
  }
);
  leftBtn.addEventListener('click', () =>  {
    const now = Date.now();
    if (now - lastKeyTime < KEY_COOLDOWN) return;
    movePlayer(-1,0)
    lastKeyTime = now;
  }
);
  rightBtn.addEventListener('click', () =>  {
    const now = Date.now();
    if (now - lastKeyTime < KEY_COOLDOWN) return;
    movePlayer(1,0)
    lastKeyTime = now;
  }
);

  // Keyboard controls with cooldown
  document.addEventListener('keydown', (e) => {
    const now = Date.now();
    if (now - lastKeyTime < KEY_COOLDOWN) return;

    switch (e.key) {
      case 'ArrowUp':
        movePlayer(0, -1);
        lastKeyTime = now;
        break;
      case 'ArrowDown':
        movePlayer(0, 1);
        lastKeyTime = now;
        break;
      case 'ArrowLeft':
        movePlayer(-1, 0);
        lastKeyTime = now;
        break;
      case 'ArrowRight':
        movePlayer(1, 0);
        lastKeyTime = now;
        break;
    }
  });
}

// Generate a random world map
function generateWorld() {
  for (let y = 0-mapSize; y < mapSize; y++) {
    worldMap[y] = {};
    for (let x = 0-mapSize; x < mapSize; x++) {
      // Random tile type, weighted towards grass
      const rand = Math.random();
      if (rand < 0.6) worldMap[y][x] = 'grass';
      else if (rand < 0.8) worldMap[y][x] = 'dirt';
      else if (rand < 0.9) worldMap[y][x] = 'water';
      else worldMap[y][x] = 'stone';

      // Ensure the starting position is grass
      if (x === playerX && y === playerY) {
        worldMap[y][x] = 'grass';
      }
    }
  }
}

// Update coordinates display
function updateCoordinates() {
  coordinatesElement.textContent = `Coordinates: ${playerX}, ${playerY}`;


}

// Render the visible portion of the map
function renderMap() {
  mapElement.innerHTML = '';

  // Calculate the visible area based on player position
  const halfView = Math.floor(VIEWPORT_SIZE / 2);
  const startX = Math.max(0-mapSize, playerX - halfView);
  const startY = Math.max(0-mapSize, playerY - halfView);
  const endX = Math.min(mapSize - 1, playerX + halfView);
  const endY = Math.min(mapSize - 1, playerY + halfView);

  // Position the map container to show the correct area
  const offsetX = (playerX - halfView) * -TILE_SIZE;
  const offsetY = (playerY - halfView) * -TILE_SIZE;
  mapElement.style.transform = `translate(${offsetX}px, ${offsetY}px)`;

  // Render each visible tile
  for (let y = startY; y <= endY; y++) {
    for (let x = startX; x <= endX; x++) {
      const tile = document.createElement('div');
      tile.className = `tile ${worldMap[y][x]}`;
      tile.style.left = `${x * TILE_SIZE}px`;
      tile.style.top = `${y * TILE_SIZE}px`;
      mapElement.appendChild(tile);
    }
  }
}

// Move the player if possible
function movePlayer(dx, dy) {
  const newX = playerX + dx;
  const newY = playerY + dy;

  // Check boundaries
  if (newX < (0-mapSize) || newX >= mapSize || newY < (0-mapSize) || newY >= mapSize) {
    return;
  }

  // Check if the tile is passable (not stone)
  if (worldMap[newY][newX] === 'stone') {
    return;
  }

  // Move the player
  playerX = newX;
  playerY = newY;

  // Update the view and coordinates
  renderMap();
  updateCoordinates();
}

// Start the game
initGame();