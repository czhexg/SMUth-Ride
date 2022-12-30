
import { getDatabase, ref, onValue } from "https://www.gstatic.com/firebasejs/9.4.0/firebase-database.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.4.0/firebase-app.js";


const firebaseConfig = {
    apiKey: "AIzaSyCCVjpCi9lziMF130jj2UtJGiPc0MamUkY",
    authDomain: "wad2-smuth-ride.firebaseapp.com",
    projectId: "wad2-smuth-ride",
    storageBucket: "wad2-smuth-ride.appspot.com",
    messagingSenderId: "738000465812",
    appId: "1:738000465812:web:9d74b4f15684ed2a83a981",
    measurementId: "G-E7M5LHMTL8",
    databaseURL: "https://wad2-smuth-ride-default-rtdb.asia-southeast1.firebasedatabase.app/"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase();

var locations = ['Western Water Catchment','Mountbatten','Kembangan','Outram Park','Tiong Bahru','Queenstown','Boat Quay', 'Raffles Place', 'Marina', 'Chinatown', 'Tanjong Pagar', 'Alexandra', 'Commonwealth', 'Harbourfront', 'Telok Blangah', 'Buona Vista', 'West Coast', 'Clementi New Town', 'City Hall', 'Clarke Quay', 'Beach Road', 'Bugis', 'Rochor', 'Farrer Park', 'Serangoon', 'Orchard', 'River Valley', 'Tanglin', 'Holland', 'Bukit Timah', 'Newton', 'Novena', 'Balestier', 'Toa Payoh','Lorong Chuan','Marymount', 'Macpherson', 'Potong Pasir', 'Eunos','Yew Tee','Chinese Garden', 'Bartley','Lakeside','Kovan', 'Kranji','Geylang','Bendemeer', 'Paya Lebar','Kaki Bukit', 'East Coast', 'Marine Parade','Jalan Besar', 'Bedok', 'Upper East Coast','Kallang', 'Changi', 'Pasir Ris', 'Tampines', 'Hougang', 'Punggol', 'Sengkang', 'Ang Mo Kio','Botanic Gardens', 'Bishan', 'Boon Keng','Thomson', 'Clementi', 'Upper Bukit Timah', 'Boon Lay', 'Jurong', 'Tuas', 'Dairy Farm', 'Bukit Panjang', 'Choa Chu Kang', 'Lim Chu Kang', 'Tengah', 'Admiralty', 'Woodlands', 'Mandai', 'Upper Thomson', 'Sembawang', 'Yishun', 'Seletar', 'Yio Chu Kang', 'Downtown', 'Simei','Bukit Batok' ]

const listings = Vue.createApp({
    data() {
        return{
            users: [],
            listings: [],
            to_from : "from",
            display_listings: [],
            search: '',
            results: [],
            possible_locations: locations,
            selected_date: '',
        }
    },
    methods: {
        expired_check(date,time){
            var today = new Date();
            var local_date = today.toLocaleDateString('en-GB').split("/")
            var local_date_formatted = local_date[2] + '-' + local_date[1] + '-' + local_date[0]
            if (date < local_date_formatted || (date == local_date_formatted && time < today.toLocaleTimeString('en-GB').split(":").slice(0, 2).join(":"))){
                return false
            }
            return true
        },

        searchResults() {

            this.results = this.possible_locations.filter(item => item.toLowerCase().indexOf(this.search.toLowerCase()) > -1);
            if (this.search == '') {
                this.results = []
            }

            // this.isOpen ? document.getElementsByClassName('dropdown')[0].classList.add("dropdown_ani"): document.getElementsByClassName('dropdown')[0].classList.remove("dropdown_ani");
        },
        selectResult(location){
            this.search = location
            this.searchResults()
            document.getElementsByClassName('dropdown')[0].classList.remove("dropdown_ani_forward");
            document.getElementsByClassName('dropdown')[0].classList.add("dropdown_ani_backward");
            setTimeout(function () {this.results = []}, 100);
        },
        change_direction(){
            this.to_from = this.to_from === "to" ? "from" : "to";
            this.check_and_populate()
        },
        time_filter(){
            this.display_listings = this.display_listings.filter(listing => listing.date == this.selected_date)
        },
        search_filter(){
            this.display_listings = this.display_listings.filter(x =>x.neighbourhood.toLowerCase().indexOf(this.search.toLowerCase()) > -1 ||
                x.formatted_address.toLowerCase().indexOf(this.search.toLowerCase()) > -1)
        },
        check_and_populate(){

            this.listings = Object.values(this.listings)

            if (this.to_from === "to"){
                this.display_listings = this.listings.filter(x => x.smu_to_from.toLowerCase() == "to" &&(x.users_offered.length - x.max_capacity<1));
            } else if (this.to_from === "from"){
                this.display_listings = this.listings.filter(x => x.smu_to_from.toLowerCase() == "from" &&(x.users_offered.length - x.max_capacity<1) );
            }
            console.log("filtering")
            if (this.search != ''){
                console.log("search")
                this.search_filter()
            }
            if (this.selected_date != ""){
                console.log("time")
                this.time_filter()
            }
        },
        formatAMPM(date) {

            let hours = Number(date.split(":")[0]);
            let minutes = Number(date.split(":")[1]);
            let ampm = hours >= 12 ? 'pm' : 'am';
            hours = hours % 12;
            hours = hours ? hours : 12; // the h`our '0' should be '12'
            minutes = minutes < 10 ? '0'+minutes : minutes;
            return hours + ':' + minutes + ' ' + ampm;

        },
        format_date(date){
            date = date.split("-")
            let day = new Date(date[0], date[1]-1, date[2]).toDateString().split(" ")
            return [day[0],`${day[2]} ${day[1]} ${day[3]}`]
        },
        get_user_name(username){

            return this.users[username].name
        },
        get_url(username){
            return this.users[username].profile_url
        },
        get_user_gender(username){
            return this.users[username]['userprofile']['gender']
        }
    },
    mounted() {

        const db = getDatabase();
        const rides = ref(db, `rides/`)
        const users = ref(db, `users/`)
        onValue(users, (snapshot) => {
            this.users = snapshot.val();
        });

        onValue(rides, (snapshot) => {
            this.listings = snapshot.val();
            this.listings = Object.values(this.listings)
            this.listings = this.listings.filter(x => this.expired_check(x.date, x.time)).sort((a, b) => ((a.date > b.date)|| (a.date == b.date && a.time >b.time)) ? 1 :  -1)


            this.check_and_populate()
        })


        },
    watch: {
        results(value,oldValue){
            // console.log( typeof value)
            // console.log(typeof oldValue)
            // console.log(document.getElementsByClassName('dropdown')[0])
            if (Object.keys(oldValue) == 0 && Object.keys(value) != 0){
                document.getElementsByClassName('dropdown')[0].classList.remove("dropdown_ani_backward")
                document.getElementsByClassName('dropdown')[0].classList.add("dropdown_ani_forward");
            }
        },
        selected_date(value,oldValue){
            console.log(value)
                this.check_and_populate()
        },
        search:{
            handler(value,oldValue) {
                    if (value == ''){
                        this.check_and_populate()
                    }
                    this.check_and_populate()
            },
            deep: true
        }
    }
})
// listings.component('autocomplete', {})


listings.mount('#populate_listings')