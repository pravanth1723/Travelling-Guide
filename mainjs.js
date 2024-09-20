const stations = [
    "Agra", "Ahmedabad", "Ajmer", "Akola", "Ambala", "Amritsar", "Asansol", "Aurangabad", "Bangalore",
    "Bareilly", "Bhagalpur", "Bhopal", "Bhubaneswar", "Bhusaval", "Bilaspur", "Chandigarh", "Chennai",
    "Chhapra", "Coimbatore", "Cuttack", "Darbhanga", "Dehradun", "Dhanbad", "Durg", "Ernakulam",
    "Erode", "Gaya", "Ghaziabad", "Gorakhpur", "Guntur", "Guwahati", "Gwalior", "Haridwar", "Hatia",
    "Hazur Sahib Nanded", "Howrah", "Hubli", "Indore", "Jabalpur", "Jaipur", "Jalandhar City", "Jammu",
    "Jhansi", "Jodhpur", "Kanpur", "Katihar", "Katni", "Katpadi", "Kharagpur", "Kollam", "Kota",
    "Kozhikode", "Lucknow", "Ludhiana", "Madgaon", "Madurai", "Malda", "Malkapur", "Mangalore",
    "Manmad", "Mathura", "Moradabad", "Mumbai", "Muzaffarpur", "Mysore", "Nagpur", "Nasik", "Nellore",
    "New Delhi", "New Jalpaiguri", "Palakkad", "Patna", "Prayagraj", "Pune", "Pandit Deen Dayal Upadhyaya",
    "Puri", "Raipur", "Rajahmundry", "Rajkot", "Ranchi", "Ratlam", "Rourkela", "Salem", "Satna",
    "Secunderabad", "Siwan", "Solapur", "Surat", "Tatanagar", "Tiruchirappalli", "Tirunelveli", "Tirupati",
    "Thrissur", "Thiruvananthapuram", "Udaipur", "Ujjain", "Vapi", "Vadodara", "Varanasi", "Vijayawada",
    "Visakhapatnam"
];


// Array to store selected stations
window.selectedStations = [];
let sourceStation = '';

// Populate the source station dropdown
window.onload = function () {
    const sourceSelect = document.getElementById("sourceStation");
    stations.forEach(station => {
        const option = document.createElement('option');
        option.value = station;
        option.textContent = station;
        sourceSelect.appendChild(option);
    });
};

// Function to handle the selection of the source station
function handleSourceSelection() {
    sourceStation = document.getElementById("sourceStation").value;
    selectedStations = [];  // Clear previous selections
    document.getElementById("stationDropdowns").innerHTML = '';  // Clear station dropdowns
}

// Function to create dropdowns excluding the source station
function createDropdowns() {
    const date = document.getElementById('dateInput').value;
    const time = document.getElementById('timeInput').value;
    const dateTimeString = `${date}T${time}`;
    window.dateTime = new Date(dateTimeString);
    // alert(dateTime);
    const numStations = document.getElementById("numStations").value;
    const container = document.getElementById("stationDropdowns");

    // Clear previous dropdowns if any
    container.innerHTML = '';

    if (!sourceStation) {
        alert('Please select a source station first.');
        return;
    }

    for (let i = 0; i < numStations; i++) {
        const select = document.createElement('select');
        select.setAttribute('class', 'stationDropdown');
        select.setAttribute('data-index', i);

        // Add an empty default option
        const defaultOption = document.createElement('option');
        defaultOption.textContent = 'Select a station';
        defaultOption.value = '';
        select.appendChild(defaultOption);

        // Populate dropdown with station options, excluding the source station and already selected stations
        stations.forEach(station => {
            if (station !== sourceStation && !selectedStations.includes(station)) {
                const option = document.createElement('option');
                option.value = station;
                option.textContent = station;
                select.appendChild(option);
            }
        });

        select.addEventListener('change', handleSelection);
        container.appendChild(select);
        container.appendChild(document.createElement('br'));  // Line break
    }
}

