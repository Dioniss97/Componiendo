import {API_URL} from '../config/config.js';

class Table extends HTMLElement {
    constructor() {
        super();
        this.shadow = this.attachShadow({mode: 'open'});
        this.url = this.getAttribute('url');
        this.data = [];
        this.keys = [];
    }

    static get observedAttributes() { return ['url']; } // Here is where we tell the browser to watch for changes to the url attribute

    connectedCallback() { // Here is where we tell the browser to listen for the newUrl event
        document.addEventListener('newUrl', (event) => {
            this.setAttribute('url', event.detail.url);
        });

        this.loadData().then(() => this.render());
    }

    attributeChangedCallback(name, oldValue, newValue){ // Here is where we tell the browser what to do when the url attribute changes
        this.loadData().then(() => this.render());
    }

    async loadData() {

        let url = `${API_URL}${this.getAttribute('url')}`;

        try {

            let response = await fetch(url, {
                headers: {
                    'x-access-token': sessionStorage.getItem('accessToken'),
                }
            });

            let data = await response.json();
            this.data = data;

        } catch(error) {
            console.log(error);
        }
    }

    render() {
        this.shadow.innerHTML =
        `
        <style>

            caption {
                font-size: 1.4rem;
                font-weight: 600;
                background-color: #eee;
                padding: 10px;
                border-bottom: 1px solid #ccc;
            }

            table {
                border-collapse: collapse;
            }

            th {
                background-color: #eee;
                font-size: 1.4rem;
            }

            tr {
                border-bottom: .2rem solid #ccc;
            }

            th, td {
                padding: 10px;
                border: 1px solid #ccc;
            }

            td {
                text-align: center;
            }

            svg {
                width: 1.5rem;
                height: 1.5rem;
                cursor: pointer;
            }

        </style>
        `;

        let tableContainer = document.createElement('div');
        tableContainer.classList.add('table-container');

        let table = document.createElement('table');

        let thead = document.createElement('thead');
        let tbody = document.createElement('tbody');

        let tableStructure = this.setTableStructure();

        // Table structure:

        let buttons = Object.keys(tableStructure.buttons);
        let headers = Object.keys(tableStructure.headers);
        let values = Object.values(this.data);

        headers.forEach((key) => {

            let th = document.createElement('th');
            th.textContent = tableStructure.headers[key].label;
            thead.appendChild(th);

        });

        if (buttons.length > 0) {

            let th = document.createElement('th');
            th.textContent = 'Acciones';
            thead.appendChild(th);

        }

        values.forEach((register) => {

            let tr = document.createElement('tr');

            headers.forEach((header) => {

                let td = document.createElement('td');
                td.textContent = register[header];

                tr.appendChild(td);
                tbody.appendChild(tr);

            });

            if (buttons.length > 0) {

                let td = document.createElement('td');

                buttons.forEach((key) => {

                    if (tableStructure.buttons[key] === true) {

                        // Si la key es edit o remove, cargamos un svg con el icono correspondiente

                        let button = document.createElement('div');
                        button.setAttribute('data-id', register.id);

                        if (key === 'edit') {

                            let svg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>pencil</title><path d="M20.71,7.04C21.1,6.65 21.1,6 20.71,5.63L18.37,3.29C18,2.9 17.35,2.9 16.96,3.29L15.12,5.12L18.87,8.87M3,17.25V21H6.75L17.81,9.93L14.06,6.18L3,17.25Z" /></svg>';
                            button.innerHTML = svg;

                            button.addEventListener('click', (e) => {

                                document.dispatchEvent(new CustomEvent('fillForm', {detail: {id: register.id, url: this.getAttribute('url'), method: 'GET'}}));

                                e.preventDefault();

                                let id = e.target.getAttribute('data-id');

                                // A partir de aquí se debe lanzar un evento personalizado para que el formulario se rellene con los datos del registro. Y solo
                                // cuando se pulse el botón de guardar se debe enviar la petición PUT.

                            });
                        
                        } else if (key === 'remove') {

                            let svg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>delete</title><path d="M19,4H15.5L14.5,3H9.5L8.5,4H5V6H19M6,19A2,2 0 0,0 8,21H16A2,2 0 0,0 18,19V7H6V19Z" /></svg>';
                            button.innerHTML = svg;

                            button.addEventListener('click', (e) => {

                                document.dispatchEvent(new CustomEvent('fillForm', {detail: {id: register.id, url: this.getAttribute('url'), load: false}}));

                                e.preventDefault();

                                let id = e.target.getAttribute('data-id');

                                // A partir de aquí se debe lanzar un evento personalizado para que aparezca un modal de confirmación. Y solo
                                // cuando se pulse el botón de confirmar se debe enviar la petición DELETE.

                                fetch(API_URL + this.url + '/' + id, {
                                    method: 'DELETE',
                                }).then((response) => {

                                    if (response.status === 200) {

                                        this.render();

                                    }

                                });

                            });

                        }

                        td.appendChild(button);
                        tr.appendChild(td);
                        tbody.appendChild(tr);

                    }
                });
            }
        });

        // Appends:

            table.appendChild(thead);
            table.appendChild(tbody);

            tableContainer.appendChild(table);

        // ----------------------------

        this.shadow.appendChild(tableContainer);

    }

    setTableStructure() {

        let url = this.getAttribute('url');

        switch (url) {

        case '/api/admin/customers':

            return {

                headers: {
                    email: {
                        label: 'Email',
                    },
                    name: {
                        label: 'Nombre',
                    },
                    surname: {
                        label: 'Apellidos',
                    }
                },
                buttons: {
                    edit: true,
                    remove: true
                }
            };

        case '/api/admin/emails':

            return {

                headers: {
                    subject: {
                        label: 'Asunto',
                    },
                    content: {
                        label: 'Contenido',
                    }
                },
                buttons: {
                    edit: true,
                    remove: true
                }
            };

        case '/api/admin/users':

            return {

                headers: {
                    email: {
                        label: 'Email',
                    },
                    name: {
                        label: 'Nombre',
                    }
                },
                buttons: {
                    edit: true,
                    remove: true
                }
            };

        }
    }
}

customElements.define('table-component', Table);