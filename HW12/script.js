const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

class Square {
  constructor(x, y, w, h, color) {
    this.x = x;
    this.y = y;
    this.width = w;
    this.height = h;
    this.color = color;
    this.speedX = 0;
    this.speedY = 0;
  }

  draw() {
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }

  move() {
    this.x += this.speedX;
    this.y += this.speedY;

    // keep inside canvas
    if (this.x < 0) this.x = 0;
    if (this.y < 0) this.y = 0;
    if (this.x + this.width > canvas.width) this.x = canvas.width - this.width;
    if (this.y + this.height > canvas.height) this.y = canvas.height - this.height;
  }
}

// objects
let player = new Square(100, 100, 50, 50, "blue");
let enemy = new Square(300, 200, 50, 50, "red");

enemy.speedX = 2;
enemy.speedY = 2;

let bgColor = "lightblue";

// keyboard input
let keys = {};
document.addEventListener("keydown", (e) => keys[e.key] = true);
document.addEventListener("keyup", (e) => keys[e.key] = false);

function handleInput() {
  player.speedX = 0;
  player.speedY = 0;

  if (keys["ArrowUp"]) player.speedY = -4;
  if (keys["ArrowDown"]) player.speedY = 4;
  if (keys["ArrowLeft"]) player.speedX = -4;
  if (keys["ArrowRight"]) player.speedX = 4;
}

function moveEnemy() {
  enemy.move();

  // bounce
  if (enemy.x <= 0 || enemy.x + enemy.width >= canvas.width) {
    enemy.speedX *= -1;
  }
  if (enemy.y <= 0 || enemy.y + enemy.height >= canvas.height) {
    enemy.speedY *= -1;
  }
}

function hasCollided(a, b) {
  return (
    a.x < b.x + b.width &&
    a.x + a.width > b.x &&
    a.y < b.y + b.height &&
    a.y + a.height > b.y
  );
}

function handleCollision() {
  if (hasCollided(player, enemy)) {
    bgColor = bgColor === "lightblue" ? "yellow" : "lightblue";

    player.width = 70;
    player.height = 70;
    enemy.width = 70;
    enemy.height = 70;

    setTimeout(() => {
      player.width = 50;
      player.height = 50;
      enemy.width = 50;
      enemy.height = 50;
    }, 200);
  }
}

function update() {
  ctx.fillStyle = bgColor;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  handleInput();
  player.move();
  moveEnemy();
  handleCollision();

  player.draw();
  enemy.draw();
}

setInterval(update, 1000/60);

function playMusic() {
  document.getElementById("bgMusic").play();
}