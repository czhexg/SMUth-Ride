import {
    get_ride_details,
    find_user_profile,
    find_name_from_username,
    format_date,
    formatAMPM,
    create_chat,
} from "../../../index.js";

// const queryString = window.location.search;
// const urlParams = new URLSearchParams(queryString);
// const rideid = urlParams.get('rideid')
// get_ride_details(rideid)
// var driver_username = localStorage.getItem("driver_username")
// document.getElementById("username").innerHTML = `@${driver_username}`
// find_name_from_username(driver_username)
// document.getElementById("displayname").innerHTML = localStorage.getItem("displayname")
// find_user_profile(driver_username)
// var degree = localStorage.getItem("degree")
// var year = localStorage.getItem("year")
// document.getElementById("year_degree").innerHTML = `${year}, ${degree}`
// document.getElementById("user_address").innerHTML = localStorage.getItem("user_address")
// var cost = localStorage.getItem("cost")
// document.getElementById("costperpax").innerHTML = `$${cost} per pax`
// var max_capacity = localStorage.getItem("max_capacity")
// var capacity = localStorage.getItem("users_offered").split(",").length
// document.getElementById("capacity").innerHTML = `${capacity} / ${max_capacity} seats available`
// var date = format_date(localStorage.getItem("date"))
// var time = formatAMPM(localStorage.getItem("time"))
// document.getElementById("date_time").innerHTML = `${date[1]} (${date[0]}), ${time}`

// var username = localStorage.getItem("username_x")
// localStorage.clear()
// localStorage.setItem("username_x", username)

// document.getElementById("gotochat").addEventListener("submit", gotochat)

// function gotochat() {
//     let your_username = localStorage.getItem("username_x")
//     create_chat(driver_username, your_username)
//     localStorage.setItem("driver_username", driver_username)

// }

import { initializeApp } from "https://www.gstatic.com/firebasejs/9.4.0/firebase-app.js";
import {
    getDatabase,
    ref,
    set,
    onValue,
    update,
} from "https://www.gstatic.com/firebasejs/9.4.0/firebase-database.js";

