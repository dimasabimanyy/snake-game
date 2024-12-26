const canvas = document.getElementById("game-canvas");
const ctx = canvas.getContext("2d");

// Mengambil ukuran canvas dari style CSS
const canvasWidth = parseInt(window.getComputedStyle(canvas).width);
const canvasHeight = parseInt(window.getComputedStyle(canvas).height);

// Set ukuran canvas internal agar sesuai dengan ukuran CSS
canvas.width = canvasWidth;
canvas.height = canvasHeight;

const boxSize = 20;
const canvasSize = canvas.width;

// Spawn a food object at a random position
function spawnFood() {
  return {
    x: Math.floor((Math.random() * canvasSize) / boxSize) * boxSize,
    y: Math.floor((Math.random() * canvasSize) / boxSize) * boxSize,
  };
}

let snake = [{ x: 9 * boxSize, y: 10 * boxSize }];
let direction = null;

let food = spawnFood();
let bigFood = null;
let bigFoodTimeout = null;

let score = 0;
let blinkCounter = 0;
let isGameOver = false;

let sound = new Audio("assets/audio/bop.mp3"); // Sound for eating food
let bigFoodSound = new Audio("assets/audio/bip-bop.mp3"); // Sound for eating food

// Control snake direction
document.addEventListener("keydown", (e) => {
  if (isGameOver) {
    if (e.key === "Enter") resetGame();
    return; // Early exit if the game is over
  } else if (e.key === "ArrowUp" && direction !== "DOWN") {
    direction = "UP";
  } else if (e.key === "ArrowDown" && direction !== "UP") {
    direction = "DOWN";
  } else if (e.key === "ArrowLeft" && direction !== "RIGHT") {
    direction = "LEFT";
  } else if (e.key === "ArrowRight" && direction !== "LEFT") {
    direction = "RIGHT";
  }
});

// Gambar text di canvas
function drawText(text, x, y, color = "#fff", size = "20px") {
  ctx.fillStyle = color;
  ctx.font = `${size} Arial`;
  ctx.fillText(text, x, y);
}

// Gambar makanan di canvas
function drawFood(
  food,
  size = boxSize / 2.5,
  color = "red",
  isBlinking = false
) {
  if (isBlinking && blinkCounter % 15 < 7) return; // Make food blink faster

  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(food.x + boxSize / 2, food.y + boxSize / 2, size, 0, 2 * Math.PI);
  ctx.fill();
  ctx.strokeStyle = "#000";
  ctx.stroke();
}

// Gambar ular
function drawSnake() {
  snake.forEach((segment, index) => {
    if (index === 0) {
      // Head of the snake
      ctx.fillStyle = "green";
      ctx.fillRect(segment.x, segment.y, boxSize, boxSize);
    } else {
      // Body of the snake
      ctx.fillStyle = "lime";
      ctx.fillRect(segment.x, segment.y, boxSize, boxSize);
    }
  });
}

// Handle big food spawn and timeout
function handleBigFood() {
  if (!bigFood && Math.random() < 0.01) {
    // 1% chance of spawning big food each frame
    bigFood = spawnFood();

    if (bigFoodTimeout) clearTimeout(bigFoodTimeout); // Clear previous timeout if any

    bigFoodTimeout = setTimeout(() => (bigFood = null), 7000); // Big food disappears after 7 seconds
  }
}

// Main game draw function
function drawGame() {
  ctx.clearRect(0, 0, canvasSize, canvasSize);

  if (isGameOver) {
    drawText("GAME OVER", canvasSize / 4, canvasSize / 2.4, "#ff0000", "30px");
    drawText(
      "Tekan Enter untuk Restart",
      canvasSize / 5,
      canvasSize / 1.9,
      "#fff",
      "20px"
    );
    return;
  }

  // Draw regular food
  drawFood(food);

  // Draw big food (bonus)
  if (bigFood) drawFood(bigFood, boxSize / 1.5, "gold", true);

  // Draw the snake
  drawSnake();

  // Draw the score
  drawText(`Score: ${score}`, 10, 20, "#fff", "16px");
}

// Move the snake
function moveSnake() {
  if (isGameOver) return;

  const head = { ...snake[0] };

  // Handle direction changes using switch for better readability
  switch (direction) {
    case "UP":
      head.y -= boxSize;
      break;
    case "DOWN":
      head.y += boxSize;
      break;
    case "LEFT":
      head.x -= boxSize;
      break;
    case "RIGHT":
      head.x += boxSize;
      break;
  }

  // Wrap around edges
  head.x = (head.x + canvasSize) % canvasSize; // Simplified wrapping for x
  head.y = (head.y + canvasSize) % canvasSize; // Simplified wrapping for y

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

  // Add new head to the snake
  snake.unshift(head);

  // Check for self-collision
  if (
    snake.some(
      (segment, index) =>
        index !== 0 && segment.x === head.x && segment.y === head.y
    )
  ) {
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
