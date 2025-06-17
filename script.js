const Gameboard = (function(){
  let board = Array(9).fill(null);

  return {
    getBoard: () => board,
    setMark: (index, mark) => {
      if (board[index] === null) {
        board[index] = mark;
        return true;
      }
      return false;
    },
    reset: () => {
      board.fill(null);
    },
    isFull: () => board.every(cell => cell !== null)
  };
})();


function Player(name, mark) {
  return {
    name,
    mark
  };
}


const gameController = (function(){
  let players = []; 
  let currentPlayer = 0;
  let isGameOver = false;

  function start(player1, player2) {
    players = [Player(player1, "X"), Player(player2, "O")];
    currentPlayer = 0;
    isGameOver = false;
    Gameboard.reset();
    DisplayController.render();
    DisplayController.setStatus("Let's play!");
  }

  function playTurn(index) {
    if (isGameOver) return;

    if (Gameboard.setMark(index, players[currentPlayer].mark)) {
      if (checkWin()) {
        DisplayController.setStatus(players[currentPlayer].name + " wins!");
        isGameOver = true;
        return "win";
      } 
      if (Gameboard.isFull()) {
        DisplayController.setStatus("Tie game!");
        isGameOver = true;
        return "tie";
      }
      currentPlayer = 1 - currentPlayer;
      DisplayController.setStatus(players[currentPlayer].name +"'s turn.");
      return "next";
    }
    return "invalid";
  }

  function checkWin(){
    const b = Gameboard.getBoard();
    const lines = [
      [0,1,2],
      [3,4,5],
      [6,7,8],
      [0,3,6],
      [1,4,7],
      [2,5,8],
      [0,4,8],
      [2,4,6],
    ];

    return lines.some(([a, bIdx, c]) =>
      b[a] &&
      b[a] === b[bIdx] &&
      b[bIdx] === b[c]
    );
  }

  return {
    start,
    playTurn,
    checkWin,
    getCurrentPlayer: () => players[currentPlayer],
    getPlayers: () => players,
    isGameOver: () => isGameOver
  };
})();


const DisplayController = (function(){
  const board = document.querySelector("#board");

  const status = document.querySelector("#status");

  function setStatus(text) {
    status.textContent = text;
  }

  function render(){
    board.innerHTML = '';
    const gameboard = Gameboard.getBoard();

    gameboard.forEach((mark, index) => {
      const cell = document.createElement("div");

      cell.classList.add("cell");

      cell.textContent = mark ? mark : '';
      cell.addEventListener("click", () => {
        if (gameController.playTurn(index) === "win") {
          setStatus(gameController.getCurrentPlayer().name + " wins!");
        } else if (gameController.playTurn(index) === "tie") {
          setStatus("Tie game!");
        } 
        render();
      });

      board.appendChild(cell);
    });
  }

  return {render, setStatus};

})();


document.querySelector("#start").addEventListener("click", () => {
  const player1 = document.querySelector("#player1").value.trim() ||
    "Player 1";

  const player2 = document.querySelector("#player2").value.trim() ||
    "Player 2";

  gameController.start(player1, player2);
});

DisplayController.render();