const app = Vue.createApp({
    data() {
        return {
            rideid: "",
            driver_username: "",
            driver_name: "",
            picture_url: "hi",
            cost_per_pax: 0,
            current_riders: [],
            max_capacity: "",
            address: "",
            neighbourhood: "",
            degree: "Information Systems",
            year: "Year 1",
            time: "",
            date: "",
            to_from: "",
            smu_location: "",
            new_mid: 0,
            user: "",
            msg_length: 0,
            unformatted_date: "",
            unformatted_time: "",
            gender: "",
            user_address: "",
        };
    },
    computed: {},
    methods: {
        getData() {
            const database = getDatabase();
            const ride_details = ref(database, `rides/${this.rideid}`);
            onValue(ride_details, (snapshot) => {
                console.log(snapshot.val());
                let details = snapshot.val();

                this.driver_username = details.driver_username;
                this.cost_per_pax = details.cost;
                this.current_riders = details.users_offered;
                this.max_capacity = details.max_capacity;
                this.address = details.formatted_address;
                this.neighbourhood = details.neighbourhood;
                console.log(this.address);
                this.unformatted_time = details.time;
                this.time = formatAMPM(this.unformatted_time);
                this.unformatted_date = details.date;
                this.date = format_date(this.unformatted_date);
                this.smu_location = details.smu_location;
                this.to_from = details.to_from;
                this.user_address = details.user_address;

                var map;
                var chosenloc = this.address;
                console.log(this.address);
                var prof_loc = encodeURI(chosenloc);

                var url =
                    "https://maps.googleapis.com/maps/api/geocode/json?address=" +
                    prof_loc +
                    "&key=API_KEY_HERE";

                axios.get(url).then((response) => {
                    var results = response.data.results[0];
                    var lat = results.geometry.location.lat;
                    var lng = results.geometry.location.lng;
                    var coords = [lat, lng];
                    this.initMap(coords);
                    this.calcRoute(
                        this.smu_location,
                        this.user_address,
                        this.to_from
                    );
                });
            });
        },

        gotochat(driver, user, length, to_from) {
            console.log(driver);
            console.log(user);
            console.log(length);
            // var your_username = localStorage.getItem("username_x")
            console.log(this.to_from);
            if (to_from == "from") {
                var chat_message_details = `Hello! I am interested in a ride <a class="ride_url" href="../rides/ride_details/rides_indiv_rider.html?rideid=${this.rideid}">from ${this.smu_location} to ${this.address} on ${this.date[1]} (${this.date[0]}), ${this.time}!</a>`;
            } else {
                var chat_message_details = `Hello! I am interested in a ride <a class="ride_url" href="../rides/ride_details/rides_indiv_rider.html?rideid=${this.rideid}">from ${this.address} to ${this.smu_location} on ${this.date[1]} (${this.date[0]}), ${this.time}!</a>`;
            }
            // create_chat(this.driver_username, your_username)
            if (driver != user) {
                var list_for_chatid = [driver, user];
                list_for_chatid = list_for_chatid.sort().join(";");
                console.log(list_for_chatid);
                this.send_message(
                    list_for_chatid,
                    user,
                    chat_message_details,
                    length
                );

                // console.log(chatid)
                // var chatid = `${list_for_chatid[0]};${list_for_chatid[1]}`
                // this.send_message(chatid, your_username, chat_message_details)
                // localStorage.setItem("driver_username", driver_username)
            }
        },

        initMap(coords) {
            var map = new google.maps.Map(document.getElementById("map"), {
                center: { lat: coords[0], lng: coords[1] },
                zoom: 17,
                mapTypeControl: false,
                //mapTypeID: google.maps.mapTypeID
            });
            var marker = new google.maps.Marker({
                map,
                draggable: true,
                animation: google.maps.Animation.DROP,
                position: { lat: coords[0], lng: coords[1] },
                preserveViewport: true,
            });
        },

        calcRoute(smu_loc, user_loc, smu_position) {
            const smu_loc_dict = {
                SCIS: "Singapore 178902,SCIS",
                SOE: "Singapore 178903,SOE",
                SOL: "55 Armenian St Singapore 179943,SOL",
                SOA: "Singapore 178900,SOA",
                SOB: "Singapore 178899,SOB",
                SOSS: "Singapore 179873,SOSS",
            };

            if (smu_position == "from") {
                var request = {
                    origin: smu_loc_dict[smu_loc],
                    destination: user_loc,
                    travelMode: google.maps.TravelMode["DRIVING"],
                    unitSystem: google.maps.UnitSystem["METRIC"],
                };
                console.log("is it working???");
            } else {
                var request = {
                    origin: user_loc,
                    destination: smu_loc_dict[smu_loc],
                    travelMode: google.maps.TravelMode["DRIVING"],
                    unitSystem: google.maps.UnitSystem["METRIC"],
                };
            }

            var directionsService = new google.maps.DirectionsService();
            var directionsDisplay = new google.maps.DirectionsRenderer();

            directionsDisplay.setDirections({ routes: [] });

            directionsDisplay.setOptions({
                polylineOptions: {
                    strokeColor: "#4e7570",
                },
            });

            directionsService.route(request, function (result, status) {
                if (status == "OK") {
                    // get the distance of the route in km
                    var distance = result.routes[0].legs[0].distance.text;

                    if (smu_position == "from") {
                        var loc_lat =
                            result.routes[0].legs[0].end_location.lat();
                        var loc_lng =
                            result.routes[0].legs[0].end_location.lng();
                    } else {
                        var loc_lat =
                            result.routes[0].legs[0].start_location.lat();
                        var loc_lng =
                            result.routes[0].legs[0].start_location.lng();
                    }
                    var map = new google.maps.Map(
                        document.getElementById("map"),
                        {
                            zoom: 17,
                            mapTypeControl: false,
                            //mapTypeID: google.maps.mapTypeID
                        }
                    );
                    var marker = new google.maps.Marker({
                        map,
                        draggable: true,
                        animation: google.maps.Animation.DROP,
                        preserveViewport: true,
                    });
                    marker.setMap(null);
                    directionsDisplay.setMap(null);
                    directionsDisplay.setDirections({
                        routes: [],
                    });

                    directionsDisplay.setDirections(result);
                    directionsDisplay.setMap(map);
                }
            });
        },

        getName() {
            const database = getDatabase();
            const user = ref(database, `users/${this.driver_username}`);
            onValue(user, (snapshot) => {
                console.log(snapshot.val());
                let details = snapshot.val();
                console.log(details[this.driver_username]["profile_url"]);
                this.driver_name = details[this.driver_username]["name"];
                this.picture_url = details[this.driver_username]["profile_url"];

                // year 2 information systems NOT in
                this.year =
                    details[this.driver_username]["userprofile"]["year"];
                this.degree =
                    details[this.driver_username]["userprofile"]["degree"];
                this.gender =
                    details[this.driver_username]["userprofile"]["gender"];
            });
        },

        send_message(chat_id, user, message, length) {
            // console.log("hello")
            const db = getDatabase();

            // const reference = ref(db, 'messages/' + chat_id)
            // onValue(reference, (snapshot) => {
            //     var all_messages = snapshot.val()
            //     console.log(all_messages.length)
            //     this.new_mid = all_messages.length
            //     // localStorage.setItem("aaa", this.new_mid)

            // })

            if (message.trim().length > 0) {
                console.log(length);
                console.log("YES");
                let time = Date.now();
                set(ref(db, `messages/${chat_id}/${length}`), {
                    message: message,
                    username: user,
                    type: "message",
                    accepted: "message",
                    message_time: time,
                    mid: length,
                });
            }
        },

        // get_length(){
        //     var you = localStorage.getItem("username_x")
        //     let driver = this.driver_username
        //     let list = [driver, you]
        //     let chat_id = list.sort().join(";")
        //     console.log(chat_id)
        //     const db = getDatabase()

        //     const reference = ref(db,`messages/${chat_id}`)
        //     onValue(reference, (snapshot) => {
        //         var all_messages = snapshot.val()
        //         console.log(all_messages)
        //         if(all_messages != null){
        //             this.msg_length = all_messages.length
        //         }
        //         else{
        //             this.msg_length = 0
        //         }
        //         // console.log(all_messages.length)
        //         // this.new_mid = all_messages.length
        //         // localStorage.setItem("aaa", this.new_mid)

        //     })

        // },
    },
    created() {
        // console.log(window.location.href)
        this.user = localStorage.getItem("username_x");
        const queryString = window.location.search;
        const urlParams = new URLSearchParams(queryString);
        const rideid = urlParams.get("rideid");
        this.rideid = rideid;
        this.getData();
        this.getName();
        // this.get_length()
    },
});

