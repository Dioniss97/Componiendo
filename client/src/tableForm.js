class TableForm extends HTMLElement {
    constructor() {
        super();
        this.shadow = this.attachShadow({mode: 'open'});
        this.render();
        // this.obtainData();
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

            th, td {
                padding: 10px;
                border: 1px solid #ccc;
            }

        </style>
        `;

        // FORM

        const tableFormContainer = document.createElement('div');
        tableFormContainer.setAttribute('class', 'table-form-container');

        const form = document.createElement('form');

        const caption = document.createElement('caption');
        caption.textContent = 'Compose Email';

        const inputSubject = document.createElement('input');
        inputSubject.setAttribute('type', 'text');
        inputSubject.setAttribute('placeholder', 'Subject');

        const inputContent = document.createElement('input');
        inputContent.setAttribute('type', 'text');
        inputContent.setAttribute('placeholder', 'Content');

        const button = document.createElement('button');
        button.setAttribute('type', 'submit');
        button.textContent = 'Send';

        form.appendChild(caption);
        form.appendChild(inputSubject);
        form.appendChild(inputContent);
        form.appendChild(button);

        tableFormContainer.appendChild(form);

        // TABLE

        const table = document.createElement('table');

        const thead = document.createElement('thead');

        const tr = document.createElement('tr');

        const thName = document.createElement('th');
        thName.textContent = 'Name';

        const thAge = document.createElement('th');
        thAge.textContent = 'Age';

        console.log(thName.textContent);

        // APPEND

        tr.appendChild(thName);
        tr.appendChild(thAge);

        thead.appendChild(tr);

        const tbody = document.createElement('tbody');

        // // Si el title es Customers, hacemos una llamada fetch a la API para obtener todos los customers.

        // const title = document.querySelector('table-form-component').getAttribute('for');

        // console.log(sessionStorage.getItem('token'));

        // if(title === 'customers') {

        //         fetch('http://127.0.0.1:8080/api/admin/customer/', {
        //             method: 'GET',
        //             headers: {
        //                 'Content-Type': 'application/json',
        //                 'x-access-token': sessionStorage.getItem('token')
        //             }
        //         })
        //         .then(response => response.json())
        //         .then(data => {
        //             console.log(data);
        //             return this.render(data);
        //         }
        //     );
        // }

        // const rows = data;

        const rows = [
            {
                name: 'John',
                age: 20
            },
            {
                name: 'Jane',
                age: 25
            },
            {
                name: 'Peter',
                age: 30
            }
        ];

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

    // obtainData() {

    //     // Si el title es Customers, hacemos una llamada fetch a la API para obtener todos los customers.

    //     const title = document.querySelector('table-form-component').getAttribute('for');

    //     console.log(sessionStorage.getItem('token'));

    //     if(title === 'customers') {

    //             fetch('http://127.0.0.1:8080/api/admin/customer/', {
    //                 method: 'GET',
    //                 headers: {
    //                     'Content-Type': 'application/json',
    //                     'x-access-token': sessionStorage.getItem('token')
    //                 }
    //             })
    //             .then(response => response.json())
    //             .then(data => {
    //                 console.log(data);
    //                 return this.render(data);
    //             }
    //         );
    //     }
    // }
}

customElements.define('table-form-component', TableForm);