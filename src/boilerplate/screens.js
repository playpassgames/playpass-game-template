const template = document.createElement('template');
template.innerHTML = `
    <style>
        ::slotted(*) {
            display: none;
        }

        :host(:not([loading])) ::slotted(*[active]) {
            display: block;
        }

        :host([loading]) ::slotted([slot="load-spinner"]) {
            display: block;
        }
    </style>
    <slot name="load-spinner"></slot>
    <slot></slot>
`;

const routerTagName = "screen-router";

window.customElements.define(
    routerTagName, 
    class extends HTMLElement {
        constructor() {
            super();
    
            this.attachShadow({mode: 'open'});
            this.shadowRoot.appendChild(template.content.cloneNode(true));
        }

        static get observedAttributes() {
            return ["open"];
        }

        async attributeChangedCallback(name, oldValue, newValue) {
            if (name === "open") {
                const prev = this.querySelector(oldValue);
                if (prev) {
                    prev.removeAttribute("active");
                    prev.onInactive();
                }
                
                const next = this.querySelector(newValue);
                next.setAttribute("active", "");

                this.setAttribute("loading", "");
                next.setAttribute("loading", "");
                await next.onActive()
                this.removeAttribute("loading");
                next.removeAttribute("loading");
                
            }
        }
    }
);

export function showScreen(name) {
    document.querySelector(routerTagName).setAttribute("open", name);
}

export class Screen extends HTMLElement {
    constructor() {
        super();
    }

    onActive() {

    }

    onInactive() {

    }
}