app.component("send-button", {
    data() {
        return {
            length: 0,
            // chatid : "",
            user: "",
            to_from: "",
        };
    },

    props: [
        "driver",
        "user",
        "avail_capacity",
        "date",
        "time",
        "current_riders",
        "rideid",
    ],

    emits: ["gotochat"],

    template: ` <form
                    id="gotochat"
                    :action="find_action_path()"
                >
                    <div v-if="!driver_is_user() && user_is_offered()" class="accepted-div"> 
                        <button  type="submit" class="btn btn-lg chat-button" v-on:click="$emit('gotochat',driver, user,length,to_from)" v-on:mouseover="get_length" disabled>
                            Ride accepted
                        </button>
                        <p class='valid-message'>You have already accepted this ride!</p>
                    </div> 
                    <button v-else-if="!driver_is_user() && avail_capacity > 0 && expired_check()" type="submit" class="btn btn-lg chat-button accepted-div" v-on:click="$emit('gotochat',driver, user,length,to_from)" v-on:mouseover="get_length">
                        Chat for more
                    </button>
                    <div v-else-if="!driver_is_user()" class="accepted-div"> 
                        <button  type="submit" class="btn btn-lg chat-button" v-on:click="$emit('gotochat',driver, user,length,to_from)" v-on:mouseover="get_length" disabled>
                            Chat for more
                        </button>
                        <p class='valid-message'>This ride is no longer available!</p>
                    </div>
                    <button v-else class="btn btn-lg my-offer-button accepted-div">
                        My offers
                    </button>
                    </form>`,

    methods: {
        get_length() {
            var you = this.user;
            let driver = this.driver;
            let ride_id = this.rideid;
            // console.log(ride_id)
            // console.log(driver)
            let list = [driver, you];
            let chat_id = list.sort().join(";");
            // console.log(chat_id)
            const db = getDatabase();

            const reference = ref(db, `messages/${chat_id}`);
            onValue(reference, (snapshot) => {
                var all_messages = snapshot.val();
                console.log(all_messages);
                if (all_messages != null) {
                    this.length = all_messages.length;
                } else {
                    this.length = 0;
                }
                // console.log(all_messages.length)
                // this.new_mid = all_messages.length
                // localStorage.setItem("aaa", this.new_mid)
            });
            const to_from = ref(db, `rides/${ride_id}`);
            onValue(to_from, (snapshot) => {
                var ride_details = snapshot.val();
                // console.log(ride_details)
                this.to_from = ride_details.smu_to_from;

                // console.log(this.to_from)
            });
        },

        driver_is_user() {
            if (this.driver == this.user) {
                return true;
            } else {
                return false;
            }
        },

        find_action_path() {
            if (this.driver == this.user) {
                return "../../offers/offers.html";
            } else {
                return "../../chats/chat.html";
            }
        },

        expired_check() {
            var today = new Date();
            var local_date = today.toLocaleDateString().split("/");
            var local_date_formatted =
                local_date[2] + "-" + local_date[1] + "-" + local_date[0];
            console.log(
                today
                    .toLocaleTimeString("en-GB")
                    .split(":")
                    .slice(0, 2)
                    .join(":")
            );
            if (
                this.date < local_date_formatted ||
                (this.date == local_date_formatted &&
                    this.time <
                        today
                            .toLocaleTimeString("en-GB")
                            .split(":")
                            .slice(0, 2)
                            .join(":"))
            ) {
                console.log("expired");
                return false;
            }
            console.log("not expired");
            return true;
        },

        user_is_offered() {
            var offered_users = Object.values(this.current_riders);
            if (offered_users.includes(this.user)) {
                return true;
            }
            return false;
        },
    },
    created() {
        // get the chat id out first

        this.user = localStorage.getItem("username_x");
        // this.get_length()

        if (this.driver_is_user()) {
            this.driver_user = true;
        } else {
            this.driver_user = false;
        }

        console.log(this.driver_user);
    },
});

