/**
 * Memeriksa apakah dua objek berada di posisi yang sama.
 * 
 * Fungsi ini digunakan untuk membandingkan posisi dua objek, dalam hal ini
 * posisi `x` dan `y`, dan memeriksa apakah kedua objek berada di posisi yang
 * sama.
 * 
 * @param {Object} obj1 - Objek pertama yang memiliki properti `x` dan `y`.
 * @param {Object} obj2 - Objek kedua yang memiliki properti `x` dan `y`.
 * @returns {boolean} True jika posisi kedua objek sama, false jika berbeda.
 */
export function isSamePosition(obj1, obj2) {
  return obj1.x === obj2.x && obj1.y === obj2.y;
}

/**
 * Memeriksa apakah ular mengalami tabrakan dengan dirinya sendiri.
 * 
 * Fungsi ini digunakan untuk memeriksa apakah kepala ular (head) berada di posisi
 * yang sama dengan salah satu bagian tubuh ular lainnya. Jika ada tabrakan, 
 * maka permainan akan berakhir.
 * 
 * @param {Array} snake - Array yang berisi segmen-segmen tubuh ular, dimana
 *   segmen pertama adalah kepala ular.
 * @param {Object} head - Objek yang merepresentasikan posisi kepala ular 
 *   dengan properti `x` dan `y`.
 * @returns {boolean} True jika ada tabrakan dengan tubuh ular, false jika tidak.
 */
export function checkSelfCollision(snake, head) {
  return snake.some(
    (segment, index) => index !== 0 && isSamePosition(segment, head)
  );
}

/**
 * Fungsi untuk membuat posisi makanan secara acak di dalam kanvas.
 * @returns {Object} Koordinat x dan y makanan.
 */
export function spawnFood(CANVAS_SIZE, BOX_SIZE) {
  return {
    x: Math.floor((Math.random() * CANVAS_SIZE) / BOX_SIZE) * BOX_SIZE,
    y: Math.floor((Math.random() * CANVAS_SIZE) / BOX_SIZE) * BOX_SIZE,
  };
}


/**
 * Fungsi untuk menampilkan teks di layar.
 * @param {string} text Teks yang akan ditampilkan
 * @param {number} x Koordinat x
 * @param {number} y Koordinat y
 * @param {string} color Warna teks (default: putih)
 * @param {string} size Ukuran teks (default: 20px)
 */
export function drawText(ctx, text, x, y, color = "#fff", size = "20px") {
  ctx.fillStyle = color;
  ctx.font = `${size} Arial`;
  ctx.fillText(text, x, y);
}


/**
 * Fungsi untuk menggambar ular pada kanvas.
 */
export function drawSnake(snake, ctx, BOX_SIZE) {
  snake.forEach((segment, index) => {
    ctx.fillStyle = index === 0 ? "green" : "lime"; // Kepala hijau, tubuh hijau terang
    ctx.fillRect(segment.x, segment.y, BOX_SIZE, BOX_SIZE);
  });
}
