let level = 1;

// Change text and background color
function changeScene(text, color) {
    document.getElementById("story").innerText = text;
    document.body.style.backgroundColor = color;
}

// Function that returns final result
function finalBattle(move) {
    if (move === "attack") {
        return "You attack the final boss and win! You escape the game!";
    } else {
        return "You hesitate and the boss defeats you. You are stuck forever.";
    }
}

function nextPart() {

    let userChoice = document.getElementById("choiceBox").value.toLowerCase();
    document.getElementById("choiceBox").value = "";

    if (level === 1) {

        if (userChoice === "door") {
            changeScene(
                "You open the door and find a glowing sword. Pick it up or leave it?",
                "darkblue"
            );
            level = 2;

        } else if (userChoice === "stairs") {
            changeScene(
                "You walk up the stairs and meet a strange NPC. Talk or ignore?",
                "purple"
            );
            level = 3;

        } else {
            alert("Please type door or stairs.");
        }
    }

    else if (level === 2) {

        switch(userChoice) {

            case "pick it up":
                changeScene(
                    "You now have the sword. A monster appears! Attack or run?",
                    "red"
                );
                level = 4;
                break;

            case "leave it":
                changeScene(
                    "You leave the sword. The room resets. Type restart.",
                    "black"
                );
                level = 6;
                break;

            default:
                alert("Type pick it up or leave it.");
        }
    }

    else if (level === 3) {

        if (userChoice === "talk") {

            let i = 0;
            while (i < 3) {
                console.log("NPC is thinking...");
                i++;
            }

            changeScene(
                "The NPC warns you about the final boss. Attack or hide?",
                "darkgreen"
            );
            level = 5;

        } else if (userChoice === "ignore") {
            changeScene(
                "The NPC glitches and deletes you. Type restart.",
                "black"
            );
            level = 6;

        } else {
            alert("Type talk or ignore.");
        }
    }

    else if (level === 4 || level === 5) {

        let result = finalBattle(userChoice);

        changeScene(
            result + " Type restart to play again.",
            "black"
        );

        level = 6;
    }

    else if (level === 6) {

        if (userChoice === "restart") {
            restartGame();
        } else {
            alert("Type restart to play again.");
        }
    }
}

function restartGame() {
    level = 1;
    changeScene(
        "You start your favorite video game, but the screen glitches. You are now inside the game. You see a door and a staircase. Do you choose door or stairs?",
        "black"
    );
}