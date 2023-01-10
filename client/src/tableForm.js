class TableForm extends HTMLElement {
    constructor() {
        super();
        this.shadow = this.attachShadow({mode: 'open'});
        this.render();
        this.obtainData();
    }
    render() {
        this.shadow.innerHTML =
        `
        <style>

            .table-form-container {
                display: flex;
                flex-direction: row;
                justify-content: space-around;
                width: 100%;
            }

            form {
                display: flex;
                flex-direction: column;
                width: 30%;
                border: 1px solid #ccc;
            }

            caption {
                font-size: 1.2rem;
                font-weight: 600;
                background-color: #eee;
                padding: 10px;
                border-bottom: 1px solid #ccc;
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

            th, td {
                padding: 10px;
                border: 1px solid #ccc;
            }

        </style>
        `;

        const tableFormContainer = document.createElement('div');
        tableFormContainer.setAttribute('class', 'table-form-container');

        const form = document.createElement('form');

        const caption = document.createElement('caption');
        caption.textContent = 'Add a new row';

        const inputName = document.createElement('input');
        inputName.setAttribute('type', 'text');
        inputName.setAttribute('placeholder', 'Name');

        const inputAge = document.createElement('input');
        inputAge.setAttribute('type', 'number');
        inputAge.setAttribute('placeholder', 'Age');

        const button = document.createElement('button');
        button.setAttribute('type', 'submit');
        button.textContent = 'Add';

        form.appendChild(caption);
        form.appendChild(inputName);
        form.appendChild(inputAge);
        form.appendChild(button);

        tableFormContainer.appendChild(form);

        const table = document.createElement('table');

        const thead = document.createElement('thead');

        const rows = [
            {name: 'John', age: 20},
            {name: 'Jane', age: 21},
            {name: 'Jack', age: 22}
        ];

        const tr = document.createElement('tr');

        const thName = document.createElement('th');
        thName.textContent = 'Name';

        const thAge = document.createElement('th');
        thAge.textContent = 'Age';

        tr.appendChild(thName);
        tr.appendChild(thAge);

        thead.appendChild(tr);

        const tbody = document.createElement('tbody');

        rows.forEach(row => {
            const tr = document.createElement('tr');

            const tdName = document.createElement('td');
            tdName.textContent = row.name;

            const tdAge = document.createElement('td');
            tdAge.textContent = row.age;

            tr.appendChild(tdName);
            tr.appendChild(tdAge);

            tbody.appendChild(tr);
        });

        table.appendChild(thead);
        table.appendChild(tbody);

        tableFormContainer.appendChild(table);

        this.shadow.appendChild(tableFormContainer);
    }

    obtainData() {

        // Si el title es Customers, hacemos una llamada fetch a la API para obtener todos los customers.

        const title = document.getElementByTagName('header-component')[0].getAttribute('title');

        console.log(title);

        if(title === 'Customers') {

                fetch('http://localhost:3000/api/admin/customer', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'x-access-token': localStorage.getItem('token')
                    }
                })
                .then(response => response.json())
                .then(data => {
                    console.log(data);
                }
            );
        }
    }
}

customElements.define('table-form-component', TableForm);