var map;
function initMap() {
    map = new google.maps.Map(document.getElementById("map"), {
        center: { lat: coords[0], lng: coords[1] },
        zoom: 17,
        mapTypeControl: false,
        //mapTypeID: google.maps.mapTypeID
    });

    marker = new google.maps.Marker({
        map,
        draggable: true,
        animation: google.maps.Animation.DROP,
        position: { lat: coords[0], lng: coords[1] },
        preserveViewport: true,
    });
}
//directionsDisplay
var chosenloc = document.getElementById("location_field").value;
var chosentrans = encodeURI(chosenloc);

smuLatLng = [];
coords = [1.296568, 103.852119]; // auto starts center at SCIS

// directionservice allows use of route method, directionrenderer displays the route

// creates the map

function getSMUloc() {
    sch_value = document.getElementById("smulocation").value;
    sch_deets = sch_value.split(",");
    smutrans = encodeURI(sch_deets[0]);

    var url =
        "https://maps.googleapis.com/maps/api/geocode/json?address=" +
        smutrans +
        "&key=API_KEY_HERE&region=SG";

    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            try {
                var data = JSON.parse(this.responseText);

                var location = data["results"][0]["geometry"]["location"];
                console.log(location);
                smuLatLng = [location["lat"], location["lng"]];
                console.log(smuLatLng);

                coords = [smuLatLng[0], smuLatLng[1]];

                initMap();
            } catch (err) {
                document.getElementById("display").innerHTML =
                    "Sorry, invalid address. Please try a valid address!";
            }
        } else if (this.readyState != 4 || this.status != 200) {
        }
    };
    xhttp.open("GET", url, true);
    xhttp.send();
}

