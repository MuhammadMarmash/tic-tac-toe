const squares = document.querySelectorAll(".square");
const xBtn = document.querySelector("#x");
const oBtn = document.querySelector("#o");
const rstBtn = document.querySelector("#rstBtn");

let currentSymbol = "x";
function restart() {
    squares.forEach((square) => {
        const paragraph = square.querySelector("p");
        paragraph.classList.remove("puff-in-center");
        paragraph.textContent = "";
    });
}
function changeSymbol() {
    restart();
    if (currentSymbol === "x") {
        currentSymbol = "o";
        xBtn.classList.remove("active");
        xBtn.classList.add("inactive");
        xBtn.disabled = false;
        oBtn.classList.remove("inactive");
        oBtn.classList.add("active");
        oBtn.disabled = true;
    } else {
        currentSymbol = "x";
        oBtn.classList.remove("active");
        oBtn.classList.add("inactive");
        oBtn.disabled = false;
        xBtn.classList.remove("inactive");
        xBtn.classList.add("active");
        xBtn.disabled = true;
    }
}
xBtn.addEventListener("click", changeSymbol);
oBtn.addEventListener("click", changeSymbol);
rstBtn.addEventListener("click", () => {
    restart();
});
squares.forEach((square) => {
    square.addEventListener("click", () => {
        const paragraph = square.querySelector("p");
        paragraph.classList.add("puff-in-center");
        paragraph.textContent = currentSymbol.toUpperCase();
    });
});
