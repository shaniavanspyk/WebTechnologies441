// ==============================
// 1. Create Arrays
// ==============================

// Blank images (what user sees first)
let blankImages = new Array(12).fill("images/img7.jpg");

// Actual image pairs (6 images × 2 = 12 total)
let actualImages = [
    "images/img1.jpg",
    "images/img1.jpg",
    "images/img2.jpg",
    "images/img2.jpg",
    "images/img3.jpg",
    "images/img3.jpg",
    "images/img4.jpg",
    "images/img4.jpg",
    "images/img5.jpg",
    "images/img5.jpg",
    "images/img6.jpg",
    "images/img6.jpg"
];


// ==============================
// 2. Shuffle Function
// ==============================

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {

        let randomIndex = Math.floor(Math.random() * (i + 1));

        let temp = array[i];
        array[i] = array[randomIndex];
        array[randomIndex] = temp;
    }
}

// Shuffle actual images
shuffle(actualImages);


// ==============================
// 3. Build the Board (FOR LOOP)
// ==============================

let board = document.getElementById("board");

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
        revealCard(img);
    });

    board.appendChild(img);
}


// ==============================
// 4. Reveal Card
// ==============================

function revealCard(card) {

    let index = card.dataset.index;

    if (card === firstCard) return;

    card.src = actualImages[index];

    if (!firstCard) {
        firstCard = card;
    } else {
        secondCard = card;
        lockBoard = true;
        checkMatch();
    }
}


// ==============================
// 5. Check Match
// ==============================

function checkMatch() {

    let firstIndex = firstCard.dataset.index;
    let secondIndex = secondCard.dataset.index;

    if (actualImages[firstIndex] === actualImages[secondIndex]) {
        resetTurn();
    } else {
        setTimeout(function () {
            firstCard.src = "images/img7.jpg";
            secondCard.src = "images/img7.jpg";
            resetTurn();
        }, 1000);
    }
}


// ==============================
// 6. Reset Turn
// ==============================

function resetTurn() {
    firstCard = null;
    secondCard = null;
    lockBoard = false;
}