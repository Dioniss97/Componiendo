// Un componente js para el menú de navegación para el elemento Send Emails, Add Emails y Add Customers.
import { API_URL } from '../config/config.js';

class NavMenu extends HTMLElement {
    constructor() {
        super();
        this.shadow = this.attachShadow({mode: 'open'});
        this.menuItems = [];
    }

    connectedCallback() {
        this.loadData().then(() => this.render());
    }

    async loadData() {

        let url = `${API_URL}/api/admin/menus/display/${this.getAttribute("menu")}`;

        try{

            let response = await fetch(url, {
                headers: {
                    'x-access-token': sessionStorage.getItem('accessToken'),
                }
            });

            let data = await response.json();
            this.menuItems =  data.menuItems;

        }catch(error){
            console.log(error);
        }
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

        this.menuItems.forEach((item) => {

            const menuItem = document.createElement('div');
            menuItem.classList.add('menu-item');
            menuItem.setAttribute('url', item.customUrl);
            menuItem.textContent = item.name;

            nav.appendChild(menuItem);
        });

        this.shadow.appendChild(nav);

        let elements = this.shadow.querySelectorAll('.menu-item');

        elements.forEach((element) => {
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