app.component("riders-table", {
    data() {
        return {
            list_riders: [],
            list_fullnames: [],
            list_gender: [],
            user_fullname: "",
            gender: "",
        };
    },

    props: ["driver", "user", "rideid"],

    template: ` 
                <table class="table mt-5" v-if="driver_is_user() && list_riders.length > 0" class='table mx-auto' style="width:90%">
                    <thead>
                        <tr>
                            <th scope="col">Rider</th>
                            <th scope='col'>Gender</th>
                            <th scope="col">Remove</th>
                        </tr>
                    </thead>
                    <tbody class="table-group-divider">
                        <riders-tr 
                            :rider='rider'
                            @remove_rider='remove_rider' 
                            v-for="rider of list_riders"
                        ></riders-tr>
                    </tbody>
                </table>`,

    methods: {
        driver_is_user() {
            this.riders_list();
            if (this.driver == this.user) {
                return true;
            } else {
                return false;
            }
        },

        riders_list() {
            const db = getDatabase();
            const reference = ref(db, `rides/${this.rideid}/users_offered`);
            onValue(reference, (snapshot) => {
                var users_offered = snapshot.val();
                users_offered = users_offered.slice(1, users_offered.length);
                this.list_riders = users_offered;
                // for (var users of users_offered) {
                //     this.find_user_name(users)
                //     this.find_user_gender(users)
                // }
                // console.log(this.list_gender)
                return users_offered;
            });
        },

        remove_rider(rider_to_remove) {
            const db = getDatabase();
            var updated_riders = [""];
            for (var rider of this.list_riders) {
                if (rider != rider_to_remove) {
                    updated_riders.push(rider);
                }
            }
            const updates = {};
            updates[`rides/${this.rideid}/users_offered`] = updated_riders;
            this.reload();
            return update(ref(db), updates);
        },

        reload() {
            this.sleep(0.1 * 1000);
            location.reload();
        },

        sleep(ms) {
            return new Promise((resolve) => setTimeout(resolve, ms));
        },
    },
});

app.component("riders-tr", {
    data() {
        return {
            gender: "",
            full_name: "",
        };
    },

    props: ["rider"],

    emits: ["remove_rider"],

    template: `
                <tr>
                    <td>
                        <b>{{full_name}}</b> (@{{rider}})
                    </td>
                    <td>
                        <span v-if="gender == 'Male'">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-gender-male" viewBox="0 0 16 16">
                                <path fill-rule="evenodd" d="M9.5 2a.5.5 0 0 1 0-1h5a.5.5 0 0 1 .5.5v5a.5.5 0 0 1-1 0V2.707L9.871 6.836a5 5 0 1 1-.707-.707L13.293 2H9.5zM6 6a4 4 0 1 0 0 8 4 4 0 0 0 0-8z"/>
                            </svg>
                        </span>
                        <span v-else-if="gender == 'Female'">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-gender-female" viewBox="0 0 16 16">
                                <path fill-rule="evenodd" d="M8 1a4 4 0 1 0 0 8 4 4 0 0 0 0-8zM3 5a5 5 0 1 1 5.5 4.975V12h2a.5.5 0 0 1 0 1h-2v2.5a.5.5 0 0 1-1 0V13h-2a.5.5 0 0 1 0-1h2V9.975A5 5 0 0 1 3 5z"/>
                            </svg>
                        </span>
                    </td>
                    <td>
                        <span class="trashcan" @click="$emit('remove_rider', rider)">🗑</span>
                    </td>
                </tr>
            `,

    methods: {
        find_user_details() {
            console.log("iuhewuifeuhif");
            const db = getDatabase();
            const reference = ref(db, `users/${this.rider}`);
            onValue(reference, (snapshot) => {
                var users = snapshot.val();
                this.full_name = users.name;
                this.gender = users.userprofile.gender;
                console.log(this.gender);
                console.log(this.full_name);
            });
        },
    },

    created() {
        this.find_user_details();
        console.log(this.gender);
        console.log(this.full_name);
    },
});

app.mount("#main");
