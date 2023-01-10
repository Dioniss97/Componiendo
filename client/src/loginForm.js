class LoginForm extends HTMLElement {

    constructor() {
        super();
        this.url = this.getAttribute('url');
        this.shadow = this.attachShadow({mode: 'open'});
        this.render();
    }

    render() {
        this.shadow.innerHTML =
        `
        <style>
            form {
                display: flex;
                flex-direction: column;
                width: 300px;
                margin: 0 auto;
            }
            input {
                margin: 10px 0;
                padding: 10px;
                border: 1px solid #ccc;
                border-radius: 5px;
            }
            button {
                padding: 10px;
                border: 1px solid #ccc;
                border-radius: 5px;
                background-color: #333;
                color: #fff;
                font-weight: 600;
                cursor: pointer;
            }
        </style>

        `;

        const form = document.createElement('form');

        const inputEmail = document.createElement('input');
        inputEmail.setAttribute('type', 'email');
        inputEmail.name =  'email';
        inputEmail.setAttribute('placeholder', 'Email');

        const inputPassword = document.createElement('input');
        inputPassword.setAttribute('type', 'password');
        inputPassword.name = 'password';
        inputPassword.setAttribute('placeholder', 'Password');

        const button = document.createElement('button');
        button.setAttribute('type', 'submit');
        button.textContent = 'Login';

        button.addEventListener('click', (e) => {
            e.preventDefault();
            this.login();
        });

        form.appendChild(inputEmail);
        form.appendChild(inputPassword);
        form.appendChild(button);

        this.shadow.appendChild(form);
    }

    login() {

        // Recojemos con FormData los datos del formulario. Así creamos un objeto con los datos del formulario.
        const formData = new FormData(this.shadow.querySelector('form'));

        // Pasamos el objeto de FormData a un objeto de JavaScript.
        const data = Object.fromEntries(formData.entries());

        // Pasamos el objeto de JavaScript a un objeto JSON.
        const json = JSON.stringify(data);

        console.log(json);
        console.log(this.url);

        // Enviamos los datos al servidor.
        fetch( this.url , {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: json
        })
        .then(res => res.json())
        .then(data => {
            // Guardamos el token en el sessionStorage
            sessionStorage.setItem('token', data.accessToken);
            window.location.href = this.getAttribute('redirection');
        })
        .catch(err => console.log(err));
    }
}

customElements.define('login-form-component', LoginForm);