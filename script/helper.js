export function isSamePosition(obj1, obj2) {
  return obj1.x === obj2.x && obj1.y === obj2.y;
}

export function checkSelfCollision(snake, head) {
  return snake.some(
    (segment, index) => index !== 0 && isSamePosition(segment, head)
  );
}
