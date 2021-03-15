mapboxgl.accessToken = mapToken;

const map = new mapboxgl.Map({
    container: 'show-map', // container ID
    style: 'mapbox://styles/mapbox/outdoors-v11', // style URL
    center: campground.geometry.coordinates, // starting position [lng, lat]
    zoom: 7 // starting zoom
});

new mapboxgl.Marker()
    .setLngLat(campground.geometry.coordinates)
    .setPopup(
        new mapboxgl.Popup({ offset: 25 })
            .setHTML(
                `<h6>${campground.title}</h6>`
            )
    )
    .addTo(map);

// Add zoom and rotation controls to the map.
map.addControl(new mapboxgl.NavigationControl());