function calcRoute() {
    sch_value = document.getElementById("smulocation").value;
    sch_deets = sch_value.split(",");

    sch_postal = sch_deets[0];
    sch_name = sch_deets[1];

    if (smu_position == "from") {
        var request = {
            origin: sch_postal,
            destination: document.getElementById("location_field").value,
            travelMode: google.maps.TravelMode["DRIVING"],
            unitSystem: google.maps.UnitSystem["METRIC"],
        };
        console.log("is it working???");
    } else {
        var request = {
            origin: document.getElementById("location_field").value,
            destination: sch_postal,
            travelMode: google.maps.TravelMode["DRIVING"],
            unitSystem: google.maps.UnitSystem["METRIC"],
        };
    }

    if (document.getElementById("info_hover").innerHTML != "") {
        console.log("===wtf===");
        directionsDisplay.setDirections({ routes: [] });
    }

    directionsService = new google.maps.DirectionsService();
    directionsDisplay = new google.maps.DirectionsRenderer();

    // restrict to singapore...ish
    var strictBounds = [1.29027, 103.851959];

    directionsDisplay.setOptions({
        polylineOptions: {
            strokeColor: "#4e7570",
        },
    });

    directionsService.route(request, function (result, status) {
        const info_hover = document.getElementById("info_hover");
        const loc_outofsg = document.querySelector("#wrongloc");

        if (status == "OK") {
            // get the distance of the route in km
            distance = result.routes[0].legs[0].distance.text;

            if (smu_position == "from") {
                (loc_lat = result.routes[0].legs[0].end_location.lat()),
                    (loc_lng = result.routes[0].legs[0].end_location.lng());
            } else {
                (loc_lat = result.routes[0].legs[0].start_location.lat()),
                    (loc_lng = result.routes[0].legs[0].start_location.lng());
            }

            api_url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${loc_lat},${loc_lng}&key=API_KEY_HERE`;
            axios
                .get(api_url)
                .then((response) => {
                    address_details = response.data.results[0];
                    formatted_address = address_details.formatted_address;
                    // kenming pls convert formatted addresss
                })
                .catch((error) => {
                    console.log(error.message);
                });

            if (1.15948 > loc_lat || loc_lat > 1.47475) {
                loc_outofsg.innerHTML = `<div class='wrong_loc text-danger'>Can you put some location within Singapore .</div>`;
            } else if (103.60468 > loc_lng || loc_lat > 104.08872) {
                loc_outofsg.innerHTML = `<div class='wrong_loc text-danger'>Can you put some location within Singapore .</div>`;
            } else {
                // get distance of route in min
                duration = parseInt(
                    result.routes[0].legs[0].duration.text.split(" ")
                );
                recc_price = parseInt(distance) * 0.15 + 2.8 + duration * 0.15;

                // from smu to indicated location, display route and duration
                if (smu_position == "from") {
                    info_hover.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg"
                                                    width='30'
                                                    height='30'
                                                    viewBox="0 0 512 512"
                                                    fill="#4e7570">
                                                    <path d="M256 512c141.4 0 256-114.6 256-256S397.4 0 256 0S0 114.6 0 256S114.6 512 256 512zM216 336h24V272H216 192V224h24 48 24v24 88h8 24v48H296 216 192V336h24zm72-144H224V128h64v64z"/>
                                                </svg>
                                                <span class="tooltiptext">
                                                    From: <b>${sch_name}</b>
                                                    <br>To: <b>${formatted_address}</b>
                                                    <br>Driving distance: <b>${distance}</b>
                                                    <br>Recommended Pricing: <b>$${recc_price.toFixed(
                                                        2
                                                    )}</b>
                                                    <br>Duration: <b>${
                                                        result.routes[0].legs[0]
                                                            .duration.text
                                                    }</b>
                                                </span>`;
                    marker.setMap(null);
                    directionsDisplay.setMap(null);
                    directionsDisplay.setDirections({
                        routes: [],
                    });

                    directionsDisplay.setDirections(result);
                    directionsDisplay.setMap(map);
                }
                // from indicated to smu, display route and duration
                else {
                    info_hover.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg"
                                                    width='30'
                                                    height='30'
                                                    viewBox="0 0 512 512"
                                                    fill="#4e7570">
                                                    <path d="M256 512c141.4 0 256-114.6 256-256S397.4 0 256 0S0 114.6 0 256S114.6 512 256 512zM216 336h24V272H216 192V224h24 48 24v24 88h8 24v48H296 216 192V336h24zm72-144H224V128h64v64z"/>
                                                </svg>
                                                <span class="tooltiptext">
                                                    From: <b>${formatted_address}</b>
                                                    <br>To: <b>${sch_name}</b>
                                                    <br>Driving distance: <b>${distance}</b>
                                                    <br>Recommended Pricing: <b>$${recc_price.toFixed(
                                                        2
                                                    )}</b>
                                                    <br>Duration: <b>${
                                                        result.routes[0].legs[0]
                                                            .duration.text
                                                    }</b>
                                                </span>`;

                    marker.setMap(null);
                    directionsDisplay.setMap(null);

                    directionsDisplay.setDirections(result);
                    directionsDisplay.setMap(map);

                    // const tooltipTriggerList =
                    //     document.querySelectorAll(
                    //         '[data-bs-toggle="tooltip"]'
                    //     );
                    // const tooltipList = [
                    //     ...tooltipTriggerList,
                    // ].map(
                    //     (tooltipTriggerEl) =>
                    //         new bootstrap.Tooltip(
                    //             tooltipTriggerEl
                    //         )
                    // );
                }
            }
        } else {
            directionsDisplay.setDirections({
                routes: [],
            });

            map.setCenter(coords[0], coords[1]);

            // error message for invalid address
            info_hover.innerHTML = `<div class='wrong_loc'>Stop it. Get some help. Put correct location please.</div>`;
        }
    });
}
// autocomplete objects for all input

// var options = {
//     types: ["(cities)"],
// };

// var input1 = document.getElementById("smulocation");
// var autocomplete1 = new google.maps.places.Autocomplete(
//     input1,
//     options
// );

// var input2 = document.getElementById("location_field");
// var autocomplete2 = new google.maps.places.Autocomplete(
//     input2,
//     options
// );
