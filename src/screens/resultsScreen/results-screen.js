import * as playpass from "playpass";
import { Screen, showScreen } from "@/boilerplate/screens";
import * as timer from "@/boilerplate/timer";
import state from "@/state";

const DICE_EMOJI = [ "⚀", "⚁", "⚂", "⚃", "⚄", "⚅" ];

const template = `
<p>Your dice rolls today were...</p>
<h1 id="resultLine1">⚅ + ⚅ + ⚅ = 18 points</h1>
<h2 id="resultLine2">Lucky!</h2>
<button name="share">🗨️ Share</button>
<p><span id="timeLeft"></span></p>
`

window.customElements.define(
    "results-screen", 
    class extends Screen {
        constructor() {
            super();

            this.innerHTML = template;

            this.querySelector("button[name=share]").onclick = this.share;
        }

        share() {
            // Create a link to our game
            const link = playpass.createLink();

            // Share some text along with our link
            playpass.share({
                text: `Today's dice ${state.rolledDice.map(roll => DICE_EMOJI[roll]).join(" ")} ${link}`,
            });
        }

        onActive() {
            if (state.rolledDice.length === 0) {
                showScreen("landing-page");
                return;
            }

            // Set the first results line
            const points = state.rolledDice.reduce((sum, roll) => sum + (roll + 1), 0);
            this.querySelector("#resultLine1").textContent = `${state.rolledDice.map(roll => DICE_EMOJI[roll]).join(" + ")} = ${points}`;

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
            this.querySelector("#resultLine2").textContent = rank;

            const nextGameAt = timer.getNextGameTime();
            this.timerUpdate = setInterval(() => {
                const until = timer.getUntil(nextGameAt);
                this.querySelector("#timeLeft").textContent = `${until.hours}h ${until.minutes}m ${until.seconds}s until next roll`;
            }, 1000);
        }

        onInactive() {
            if (this.timerUpdate) {
                clearInterval(this.timerUpdate);
            }
        }
    },
);
