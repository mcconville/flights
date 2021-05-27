class Picker extends HTMLElement {

    static get observedAttributes() {
        return ['source', 'destination'];
    }

    constructor() {
        super();
        let templateContent = '<div></div>';
        this.labels = [];
        this.datapath = "";
        const shadow = this.attachShadow({
            mode: 'open'
        })
    }

    createOption(count, element) {
        var option = document.createElement('option');
        option.value = count;
        option.innerHTML = element.iata_code;
        option.airport = element;
        count++;
        return option;
    }

    selectOrigin(){
        console.log('select origin');
    }

    async connectedCallback() {
        let res = await fetch('./components/picker.html')
        var sr = this.shadowRoot;
        sr.innerHTML = await res.text();

        var m = sr.getElementById('map');

        var picker = this;

        fetch('../data/airports.json')
            .then(response => response.json())
            .then(data => {
                this.data = data;

                var o = sr.getElementById('origin');
                var d = sr.getElementById('destination');

                o.onselect = picker.selectOrigin;

                // var customEvent = new CustomEvent('ORDER-PLACED', {
                //     detail: {
                //         eventData: {
                //             "order": orderinfo
                //         }
                //     },
                //     bubbles: true
                // });
        
                // component.dispatchEvent(customEvent);

                var count = 1;

                this.data.forEach(element => {
                    var option = picker.createOption(count,element);
                    count++;
                    o.appendChild(option);
                });

                this.data.forEach(element => {
                    var option = picker.createOption(count,element);
                    count++;
                    d.appendChild(option);
                });
            });

    }
}

try {
    customElements.define('picker-element', Picker);
} catch (err) {
    const h3 = document.createElement('h3')
    h3.innerHTML = err
    document.body.appendChild(h3)
}