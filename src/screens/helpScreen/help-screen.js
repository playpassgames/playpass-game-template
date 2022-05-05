import * as playpass from "playpass";
import { Screen, showScreen } from "@/boilerplate/screens";

const template = `
<h2>Welcome to Daily Dice!</h2>
<p>This is an example of how to use the Playpass SDK to build a simple daily level game.</p>
<p>Each day, you have the opportunity to roll a set of 3 dice. If you get a good roll, share it with a friend!</p>
<button name="back">Continue</button>

<a class="fork-ribbon" href="https://github.com/playpassgames/playpass-game-template" target="_blank">Fork with Playpass</a>
`;

window.customElements.define("help-screen",
    class extends Screen {
        constructor() {
            super();

            this.innerHTML = template;
            
            this.querySelector("button[name=back]").onclick = this.back;
        }

        back() {
            showScreen("landing-screen");
        }

        onActive() {
            playpass.storage.set("sawTutorial", true);
        }
    },
);