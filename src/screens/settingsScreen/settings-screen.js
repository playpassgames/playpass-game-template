import { Screen, showScreen } from "@/boilerplate/screens";
import state from "@/state";

const template = `
<h2>Settings</h2>
<div class="showIfLoggedOut">
  <div>Login to save or transfer your game progress.</div>
  <button name="login">📱 Login</button>
</div>
<div class="showIfLoggedIn">
  <div>You are logged in, your progress will be saved.</div>
  <button name="logout">Logout</button>
</div>
<button name="back" onclick="this.back">Back</button>
`

window.customElements.define("settings-screen", class extends Screen {
    constructor() {
        super();

        this.innerHTML = template;

        this.querySelector("button[name=back]").onclick = this.back;
        this.querySelector("button[name=login]").onclick = this.login;
        this.querySelector("button[name=logout]").onclick = this.logout;
    }

    async login () {
        await state.login();
    }
    
    logout () {
        state.logout();
    }
    
    back() {
        showScreen("landing-screen");
    }
});