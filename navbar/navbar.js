import {
    getDatabase,
    ref,
    onValue,
} from "https://www.gstatic.com/firebasejs/9.4.0/firebase-database.js";

import "../index.js";

const pageData = document.querySelector("#navbarVue div").dataset.page;

const navbar = Vue.createApp({
    data() {
        return {
            page: pageData,
            url: "",
        };
    },
    template: `
        <nav id="navbar" class="navbar navbar-expand-md fixed-top">
            <a class="navbar-brand" :href=" homeURL ">
                <div id="div-car">
                    <img
                        class=""
                        :src=" relativePath + 'navbar/car_side_v2.svg'"
                        id="side-car"
                    /> 
                    <img
                        class="tyre"
                        :src=" relativePath + 'navbar/tyre.svg'"
                        id="tyre-back"
                    /> 
                    <img
                        class="tyre"
                        :src=" relativePath + 'navbar/tyre.svg'"
                        id="tyre-front"
                    /> 
                </div>
            </a>
            <button
                class="navbar-toggler"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#navbarSupportedContent"
                aria-controls="navbarSupportedContent"
                aria-expanded="false"
                aria-label="Toggle navigation"
            >
                <span class="navbar-toggler-icon"></span>
            </button>
            <div
                class="collapse navbar-collapse"
                id="navbarSupportedContent"
            >
                <ul class="navbar-nav ms-auto">
                    <li class="nav-item">
                        <a class="nav-link" :href=" homeURL ">Home</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" :href=" rideURL ">Rides</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" :href=" offerURL ">Offers</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" :href=" chatURL ">Chat</a>
                    </li>
                    <li class="nav-item" v-if=" isLoggedIn != null ">
                        <a class="nav-link" :href=" homeURL " onclick=" localStorage.clear() " >Logout</a>
                    </li>
                    <li class="nav-item" style='margin-top: -10px;'>
                        <a class="nav-link" :href=" profileURL ">
                            <img v-if=" isLoggedIn " :src="url" class="img-fluid rounded-circle profile-img"/>
                            <a class="nav-link" :href="profileURL" v-else>Login</span>
                        </a>
                    </li>
                </ul>
            </div>
            <div id="street" class="street"></div>
            <div id="street-stripe" class="street-stripe"></div>
        </nav>
    `,
    computed: {
        relativePath() {
            if (
                this.page === "profile" ||
                this.page === "chat" ||
                this.page === "offers"
            ) {
                return "../../";
            } else if (this.page === "home") {
                return "./";
            } else {
                return "../../../";
            }
        },
        isLoggedIn() {
            return localStorage.getItem("username_x");
        },
        homeURL() {
            return this.relativePath + "index.html";
        },
        rideURL() {
            if (this.isLoggedIn) {
                return (
                    this.relativePath +
                    "pages/rides/rides_list/rides_listing.html"
                );
            } else {
                return this.relativePath + "pages/login/login.html";
            }
        },
        offerURL() {
            if (this.isLoggedIn) {
                return this.relativePath + "pages/offers/offers.html";
            } else {
                return this.relativePath + "pages/login/login.html";
            }
        },
        chatURL() {
            if (this.isLoggedIn) {
                return this.relativePath + "pages/chats/chat.html";
            } else {
                return this.relativePath + "pages/login/login.html";
            }
        },
        profileURL() {
            if (this.isLoggedIn) {
                return (
                    this.relativePath +
                    "pages/profile/profile.html?user=" +
                    localStorage.getItem("username_x")
                );
            } else {
                return this.relativePath + "pages/login/login.html";
            }
        },
    },
    methods: {
        profilePic() {
            console.log("profilepic func run");
            let username = localStorage.getItem("username_x");
            const db = getDatabase();

            const data = ref(db, "users/" + username);
            onValue(data, (snapshot) => {
                if (snapshot.val()) {
                    this.url = snapshot.val().profile_url;
                } else {
                    if (
                        this.page === "profile" ||
                        this.page === "chat" ||
                        this.page === "offers"
                    ) {
                        this.url = "../../pages/profile/default_profile.png";
                    } else if (this.page === "home") {
                        this.url = "./pages/profile/default_profile.png";
                    } else {
                        this.url = "../../../pages/profile/default_profile.png";
                    }
                }
            });
        },
    },
    mounted() {
        this.profilePic();
        for (const elem of document.getElementsByClassName("nav-link")) {
            if (elem.innerText.toLowerCase() === this.page) {
                elem.classList.add("current-page");
            }
        }
    },
});

navbar.mount("#navbarVue");