// Function to handle station selection in the dropdowns
function handleSelection(event) {
    const dropdown = event.target;
    const selectedStation = dropdown.value;
    const index = dropdown.getAttribute('data-index');

    // If already selected, remove previous selection from array
    const previouslySelectedStation = selectedStations[index];
    if (previouslySelectedStation) {
        selectedStations[index] = '';  // Clear old selection
    }

    // Update selectedStations array with the new selection
    selectedStations[index] = selectedStation;

    // Refresh the dropdowns to reflect the new selection
    refreshDropdowns();
}

// Function to refresh the dropdown options after a change
function refreshDropdowns() {
    const dropdowns = document.querySelectorAll('.stationDropdown');
    dropdowns.forEach(dropdown => {
        const currentValue = dropdown.value;
        const index = dropdown.getAttribute('data-index');

        // Clear current options
        dropdown.innerHTML = '';
        const defaultOption = document.createElement('option');
        defaultOption.textContent = 'Select a station';
        defaultOption.value = '';
        dropdown.appendChild(defaultOption);

        // Add available stations excluding already selected and source station
        stations.forEach(station => {
            if (station !== sourceStation && (!selectedStations.includes(station) || selectedStations[index] === station)) {
                const option = document.createElement('option');
                option.value = station;
                option.textContent = station;
                if (station === currentValue) {
                    option.selected = true;  // Keep the selected station as selected
                }
                dropdown.appendChild(option);
            }
        });
    });
}
let dmat;
// Function to get and display the selected stations
function getSelectedStations() {
    const selectedStationsList = document.getElementById('selectedStationsList');
    selectedStationsList.innerHTML = '';  // Clear previous list

    selectedStations.forEach(station => {
        if (station) {
            const li = document.createElement('li');
            li.textContent = station;
            // selectedStationsList.appendChild(li);
        }
    });
    selectedStations.unshift(sourceStation);

    console.log('Source Station:', sourceStation);
    console.log('All Stations:', selectedStations.filter(Boolean));
    window.distanceMatrix = Array(selectedStations.length)
        .fill(null)
        .map(() => Array(selectedStations.length).fill(null));
    window.timeMatrix = Array(selectedStations.length)
        .fill(null)
        .map(() => Array(selectedStations.length).fill(null));


    // Function to send request and get distance between two stations
    function getDistanceBetweenStations(source, destination, i, j) {
        const data = JSON.stringify({
            route: [
                {
                    country: 'IND',
                    name: source
                },
                {
                    country: 'IND',
                    name: destination
                }
            ]
        });

        $.ajax({
            url: 'https://distanceto.p.rapidapi.com/distance/route/detailed',
            method: 'POST',
            headers: {
                'x-rapidapi-key': '33969e7105mshebd0b284f273777p140b4ejsn0f33ce9280dc',
                'x-rapidapi-host': 'distanceto.p.rapidapi.com',
                'Content-Type': 'application/json'
            },
            data: data,
            success: function (response) {
                const distance = response.route.car.countries[0].distance;  // Adjust based on API response structure
                const timetaken = response.route.car.countries[0].duration;
                distanceMatrix[i][j] = distance;
                distanceMatrix[j][i] = distance;  // Mirror the value for [i][j] and [j][i]
                timeMatrix[i][j] = timetaken;
                timeMatrix[j][i] = timetaken;

                console.log(`Distance between ${source} and ${destination}: ${distance}`);
            },
            error: function (err) {
                console.error(`Error getting distance between ${source} and ${destination}:`, err);
            }
        });
    }

    // Iterate over the stations and calculate distances for each pair
    for (let i = 0; i < selectedStations.length; i++) {
        for (let j = i + 1; j < selectedStations.length; j++) {
            getDistanceBetweenStations(selectedStations[i], selectedStations[j], i, j);
        }
    }

    console.log("Selected Stations:", selectedStations);
    console.log("Distance Matrix (initially):", distanceMatrix);
    localStorage.setItem('distanceMatrix', distanceMatrix);
    // alert(localStorage.getItem('distanceMatrix'));
    // Add stations to the list (for display purposes)
    selectedStations.forEach(station => {
        const li = document.createElement('li');
        li.textContent = station;
        selectedStationsList.appendChild(li);
    });
}

