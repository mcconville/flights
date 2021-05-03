class Map extends HTMLElement {

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

    async connectedCallback() {
        let res = await fetch('./components/map.html')
        var sr = this.shadowRoot;
        sr.innerHTML = await res.text();

        var m = sr.getElementById('map');

        mapboxgl.accessToken = 'pk.eyJ1IjoiYW50b25tYyIsImEiOiJjaW82am5xOGkwMmY0djRrcWtlajlnNWdwIn0.ZniLehzcno7t1dO__lhe5Q';
        var map = new mapboxgl.Map({
            container: m,
            attribution_enabled: false,
            center: [-96, 37.8],
            zoom: 1,
            style: 'mapbox://styles/antonmc/cjtkgcy972e891fo1o6r32ud0'
        });

        // San Francisco
        var origin = [-122.414, 37.776];

        // Washington DC
        var destination = [-77.032, 38.913];

        // A simple line from origin to destination.
        var route = {
            'type': 'FeatureCollection',
            'features': [{
                'type': 'Feature',
                'geometry': {
                    'type': 'LineString',
                    'coordinates': [origin, destination]
                }
            }]
        };

        // A single point that animates along the route.
        // Coordinates are initially set to origin.
        var point = {
            'type': 'FeatureCollection',
            'features': [{
                'type': 'Feature',
                'properties': {},
                'geometry': {
                    'type': 'Point',
                    'coordinates': origin
                }
            }]
        };

        // Calculate the distance in kilometers between route start/end point.
        var lineDistance = turf.length(route.features[0]);

        var arc = [];

        // Number of steps to use in the arc and animation, more steps means
        // a smoother arc and animation, but too many steps will result in a
        // low frame rate
        var steps = 500;

        // Draw an arc between the `origin` & `destination` of the two points
        for (var i = 0; i < lineDistance; i += lineDistance / steps) {
            var segment = turf.along(route.features[0], i);
            arc.push(segment.geometry.coordinates);
        }

        // Update the route with calculated arc coordinates
        route.features[0].geometry.coordinates = arc;

        // Used to increment the value of the point measurement against the route.
        var counter = 0;


        map.on('load', function () {
            // Add a source and layer displaying a point which will be animated in a circle.
            map.addSource('route', {
                'type': 'geojson',
                'data': route
            });

            map.addSource('point', {
                'type': 'geojson',
                'data': point
            });

            map.addLayer({
                'id': 'route',
                'source': 'route',
                'type': 'line',
                'paint': {
                    'line-width': 2,
                    'line-color': '#007cbf'
                }
            });

            map.addLayer({
                'id': 'point',
                'source': 'point',
                'type': 'symbol',
                'layout': {
                    // This icon is a part of the Mapbox Streets style.
                    // To view all images available in a Mapbox style, open
                    // the style in Mapbox Studio and click the "Images" tab.
                    // To add a new image to the style at runtime see
                    // https://docs.mapbox.com/mapbox-gl-js/example/add-image/
                    'icon-image': 'airport-15',
                    'icon-rotate': ['get', 'bearing'],
                    'icon-rotation-alignment': 'map',
                    'icon-allow-overlap': true,
                    'icon-ignore-placement': true
                }
            });
        });



    }
}

try {
    customElements.define('map-element', Map);
} catch (err) {
    const h3 = document.createElement('h3')
    h3.innerHTML = err
    document.body.appendChild(h3)
}