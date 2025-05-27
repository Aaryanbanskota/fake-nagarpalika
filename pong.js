const canvas = document.getElementById("pongCanvas");
const ctx = canvas.getContext("2d");

// Resize canvas for responsiveness
canvas.width = window.innerWidth * 0.8;
canvas.height = window.innerHeight * 0.6;

const paddleWidth = 10, paddleHeight = 100;
const ballSize = 15;
let playerY = (canvas.height - paddleHeight) / 2, computerY = (canvas.height - paddleHeight) / 2;
let playerYSpeed = 0, computerYSpeed = 4;
let ballX = canvas.width / 2, ballY = canvas.height / 2, ballSpeedX = 4, ballSpeedY = 4;
let playerScore = 0, computerScore = 0;

// Draw the paddles and ball
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // Player Paddle
    ctx.fillStyle = 'white';
    ctx.fillRect(20, playerY, paddleWidth, paddleHeight);
    // Computer Paddle
    ctx.fillRect(canvas.width - 30, computerY, paddleWidth, paddleHeight);
    // Ball
    ctx.beginPath();
    ctx.arc(ballX, ballY, ballSize, 0, Math.PI * 2);
    ctx.fill();
    // Scoreboard
    document.getElementById("playerScore").textContent = `Player: ${playerScore}`;
    document.getElementById("computerScore").textContent = `Computer: ${computerScore}`;
}

// Move paddles and ball
function move() {
    ballX += ballSpeedX;
    ballY += ballSpeedY;
    
    // Ball bounce on top and bottom
    if (ballY <= 0 || ballY >= canvas.height) ballSpeedY = -ballSpeedY;

    // Ball bounce on paddles
    if (ballX <= 30 && ballY >= playerY && ballY <= playerY + paddleHeight || 
        ballX >= canvas.width - 30 - ballSize && ballY >= computerY && ballY <= computerY + paddleHeight) {
        ballSpeedX = -ballSpeedX;
    }

    // Ball out of bounds
    if (ballX <= 0) {
        computerScore++;
        resetBall();
    } else if (ballX >= canvas.width) {
        playerScore++;
        resetBall();
    }

    // Move computer paddle
    if (computerY + paddleHeight / 2 < ballY) {
        computerY += computerYSpeed;
    } else {
        computerY -= computerYSpeed;
    }

    // Move player paddle
    playerY += playerYSpeed;
    if (playerY < 0) playerY = 0;
    if (playerY + paddleHeight > canvas.height) playerY = canvas.height - paddleHeight;
}

// Reset the ball to the center
function resetBall() {
    ballX = canvas.width / 2;
    ballY = canvas.height / 2;
    ballSpeedX = (Math.random() < 0.5 ? 1 : -1) * 4;
    ballSpeedY = 4;
}

// Player controls
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowUp') playerYSpeed = -8;
    if (e.key === 'ArrowDown') playerYSpeed = 8;
});

document.addEventListener('keyup', (e) => {
    if (e.key === 'ArrowUp' || e.key === 'ArrowDown') playerYSpeed = 0;
});

// Game loop
function gameLoop() {
    draw();
    move();
    requestAnimationFrame(gameLoop);
}

gameLoop();
