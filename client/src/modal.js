import {API_URL} from './config.js';

class Modal extends HTMLElement {

    constructor() {
        super();
        this.shadow = this.attachShadow({mode: 'open'});
    }

    connectedCallback() {

        document.addEventListener('loadModal', (event => {
            console.log('loadModal');
            this.render();
        }));
    }

    render() {
        this.shadow.innerHTML =
        `
        <style>
            .modal {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background-color: rgba(0,0,0,0.5);
                display: flex;
                justify-content: center;
                align-items: center;
                z-index: 999;
            }
            .modal-content {
                background-color: #fff;
                padding: 20px;
                border-radius: 5px;
                width: 500px;
            }
            .close {
                position: absolute;
                top: 10px;
                right: 10px;
                cursor: pointer;
            }
        </style>
        `;

        console.log('loadModal');

        e.preventDefault();

        const modalContainer = document.createElement('div');
        modalContainer.classList.add('modal-container');

        const modal = document.createElement('div');
        modal.classList.add('modal');

        const modalText = document.createElement('div');
        modalText.classList.add('modal-text');
        modalText.textContent = '¿Estás seguro de que quieres eliminar este registro?';

        const modalButtons = document.createElement('div');
        modalButtons.classList.add('modal-buttons');

        const modalButtonConfirm = document.createElement('button');
        modalButtonConfirm.classList.add('modal-button-confirm', 'button');
        modalButtonConfirm.textContent = 'Sí';

        const modalButtonCancel = document.createElement('button');
        modalButtonCancel.classList.add('modal-button-cancel', 'button');
        modalButtonCancel.textContent = 'No';

        // Appends:

            modalButtons.appendChild(modalButtonConfirm);
            modalButtons.appendChild(modalButtonCancel);

        // Añadimos a los botones un evento de click para que se cierre el modal:

            let buttons = modalButtons.querySelectorAll('button');

            buttons.forEach((button) => {

                button.addEventListener('click', (e) => {

                    e.preventDefault();

                    modalContainer.classList.add('hidden');

                });

            });

            modal.appendChild(modalText);
            modal.appendChild(modalButtons);

            modalContainer.appendChild(modal);

        // ----------------------------

        document.body.appendChild(modalContainer);

    }

}

customElements.define('modal-component', Modal);