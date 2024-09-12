const urlParams = new URLSearchParams(window.location.search);
var params = urlParams.get('Params');
params=params.split(',');
console.log(params);  
const map = L.map('map').setView([20.5937, 78.9629], 5); // Centered on India

    // Load a tile layer from OpenStreetMap
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);

    // Initialize Leaflet Routing Machine without waypoints
    const routeControl = L.Routing.control({
        waypoints: [],
        routeWhileDragging: true,
        createMarker: function(i, wp) { // Display markers
            return L.marker(wp.latLng).bindPopup(`Stop ${i+1}: ${wp.latLng}`);
        }
    }).addTo(map);

    // Example list of cities in the desired route order
    const cities = params;

    const geocoder = L.Control.Geocoder.nominatim();

    // Function to geocode cities sequentially
    function geocodeCities(cities, callback) {
        let waypoints = [];

        function geocodeNextCity(index) {
            if (index >= cities.length) {
                callback(waypoints); // All cities are geocoded, return waypoints
                return;
            }

            geocoder.geocode(cities[index], (results) => {
                if (results.length > 0) {
                    const { center } = results[0];
                    waypoints.push(L.latLng(center.lat, center.lng));
                } else {
                    console.log(`Failed to geocode city: ${cities[index]}`);
                }

                // Proceed to next city
                geocodeNextCity(index + 1);
            });
        }

        geocodeNextCity(0); // Start geocoding the first city
    }

    // Geocode the cities and update the route
    geocodeCities(cities, (waypoints) => {
        routeControl.setWaypoints(waypoints);
    });