class Flights extends HTMLElement {

    SELECTEDSUFFIX = '-selected.svg';
    DESELECTEDSUFFIX = '-deselected.svg'

    static get observedAttributes() {
        return ['imagename', 'viewname', 'mode'];
    }

    constructor() {
        super();
        console.log('Initializing Flights Component');
        let templateContent = '<div></div>';
        this.labels = [];
        this.datapath = "";
        const shadow = this.attachShadow({
            mode: 'open'
        })
    }

    async connectedCallback() {
        let res = await fetch('./components/flights.html')
        var sr = this.shadowRoot;
        sr.innerHTML = await res.text();
        // this.showTaste();

       

    }

    randomRestaurantList(restaurants) {

        var arr = [];
        while (arr.length < 5) {
            var r = Math.floor(Math.random() * this.restaurants.length - 1) + 1;
            if (arr.indexOf(r) === -1) arr.push(r);
        }

        var component = this;

        var sr = component.shadowRoot;

        var anchor = sr.getElementById('restaurantlist');
        anchor.innerHTML = "";


        arr.forEach(function (index) {
            var restaurant = restaurants[index];
            var element = document.createElement('restaurant-element');
            element.setAttribute("restaurant", restaurant.name);
            element.setAttribute("type", restaurant.type);
            anchor.appendChild(element);
        })

    }

    showRestaurantOptions(event) {

        let id = event.currentTarget.id;

        // let id = event.path[1].id;

        let component = this;

        var sr = component.shadowRoot;

        var anchor = sr.getElementById('restaurantlist');
        anchor.innerHTML = "";

        var cap = 'cafes ...';

        if (id != 'cafe') {
            cap = id + ' restaurants ...';
        }

        this.setCaption(cap);

        this.restaurants.forEach(function (restaurant) {
            if (restaurant.type == id) {
                var element = document.createElement('restaurant-element');
                element.setAttribute("restaurant", restaurant.name);
                element.setAttribute("type", restaurant.type);
                anchor.appendChild(element);
            }
        })
    }

    setMode(mode) {
        this.mode = mode;

        var imagestring = this.imagename;

        if (this.mode == 'active') {
            imagestring = imagestring + this.SELECTEDSUFFIX;
        } else {
            imagestring = imagestring + this.DESELECTEDSUFFIX;
        }

        this.buttonimage.src = './images/' + imagestring;
    }

    setEnabled() {
        this.setMode('active');
    }

    setDisabled() {
        this.setMode('inactive');
    }

    setCaption(caption) {
        var sr = this.shadowRoot;
        var cap = sr.getElementById('caption');
        cap.innerHTML = caption;
    }

    showTaste() {

        let component = this;

        var sr = component.shadowRoot;

        var anchor = sr.getElementById('restaurantlist');


        // anchor.addEventListener('RESTAURANT-SELECTION', e => {
        //     console.log(e.detail.eventData.restaurant);
        //     anchor.innerHTML = "";

        //     var selected = e.detail.eventData.restaurant;

        //     component.restaurants.forEach(function (restaurant) {
        //         if (restaurant.name == selected) {

        //             component.setCaption('Menu for ' + restaurant.name + ' ...');

        //             restaurant.menu.forEach(function (menuitem) {
        //                 let entry = document.createElement('menuitem-element');
        //                 entry.setAttribute('dish', menuitem.item);
        //                 entry.setAttribute('cost', menuitem.cost);
        //                 entry.setAttribute('restaurant', restaurant.name);
        //                 entry.setAttribute('type', restaurant.type);
        //                 anchor.appendChild(entry);
        //             })
        //         }
        //     })
        // });
    }
}


try {
    customElements.define('flights-element', Flights);
} catch (err) {
    const h3 = document.createElement('h3')
    h3.innerHTML = err
    document.body.appendChild(h3)
}