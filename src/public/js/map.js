
// Your Mapbox access token
mapboxgl.accessToken = mapToken;

// Initialize the map
var map = new mapboxgl.Map({
    container: 'map', // The ID of the container element
    style: 'mapbox://styles/mapbox/streets-v11', // The style URL
    center: coordinates, // Starting position [lng, lat]
    zoom: 8 // Starting zoom level
});

// Add navigation controls (zoom and rotation)
map.addControl(new mapboxgl.NavigationControl());

//marker
const marker = new mapboxgl.Marker({color: "red"})
    .setLngLat(coordinates) // Marker position [longitude, latitude]
    .setPopup(new mapboxgl.Popup({ offset: 25 })
        .setHTML(`<h1>${title}</h1><p>Exact location will be provided after booking</p>`)
        .setMaxWidth("300px")
    )
    .addTo(map);

// Remove the `aria-hidden` attribute from the popup close button
map.on('render', function() {
    document.querySelectorAll('.mapboxgl-popup-close-button').forEach(button => {
        button.removeAttribute('aria-hidden');
    });
});