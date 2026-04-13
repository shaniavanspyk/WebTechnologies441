const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let obstacles = [];
let collectibles = [];

let score = 0;
let timeLeft = 30;
let gameWon = false;
let gameOver = false;

// =====================
// CLASSES
// =====================

class Player {
  constructor(x, y, size, color) {
    this.x = x;
    this.y = y;
    this.size = size;
    this.baseColor = color;
    this.color = color;
    this.speed = 3;
  }

  draw() {
    ctx.fillStyle = this.color;

    // pulse animation
    let pulse = Math.sin(Date.now() * 0.01) * 2;
    ctx.fillRect(
      this.x - pulse,
      this.y - pulse,
      this.size + pulse * 2,
      this.size + pulse * 2
    );

    this.color = this.baseColor;
  }

  move(dx, dy) {
    let newX = this.x + dx;
    let newY = this.y + dy;

    if (newX < 0 || newX + this.size > canvas.width) return;
    if (newY < 0 || newY + this.size > canvas.height) return;

    for (let obs of obstacles) {
      if (isColliding(newX, newY, this.size, this.size, obs)) {
        return;
      }
    }

    this.x = newX;
    this.y = newY;

    // change color when moving
    this.color = "yellow";
  }
}

class Obstacle {
  constructor(x, y, width, height, color) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.color = color;
  }

  draw() {
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }
}

class Collectible {
  constructor(x, y, size, color, value) {
    this.x = x;
    this.y = y;
    this.size = size;
    this.color = color;
    this.value = value;
    this.active = true;
  }

  draw() {
    if (!this.active) return;

    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, this.size, this.size);
  }
}

// =====================
// COLLISION
// =====================

function isColliding(x, y, w, h, obj) {
  return (
    x < obj.x + obj.width &&
    x + w > obj.x &&
    y < obj.y + obj.height &&
    y + h > obj.y
  );
}

// =====================
// LOAD DATA
// =====================

async function loadGameData() {
  const obsData = await fetch("obstacles.json").then(res => res.json());
  const colData = await fetch("collectibles.json").then(res => res.json());

  obstacles = obsData.map(o => new Obstacle(o.x, o.y, o.width, o.height, o.color));
  collectibles = colData.map(c => new Collectible(c.x, c.y, c.size, c.color, c.value));
}

// =====================
// PLAYER
// =====================

const player = new Player(20, 20, 20, "cyan");

// =====================
// INPUT
// =====================

document.addEventListener("keydown", (e) => {
  if (gameWon || gameOver) return;

  if (e.key === "ArrowUp") player.move(0, -player.speed);
  if (e.key === "ArrowDown") player.move(0, player.speed);
  if (e.key === "ArrowLeft") player.move(-player.speed, 0);
  if (e.key === "ArrowRight") player.move(player.speed, 0);
});

// =====================
// TIMER
// =====================

function startTimer() {
  const timerInterval = setInterval(() => {
    if (gameWon || gameOver) {
      clearInterval(timerInterval);
      return;
    }

    timeLeft--;
    document.getElementById("timer").textContent = timeLeft;

    if (timeLeft <= 10) {
      document.getElementById("timer").style.color = "red";
    }

    if (timeLeft <= 0) {
      gameOver = true;
      clearInterval(timerInterval);
    }
  }, 1000);
}

// =====================
// UPDATE
// =====================

function update() {
  collectibles.forEach((c) => {
    if (c.active && isColliding(player.x, player.y, player.size, player.size, {
      x: c.x,
      y: c.y,
      width: c.size,
      height: c.size
    })) {
      c.active = false;
      score += c.value;
      document.getElementById("score").textContent = score;
    }
  });

  if (collectibles.every(c => !c.active)) {
    gameWon = true;
  }
}

// =====================
// DRAW
// =====================

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  player.draw();
  obstacles.forEach(o => o.draw());
  collectibles.forEach(c => c.draw());

  if (gameWon) {
    ctx.fillStyle = "white";
    ctx.font = "40px Arial";
    ctx.fillText("YOU WIN!", canvas.width / 2 - 100, canvas.height / 2);
  }

  if (gameOver) {
    ctx.fillStyle = "red";
    ctx.font = "40px Arial";
    ctx.fillText("TIME'S UP!", canvas.width / 2 - 120, canvas.height / 2);
  }
}

// =====================
// LOOP
// =====================

function gameLoop() {
  update();
  draw();
  requestAnimationFrame(gameLoop);
}

// =====================
// RESET
// =====================

function resetGame() {
  score = 0;
  timeLeft = 30;
  gameWon = false;
  gameOver = false;

  document.getElementById("score").textContent = score;
  document.getElementById("timer").textContent = timeLeft;
  document.getElementById("timer").style.color = "white";

  player.x = 20;
  player.y = 20;

  collectibles.forEach(c => c.active = true);

  startTimer();
}

document.getElementById("restartBtn").addEventListener("click", resetGame);

// =====================
// START
// =====================

loadGameData().then(() => {
  startTimer();
  gameLoop();
});