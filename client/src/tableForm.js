import {API_URL} from '../config/config.js';

class TableForm extends HTMLElement {
    constructor() {
        super();
        this.shadow = this.attachShadow({mode: 'open'});
        this.url = this.getAttribute('url');
        this.data = [];
    }

    static get observedAttributes() { return ['url']; }

    connectedCallback() {
        document.addEventListener('newUrl', (event) => {
            this.setAttribute('url', event.detail.url);
        });

        this.loadData().then(() => this.render());
    }

    attributeChangedCallback(name, oldValue, newValue){
        this.loadData().then(() => this.render());
    }

    async loadData() {

        let url = `${API_URL}${this.getAttribute('url')}`;

        try{

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

            .table-form-container {
                margin: 1rem 4%;
                display: flex;
                flex-direction: row-reverse;
                justify-content: space-around;
                width: 96%;
            }

            form {
                display: flex;
                flex-direction: column;
                width: 30%;
                border: 1px solid #ccc;
            }

            caption {
                font-size: 1.4rem;
                font-weight: 600;
                background-color: #eee;
                padding: 10px;
                border-bottom: 1px solid #ccc;
            }

            label {
                font-size: 1.2rem;
                font-weight: 600;
                margin: .4rem;
            }

            input {
                margin: .4rem;
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
                margin: 1.2rem;
            }

            table {
                width: 50%;
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

        </style>
        `;

        let tableFormContainer = document.createElement('div');
        tableFormContainer.classList.add('table-form-container');

        // let formContainer = document.createElement('div');
        let form = document.createElement('form');

        // let tableContainer = document.createElement('div');
        let table = document.createElement('table');

        let thead = document.createElement('thead');
        let tbody = document.createElement('tbody');

        let tableStructure = this.setTableStructure();

        Object.keys(tableStructure.headers).forEach((key) => {

            let th = document.createElement('th');
            th.textContent = tableStructure.headers[key].label;
            thead.appendChild(th);

        });

        Object.values(this.data).forEach((register) => {
            
            let tr = document.createElement('tr');

            Object.keys(tableStructure.headers).forEach((key) => {

            let td = document.createElement('td');
            td.textContent = register[key];

            tr.appendChild(td);
            tbody.appendChild(tr);

            });
        });


        Object.keys(tableStructure.filters).forEach((key) => {

            let label = document.createElement('label');
            label.textContent = tableStructure.filters[key].label;

            let input = document.createElement('input');
            input.setAttribute('type', tableStructure.filters[key].type);
            input.setAttribute('name', key);
            input.setAttribute('placeholder', label.textContent);

            form.appendChild(label);
            form.appendChild(input);
        });

        // Appends:

            // Form:

            tableFormContainer.appendChild(form);

            // Table:

            table.appendChild(thead);
            table.appendChild(tbody);
    
            tableFormContainer.appendChild(table);

        // ----------------------------

        this.shadow.appendChild(tableFormContainer);

    }

    setTableStructure() {

        let url = this.getAttribute('url');

        switch (url) {

        case '/api/admin/customers':

            return {

                filters: {
                    name: {
                        label: 'Nombre',
                        type: 'text',
                    },
                    surname: {
                        label: 'Apellidos',
                        type: 'text',
                    },
                    email: {
                        label: 'Email',
                        type: 'email',
                    }
                },
                headers:{
                    email: {
                        label: 'Email',
                    },
                    name: {
                        label: 'Nombre',
                    },
                    surname: {
                        label: 'Apellidos',
                    },
                },
                buttons: {
                    edit: true,
                    remove: true
                }
            };

        case '/api/admin/emails':

            return {

                filters: {
                    subject: {
                        label: 'Asunto',
                    },
                    content: {
                        label: 'Contenido',
                    }
                },
                headers:{
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
        }
    }
}

customElements.define('table-form-component', TableForm);