/* eslint-disable */

// **   didnt exported anything because parcel isn't working
//      I'll copy by hand all the data to the budnle.js file instaed of dealing with parcel
//      Will get babel and axios from a cdn (include in base.pug)   **

// const locations = JSON.parse(document.getElementById('map').dataset.locations);
// console.log(locations);

const displayMap = locations => {
    mapboxgl.accessToken =
        'pk.eyJ1Ijoic2FnaXJkdCIsImEiOiJja3k3YWR6eGIwcmxuMnBydng4Mmw5bjl4In0.SCZ7oTDWt2g052huqqC3mA';

    const map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/sagirdt/cky7dnky25ue114p635r595iu',
        scrollZoom: false,
        // center: [-118.113491, 34.111745],
        // zoom: 9,
        // interactive: false,
    });

    const bounds = new mapboxgl.LngLatBounds();

    locations.forEach(loc => {
        // Create a marker
        const el = document.createElement('div');
        el.className = 'marker';

        // Add the marker
        new mapboxgl.Marker({
            element: el,
            anchor: 'bottom',
        })
            .setLngLat(loc.coordinates)
            .addTo(map);

        // Add a popup
        new mapboxgl.Popup({
            offset: 30,
        })
            .setLngLat(loc.coordinates)
            .setHTML(`<p>Day ${loc.day}: ${loc.description}</p>`)
            .addTo(map);

        // Extend the map bound to include the current location
        bounds.extend(loc.coordinates);
    });

    map.fitBounds(bounds, {
        padding: {
            top: 250,
            bottom: 150,
            left: 100,
            right: 100,
        },
    });
};
