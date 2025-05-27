const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = 320;
canvas.height = 480;

const bird = {
    x: 50,
    y: 150,
    width: 20,
    height: 20,
    gravity: 0.6,
    lift: -15,
    velocity: 0
};

const pipes = [];
const pipeWidth = 60;
const pipeGap = 150;
let frame = 0;
let score = 0;
let gameSpeed = 2;  // Initial speed of the pipes

// Background configuration
const background = {
    x1: 0,
    x2: canvas.width,
    y: 0,
    speed: 1  // Speed of background scroll
};

const gameOverText = {
    text: "Game Over! Press Space to Restart",
    x: canvas.width / 2 - 130,
    y: canvas.height / 2
};

document.addEventListener("keydown", (e) => {
    if (e.key === " ") {
        if (score === 0 || bird.y === 150) {
            restartGame();
        } else {
            bird.velocity = bird.lift;
        }
    }
});

function restartGame() {
    bird.y = 150;
    bird.velocity = 0;
    pipes.length = 0;
    score = 0;
    gameSpeed = 2;
    frame = 0;
    background.x1 = 0;
    background.x2 = canvas.width;
    update();
}

function createPipe() {
    const pipeHeight = Math.floor(Math.random() * (canvas.height - pipeGap));
    pipes.push({
        x: canvas.width,
        top: pipeHeight,
        bottom: pipeHeight + pipeGap
    });
}

function drawBird() {
    bird.velocity += bird.gravity;
    bird.y += bird.velocity;
    ctx.fillStyle = "yellow";
    ctx.fillRect(bird.x, bird.y, bird.width, bird.height);
}

function drawPipes() {
    pipes.forEach((pipe, index) => {
        pipe.x -= gameSpeed;
        ctx.fillStyle = "green";
        ctx.fillRect(pipe.x, 0, pipeWidth, pipe.top);
        ctx.fillRect(pipe.x, pipe.bottom, pipeWidth, canvas.height - pipe.bottom);

        if (pipe.x + pipeWidth < 0) {
            pipes.splice(index, 1);
            score++;
            if (score % 5 === 0) {  // Every 5 pipes, increase speed
                gameSpeed += 0.5;
            }
        }

        if (
            bird.x + bird.width > pipe.x &&
            bird.x < pipe.x + pipeWidth &&
            (bird.y < pipe.top || bird.y + bird.height > pipe.bottom)
        ) {
            gameOver();
        }
    });
}

function drawBackground() {
    background.x1 -= background.speed;
    background.x2 -= background.speed;

    if (background.x1 <= -canvas.width) background.x1 = canvas.width;
    if (background.x2 <= -canvas.width) background.x2 = canvas.width;

    ctx.fillStyle = "#70c5ce"; // Background color instead of an image
    ctx.fillRect(background.x1, background.y, canvas.width, canvas.height);
    ctx.fillRect(background.x2, background.y, canvas.width, canvas.height);
}

function drawScore() {
    ctx.fillStyle = "black";
    ctx.font = "20px Arial";
    ctx.fillText("Score: " + score, 10, 30);
}

function gameOver() {
    ctx.fillStyle = "black";
    ctx.font = "30px Arial";
    ctx.fillText(gameOverText.text, gameOverText.x, gameOverText.y);
}

function update() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawBackground();
    drawBird();
    drawPipes();
    drawScore();

    if (frame % 60 === 0) {
        createPipe();
    }

    frame++;

    if (bird.y + bird.height >= canvas.height || bird.y <= 0) {
        gameOver();
    }

    if (score > 0) {
        requestAnimationFrame(update);
    }
}

update();
