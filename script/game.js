/**
 * @fileoverview Permainan Snake klasik dengan fitur tambahan makanan besar (big food).
 * @author Anda
 * @version 1.0
 * 
 * @description 
 * Permainan ini dibuat menggunakan HTML5 Canvas dan JavaScript. 
 * Fitur utama:
 * - Ular yang bisa bergerak ke atas, bawah, kiri, dan kanan.
 * - Makanan biasa yang memberikan skor +1.
 * - Makanan besar (big food) dengan skor lebih besar, namun memiliki durasi kemunculan terbatas.
 * - Permainan berakhir ketika ular menabrak dirinya sendiri.
 */

// Import fungsi untuk mengecek tabrakan dengan diri sendiri
import { checkSelfCollision } from "./helper.js";

// Ambil elemen canvas dan konteks gambar 2D
const canvas = document.getElementById("game-canvas");
const ctx = canvas.getContext("2d");

/** Konstanta untuk permainan */
const BOX_SIZE = 20; // Ukuran kotak (satu grid) dalam piksel
const CANVAS_SIZE = canvas.width; // Ukuran kanvas (asumsi kotak)
const BIG_FOOD_LIFETIME = 7000; // Waktu hidup big food dalam milidetik
const BIG_FOOD_SPAWN_CHANCE = 0.01; // Peluang kemunculan big food di tiap frame (1%)
const BIG_FOOD_SCORE = 5; // Skor tambahan untuk big food
const FRAME_DELAY = 100; // Waktu jeda antar frame dalam milidetik

/**
 * Fungsi untuk membuat posisi makanan secara acak di dalam kanvas.
 * @returns {Object} Koordinat x dan y makanan.
 */
function spawnFood() {
  return {
    x: Math.floor((Math.random() * CANVAS_SIZE) / BOX_SIZE) * BOX_SIZE,
    y: Math.floor((Math.random() * CANVAS_SIZE) / BOX_SIZE) * BOX_SIZE,
  };
}

/** Variabel permainan */
let snake = [{ x: 9 * BOX_SIZE, y: 10 * BOX_SIZE }]; // Posisi awal ular
let food = spawnFood(); // Makanan biasa
let bigFood = null; // Big food, jika ada
let bigFoodTimeout = null; // Timeout untuk menghapus big food
let direction = null; // Arah ular
let score = 0; // Skor pemain
let blinkCounter = 0; // Counter untuk efek blinking makanan besar
let isGameOver = false; // Status permainan

/** Audio untuk aksi */
let sound = new Audio("assets/audio/bop.mp3"); // Suara saat makan makanan biasa
let bigFoodSound = new Audio("assets/audio/bip-bop.mp3"); // Suara saat makan makanan besar

/**
 * Event listener untuk menangani input keyboard pemain.
 */
document.addEventListener("keydown", (e) => {
  if (isGameOver) {
    if (e.key === "Enter") resetGame(); // Reset jika permainan berakhir
    return;
  }
  // Ubah arah ular
  if (e.key === "ArrowUp" && direction !== "DOWN") direction = "UP";
  else if (e.key === "ArrowDown" && direction !== "UP") direction = "DOWN";
  else if (e.key === "ArrowLeft" && direction !== "RIGHT") direction = "LEFT";
  else if (e.key === "ArrowRight" && direction !== "LEFT") direction = "RIGHT";
});

/**
 * Fungsi untuk menampilkan teks di layar.
 * @param {string} text Teks yang akan ditampilkan
 * @param {number} x Koordinat x
 * @param {number} y Koordinat y
 * @param {string} color Warna teks (default: putih)
 * @param {string} size Ukuran teks (default: 20px)
 */
function drawText(text, x, y, color = "#fff", size = "20px") {
  ctx.fillStyle = color;
  ctx.font = `${size} Arial`;
  ctx.fillText(text, x, y);
}

/**
 * Fungsi untuk menggambar makanan pada kanvas.
 * @param {Object} food Objek makanan (koordinat x dan y)
 * @param {number} size Ukuran makanan (default: BOX_SIZE / 2.5)
 * @param {string} color Warna makanan (default: merah)
 * @param {boolean} isBlinking Apakah makanan berkedip (default: false)
 */
