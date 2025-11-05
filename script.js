const ROWS = 16;
const COLS = 30;
const MINES = 99;

let boardArray = [];
let isGameOver = false;
let isFirstClick = true;
let cellsOpened = 0;
let timerInterval = null;
let seconds = 0;

const boardElement = document.getElementById('board');
const minesCountElement = document.getElementById('mines-count');
const timerElement = document.getElementById('timer');
const messageElement = document.getElementById('game-message');
const resetButton = document.getElementById('reset-button');

const winModal = document.getElementById('win-modal');
const finalTimeSpan = document.getElementById('final-time');
const modalPlayAgainButton = document.getElementById('modal-play-again');
const modalChangeLevelButton = document.getElementById('modal-change-level');


boardElement.style.gridTemplateColumns = `repeat(${COLS}, var(--cell-size))`;


function initGame() {
    boardArray = [];
    boardElement.innerHTML = '';
    isGameOver = false;
    isFirstClick = true;
    cellsOpened = 0;
    minesCountElement.textContent = MINES;
    messageElement.textContent = '';
    
    // Reset và bắt đầu đếm giờ
    clearInterval(timerInterval);
    seconds = 0;
    timerElement.textContent = seconds;
    winModal.style.display = 'none'; // Đảm bảo Modal ẩn

    // Tạo mảng bàn cờ rỗng
    for (let r = 0; r < ROWS; r++) {
        boardArray[r] = [];
        for (let c = 0; c < COLS; c++) {
            boardArray[r][c] = {
                isMine: false,
                neighborMines: 0,
                isOpened: false,
                isFlagged: false,
                element: null 
            };
        }
    }
    
    createBoardElements();
    adjustBoardDisplay(); 
}

function createBoardElements() {
    for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
            const cell = document.createElement('div');
            cell.classList.add('cell', 'unopened');
            cell.dataset.row = r;
            cell.dataset.col = c;
            
            cell.addEventListener('click', () => handleCellClick(r, c));
            cell.addEventListener('contextmenu', (e) => {
                e.preventDefault(); 
                handleFlag(r, c);
            });

            boardArray[r][c].element = cell;
            boardElement.appendChild(cell);
        }
    }
}

function placeMines(firstRow, firstCol) {
    let minesPlaced = 0;
    while (minesPlaced < MINES) {
        const r = Math.floor(Math.random() * ROWS);
        const c = Math.floor(Math.random() * COLS);

        if (!boardArray[r][c].isMine && 
            Math.abs(r - firstRow) > 1 && 
            Math.abs(c - firstCol) > 1) {
             
             boardArray[r][c].isMine = true;
             minesPlaced++;
        }
    }
    calculateNeighborMines();
}

function calculateNeighborMines() {
    for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
            if (boardArray[r][c].isMine) continue;
            
            let count = 0;
            getNeighbors(r, c).forEach(([nr, nc]) => {
                if (boardArray[nr][nc].isMine) {
                    count++;
                }
            });
            boardArray[r][c].neighborMines = count;
        }
    }
}

function getNeighbors(r, c) {
    const neighbors = [];
    for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
            if (dr === 0 && dc === 0) continue;
            const nr = r + dr;
            const nc = c + dc;

            if (nr >= 0 && nr < ROWS && nc >= 0 && nc < COLS) {
                neighbors.push([nr, nc]);
            }
        }
    }
    return neighbors;
}


function handleCellClick(r, c) {
    if (isGameOver || boardArray[r][c].isFlagged || boardArray[r][c].isOpened) return;

    if (isFirstClick) {
        placeMines(r, c);
        startTimer();
        isFirstClick = false;
    }
    
    openCell(r, c);
    checkWin();
}

function handleFlag(r, c) {
    if (isGameOver || boardArray[r][c].isOpened) return;

    const cell = boardArray[r][c];
    cell.isFlagged = !cell.isFlagged;
    
    if (cell.isFlagged) {
        cell.element.classList.add('flag');
        cell.element.textContent = '🚩';
    } else {
        cell.element.classList.remove('flag');
        cell.element.textContent = '';
    }
    
    updateMinesCount();
}

function openCell(r, c) {
    const cell = boardArray[r][c];
    if (cell.isOpened || cell.isFlagged) return;

    cell.isOpened = true;
    cell.element.classList.remove('unopened');
    cell.element.classList.add('opened');
    cell.element.textContent = '';
    cellsOpened++;

    if (cell.isMine) {
        cell.element.classList.add('mine');
        cell.element.textContent = '💥';
        gameOver(false); 
        return;
    }

    const count = cell.neighborMines;
    if (count > 0) {
        cell.element.textContent = count;
        cell.element.classList.add(`n${count}`);
    } else {
        getNeighbors(r, c).forEach(([nr, nc]) => {
            openCell(nr, nc);
        });
    }
}


function updateMinesCount() {
    const flags = boardArray.flat().filter(cell => cell.isFlagged).length;
    minesCountElement.textContent = MINES - flags;
}

function startTimer() {
    timerInterval = setInterval(() => {
        seconds++;
        timerElement.textContent = seconds;
    }, 1000);
}

function checkWin() {
    const totalSafeCells = ROWS * COLS - MINES;
    if (cellsOpened === totalSafeCells) {
        gameOver(true); 
    }
}

function gameOver(isWin) {
    isGameOver = true;
    clearInterval(timerInterval);
    
    boardArray.flat().forEach(cell => {
        cell.element.style.pointerEvents = 'none';
    });

    if (isWin) {
        messageElement.textContent = ''; 
        finalTimeSpan.textContent = seconds;
        winModal.style.display = 'block'; 
        
        boardArray.flat().filter(cell => cell.isMine && !cell.isFlagged).forEach(cell => {
            cell.element.classList.add('flag');
            cell.element.textContent = '🚩';
        });
        
    } else {
        messageElement.textContent = 'GAME OVER! 💥 Bạn đã dẫm phải mìn. 😔';
        messageElement.style.color = 'red';
        
        boardArray.flat().filter(cell => cell.isMine).forEach(cell => {
             cell.element.classList.add('mine');
             cell.element.textContent = '💥';
        });
    }
}

function adjustBoardDisplay() {
    const cellSize = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--cell-size'));
    const boardWidth = COLS * cellSize + 2 * 5;
    boardElement.style.width = `${boardWidth}px`;
}


resetButton.addEventListener('click', initGame);
modalPlayAgainButton.addEventListener('click', () => {
    winModal.style.display = 'none'; 
    initGame();
});
modalChangeLevelButton.addEventListener('click', () => {
    alert('Để thay đổi độ khó, hãy chỉnh sửa 3 hằng số ROWS, COLS, MINES ở đầu file script.js!');
});

initGame();

window.addEventListener('resize', initGame);

//uocgicoaylacuatoi =)))
