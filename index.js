const grid = document.querySelector(".grid");
const scoreDisplay = document.querySelector(".score");
const blockWidth = 100;
const blockHeight = 20;
const boardWidth = 560;
const boardHeight = 300;
const ballDiameter = 20;
let xDirection = 2;
let yDirection = 2;
let timerId;
let score = 0;

// Start position for the user and the ball

const userStart = [230, 10];
let userCurrentPosition = userStart;

const ballStart = [270, 40];
let ballCurrentPosition = ballStart;

// Class component for creating the blocks
// It uses the x and y axis to calculate and store the 4 edges into state

class Block {
  constructor(xAxis, yAxis) {
    this.bottomLeft = [xAxis, yAxis];
    this.bottomRight = [xAxis + blockWidth, yAxis];
    this.topLeft = [xAxis, yAxis + blockHeight];
    this.topRight = [xAxis + blockWidth, yAxis + blockHeight];
  }
}

const blocks = [
  new Block(10, 270),
  new Block(120, 270),
  new Block(230, 270),
  new Block(340, 270),
  new Block(450, 270),
  new Block(10, 240),
  new Block(120, 240),
  new Block(230, 240),
  new Block(340, 240),
  new Block(450, 240),
  new Block(10, 210),
  new Block(120, 210),
  new Block(230, 210),
  new Block(340, 210),
  new Block(450, 210),
];

// Creates a block node and add it to the grid

function addBlocks() {
  for (let block of blocks) {
    const blockNode = document.createElement("div");
    blockNode.classList.add(["block"]);
    blockNode.style.left = `${block.bottomLeft[0]}px`;
    blockNode.style.bottom = `${block.bottomLeft[1]}px`;
    grid.appendChild(blockNode);
  }
}

addBlocks();

// Creates and add the user on the page

const user = document.createElement("div");
user.classList.add("user");
drawUser();
grid.appendChild(user);

function drawUser() {
  user.style.left = `${userCurrentPosition[0]}px`;
  user.style.bottom = `${userCurrentPosition[1]}px`;
}

// Listens to the keyboard event ans moves the user left or right

function moveUser(e) {
  switch (e.key) {
    case "ArrowLeft":
      if (userCurrentPosition[0] > 0) {
        userCurrentPosition[0] -= 10;
        drawUser();
      }
      break;
    case "ArrowRight":
      if (userCurrentPosition[0] < boardWidth - blockWidth) {
        userCurrentPosition[0] += 10;
        drawUser();
      }
      break;
  }
}

document.addEventListener("keydown", moveUser);

// Creates and draws the ball

const ball = document.createElement("div");
ball.classList.add("ball");
drawBall();
grid.appendChild(ball);

function drawBall() {
  ball.style.left = `${ballCurrentPosition[0]}px`;
  ball.style.bottom = `${ballCurrentPosition[1]}px`;
}

// Move the ball automatically every 20ms and check for collitions

function moveBall() {
  ballCurrentPosition[0] += xDirection;
  ballCurrentPosition[1] += yDirection;
  drawBall();
  checkForCollition();
}

timerId = setInterval(moveBall, 20);

function checkForCollition() {
  for (let i = 0; i < blocks.length; i++) {
    if (
      ballCurrentPosition[0] > blocks[i].bottomLeft[0] &&
      ballCurrentPosition[0] < blocks[i].bottomRight[0] &&
      ballCurrentPosition[1] + ballDiameter > blocks[i].bottomLeft[1] &&
      ballCurrentPosition[1] < blocks[i].topLeft[1]
    ) {
      const allBlocks = Array.from(document.querySelectorAll(".block"));
      allBlocks[i].classList.remove("block");
      blocks.splice(i, 1);
      changeDirection();
      score++;
      scoreDisplay.innerHTML = score;

      // Check for the win

      if (blocks.length === 0) {
        scoreDisplay.innerHTML = "You Win!";
        clearInterval(timerId);
        document.removeEventListener("keydown", moveUser);
      }
    }
  }

  // Check for wall collition

  if (
    ballCurrentPosition[0] >= boardWidth - ballDiameter ||
    ballCurrentPosition[1] >= boardHeight - ballDiameter ||
    ballCurrentPosition[0] <= 0
  ) {
    changeDirection();
  }

  // Check for user collition

  if (
    ballCurrentPosition[0] > userCurrentPosition[0] &&
    ballCurrentPosition[0] < userCurrentPosition[0] + blockWidth &&
    ballCurrentPosition[1] > userCurrentPosition[1] &&
    ballCurrentPosition[1] < userCurrentPosition[1] + blockHeight
  ) {
    changeDirection();
  }

  // Check for game over

  if (ballCurrentPosition[1] <= 0) {
    clearInterval(timerId);
    scoreDisplay.innerHTML = "Game Over";
    document.removeEventListener("keydown", moveUser);
  }
}

// Takes care of the ball direction change

function changeDirection() {
  if (xDirection === 2 && yDirection === 2) {
    yDirection = -2;
    return;
  }
  if (xDirection === 2 && yDirection === -2) {
    xDirection = -2;
    return;
  }
  if (xDirection === -2 && yDirection === -2) {
    yDirection = 2;
    return;
  }
  if (xDirection === -2 && yDirection === 2) {
    xDirection = 2;
    return;
  }
}