function drawFood(food, size = BOX_SIZE / 2.5, color = "red", isBlinking = false) {
  if (isBlinking && blinkCounter % 15 < 7) return; // Blink cepat

  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(food.x + BOX_SIZE / 2, food.y + BOX_SIZE / 2, size, 0, 2 * Math.PI);
  ctx.fill();
  ctx.strokeStyle = "#000";
  ctx.stroke();
}

/**
 * Fungsi untuk menggambar ular pada kanvas.
 */
function drawSnake() {
  snake.forEach((segment, index) => {
    ctx.fillStyle = index === 0 ? "green" : "lime"; // Kepala hijau, tubuh hijau terang
    ctx.fillRect(segment.x, segment.y, BOX_SIZE, BOX_SIZE);
  });
}

/**
 * Fungsi untuk menangani big food (spawn dan timeout).
 */
function handleBigFood() {
  if (!bigFood && Math.random() < BIG_FOOD_SPAWN_CHANCE) {
    bigFood = spawnFood();
    if (bigFoodTimeout) clearTimeout(bigFoodTimeout);

    bigFoodTimeout = setTimeout(() => (bigFood = null), BIG_FOOD_LIFETIME);
  }
}

/**
 * Fungsi utama untuk menggambar seluruh elemen permainan.
 */
function drawGame() {
  ctx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

  if (isGameOver) {
    drawText("GAME OVER", CANVAS_SIZE / 4, CANVAS_SIZE / 2.4, "#ff0000", "30px");
    drawText("Tekan Enter untuk Restart", CANVAS_SIZE / 5, CANVAS_SIZE / 1.9);
    return;
  }

  drawFood(food); // Gambar makanan biasa
  if (bigFood) drawFood(bigFood, BOX_SIZE / 1.5, "gold", true); // Gambar big food
  drawSnake(); // Gambar ular
  drawText(`Score: ${score}`, 10, 20); // Gambar skor
}

/**
 * Fungsi untuk menggerakkan ular berdasarkan arah saat ini.
 */
function moveSnake() {
  if (isGameOver) return;

  const head = { ...snake[0] }; // Posisi kepala ular
  switch (direction) {
    case "UP": head.y -= BOX_SIZE; break;
    case "DOWN": head.y += BOX_SIZE; break;
    case "LEFT": head.x -= BOX_SIZE; break;
    case "RIGHT": head.x += BOX_SIZE; break;
  }

  // Membungkus posisi agar ular muncul di sisi lain layar
  head.x = (head.x + CANVAS_SIZE) % CANVAS_SIZE;
  head.y = (head.y + CANVAS_SIZE) % CANVAS_SIZE;

  // Cek apakah makanan dimakan
  if (head.x === food.x && head.y === food.y) {
    score++;
    sound.play();
    food = spawnFood();
  } else if (bigFood && head.x === bigFood.x && head.y === bigFood.y) {
    score += BIG_FOOD_SCORE;
    bigFoodSound.play();
    bigFood = null;
    if (bigFoodTimeout) clearTimeout(bigFoodTimeout);
  } else {
    snake.pop(); // Hapus ekor ular jika tidak makan
  }

  // Tambahkan posisi kepala baru
  snake.unshift(head);

  // Cek tabrakan dengan diri sendiri
  if (checkSelfCollision(snake, head)) isGameOver = true;
}

/**
 * Fungsi untuk mereset permainan ke kondisi awal.
 */
function resetGame() {
  snake = [{ x: 9 * BOX_SIZE, y: 10 * BOX_SIZE }];
  direction = null;
  score = 0;
  food = spawnFood();
  bigFood = null;
  isGameOver = false;
}

/**
 * Fungsi loop utama permainan.
 */
function gameLoop() {
  moveSnake();
  handleBigFood();
  drawGame();
  blinkCounter++;
  setTimeout(gameLoop, FRAME_DELAY);
}

// Mulai permainan
gameLoop();
