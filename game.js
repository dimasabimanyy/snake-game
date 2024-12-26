const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const boxSize = 20;
const canvasSize = canvas.width;
let snake = [{ x: 9 * boxSize, y: 10 * boxSize }];
let direction = null;
let food = spawnFood();
let bigFood = null;
let bigFoodTimeout = null;
let score = 0;
let sound = new Audio('/bop.mp3'); // Sound for eating food
let bigFoodSound = new Audio('/bip-bop.mp3'); // Sound for eating food
let blinkCounter = 0;
let isGameOver = false;

// Spawn a food object at a random position
function spawnFood() {
    return {
        x: Math.floor(Math.random() * canvasSize / boxSize) * boxSize,
        y: Math.floor(Math.random() * canvasSize / boxSize) * boxSize,
    };
}

// Control snake direction
document.addEventListener('keydown', (e) => {
    if (isGameOver) {
        if (e.key === 'Enter') resetGame();
        return;
    }
    if (e.key === 'ArrowUp' && direction !== 'DOWN') direction = 'UP';
    if (e.key === 'ArrowDown' && direction !== 'UP') direction = 'DOWN';
    if (e.key === 'ArrowLeft' && direction !== 'RIGHT') direction = 'LEFT';
    if (e.key === 'ArrowRight' && direction !== 'LEFT') direction = 'RIGHT';
});

// Draw text
function drawText(text, x, y, color = '#fff', size = '20px') {
    ctx.fillStyle = color;
    ctx.font = `${size} Arial`;
    ctx.fillText(text, x, y);
}

// Draw food as a circle
function drawFood(food, size = boxSize / 2.5, color = 'red', isBlinking = false) {
    if (isBlinking && blinkCounter % 15 < 7) return; // Make food blink faster
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(food.x + boxSize / 2, food.y + boxSize / 2, size, 0, 2 * Math.PI);
    ctx.fill();
    ctx.strokeStyle = '#000';
    ctx.stroke();
}

// Draw the snake
function drawSnake() {
    snake.forEach((segment, index) => {
        if (index === 0) {
            // Head of the snake
            ctx.fillStyle = 'green';
            ctx.fillRect(segment.x, segment.y, boxSize, boxSize);
        } else {
            // Body of the snake
            ctx.fillStyle = 'lime';
            ctx.fillRect(segment.x, segment.y, boxSize, boxSize);
        }
    });
}

// Handle big food spawn and timeout
function handleBigFood() {
    if (!bigFood && Math.random() < 0.01) { // 1% chance of spawning big food each frame
        bigFood = spawnFood();
        if (bigFoodTimeout) clearTimeout(bigFoodTimeout); // Clear previous timeout if any
        bigFoodTimeout = setTimeout(() => (bigFood = null), 7000); // Big food disappears after 7 seconds
    }
}

// Main game draw function
function drawGame() {
    ctx.clearRect(0, 0, canvasSize, canvasSize);

    if (isGameOver) {
        drawText("GAME OVER", canvasSize / 4, canvasSize / 2, '#ff0000', '30px');
        drawText("Press Enter to Restart", canvasSize / 6, canvasSize / 2 + 40, '#fff', '20px');
        return;
    }

    // Draw regular food
    drawFood(food);

    // Draw big food (bonus)
    if (bigFood) drawFood(bigFood, boxSize / 1.5, 'gold', true);

    // Draw the snake
    drawSnake();

    // Draw the score
    drawText(`Score: ${score}`, 10, 20, '#fff', '16px');
}

// Move the snake
function moveSnake() {
    if (isGameOver) return;

    const head = { ...snake[0] };
    if (direction === 'UP') head.y -= boxSize;
    if (direction === 'DOWN') head.y += boxSize;
    if (direction === 'LEFT') head.x -= boxSize;
    if (direction === 'RIGHT') head.x += boxSize;

    // Wrap around edges
    if (head.x < 0) head.x = canvasSize - boxSize;
    if (head.x >= canvasSize) head.x = 0;
    if (head.y < 0) head.y = canvasSize - boxSize;
    if (head.y >= canvasSize) head.y = 0;

    // Check if food is eaten
    if (head.x === food.x && head.y === food.y) {
        score++;
        sound.play();
        food = spawnFood();
    } else if (bigFood && head.x === bigFood.x && head.y === bigFood.y) {
        score += 5; // Big food adds more points
        bigFoodSound.play();
        bigFood = null; // Remove big food after eaten
        if (bigFoodTimeout) clearTimeout(bigFoodTimeout);
    } else {
        snake.pop(); // Remove the tail if no food eaten
    }

    // Add new head
    snake.unshift(head);

    // Check for self-collision
    if (snake.slice(1).some(segment => segment.x === head.x && segment.y === head.y)) {
        isGameOver = true;
    }
}

// Reset the game
function resetGame() {
    snake = [{ x: 9 * boxSize, y: 10 * boxSize }];
    direction = null;
    score = 0;
    food = spawnFood();
    bigFood = null;
    isGameOver = false;
}

// Game loop
function gameLoop() {
    moveSnake();
    handleBigFood();
    drawGame();
    blinkCounter++;
    setTimeout(gameLoop, 100);
}

// Start the game loop
gameLoop();
