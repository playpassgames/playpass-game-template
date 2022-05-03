import * as playpass from "playpass";

import "./boilerplate/common.css";
import "./main.css";

import * as timer from "./boilerplate/timer";

const DICE_EMOJI = [ "⚀", "⚁", "⚂", "⚃", "⚄", "⚅" ];

// The dice the player rolled today
let rolledDice = [];

// Gets the current day number
function getCurrentDay () {
    return Math.floor(Date.now() / (1000 * 60 * 60 * 24));
}

// Shows either the results or gameplay screen
async function showMainScreen () {
    const lastDay = await playpass.storage.get("lastDay");
    if (lastDay == getCurrentDay()) {
        // The player has already played today, load the dice and show the results screen
        rolledDice = await playpass.storage.get("lastDice");
        showResultScreen();
    } else {
        // The player hasn't yet played today, show the playing screen
        rolledDice = [];
        showScreen("#playingScreen");
    }
}

function showResultScreen () {
    // Go to the results screen
    showScreen("#resultScreen");

    // Set the first results line
    let points = 0;
    for (const die of rolledDice) {
        points += DICE_EMOJI.indexOf(die) + 1;
    }
    document.querySelector("#resultLine1").textContent = rolledDice.join(" + ") + " = " + points;

    // Set the second results line
    let rank;
    if (points > 16) {
        rank = "LEGENDARY LUCK!";
    } else if (points > 14) {
        rank = "Golden Luck!";
    } else if (points > 12) {
        rank = "Favored Luck";
    } else if (points > 10) {
        rank = "Average Luck";
    } else if (points > 8) {
        rank = "Slightly Unlucky";
    } else if (points > 6) {
        rank = "Luckless";
    } else if (points > 4) {
        rank = "Unfavored Luck";
    } else if (points > 2) {
        rank = "Disastrous Luck!";
    } else {
        rank = "CURSED!";
    }
    document.querySelector("#resultLine2").textContent = rank;
}

function showScreen (name) {
    for (let screen of document.querySelectorAll(".screen")) {
        screen.style.display = "none";
    }
    document.querySelector(name).style.display = "inherit";
}

function onRollClick () {
    // Generate 3 random dice
    rolledDice = [
        DICE_EMOJI[Math.floor(Math.random()*6)],
        DICE_EMOJI[Math.floor(Math.random()*6)],
        DICE_EMOJI[Math.floor(Math.random()*6)],
    ];

    // Save the current day
    playpass.storage.set("lastDay", getCurrentDay());
    playpass.storage.set("lastDice", rolledDice);

    // Go to the results screen
    showResultScreen();
}

function onShareClick () {
    // Create a link to our game
    const link = playpass.createLink();

    // Share some text along with our link
    playpass.share({
        text: "Today's dice " + rolledDice.join(" ") + " " + link,
    });
}

function onHelpClick () {
    showScreen("#helpScreen");
}

function onStatsClick () {
    showScreen("#statsScreen");
}

function onSettingsClick () {
    showScreen("#settingsScreen");
}

function onBackClick () {
    showMainScreen();
}

async function onLoginClick () {
    if (await playpass.account.login()) {
        document.body.classList.add("isLoggedIn");
    }
}

function onLogoutClick () {
    playpass.account.logout();
    document.body.classList.remove("isLoggedIn");
    rolledDice = [];
}

(async function () {
    // Initialize the Playpass SDK
    await playpass.init({
        gameId: "YOUR_GAME_ID", // Do not edit!
    });

    // Take new users to help screen first
    const sawTutorial = await playpass.storage.get("sawTutorial");
    if (sawTutorial) {
        showMainScreen();
    } else {
        playpass.storage.set("sawTutorial", true);
        showScreen("#helpScreen");
    }

    // Set the login state for our UI
    if (playpass.account.isLoggedIn()) {
        document.body.classList.add("isLoggedIn");
    }

    var nextGameAt = timer.getNextGameTime();
    setInterval(() => {
        var hoursLeft = timer.getHoursUntil(nextGameAt);
        var minutesLeft = timer.getMinutesUntil(nextGameAt);
        var secondsLeft = timer.getSecondsUntil(nextGameAt);
        document.querySelector("#timeLeft").textContent = hoursLeft + "h " + minutesLeft + "m " + secondsLeft + "s" + " until next roll";
    }, 1000);

    // Add UI event listeners
    document.querySelector("#rollBtn").onclick = onRollClick;
    document.querySelector("#shareBtn").onclick = onShareClick;
    document.querySelector("#helpBtn").onclick = onHelpClick;
    document.querySelector("#helpBackBtn").onclick = onBackClick;
    document.querySelector("#statsBtn").onclick = onStatsClick;
    document.querySelector("#statsBackBtn").onclick = onBackClick;
    document.querySelector("#settingsBtn").onclick = onSettingsClick;
    document.querySelector("#loginBtn").onclick = onLoginClick;
    document.querySelector("#logoutBtn").onclick = onLogoutClick;
    document.querySelector("#settingsBackBtn").onclick = onBackClick;
})();