function cal() {
    //const distanceMatrix=localStorage.getItem('distanceMatrix');
    console.log(distanceMatrix);
    const n = distanceMatrix.length;
    const INF = Infinity;
    let dp, path;

    function initializeDP() {
        dp = Array.from({ length: 1 << n }, () => Array(n).fill(-1));
        path = Array.from({ length: 1 << n }, () => Array(n).fill(-1));
    }

    function tsp(mask, pos) {
        if (mask === (1 << n) - 1) {
            return distanceMatrix[pos][0];
        }

        if (dp[mask][pos] !== -1) {
            return dp[mask][pos];
        }

        let ans = INF;
        let bestNextCity = -1;

        for (let city = 0; city < n; city++) {
            if (!(mask & (1 << city))) {
                let newCost = distanceMatrix[pos][city] + tsp(mask | (1 << city), city);
                if (newCost < ans) {
                    ans = newCost;
                    bestNextCity = city;
                }
            }
        }

        path[mask][pos] = bestNextCity;
        return dp[mask][pos] = ans;
    }

    function solveTSP() {
        initializeDP();
        window.result = tsp(1, 0);
        window.optimalPath = [0];
        let mask = 1;
        let currentCity = 0;

        while (mask !== (1 << n) - 1) {
            let nextCity = path[mask][currentCity];
            optimalPath.push(nextCity);
            mask |= (1 << nextCity);
            currentCity = nextCity;
        }
        // console.log(dp);
        optimalPath.push(0);  // Return to the starting city
        // alert(result);
        const route = document.getElementById('route');
        route.innerHTML = '';  // Clear previous list
        for (var i = 0; i < optimalPath.length - 1; i++) {
            console.log(optimalPath[i] + '->' + optimalPath[i + 1]);
            console.log(distanceMatrix[optimalPath[i]][optimalPath[i + 1]]);
            console.log(timeMatrix[optimalPath[i]][optimalPath[i + 1]]);
            const li = document.createElement('ul');
            route.appendChild(li);
            if (i != 0)
                dateTime.setHours(dateTime.getHours() + 48);
            // dt = dateTime;
            const dt = new Date(dateTime.getTime());
            dateTime.setHours(dateTime.getHours() + Math.round(timeMatrix[optimalPath[i]][optimalPath[i + 1]] / 3600));
            li.innerHTML = `
<li class='city'>
    <strong></strong> ${selectedStations[optimalPath[i]]}
</li>
<li>
    <div>
    <strong>Start at : </strong> ${dt}
    </div>
    <div>
    <strong>Distance: </strong> ${Math.round(distanceMatrix[optimalPath[i]][optimalPath[i + 1]], 5)} km<br>
    </div>
    <div>
    <strong>Duration: </strong> ${Math.round(timeMatrix[optimalPath[i]][optimalPath[i + 1]] / 3600)} hours<br>
    </div>
    <div>
    <strong>You will reach by : </strong> ${dateTime}
    </div>
</li>
<li class='city'>
    <strong></strong> ${selectedStations[optimalPath[i + 1]]}<br>
</li>

`;
        }
        var li = document.createElement('li');
        li.textContent = `Total ${result} KM`;
        route.appendChild(li);
        // function hotels() {

        window.hotels = [];
        window.locationids = [];
        $('#spinner').show();
        for (var i = 1; i < optimalPath.length - 1; i++) {

            const settings = {
                async: true,
                crossDomain: true,
                url: `https://tripadvisor16.p.rapidapi.com/api/v1/hotels/searchLocation?query=${selectedStations[optimalPath[i]]}`,
                method: 'GET',
                headers: {
                    'x-rapidapi-key': '33969e7105mshebd0b284f273777p140b4ejsn0f33ce9280dc',
                    'x-rapidapi-host': 'tripadvisor16.p.rapidapi.com'
                }
            };

            $.ajax(settings).done(function (response) {
                locationids.push(response.data[0].geoId);

            });
            // if(i==optimalPath.length - 2){
            // 	printhotels();
            // }
        }
        console.log(locationids.length);
        $('#spinner').hide();
    }

    solveTSP();
    // hotelsfun();
}
function printhotels() {
    window.hotelprice = [];
    console.log(locationids);
    $('#spinner').show();
    for (var i = 0; i < locationids.length; i++) {
        var price = 10000000;

        
        const settings = {
            async: true,
            crossDomain: true,
            url: `https://tripadvisor16.p.rapidapi.com/api/v1/hotels/searchHotels?geoId=${locationids[i]}&checkIn=2024-10-20&checkOut=2024-10-22&pageNumber=1&currencyCode=INR`,
            method: 'GET',
            headers: {
                'x-rapidapi-key': '33969e7105mshebd0b284f273777p140b4ejsn0f33ce9280dc',
                'x-rapidapi-host': 'tripadvisor16.p.rapidapi.com'
            }
        };

        $.ajax(settings).done(function (response) {
            console.log(response);
            console.log(optimalPath);
            var hotelincity = [];
            const hostelhtml = document.getElementById('cityHotelsList');
            var cityLi = document.createElement('ul');
            var tem = document.createElement('li');
            tem.textContent = selectedStations[optimalPath[i + 1]];
            cityLi.appendChild(tem);
            // hostelhtml.appendChild(cityLi);
            console.log(selectedStations[optimalPath[i + 1]]);
            for (var j1 = 0; j1 < Math.min(5, response.data.data.length); j1++) {

                // var hotelList = document.createElement('ul');
                var hotel = response.data.data[j1];
                var hotelLi = document.createElement('li');
                hotelLi.textContent = hotel.title + " - Price: " + hotel.priceForDisplay;  // Hotel name and price
                // hotelList.appendChild(hotelLi);
                let priceWithoutSymbols = hotel.priceForDisplay.replace(/[₹,]/g, '');
                if (priceWithoutSymbols) {
                    var priceint = parseInt(priceWithoutSymbols, 10);
                    price = Math.min(price, priceint);
                }
                cityLi.appendChild(hotelLi);
                // }
            }
            if (price)
                hotelprice.push(price);
            price=1e7;
            hostelhtml.appendChild(cityLi);

            hotels.push(hotelincity);
        });
    }
    $('#spinner').hide();

}
function costdetails() {
    // alert(hotelprice);
    var hotelscharges = 0;
    alert(hotelprice);
    for (var i = 0; i < hotelprice.length; i++) {
        hotelscharges += hotelprice[i];
    }
    hotelscharges = hotelscharges * 2;//2 days in every city
    var temp = document.getElementById('details');
    var num = parseInt(document.getElementById('milage').value);
    var persons = parseInt(document.getElementById('persons').value);

    let date2 = new Date(dateTime.getFullYear(), dateTime.getMonth(), dateTime.getDate());
    var date1 = document.getElementById('dateInput').value;
    date1 = new Date(date1);
    let timeDifference = Math.abs(date2 - date1);
    let days = Math.ceil(timeDifference / (1000 * 60 * 60 * 24));

    var fuelcost = (result / num) * 110;
    var toll = (result / 150) * 200;
    var food = persons * 500 * days;
    var total = hotelscharges + toll + fuelcost + food;

    temp.innerHTML = `
    <div>
    <strong>Fuel cost estimating 110 rupees/litre : </strong> ${fuelcost}
    </div>
    <div>
    <strong>Toll charges estimating 200 rupees for every 150 km : </strong> ${toll}<br>
    </div>
    <div>
    <strong>Hotel Room Charges considering cheapest hotel in every city per 2 days : </strong> ${hotelscharges}<br>
    </div>
    <div>
    <strong>Food Charges considering 500 per day per person : </strong> ${food}<br>
    </div>
    <div>
    <strong>Total Estimation</strong> ${total}
    </div>
    `;

}
function maps() {
    var locs = '';
    for (var i = 0; i < optimalPath.length; i++) {
        locs += selectedStations[optimalPath[i]] + ',';
    }
    locs = locs.slice(0, -1);
    window.location = "mapview.html?Params=" + encodeURIComponent(locs);
}
// }
