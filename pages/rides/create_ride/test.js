import { write_ride, find_rid } from "../../../index.js";

document.getElementById("rides").addEventListener("click", write_ride_local);
function write_ride_local() {
    var user = "alice";

    // const database = getDatabase();
    // const chats = ref(database, `users/${username}`)
    // onValue(chats, (snapshot) => {

    //   const data = snapshot.val();
    //   var userid

    // })
    var rideid = 7;

    var smu_to_from = "To";

    var user_address = "abc123";
    // console.log(address)
    var smu_location = "LKCSB";
    var cost = 56;
    var max_capacity = 4;
    var frequency = 2;
    var date = "11/12/22";
    var time = "11";
    var users_offered = [];
    var area = "Changi Prison";
    write_ride(
        smu_location,
        smu_to_from,
        user,
        rideid,
        user_address,
        cost,
        max_capacity,
        date,
        time,
        users_offered,
        area
    );
}

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
        "&key=API_KEY_HERE";

    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        // console.log(this.readyState, this.status)
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

    if (document.getElementById("problematic").innerHTML != "") {
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
        const output = document.getElementById("problematic");
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

            if (1.15948 > loc_lat || loc_lat > 1.47475) {
                loc_outofsg.innerHTML = `<div class='wrong_loc'>Can you put some location within Singapore .</div>`;
            } else if (103.60468 > loc_lng || loc_lat > 104.08872) {
                loc_outofsg.innerHTML = `<div class='wrong_loc'>Can you put some location within Singapore .</div>`;
            } else {
                // get distance of route in min
                duration = parseInt(
                    result.routes[0].legs[0].duration.text.split(" ")
                );
                recc_price = parseInt(distance) * 0.15 + 2.8 + duration * 0.15;

                // from smu to indicated location, display route and duration
                if (smu_position == "from") {
                    output.innerHTML = `<div class='alert-info'>
                                <a class="d-inline-block text-align mx-5" data-bs-toggle="tooltip"
                                data-bs-html='true'
                                data-bs-placement="right"
                                data-bs-title="From: ${sch_name}, ${sch_postal}
                                <br>To: ${
                                    document.getElementById("location_field")
                                        .value
                                }
                                <br>Driving distance: ${distance}
                                <br>Recommended Pricing: $${recc_price.toFixed(
                                    2
                                )}
                                <br>Duration: ${
                                    result.routes[0].legs[0].duration.text
                                }</div>"
                                data-bs-custom-class="custom-tooltip">
                                    <svg xmlns="http://www.w3.org/2000/svg"
                                    width='30'
                                    height='30'
                                    viewBox="0 0 512 512"
                                    fill="#4e7570">
                                    <path d="M256 512c141.4 0 256-114.6 256-256S397.4 0 256 0S0 114.6 0 256S114.6 512 256 512zM216 336h24V272H216 192V224h24 48 24v24 88h8 24v48H296 216 192V336h24zm72-144H224V128h64v64z"/>
                                    </svg>
                                </a>`;
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
                    output.innerHTML = `<div class='alert-info'>
                                    <a class="d-inline-block text-align mx-5" data-bs-toggle="tooltip"
                                    data-bs-html='true'
                                    data-bs-placement="right"
                                    data-bs-title="From: ${
                                        document.getElementById(
                                            "location_field"
                                        ).value
                                    }
                                    <br>To: ${sch_name}, ${sch_postal}
                                    <br>Driving distance: ${distance}
                                    <br>Recommended Pricing: $${recc_price.toFixed(
                                        2
                                    )}
                                    <br>Duration: ${
                                        result.routes[0].legs[0].duration.text
                                    }</div>"
                                    data-bs-custom-class="custom-tooltip">
                                        <svg xmlns="http://www.w3.org/2000/svg"
                                        width='30'
                                        height='30'
                                        viewBox="0 0 512 512"
                                        fill="#4e7570">
                                        <path d="M256 512c141.4 0 256-114.6 256-256S397.4 0 256 0S0 114.6 0 256S114.6 512 256 512zM216 336h24V272H216 192V224h24 48 24v24 88h8 24v48H296 216 192V336h24zm72-144H224V128h64v64z"/>
                                        </svg>
                                    </a>`;

                    // end

                    marker.setMap(null);
                    directionsDisplay.setMap(null);

                    directionsDisplay.setDirections(result);
                    directionsDisplay.setMap(map);

                    const tooltipTriggerList = document.querySelectorAll(
                        '[data-bs-toggle="tooltip"]'
                    );
                    const tooltipList = [...tooltipTriggerList].map(
                        (tooltipTriggerEl) =>
                            new bootstrap.Tooltip(tooltipTriggerEl)
                    );
                }
            }
        } else {
            directionsDisplay.setDirections({
                routes: [],
            });

            map.setCenter(coords[0], coords[1]);

            // error message for invalid address
            output.innerHTML = `<div class='wrong_loc'>Stop it. Get some help. Put correct location please.</div>`;
        }
    });
}
// autocomplete objects for all input

var options = {
    types: ["(cities)"],
};

var input1 = document.getElementById("smulocation");
var autocomplete1 = new google.maps.places.Autocomplete(input1, options);

var input2 = document.getElementById("location_field");
var autocomplete2 = new google.maps.places.Autocomplete(input2, options);
