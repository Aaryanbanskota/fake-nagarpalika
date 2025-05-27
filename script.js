// Helper to draw rounded rectangles if not supported
CanvasRenderingContext2D.prototype.roundRect = function (x, y, w, h, r) {
    if (w < 2 * r) r = w / 2;
    if (h < 2 * r) r = h / 2;
    this.beginPath();
    this.moveTo(x + r, y);
    this.arcTo(x + w, y, x + w, y + h, r);
    this.arcTo(x + w, y + h, x, y + h, r);
    this.arcTo(x, y + h, x, y, r);
    this.arcTo(x, y, x + w, y, r);
    this.closePath();
};

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const scoreDisplay = document.getElementById("score");
const startGameBtn = document.getElementById("startGameBtn");
const quitBtn = document.getElementById("quitBtn");
const backToMenuBtn = document.getElementById("backToMenuBtn");
const menu = document.getElementById("menu");
const gameScreen = document.getElementById("gameScreen");
const gameHubBtn = document.getElementById("gameHubBtn");

const scale = 10;
const rows = canvas.height / scale;
const cols = canvas.width / scale;

let snake;
let food;
let game;
let score = 0;

function startGame() {
    score = 0;
    updateScore();
    resetSnakeAndFood();

    game = setInterval(() => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        snake.move();
        snake.draw();
        food.draw();

        if (snake.eat(food)) {
            score++;
            updateScore();
            food = new Food();
        }

        if (snake.checkCollision()) {
            clearInterval(game);
            alert("Game Over! Final Score: " + score);
            showMenu(); // Go back to menu after game over
        }
    }, 100);
}

function updateScore() {
    scoreDisplay.textContent = "Score: " + score;
}

function resetSnakeAndFood() {
    snake = new Snake();
    food = new Food();
}

function Snake() {
    this.body = [
        { x: 10, y: 10 },
        { x: 9, y: 10 },
        { x: 8, y: 10 },
        { x: 7, y: 10 },
        { x: 6, y: 10 }
    ];
    this.dir = { x: 1, y: 0 };

    this.draw = function () {
        for (let i = 0; i < this.body.length; i++) {
            const part = this.body[i];

            if (i === 0) {
                ctx.fillStyle = "#00ff88";
                ctx.roundRect(
                    part.x * scale,
                    part.y * scale,
                    scale * 0.8,
                    scale * 0.8,
                    scale / 3
                );
                ctx.fill();

                ctx.fillStyle = "#000000";
                ctx.beginPath();
                ctx.arc(
                    part.x * scale + scale * 0.3, 
                    part.y * scale + scale * 0.3, 
                    scale * 0.15, 
                    0, 
                    2 * Math.PI
                );
                ctx.fill();
            } else {
                ctx.fillStyle = "#00ff00";
                ctx.roundRect(
                    part.x * scale,
                    part.y * scale,
                    scale,
                    scale,
                    scale / 3
                );
                ctx.fill();
            }
        }
    };

    this.move = function () {
        const head = { x: this.body[0].x + this.dir.x, y: this.body[0].y + this.dir.y };
        this.body.unshift(head);
        this.body.pop();
    };

    this.changeDirection = function (e) {
        switch (e.keyCode) {
            case 37: if (this.dir.x !== 1) this.dir = { x: -1, y: 0 }; break;
            case 38: if (this.dir.y !== 1) this.dir = { x: 0, y: -1 }; break;
            case 39: if (this.dir.x !== -1) this.dir = { x: 1, y: 0 }; break;
            case 40: if (this.dir.y !== -1) this.dir = { x: 0, y: 1 }; break;
        }
    };

    this.eat = function (food) {
        if (this.body[0].x === food.x && this.body[0].y === food.y) {
            this.body.push({});
            return true;
        }
        return false;
    };

    this.checkCollision = function () {
        const head = this.body[0];
        if (head.x < 0 || head.y < 0 || head.x >= cols || head.y >= rows) return true;
        for (let i = 1; i < this.body.length; i++) {
            if (head.x === this.body[i].x && head.y === this.body[i].y) return true;
        }
        return false;
    };
}

function Food() {
    this.x = Math.floor(Math.random() * cols);
    this.y = Math.floor(Math.random() * rows);

    this.draw = function () {
        ctx.fillStyle = "#ffff00";
        ctx.beginPath();
        ctx.arc(
            this.x * scale + scale / 2,
            this.y * scale + scale / 2,
            scale / 2.5,
            0,
            2 * Math.PI
        );
        ctx.fill();
    };
}

document.addEventListener("keydown", e => {
    if (snake) snake.changeDirection(e);
});

// Show game menu
function showMenu() {
    menu.style.display = "block";
    gameScreen.style.display = "none";
}

// Start game when "Start Game" button is clicked
startGameBtn.addEventListener("click", () => {
    menu.style.display = "none";
    gameScreen.style.display = "block";
    startGame();
});

// Quit the game when "Quit" button is clicked
quitBtn.addEventListener("click", () => {
    window.close(); // Closes the window (not always supported)
});

// Go back to the menu from the game screen
backToMenuBtn.addEventListener("click", () => {
    showMenu();
});

// Go to Game Hub when the hover bar button is clicked
gameHubBtn.addEventListener("click", () => {
    window.location.href = "file:///C:/Users/le/OneDrive/Pictures/bro%20work/games.html";
});
