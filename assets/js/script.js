const squares = document.querySelectorAll(".square");
const xBtn = document.querySelector("#x");
const oBtn = document.querySelector("#o");
const rstBtn = document.querySelector("#rstBtn");
const modeChoice = document.querySelector("#mode");
const levelChoice = document.querySelector("#levels");
const winnerText = document.querySelector("#winner");
const xText = document.querySelector("#x-text");
const oText = document.querySelector("#o-text");
const drawText = document.querySelector("#draw");
const content = document.querySelector("#content");
const overlay = document.querySelector(".overlay");
//hello
let currentSymbol = "x";
let aiSymbol = "o";
let mode = "human";
let turn = "human";
let gameBoard = [0, 1, 2, 3, 4, 5, 6, 7, 8];
let theMove;
let aiPrecision = 0;
modeChoice.addEventListener("change", () => {
    mode = modeChoice.value;
    if (mode === "ai") levelChoice.classList.remove("not-mode");
    else levelChoice.classList.add("not-mode");

    changeSymbol();
});
levelChoice.addEventListener("change", () => {
    let level = levelChoice.value;
    restart();
    if (level == "easy") aiPrecision = 0;
    else if (level == "medium") aiPrecision = 50;
    else if (level == "hard") aiPrecision = 75;
    else if (level == "unbeatable") aiPrecision = 100;
});

function restart() {
    gameBoard = [0, 1, 2, 3, 4, 5, 6, 7, 8];
    squares.forEach((square) => {
        const paragraph = square.querySelector("p");
        paragraph.textContent = "";
        square.disabled = false;
    });
    winnerText.classList.add("hide");
    xText.classList.add("hide");
    oText.classList.add("hide");
    drawText.classList.add("hide");
    xBtn.disabled = false;
    oBtn.disabled = false;
    turn = "human";
}
function changeSymbol() {
    if (currentSymbol === "x") {
        currentSymbol = "o";
        xBtn.classList.remove("active");
        xBtn.classList.add("inactive");
        oBtn.classList.remove("inactive");
        oBtn.classList.add("active");
        if (mode === "ai") {
            restart();
            xBtn.disabled = false;
            oBtn.disabled = true;
            aiSymbol = "x";
        } else {
            xBtn.disabled = true;
            oBtn.disabled = true;
        }
    } else {
        currentSymbol = "x";
        oBtn.classList.remove("active");
        oBtn.classList.add("inactive");
        xBtn.classList.remove("inactive");
        xBtn.classList.add("active");
        if (mode === "ai") {
            restart();
            oBtn.disabled = false;
            xBtn.disabled = true;
            aiSymbol = "o";
        } else {
            xBtn.disabled = true;
            oBtn.disabled = true;
        }
    }
}
xBtn.addEventListener("click", changeSymbol);
oBtn.addEventListener("click", changeSymbol);
rstBtn.addEventListener("click", () => {
    restart();
});
function move(square, index, symbol) {
    square.disabled = true;
    const paragraph = square.querySelector("p");
    paragraph.textContent = symbol.toUpperCase();
    gameBoard[index] = symbol;
    turn = turn === "ai" ? "human" : "ai";
    if (checkWinner(gameBoard, symbol) || checkDraw()) {
        if (checkDraw()) {
            drawText.classList.remove("hide");
        } else {
            winnerText.classList.remove("hide");
            if (checkWinner(gameBoard, "x")) {
                xText.classList.remove("hide");
            } else {
                oText.classList.remove("hide");
            }
        }
        overlay.classList.add("activee");
        overlay.addEventListener("click", function (e) {
            overlay.classList.remove("activee");
            restart();
        });
    } else if (mode === "human") {
        changeSymbol();
    } else if (mode === "ai") {
        if (turn === "ai") {
            //random number between 0 and 100
            const value = Math.floor(Math.random() * (100 + 1));

            // if the random number is smaller then the ais threshold, it findds the best move
            if (value <= aiPrecision) {
                theMove = minimax(gameBoard, aiSymbol).index;
                move(squares[theMove], theMove, aiSymbol);
            } else {
                const emptyFieldsIdx = emptyIndexes(gameBoard);
                let notBestMove = Math.floor(
                    Math.random() * emptyFieldsIdx.length
                );
                const choice = emptyFieldsIdx[notBestMove];
                move(squares[choice], choice, aiSymbol);
            }
        } else {
            theMove = minimax(gameBoard, currentSymbol);
            console.log(theMove);
        }
    }
}
squares.forEach((square, index) => {
    square.addEventListener("click", () => move(square, index, currentSymbol));
});

function checkDraw() {
    if (gameBoard.every((filed) => filed == "x" || filed == "o")) return true;
    return false;
}

function checkWinner(board, player) {
    if (
        (board[0] == player && board[1] == player && board[2] == player) ||
        (board[3] == player && board[4] == player && board[5] == player) ||
        (board[6] == player && board[7] == player && board[8] == player) ||
        (board[0] == player && board[3] == player && board[6] == player) ||
        (board[1] == player && board[4] == player && board[7] == player) ||
        (board[2] == player && board[5] == player && board[8] == player) ||
        (board[0] == player && board[4] == player && board[8] == player) ||
        (board[2] == player && board[4] == player && board[6] == player)
    )
        return true;

    return false;
}

//ai

function emptyIndexes(board) {
    return board.filter((s) => s != "o" && s != "x");
}

function minimax(newBoard, player) {
    let availSpots = emptyIndexes(newBoard);
    if (checkWinner(newBoard, currentSymbol)) {
        return { score: -10 };
    } else if (checkWinner(newBoard, aiSymbol)) {
        return { score: 10 };
    } else if (availSpots.length === 0) {
        return { score: 0 };
    }

    // an array to collect all the objects
    let moves = [];

    // loop through available spots
    for (let i = 0; i < availSpots.length; i++) {
        //create an object for each and store the index of that spot
        let move = {};
        move.index = newBoard[availSpots[i]];

        // set the empty spot to the current player
        newBoard[availSpots[i]] = player;

        /*collect the score resulted from calling minimax 
        on the opponent of the current player*/
        if (player == aiSymbol) {
            let result = minimax(newBoard, currentSymbol);
            move.score = result.score;
        } else {
            let result = minimax(newBoard, aiSymbol);
            move.score = result.score;
        }

        // reset the spot to empty
        newBoard[availSpots[i]] = move.index;

        // push the object to the array
        moves.push(move);
    }
    // if it is the computer's turn loop over the moves and choose the move with the highest score
    let bestMove;
    if (player === aiSymbol) {
        let bestScore = -10000;
        for (let i = 0; i < moves.length; i++) {
            if (moves[i].score > bestScore) {
                bestScore = moves[i].score;
                bestMove = i;
            }
        }
    } else {
        // else loop over the moves and choose the move with the lowest score
        let bestScore = 10000;
        for (let i = 0; i < moves.length; i++) {
            if (moves[i].score < bestScore) {
                bestScore = moves[i].score;
                bestMove = i;
            }
        }
    }

    // return the chosen move (object) from the moves array
    return moves[bestMove];
}

const chooseField = () => {
    return choice;
};
