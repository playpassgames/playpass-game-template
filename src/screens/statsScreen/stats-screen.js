import { Screen, showScreen } from "../../boilerplate/screens";

const template = `
<h2>Stats</h2>
<p>You have rolled 999 points over 123 days.</p>
<button name="back">Back</button>
`;

window.customElements.define("stats-screen", class extends Screen {
    constructor() {
        super();

        this.innerHTML = template;

        this.querySelector("button[name=back]").onclick = this.back;
    }

    back() {
        showScreen("landing-screen");
    }
});
