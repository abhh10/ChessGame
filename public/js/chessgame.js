const socket = io();
const chess = new Chess();
const boardElement = document.getElementById("chessboardContainer");
const roleIndicator = document.getElementById("playerRoleIndicator");

let draggedPiece = null;
let sourceSquare = null;
let playerRole = null; // 'W' or 'B'

// Handle role assignment from server
socket.on("assignRole", (role) => {
  playerRole = role;

  if (!role) {
    roleIndicator.textContent = "Spectator mode: Game is full.";
    return;
  }

  // Show role on UI
  roleIndicator.textContent = `You are playing as ${playerRole === 'W' ? 'White' : 'Black'}`;

  // Flip board for Black
  if (playerRole === 'B') {
    boardElement.style.transform = 'rotate(180deg)';
    boardElement.style.transition = '0.5s ease';
  }

  renderBoard();
});

// Receive opponent move
socket.on("move", (move) => {
  if (chess.move(move)) {
    renderBoard();
    checkGameEnd();
  } else {
    console.warn("Received invalid move from opponent:", move);
  }
});

// Render the board based on the game state
const renderBoard = () => {
  const board = chess.board();
  boardElement.innerHTML = '';

  // Optionally reverse drawing for Black (flip visually)
  const rows = playerRole === 'B' ? [...board].reverse() : board;

  rows.forEach((row, rowIndex) => {
    const actualRowIndex = playerRole === 'B' ? 7 - rowIndex : rowIndex;

    const cols = playerRole === 'B' ? [...row].reverse() : row;

    cols.forEach((square, colIndex) => {
      const actualColIndex = playerRole === 'B' ? 7 - colIndex : colIndex;

      const squareEl = document.createElement('div');
      squareEl.classList.add(
        'square',
        (actualRowIndex + actualColIndex) % 2 === 0 ? 'light' : 'dark'
      );
      squareEl.dataset.row = actualRowIndex;
      squareEl.dataset.col = actualColIndex;

      // Add piece
      if (square) {
        const pieceEl = document.createElement('div');
        pieceEl.classList.add('piece', square.color === 'w' ? 'white' : 'black');
        pieceEl.innerHTML = getPieceUnicode(square.type, square.color);

        // Flip piece upright visually if board is rotated
        pieceEl.style.transform = playerRole === 'B' ? 'rotate(180deg)' : 'none';

        const isMyPiece = playerRole === (square.color === 'w' ? 'W' : 'B');
        pieceEl.draggable = isMyPiece;

        pieceEl.addEventListener('dragstart', (e) => {
          if (pieceEl.draggable && isMyTurn()) {
            draggedPiece = pieceEl;
            sourceSquare = { row: actualRowIndex, col: actualColIndex };
            e.dataTransfer.setData('text/plain', `${actualRowIndex}-${actualColIndex}`);
          }
        });

        pieceEl.addEventListener('dragend', () => {
          draggedPiece = null;
          sourceSquare = null;
        });

        squareEl.appendChild(pieceEl);
      }

      // Drop logic
      squareEl.addEventListener('dragover', (e) => e.preventDefault());

      squareEl.addEventListener('drop', (e) => {
        e.preventDefault();

        if (
          draggedPiece &&
          sourceSquare &&
          isMyTurn() &&
          playerRole === (chess.board()[sourceSquare.row][sourceSquare.col].color === 'w' ? 'W' : 'B')
        ) {
          const targetSquare = { row: actualRowIndex, col: actualColIndex };
          const from = algebraic(sourceSquare);
          const to = algebraic(targetSquare);

          const move = { from, to, promotion: 'q' };

          if (chess.move(move)) {
            renderBoard();
            socket.emit("move", move);
            checkGameEnd();
          } else {
            console.warn("Invalid move attempt:", move);
          }

          draggedPiece = null;
          sourceSquare = null;
        }
      });

      boardElement.appendChild(squareEl);
    });
  });
};

// Get turn from Chess.js and compare to role
const isMyTurn = () => {
  const turn = chess.turn(); // 'w' or 'b'
  return (playerRole === 'W' && turn === 'w') || (playerRole === 'B' && turn === 'b');
};

// Get FEN notation-style square (e.g., e2)
const algebraic = ({ row, col }) => {
  const files = 'abcdefgh';
  const ranks = '87654321';
  return files[col] + ranks[row];
};

// Get unicode character for each piece
const getPieceUnicode = (type, color) => {
  const unicodePieces = {
    w: {
      p: '♙',
      r: '♖',
      n: '♘',
      b: '♗',
      q: '♕',
      k: '♔'
    },
    b: {
      p: '♟',
      r: '♜',
      n: '♞',
      b: '♝',
      q: '♛',
      k: '♚'
    }
  };
  return unicodePieces[color][type] || '';
};

// Game over detection
const checkGameEnd = () => {
  if (chess.in_checkmate()) {
    setTimeout(() => {
      alert("Checkmate! " + (chess.turn() === 'w' ? "Black" : "White") + " wins!");
    }, 100);
  } else if (chess.in_draw()) {
    setTimeout(() => {
      alert("Draw!");
    }, 100);
  }
};

// Initial render
renderBoard();
