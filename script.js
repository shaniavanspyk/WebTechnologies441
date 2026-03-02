function startGame() {

    let firstName = document.getElementById("firstName").value.trim();
    let lastName = document.getElementById("lastName").value.trim();
    let age = document.getElementById("age").value.trim();

    if (firstName === "" || lastName === "" || age === "") {
        alert("Fill in all fields");
        return;
    }

    if (isNaN(age)) {
        alert("Age must be a number");
        return;
    }

    let player = {
        firstName: firstName,
        lastName: lastName,
        age: Number(age),
        attempts: 0
    };

    localStorage.setItem("playerData", JSON.stringify(player));

    window.location.href = "game.html";
}


// ===============================
// PAGE 2 — MEMORY GAME
// ===============================

let playerData = JSON.parse(localStorage.getItem("playerData"));
let attempts = 0;
let matchedPairs = 0;

let board = document.getElementById("board");
let attemptDisplay = document.getElementById("attemptDisplay");

if (board) {

    let blankImages = new Array(12).fill("images/img7.jpg");

    let actualImages = [
        "images/img1.jpg","images/img1.jpg",
        "images/img2.jpg","images/img2.jpg",
        "images/img3.jpg","images/img3.jpg",
        "images/img4.jpg","images/img4.jpg",
        "images/img5.jpg","images/img5.jpg",
        "images/img6.jpg","images/img6.jpg"
    ];

    function shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
            let r = Math.floor(Math.random() * (i + 1));
            [array[i], array[r]] = [array[r], array[i]];
        }
    }

    shuffle(actualImages);

    let firstCard = null;
    let secondCard = null;
    let lockBoard = false;

    for (let i = 0; i < blankImages.length; i++) {

        let img = document.createElement("img");
        img.src = blankImages[i];
        img.classList.add("tile");
        img.dataset.index = i;

        img.addEventListener("click", function () {

            if (lockBoard) return;
            if (img === firstCard) return;

            revealCard(img);
        });

        board.appendChild(img);
    }

    function revealCard(card) {

        let index = card.dataset.index;
        card.src = actualImages[index];

        if (!firstCard) {
            firstCard = card;
        } else {
            secondCard = card;
            lockBoard = true;
            checkMatch();
        }
    }

    function checkMatch() {

        attempts++;
        attemptDisplay.innerText = "Attempts: " + attempts;

        playerData.attempts = attempts;
        localStorage.setItem("playerData", JSON.stringify(playerData));

        let firstIndex = firstCard.dataset.index;
        let secondIndex = secondCard.dataset.index;

        if (actualImages[firstIndex] === actualImages[secondIndex]) {

            matchedPairs++;

            if (matchedPairs === actualImages.length / 2) {

                setTimeout(() => {
                    window.location.href = "results.html";
                }, 1000);
            }

            resetTurn();

        } else {

            setTimeout(() => {
                firstCard.src = "images/img7.jpg";
                secondCard.src = "images/img7.jpg";
                resetTurn();
            }, 1000);
        }
    }

    function resetTurn() {
        firstCard = null;
        secondCard = null;
        lockBoard = false;
    }
}


// ===============================
// PAGE 3 — RESULTS PAGE
// ===============================

let resultsDiv = document.getElementById("results");

if (resultsDiv) {

    let playerData = JSON.parse(localStorage.getItem("playerData"));

    if (playerData) {

        resultsDiv.innerHTML = `
            <h2>${playerData.firstName} ${playerData.lastName}</h2>
            <p>Age: ${playerData.age}</p>
            <p>Total Attempts: ${playerData.attempts}</p>
        `;
    }
}

function playAgain() {
    window.location.href = "index.html";
}

function resetGame() {
    localStorage.removeItem("playerData");
    location.reload();
}