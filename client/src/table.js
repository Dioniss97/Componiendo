import {API_URL} from '../config/config.js';

class Table extends HTMLElement {
    constructor() {
        super();
        this.shadow = this.attachShadow({mode: 'open'});
        this.url = this.getAttribute('url');
        this.data = [];
        this.keys = [];
        this.total = null;
        this.lastPage = null;
        this.currentPage = null;
    }

    static get observedAttributes() { return ['url']; } // Here is where we tell the browser to watch for changes to the url attribute

    connectedCallback() { // Here is where we tell the browser to listen for the newUrl event
        document.addEventListener('newUrl', (event) => {
            this.setAttribute('url', event.detail.url);
        });

        document.addEventListener('updateTable', (event) => {

            this.loadData().then(() => {
                this.renderPaginationButtons();
                this.render();
            });

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
            // console.log(data.meta);
            
            this.rows = data.rows;
            this.total = data.meta.total;
            this.lastPage = data.meta.pages;
            this.currentPage = data.meta.currentPage;
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
                width: 100%;
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

            .table-pagination {
                margin-top: 2em;
            }
           
            .table-pagination .table-pagination-info{
                color: hsl(0, 0%, 0%);
                display: flex;
                font-family: 'Roboto', sans-serif;
                justify-content: space-between;
            }

            .table-pagination .table-pagination-buttons p{
                color: hsl(0, 0%, 0%);
                font-family: 'Roboto', sans-serif;
                margin: 1rem 0;
            }

            .table-pagination-info p{
                margin: 0;
            }
       
            .table-pagination .table-pagination-button{
                cursor: pointer;
                margin-right: 1em;
            }
       
            .table-pagination .table-pagination-button:hover{
                color: hsl(19, 100%, 50%);
            }
       
            .table-pagination .table-pagination-button.inactive{
                color: hsl(0, 0%, 69%);
            }

            .disabled {
                display: none;
            }



        </style>
        
        <div class="table-pagination">
            <div class="table-pagination-info">
                <div class="table-pagination-total"><p><span id="total-page">${this.total}</span> registros</p></div>
                <div class="table-pagination-pages"><p>Página <span id="current-page">${this.currentPage}</span> de <span id="last-page">${this.lastPage}</span></p></div>
            </div>
            <div class="table-pagination-buttons">
                <p>
                    <span class="table-pagination-button" id="firstPageUrl">Primera</span>
                    <span class="table-pagination-button" id="previousPageUrl">Anterior</span>
                    <span class="table-pagination-button" id="nextPageUrl">Siguiente</span>
                    <span class="table-pagination-button" id="lastPageUrl">Última</span>
                </p>
            </div>
        </div>
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
        let values = Object.values(this.rows);

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

                        let button = document.createElement('div');
                        button.setAttribute('data-id', register.id);

                        if (key === 'edit') {

                            let svg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>pencil</title><path d="M20.71,7.04C21.1,6.65 21.1,6 20.71,5.63L18.37,3.29C18,2.9 17.35,2.9 16.96,3.29L15.12,5.12L18.87,8.87M3,17.25V21H6.75L17.81,9.93L14.06,6.18L3,17.25Z" /></svg>';
                            button.innerHTML = svg;

                            button.addEventListener('click', (e) => {

                                document.dispatchEvent(new CustomEvent('fillForm', {detail: {id: button.dataset.id}}));

                            });
                        
                        } else if (key === 'remove') {

                            let svg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>delete</title><path d="M19,4H15.5L14.5,3H9.5L8.5,4H5V6H19M6,19A2,2 0 0,0 8,21H16A2,2 0 0,0 18,19V7H6V19Z" /></svg>';
                            button.innerHTML = svg;

                            button.addEventListener('click', (e) => {

                                console.log('remove');

                                document.dispatchEvent(new CustomEvent('loadModal', {detail: {id: button.dataset.id, customUrl: this.getAttribute('url')}}));

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

        this.renderPaginationButtons();

    }

    renderPaginationButtons() {

        // Tenemos 4 botones:
        // 
        //  - Primera
        //  - Anterior
        //  - Siguiente
        //  - Última
        // 
        //  - Si estamos en la primera página, el botón de Primera y Anterior estará desactivado.
        //  - Si estamos en la última página, el botón de Siguiente y Última estará desactivado.
        //  - Si estamos en cualquier otra página, los 4 botones estarán activados.
        // 
        //  - Si el total de registros es menor o igual que el número de registros por página, no se mostrarán los botones de paginación.
        //  - Si el total de registros es mayor que el número de registros por página, se mostrarán los botones de paginación.

        let firstPageUrl = this.shadow.querySelector('#firstPageUrl');
        let previousPageUrl = this.shadow.querySelector('#previousPageUrl');
        let nextPageUrl = this.shadow.querySelector('#nextPageUrl');
        let lastPageUrl = this.shadow.querySelector('#lastPageUrl');

        console.log(this.data.meta);

        paginationButtons.forEach((button) => {

            let action = button.textContent;

            button.addEventListener('click', (e) => {

                switch (action) {

                    case 'Primera':

                    case 'Anterior':

                    case 'Siguiente':

                    case 'Última':
                }
            });
        });            


        // Check if there are multiple pages
        if (this.data.meta.pages === 1) {
                
                // Disable all buttons if there is only one page
                paginationButtons.forEach((button) => {
    
                    button.classList.add('disabled');
    
                });
    
            } else {

                // If there are multiple pages
                if (this.data.meta.currentPage === 1) {

                    // Disable First and Previous buttons if on the first page
                    firstPageUrl.classList.add('disabled');
                    previousPageUrl.classList.add('disabled');

                } else if (this.data.meta.currentPage === this.data.meta.pages) {

                    // Disable Next and Last buttons if on the last page
                    nextPageUrl.classList.add('disabled');
                    lastPageUrl.classList.add('disabled');

                }
            }



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