import * as playpass from "playpass";
import { Screen, showScreen } from "@/boilerplate/screens";
import state from "@/state";

const template = `
<p>Test your luck with three dice. How high can you roll?</p>
<button name="roll">🎲🎲🎲 Roll 'em!</button>
`;

window.customElements.define(
    "landing-screen",
    class extends Screen {
        constructor() {
            super();

            this.innerHTML = template;

            this.querySelector("button[name=roll]").onclick = this.roll;
        }

        async roll() {
            await state.rollDice();
            showScreen("results-screen");
        }

        async onActive() {
            // Take new users to help screen first
            const sawTutorial = await playpass.storage.get("sawTutorial");
            if (!sawTutorial) {
                showScreen("help-screen");
                return;
            }

            const lastDay = await playpass.storage.get("lastDay");
            if (lastDay == state.getCurrentDay()) {
                // The player has already played today, load the dice and show the results screen
                state.rolledDice = await playpass.storage.get("lastDice");
                showScreen("results-screen");
            } else {    
                // The player hasn't yet played today, show the playing screen
                state.rolledDice = [];
            }
        }
    },
);
