import {API_URL} from '../config/config.js';

class Modal extends HTMLElement {

    constructor() {
        super();
        this.shadow = this.attachShadow({mode: 'open'});
    }

    connectedCallback() {

        document.addEventListener('loadModal', (event => {
            this.render();
            this.setAttribute('id', event.detail.id);
            this.setAttribute('url', event.detail.customUrl);
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

        .hidden {
            display: none;
        }

        .modal {
            width: 400px;
            height: 200px;
            background-color: #fff;
            border-radius: 10px;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            align-items: center;
            padding: 20px;
        }

        .modal-text {
            font-size: 1.4rem;
            font-weight: 600;
        }

        .modal-buttons {
            display: flex;
            justify-content: space-between;
            width: 100%;
        }

        .modal-button-confirm {
            background-color: #0f0;
            border: none;
            border-radius: 5px;
            padding: 10px;
            font-size: 1.2rem;
            font-weight: 600;
            cursor: pointer;
        }

        .modal-button-cancel {
            background-color: #f00;
            border: none;
            border-radius: 5px;
            padding: 10px;
            font-size: 1.2rem;
            font-weight: 600;
            cursor: pointer;
        }

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

        .hidden {
            display: none;
        }

        .modal {
            width: 400px;
            height: 200px;
            background-color: #fff;
            border-radius: 10px;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            align-items: center;
            padding: 20px;
        }

        .modal-text {
            font-size: 1.4rem;
            font-weight: 600;
        }

        .modal-buttons {
            display: flex;
            justify-content: space-between;
            width: 100%;
        }

        .modal-button-confirm, .modal-button-cancel {
            background-color: #fff;
            border: 1px solid #000;
            border-radius: 5px;
            padding: 10px;
            font-size: 1.2rem;
            font-weight: 600;
            cursor: pointer;
            padding: 1rem;
        }

        .modal-button-confirm:hover {
            background-color: #ccc;
            color: #fff;
        }

        .modal-button-cancel:hover {
            background-color: #ccc;
            color: #fff;
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

                    (button.classList.contains('modal-button-confirm')) ? this.removeData() : console.log('cancel');

                    modalContainer.classList.add('hidden');

                });

            });

            modal.appendChild(modalText);
            modal.appendChild(modalButtons);

            modalContainer.appendChild(modal);

        // ----------------------------

        this.shadow.appendChild(modalContainer);

    }

    // Fetch para el "remove":

    removeData() {

        let customUrl = this.getAttribute('url');
        let id = this.getAttribute('id');

        let url = `${API_URL}${customUrl}/${id}`;
        console.log(url);

        fetch(url, {
            method: 'DELETE',
            headers: {
                'x-access-token': sessionStorage.getItem('accessToken')
            }
        }).then((response) => {
            return response.json();
        }).then((data) => {
            console.log(data);
            document.dispatchEvent(new CustomEvent('updateTable'));
        }).catch((error) => {
            console.log(error);
        });

    }

}

customElements.define('modal-component', Modal);