const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

let balls = [], paddle, score, isRunning, ballSpeedMultiplier, isPaused, animationFrameId;
const hitSound = document.getElementById('hitSound');
const gameOverSound = document.getElementById('gameOverSound');

function createBall() {
  return {
    x: canvas.width / 2,
    y: 100,
    radius: 10,
    dx: Math.random() < 0.5 ? 2 : -2,
    dy: 4
  };
}

function initGame() {
  balls = [createBall()];
  paddle = {
    width: 80,
    height: 12,
    x: canvas.width / 2 - 40,
    y: canvas.height - 20,
    speed: 7,
    dx: 0
  };
  score = 0;
  ballSpeedMultiplier = 1;
  isRunning = true;
  isPaused = false;
  drawScore();
}

function drawBall(ball) {
  ctx.beginPath();
  ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
  ctx.fillStyle = "#00ff55";
  ctx.shadowColor = "#00ff55";
  ctx.shadowBlur = 10;
  ctx.fill();
  ctx.closePath();
  ctx.shadowBlur = 0;
}

function drawPaddle() {
  ctx.beginPath();
  ctx.rect(paddle.x, paddle.y, paddle.width, paddle.height);
  ctx.fillStyle = "#00ff55";
  ctx.shadowColor = "#00ff55";
  ctx.shadowBlur = 10;
  ctx.fill();
  ctx.closePath();
  ctx.shadowBlur = 0;
}

function drawScore() {
  document.getElementById('scoreBoard').innerText = `Score: ${score}`;
}

function update() {
  if (!isRunning || isPaused) return;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  paddle.x += paddle.dx;
  if (paddle.x < 0) paddle.x = 0;
  if (paddle.x + paddle.width > canvas.width) paddle.x = canvas.width - paddle.width;

  for (let i = 0; i < balls.length; i++) {
    let ball = balls[i];

    ball.x += ball.dx * ballSpeedMultiplier;
    ball.y += ball.dy * ballSpeedMultiplier;

    if (ball.x < ball.radius || ball.x > canvas.width - ball.radius) ball.dx *= -1;
    if (ball.y < ball.radius) ball.dy *= -1;

    if (
      ball.y + ball.radius >= paddle.y &&
      ball.y + ball.radius <= paddle.y + paddle.height &&
      ball.x >= paddle.x &&
      ball.x <= paddle.x + paddle.width
    ) {
      ball.dy *= -1;
      score++;
      drawScore();
      hitSound.currentTime = 0;
      hitSound.play();

      if (score === 6 && balls.length === 1) {
        balls.push(createBall(), createBall());
      }

      if (score % 100 === 0 && ballSpeedMultiplier < 3) {
        ballSpeedMultiplier += 0.2;
      }
    }

    if (ball.y > canvas.height) {
      balls.splice(i, 1);
      i--;
    }

    drawBall(ball);
  }

  if (balls.length === 0) {
    isRunning = false;
    gameOverSound.play();
    setTimeout(() => {
      alert(`Game Over! Your score: ${score}`);
      resetGame();
    }, 100);
  }

  drawPaddle();
  if (isRunning) animationFrameId = requestAnimationFrame(update); // Re-init the animation frame loop
}

function resetGame() {
  initGame();
  update();
}

function startGame() {
  document.getElementById("startBtn").style.display = "none"; // Hide the start button after starting
  initGame();
  update();
}

function togglePause() {
  if (isPaused) {
    // Resuming the game
    isPaused = false;
    document.getElementById("pauseBtn").innerText = "Pause";
    update(); // Reinitiate the update loop
  } else {
    // Pausing the game
    isPaused = true;
    cancelAnimationFrame(animationFrameId); // Stop the game loop
    document.getElementById("pauseBtn").innerText = "Resume";
  }
}

document.addEventListener('keydown', (e) => {
  if (e.key === "ArrowRight") paddle.dx = paddle.speed;
  else if (e.key === "ArrowLeft") paddle.dx = -paddle.speed;
});

document.addEventListener('keyup', (e) => {
  if (e.key === "ArrowRight" || e.key === "ArrowLeft") paddle.dx = 0;
});

let lastTouchX = null;
canvas.addEventListener('touchstart', (e) => {
  lastTouchX = e.touches[0].clientX;
});
canvas.addEventListener('touchmove', (e) => {
  const currentX = e.touches[0].clientX;
  const delta = currentX - lastTouchX;
  paddle.x += delta * 0.6;
  lastTouchX = currentX;
  if (paddle.x < 0) paddle.x = 0;
  if (paddle.x + paddle.width > canvas.width) paddle.x = canvas.width - paddle.width;
});
