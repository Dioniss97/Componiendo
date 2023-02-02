// Componente de un formulario para editar un registro de la tabla:

class Form extends HTMLElement {
    constructor() {
        super();

        this.shadow = this.attachShadow({mode: 'open'});
    }

    connectedCallback() {
        this.render();
    }

    render() {
        this.shadow.innerHTML = `
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

        document.addEventListener('fillForm', (event) => {

            if (event.detail.load === true) {

                const form = document.createElement('form');

                const inputId = document.createElement('input');
                inputId.setAttribute('type', 'hidden');
                inputId.setAttribute('id', event.detail.id);

                form.appendChild(inputId);
            }
        });

    }
}