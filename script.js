const X_CLASS = 'x';
const CIRCLE_CLASS = 'circle';
const WINNING_COMBINATIONS = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6]
];
const cellElements = document.querySelectorAll('[data-cell]');
const board = document.getElementById('board');
const winningMessageElement = document.getElementById('winningMessage');
const restartButton = document.getElementById('restartButton');
const previousButton = document.getElementById('previousButton');
const nextButton = document.getElementById('nextButton');
const xButton = document.getElementById('xButton');
const oButton = document.getElementById('oButton');
const selectPlayerElement = document.getElementById('selectPlayer');
const winningMessageTextElement = document.querySelector('[data-winning-message-text]');
const moveHistoryElement = document.getElementById('moveHistory');
let circleTurn;
let moveHistory = [];
let currentMoveIndex = -1;

selectPlayerElement.style.display = '';
restartButton.style.display = "none";
previousButton.style.display = "none";
nextButton.style.display = "none";
board.style.display = "none";
xButton.addEventListener('click', () => {
  playerSelected();
  startGame('x'); 
});
oButton.addEventListener('click', () => {
  playerSelected(); 
  startGame('circle')
});
restartButton.addEventListener('click', restartGame);
previousButton.addEventListener('click', showPreviousMove);
nextButton.addEventListener('click', showNextMove);

function playerSelected() {
  selectPlayerElement.style.display = "none";
  board.style.display = '';
  restartButton.style.display = '';
  previousButton.style.display = '';
  nextButton.style.display = '';
}

function startGame(playerClass) {
  circleTurn = playerClass === 'circle';
  moveHistory = [];
  currentMoveIndex = -1;
  cellElements.forEach(cell => {
    cell.classList.remove(X_CLASS);
    cell.classList.remove(CIRCLE_CLASS);
    cell.removeEventListener('click', handleClick);
    cell.addEventListener('click', handleClick);
  });
  setBoardHoverClass();
  winningMessageElement.classList.remove('show');
}

function restartGame() {
  winningMessageTextElement.innerText = ''; 
  selectPlayerElement.style.display = '';
  restartButton.style.display = "none";
  previousButton.style.display = "none";
  nextButton.style.display = "none";
  board.style.display = "none";
  startGame(null); 
}

function handleClick(event) {
  const cell = event.target;
  const currentClass = circleTurn ? CIRCLE_CLASS : X_CLASS;
  placeMark(cell, currentClass);
  if (checkWin(currentClass)) {
    endGame(false);
  } else if (isDraw()) {
    endGame(true);
  } else {
    swapTurns();
    setBoardHoverClass();
  }
}

function disableCells() {
  cellElements.forEach(cell => {
    cell.removeEventListener('click', handleClick);
  });
}

function removeHover() {
  board.classList.remove(X_CLASS);
  board.classList.remove(CIRCLE_CLASS);
}

function triggerConfetti() {
  confetti({
    particleCount: 100, //This option sets the number of confetti particles to be displayed.
    spread: 70, //This option sets the spread angle of the confetti particles. A higher spread value means the particles will be more widely dispersed.
    origin: { y: 0.6 } //This option sets the origin point from where the confetti will be launched. The y value of 0.6 means the confetti will be launched from a point 60% down the height of the screen (a bit above the center of the screen). The origin can also include an x value, but it is omitted here, defaulting to the center horizontally.
  });
}

function endGame(draw) {
  if (draw) {
    winningMessageTextElement.innerText = "It's a Tie!";
    winningMessageTextElement.style.color = "white";
  } else {
    winningMessageTextElement.innerText = `${circleTurn ? "O" : "X"} Wins!`;
    winningMessageTextElement.style.color = `${circleTurn ? "#ff00ff" : "#39ff14"}`;
    triggerConfetti(); 
  }
  disableCells(); // Disable cells when the game ends
  removeHover(); 
  winningMessageElement.classList.add('show');
}

function isDraw() {
  return [...cellElements].every(cell => {
    return cell.classList.contains(X_CLASS) || 
           cell.classList.contains(CIRCLE_CLASS);
  });
}

function placeMark(cell, currentClass) {
  // Check if the cell already has a mark
  if (cell.classList.contains(X_CLASS) || cell.classList.contains(CIRCLE_CLASS)) {
    return; // Exit the function if the cell is already marked
  }
  // Add the mark to the cell
  cell.classList.add(currentClass);
  // Add the move to the move history
  moveHistory.push({ cellIndex: [...cellElements].indexOf(cell), player: currentClass });
  // Increment the current move index
  currentMoveIndex++;
}


function swapTurns() {
  circleTurn = !circleTurn;
}

function setBoardHoverClass() {
  board.classList.remove(X_CLASS);
  board.classList.remove(CIRCLE_CLASS);
  if (circleTurn) {
    board.classList.add(CIRCLE_CLASS);
  } else {
    board.classList.add(X_CLASS);
  }
}

function checkWin(currentClass) {
  return WINNING_COMBINATIONS.some(combination => {
    return combination.every(index => {
      return cellElements[index].classList.contains(currentClass);
    });
  });
}

function showPreviousMove() {
  if (currentMoveIndex >= 0) {
    const lastMove = moveHistory[currentMoveIndex];
    const lastPlayer = lastMove.player;
    currentMoveIndex--;
    updateBoard();

    // Restore the player's turn to the player who made the last move
    circleTurn = lastPlayer === CIRCLE_CLASS;
    setBoardHoverClass(); // Update the board hover class accordingly

    selectPlayerElement.style.display = "none";
  }
}

function showNextMove() {
  if (currentMoveIndex < moveHistory.length - 1) {
    currentMoveIndex++;
    updateBoard();
  }
}

function updateBoard() {
  cellElements.forEach(cell => {
    cell.classList.remove(X_CLASS);
    cell.classList.remove(CIRCLE_CLASS);
  });

  for (let i = 0; i <= currentMoveIndex; i++) {
    const move = moveHistory[i];
    const cell = cellElements[move.cellIndex];
    cell.classList.add(move.player);
  }
}
