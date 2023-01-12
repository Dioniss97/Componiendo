class Header extends HTMLElement {

    constructor() {
        super();
        this.shadow = this.attachShadow({mode: 'open'});
        this.title = this.getAttribute('title');
    }

    static get observedAttributes() { return ['title']; }

    connectedCallback() {
       
        document.addEventListener("newUrl",( event =>{
            this.setAttribute('title', event.detail.title);
        }));

        this.render();
    }

    attributeChangedCallback(name, oldValue, newValue){
        this.render();
    }

    render() {

        this.shadow.innerHTML =
        `
        <style>
            .title-container {
                display: flex;
                justify-content: center;
                align-items: center;
                height: 100px;
                background-color: #eee;
            }
            h1 {
                font-size: 2rem;
                font-weight: 600;
            }
            .loggin-buttons-container {
                display: flex;
                justify-content: flex-end;
                align-items: center;
                height: 100px;
                background-color: #eee;
            }
            .login-button, .register-button {
                padding: 10px;
                border: 1px solid #ccc;
                border-radius: 5px;
                background-color: #333;
                color: #fff;
                font-weight: 600;
                cursor: pointer;
                margin: 1.2rem;
            }
        </style>
        `;

        const header = document.createElement('header');

        const titleContainer = document.createElement('div');
        titleContainer.setAttribute('class', 'title-container');

        const title = document.createElement('h1');
        title.textContent = this.title;

        titleContainer.appendChild(title);

        header.appendChild(titleContainer);

        const logginButtonsContainer = document.createElement('div');
        logginButtonsContainer.setAttribute('class', 'loggin-buttons-container');

        const loginButton = document.createElement('button');
        loginButton.setAttribute('class', 'login-button');
        loginButton.textContent = 'Login';

        const registerButton = document.createElement('button');
        registerButton.setAttribute('class', 'register-button');
        registerButton.textContent = 'Register';

        if (title.textContent === 'Login') {

        logginButtonsContainer.appendChild(loginButton);
        logginButtonsContainer.appendChild(registerButton);

        header.appendChild(logginButtonsContainer);

        }

        this.shadow.appendChild(header);
    }
}

customElements.define('header-component', Header);