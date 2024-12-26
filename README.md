# Snake Game

A simple yet engaging Snake Game built using HTML, CSS, and JavaScript. 

## Features

- **Special Big Food**: Randomly spawns a big food item that gives bonus points when eaten.
- **Edge Wrapping**: The snake can move through one edge of the canvas and appear on the opposite side.

## Screenshots

Include screenshots of your game here to showcase its features.

## How to Play

- Use the arrow keys (Up, Down, Left, Right) on your keyboard or the on-screen buttons to control the snake.
- Collect the red food to gain points.
- Occasionally, gold food (big food) will appear for a limited time and provide bonus points.
- Avoid colliding with yourself. If you do, the game ends.
- Press the "Restart" button or the Enter key to restart the game after a game over.

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/dimasabimanyy/snake-game.git
   ```

2. Navigate to the project directory:

   ```bash
   cd snake-game
   ```

3. Open the `index.html` file in your browser to start the game.

## File Structure

```
.
├── index.html       # Main HTML file
├── style.css        # Stylesheet for the game
├── game.js          # JavaScript file for game logic
├── README.md        # Documentation for the project
└── assets/          # Directory for images or sound files
```

## Customization

- **Game Difficulty**: Modify the game speed by adjusting the `setTimeout` value in the `gameLoop()` function inside `game.js`.
- **Canvas Size**: Change the canvas width and height in the `index.html` file.
- **Sound Effects**: Replace the `bop.mp3` and `bip-bop.mp3` files with your own sound files.

## Technologies Used

- **HTML5 Canvas**: For rendering the game graphics.
- **CSS3**: For styling the game interface.
- **JavaScript**: For game logic and interactivity.

## Contributions

Contributions are welcome! Feel free to submit a pull request or open an issue for improvements or bug fixes.

## License

This project is licensed under the MIT License. See the LICENSE file for details.

## Acknowledgments

- Inspired by the classic Snake Game.
- Thanks to everyone who provided feedback and suggestions!
