const squares = document.querySelectorAll(".square");
const xBtn = document.querySelector("#x");
const oBtn = document.querySelector("#o");
const rstBtn = document.querySelector("#rstBtn");
const modeChoice = document.querySelector("#mode");
const winnerText = document.querySelector("#winner");
const xText = document.querySelector("#x-text");
const oText = document.querySelector("#o-text");
const drawText = document.querySelector("#draw");
const content = document.querySelector("#content");
const overlay = document.querySelector(".overlay");

let currentSymbol = "x";
let mode = "human";
let gameBoard = ["", "", "", "", "", "", "", "", ""];
modeChoice.addEventListener("change", () => {
    mode = modeChoice.value;
    changeSymbol();
});
function restart() {
    gameBoard = ["", "", "", "", "", "", "", "", ""];
    squares.forEach((square) => {
        const paragraph = square.querySelector("p");
        paragraph.textContent = "";
        square.disabled = false;
    });
    winnerText.classList.add("hide");
    xText.classList.add("hide");
    oText.classList.add("hide");
    drawText.classList.add("hide");
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
squares.forEach((square, index) => {
    square.addEventListener("click", () => {
        square.disabled = true;
        const paragraph = square.querySelector("p");
        paragraph.textContent = currentSymbol.toUpperCase();
        gameBoard[index] = currentSymbol;
        if (checkWinner() || checkDraw()) {
            if (checkDraw()) {
                drawText.classList.remove("hide");
            } else {
                winnerText.classList.remove("hide");
                if (currentSymbol === "x") {
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
        }
    });
});
function checkDraw() {
    if (gameBoard.every((filed) => filed == "x" || filed == "o")) return true;

    // for (item in gameBoard) if (item == "") return false;

    return false;
}

function checkWinner() {
    for (let i = 0; i < 3; i++) {
        let row = [];
        for (let j = i * 3; j < i * 3 + 3; j++) {
            row.push(gameBoard[j]);
        }

        if (
            row.every((field) => field == "x") ||
            row.every((field) => field == "o")
        ) {
            return true;
        }
    }
    for (let i = 0; i < 3; i++) {
        let column = [];
        for (let j = 0; j < 3; j++) {
            column.push(gameBoard[i + 3 * j]);
        }

        if (
            column.every((field) => field == "x") ||
            column.every((field) => field == "o")
        ) {
            return true;
        }
    }
    diagonal1 = [gameBoard[0], gameBoard[4], gameBoard[8]];
    diagonal2 = [gameBoard[2], gameBoard[4], gameBoard[6]];
    if (
        diagonal1.every((field) => field === "x") ||
        diagonal1.every((field) => field === "o")
    )
        return true;
    else if (
        diagonal2.every((field) => field === "x") ||
        diagonal2.every((field) => field === "o")
    )
        return true;
    return false;
}
