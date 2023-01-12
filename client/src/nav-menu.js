// Un componente js para el menú de navegación para el elemento Send Emails, Add Emails y Add Customers.

class NavMenu extends HTMLElement {
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

            header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                background-color: #333;
                color: #fff;
            }

            nav {
                display: flex;
                justify-content: space-evenly;
                color: #fff;
            }

            div {
                text-decoration: none;
                color: #fff;
                width: 100%;
                padding: .6rem;
                text-align: center;
                background-color: #333;
            }

            div:hover {
                color: #000;
                cursor: pointer;
                background-color: #888;
            }

            div:active {
                color: #000;
                background-color: #ccc;
            }

        </style>
        `;

        const nav = document.createElement('nav');

        const addEmails = document.createElement('div');
        addEmails.classList.add('menu-item');
        addEmails.setAttribute('url', '/add-emails');
        addEmails.textContent = 'Emails';

        const addCustomers = document.createElement('div');
        addCustomers.classList.add('menu-item');
        addCustomers.setAttribute('url', '/add-customers');
        addCustomers.textContent = 'Customers';


        nav.appendChild(addEmails);
        nav.appendChild(addCustomers);

        this.shadow.appendChild(nav);

        let menuItems = this.shadow.querySelectorAll('.menu-item');

        menuItems.forEach((element) => {
            console.log(element)
            element.addEventListener('click', (e) => {
                document.dispatchEvent(new CustomEvent('newUrl', {
                    detail: {
                        url: element.getAttribute('url'),
                        title: element.textContent
                    }
                }));
            });
        });


    }
}

customElements.define('nav-menu-component', NavMenu);