import {API_URL} from '../config/config.js';

class savedModal extends HTMLElement {

    constructor() {
        super();
        this.shadow = this.attachShadow({mode: 'open'});
    }

    connectedCallback() {

        // Recibimos un evento y sus parámetros desde el componente "form.js" al clicar el boton de "Guardar".

        document.addEventListener('saved', (event => {

            event.preventDefault();

            let value = Object.values(event.detail.data);

            this.value = value[1];
            this.table = event.detail.table;
            this.action = event.detail.action;

            this.render();
        }));

    }

    render() {
        this.shadow.innerHTML =
        `
        <style>

        .modal-container {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.5);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 3;
        }

        .modal-container.hidden {
            opacity: 0;
            transition: opacity 0.3s ease-in-out;
        }

        .modal {
            background-color: #fff;
            border-radius: 10px;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            align-items: center;
            padding: 2rem;
        }

        .modal-text {
            font-size: 1.2rem;
            font-weight: 5d00;
        }

        </style>
        `;

        event.preventDefault();

        const modalContainer = document.createElement('div');
        modalContainer.classList.add('modal-container');

        const modal = document.createElement('div');
        modal.classList.add('modal');

        const modalText = document.createElement('div');
        modalText.classList.add('modal-text');
        modalText.textContent = this.action + ' correctamente el ' + this.table + ' ' + this.value;

        // Appends:

            modal.appendChild(modalText);
            modalContainer.appendChild(modal);

        // Añadimos un setTimeOut para que se cierre el modal:

            setTimeout(() => {
                modalContainer.classList.add('hidden');
            }, 3000);

        // ----------------------------

        this.shadow.appendChild(modalContainer);

    }

}

customElements.define('saved-modal-component', savedModal);