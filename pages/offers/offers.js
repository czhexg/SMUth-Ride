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

const listings = Vue.createApp({
    data() {
        return{
            expired_drives: [],
            expired_rides: [],
            current_drives: [],
            current_rides: [],
            user: localStorage.getItem('username_x'),
            to_from : "From",
            users: [],
            present : "present",
            expired : "expired"

        }
    },
    methods: {
        expired_check(date,time){
            var today = new Date();
            var local_date = today.toLocaleDateString('en-GB').split("/")
            var local_date_formatted = local_date[2] + '-' + local_date[1] + '-' + local_date[0]

            if (date < local_date_formatted || (date == local_date_formatted && time < today.toLocaleTimeString('en-GB').split(":").slice(0, 2).join(":"))){
                console.log("expired")
                return false
            }
            console.log("not expired")
            return true
        },
        redirect(id){
            window.location.href='../rides/ride_details/rides_indiv_rider.html?rideid=' + id
        },

    },
    mounted() {
        const db = getDatabase();
        const rides = ref(db, `rides/`)
        const users = ref(db, `users/`)
        onValue(users, (snapshot) => {
            this.users = snapshot.val();
        });

        onValue(rides, (snapshot) => {

            let db_listings = snapshot.val()

            for (let value of Object.values(db_listings)){
                console.log(value)
                // let users_offered = value.users_offered
                if (this.expired_check(value.date, value.time)){
                    //current
                    if (value.driver_username === this.user){
                        if (!this.current_drives.includes(value)) { 
                            this.current_drives.push(value)
                        }
                    } else{
                        let users_offered = value.users_offered
                        if(users_offered.includes(this.user)){
                            this.current_rides.push(value)
                        }
                        // for(user of users_offered){
                        //     console.log(user)
                        //     if(user[0] == this.user){
                        //         this.current_rides.push(value)
                        //     }
                        // }
                    }
                } else {
                    //expired
                    if (value.driver_username === this.user){
                        this.expired_drives.push(value)
                    } else{
                        let users_offered = value.users_offered
                        // for(var user of users_offered){
                        //     console.log(user)
                        //     if(user[0] == this.user){
                        //         this.expired_rides.push(value)
                        //     }
                        // }
                        if(users_offered.includes(this.user)){
                            this.expired_rides.push(value)
                        }
                        
                    }
                }
            }


        })


    }

})



listings.component('drive', {
    props: ['list', 'past_present'],
    methods: {
        format_date(date){
            date = date.split("-")
            let day = new Date(date[0], date[1]-1, date[2]).toDateString().split(" ")
            return [day[0],`${day[2]} ${day[1]} ${day[3]}`]
        },
        formatAMPM(date){

            let hours = Number(date.split(":")[0]);
            let minutes = Number(date.split(":")[1]);
            let ampm = hours >= 12 ? 'pm' : 'am';
            hours = hours % 12;
            hours = hours ? hours : 12; // the hour '0' should be '12'
            minutes = minutes < 10 ? '0'+minutes : minutes;
            return hours + ':' + minutes + ' ' + ampm;

        },
        redirect(id){
            window.location.href='../rides/ride_details/rides_indiv_rider.html?rideid=' + id
        },
    },

    template: `
      <div class="col mx-auto mt-2 text-start " >
        <div v-if="past_present == 'present'">
            <h4>My upcoming drives</h4>
        </div>
        <div v-else>
            <h4>My past drives</h4>
        </div>
      
      <div class="overflow-md-hidden mx-auto">
      <table class="table text-center mx-auto rounded" >
        <thead>
        <tr>
          <th scope="col">Date</th>
          <th scope="col">Time</th>
          <th scope="col">From</th>
          <th scope="col">To</th>
          <th scope="col">Filled seats</th>
        </tr>
        </thead>
        <tbody>
        <tr v-if="this.list.length>0" v-for="listing in this.list" v-on:click="this.redirect(listing.ride_id)" >
          <td>{{format_date(listing.date)[1]}}</td>
          <td>{{formatAMPM(listing.time)}}</td>
          <td class="location-details">
            {{listing.smu_to_from =="from"? listing.smu_location: listing.neighbourhood}}
            <span class="tooltiptext" style="background-color: #BFACD3; color: #451F6A;" v-if="listing.smu_to_from == 'to'">
                <h6 class="formatted-address" style="color: #451F6A;">{{listing.formatted_address}}</h6>
            </span>
          </td>
          <td class="location-details">
            {{listing.smu_to_from =="to"? listing.smu_location: listing.neighbourhood}}
            <span class="tooltiptext" style="background-color: #BFACD3; color: #451F6A;" v-if="listing.smu_to_from == 'from'">
                <h6 class="formatted-address" style="color: #451F6A;">{{listing.formatted_address}}</h6>
            </span>
          </td>
          <td class="riders-num">
            {{listing.users_offered.length-1}} / {{listing.max_capacity}}
            <span class="tooltiptext" style="background-color: #BFACD3; color: #451F6A;">
                <h6 class="formatted-address" style="color: #451F6A;" v-for="rider of listing.users_offered.slice(1,listing.users_offered.length)">{{rider}}</h6>
            </span>
          </td>
        </tr>
        <tr v-else>
            <td colspan="6">No drives</td>
        </tr>
        </tbody>
      </table>
      </div>  
      </div>
    `,
})

listings.component('ride', {
    props: ['list', 'users','past_present'],
    data() {
        return{
            to_from : "from",
            display_listings: [],
        }
    },
    // template: `
      
    //     <div class="mx-auto mt-2 text-start">
    //         {{display_listings}}
    //         <div class="d-flex justify-content-between" style="">

    //             <div class="py-auto sticky">
    //                 <h4 class="my-auto">My upcoming rides</h4>
    //             </div>
    //             <div class="me-2">
    //                 <label class="switch">
                      
    //                   <input type="checkbox" id="togBtn" v-on:change="change_direction()">
    //                       <div class="slider round">
    //                         <!--ADDED HTML -->
    //                           <span class="on" style=" position:absolute; right:17px; top:15px"> To</span>
    //                           <span class="on" style=" position:absolute; right:1px; top: 31px"> SMU</span>
    //                           <span class="off" style=" position:absolute; right:17px; top:15px"> From</span>
    //                           <span class="off" style=" position:absolute; right:20px; top: 31px"> SMU</span>
    //                         <!--END-->
    //                       </div>
    //                 </label>
    //             </div>
    //         </div>
    //     </div>
    //     <div class="d-flex flex-wrap justify-content-center" v-if="display_listings.length>0">
    //         <div class="card col-sm-6 col-md-4 col-lg-3"  v-for="listing in display_listings">
    //             <div class="card-body col py-0">

    //                 <a class="stretched-link"
    //                      v-bind:href="'./../../pages/rides/ride_details/rides_indiv_rider.html?rideid=' + listing.ride_id"></a>

    //                 <div class="d-flex mt-4">
        
    //                     <div class="bd-highlight col-4 my-auto">
        
    //                         <div class="d-flex justify-content-center">
                            
    //                             <img
    //                                 :src="get_url(listing['driver_username'])"
    //                                 class="profile-pic img-fluid rounded-circle rounded-circle-dp"
    //                                 style="
    //                                                     object-fit: cover;
    //                                                     height: 60px;
    //                                                     width: 60px;
    //                                                     object-position: 50% 50%;
    //                                                     border: black solid 1px;
    //                                                 "
    //                             />
    //                         </div>
    //                     </div>
    //                     <div class="col-8">
    //                         <div class="text-center overflow-visible">
    //                             <h5 class="mb-0 py-2">
    //                               {{ this.get_user_name(listing.driver_username) }}
    //                             </h5>
    //                             <h5 class="my-0 fw-bold">
    //                               {{ format_date(listing.date)[1] }}
    //                             </h5>
    //                             <h5 class="my-0 fw-bold">
    //                               {{ format_date(listing.date)[0] }}
    //                               {{ formatAMPM(listing.time) }}
    //                             </h5>
    //                         </div>
    //                     </div>
    //                 </div>
    //             <hr class="mb-1 mt-2"/>
    //             <div>

    //                 <h2 class="card-title fw-bold text-center mb-3 neighbourhood" v-if="to_from =='from'"
    //                     style="color: #BFACD3">
    //                     <i class="bi bi-geo-alt-fill"></i>{{ listing.neighbourhood }}
    //                     <span class="tooltiptext" style="background-color: #BFACD3; color: #451F6A;">
    //                                     <h6 class="formatted-address"
    //                                         style="color: #451F6A;">{{ listing.formatted_address }}</h6>
    //                     </span>
    //                 </h2>
    //                 <h2 class="card-title fw-bold text-center mb-3 neighbourhood" v-else-if="to_from == 'to'"
    //                         style="color: #d8c7a3">
    //                     <i class="bi bi-geo-alt-fill"></i>{{ listing.neighbourhood }}
    //                     <span class="tooltiptext" style="background-color: #d8c7a3; color: #8A6F42;">
    //                                         <h6 class="formatted-address"
    //                                             style="color: #8A6F42;">{{ listing.formatted_address }}</h6>
    //                     </span>
    //                 </h2>

    //                 <div class="d-flex my-2">
    
    //                     <h1 class="me-auto">$ {{listing.cost}}</h1>
    //                     <h1>{{ listing.max_capacity - listing.users_offered.length + 1 }}<i class="bi bi-person-fill"></i>
    //                     </h1>
    
    //                 </div>
    //             </div>
    //         </div>
    //     </div>
           
      
    // </div>
    // <div v-else class="text-center mt-3"><h4>No rides found </h4> </div>
    // `,
    template: `
    <div class="mx-auto mt-2 text-start">
        <div class="d-flex justify-content-between">

            <div class="py-auto sticky" v-if="past_present == 'present'">
                <h4 class="my-auto">My upcoming rides</h4>
            </div>
            <div class="py-auto sticky" v-else>
                <h4 class="my-auto">My past rides</h4>
            </div>

            
        </div>
    </div>
    <div class="d-flex flex-wrap justify-content-center" v-if="display_listings.length>0">
    <div class="card col-sm-6 col-md-4 col-lg-3" v-for="listing in display_listings">
    <span class="badge badge-pill" v-if="listing.smu_to_from == 'from'" style="background-color:#BFACD3">{{text_transform(listing.smu_to_from)}}</span>
    <span class="badge badge-pill" v-else style="background-color:#d8c7a3">{{text_transform(listing.smu_to_from)}}</span>
                <div class="card-body col py-0">

                    <a class="stretched-link" v-bind:href="'./../../pages/rides/ride_details/rides_indiv_rider.html?rideid=' + listing.ride_id"></a>
                    <span class="badge rounded-pill px-1" v-if="listing.frequency === 'recurring'" hidden>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-repeat" viewBox="0 0 16 16">
                            <path d="M11.534 7h3.932a.25.25 0 0 1 .192.41l-1.966 2.36a.25.25 0 0 1-.384 0l-1.966-2.36a.25.25 0 0 1 .192-.41zm-11 2h3.932a.25.25 0 0 0 .192-.41L2.692 6.23a.25.25 0 0 0-.384 0L.342 8.59A.25.25 0 0 0 .534 9z"/>
                            <path fill-rule="evenodd" d="M8 3c-1.552 0-2.94.707-3.857 1.818a.5.5 0 1 1-.771-.636A6.002 6.002 0 0 1 13.917 7H12.9A5.002 5.002 0 0 0 8 3zM3.1 9a5.002 5.002 0 0 0 8.757 2.182.5.5 0 1 1 .771.636A6.002 6.002 0 0 1 2.083 9H3.1z"/>
                        </svg>
                    </span>

                        <div class="d-flex mt-4">

                            <div class="bd-highlight col-4 my-auto">

                                <div class="d-flex justify-content-center">
                                <!-- <img src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-profiles/avatar-2.webp"
                                     alt="Generic placeholder image" class="img-fluid rounded-circle border"
                                > -->
                                    <!-- KEN MING REPLACED THE ABOVE WITH THIS -->
                                    <img
                                        :src="get_url(listing['driver_username'])"
                                        class="profile-pic img-fluid rounded-circle rounded-circle-dp"
                                        style="
                                            object-fit: cover;
                                            height: 60px;
                                            width: 60px;
                                            object-position: 50% 50%;
                                            border: black solid 1px;
                                        "
                                    />
                                </div>
                            </div>
                            <div class="col-8">
                                <div class="text-center overflow-visible">
                                    <div class="d-flex align-items-center justify-content-center">
                                        <h5 class="mb-0 py-2 px-1 d-inline">
                                            {{get_user_name(listing.driver_username)}}
                                        </h5>
                                        <span v-if=" get_user_gender(listing.driver_username) === 'Male' ">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-gender-male" viewBox="0 0 16 16">
                                                <path fill-rule="evenodd" d="M9.5 2a.5.5 0 0 1 0-1h5a.5.5 0 0 1 .5.5v5a.5.5 0 0 1-1 0V2.707L9.871 6.836a5 5 0 1 1-.707-.707L13.293 2H9.5zM6 6a4 4 0 1 0 0 8 4 4 0 0 0 0-8z" stroke="#4e7570" stroke-width="1"/>
                                            </svg>
                                        </span>
                                        <span v-if=" get_user_gender(listing.driver_username) === 'Female' ">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-gender-female" viewBox="0 0 16 16">
                                                <path fill-rule="evenodd" d="M8 1a4 4 0 1 0 0 8 4 4 0 0 0 0-8zM3 5a5 5 0 1 1 5.5 4.975V12h2a.5.5 0 0 1 0 1h-2v2.5a.5.5 0 0 1-1 0V13h-2a.5.5 0 0 1 0-1h2V9.975A5 5 0 0 1 3 5z" stroke="#4e7570" stroke-width="1"/>
                                            </svg>
                                        </span>
                                    </div>
                                    <h5 class="my-0 fw-bold">
                                        {{format_date(listing.date)[1]}}
                                    </h5>
                                    <h5 class="my-0 fw-bold">
                                        {{format_date(listing.date)[0]}}
                                        {{formatAMPM(listing.time)}}
                                    </h5>
                                </div>
                            </div>
                        </div>

                    <hr class="mb-1 mt-2" />
                    <div>

                        <h2 class="d-flex justify-content-center card-title fw-bold text-center mb-3 neighbourhood" v-if="listing.smu_to_from == 'from'" style="color: #BFACD3">
                            <i class="bi bi-geo-alt-fill"></i>
                            <div class="d-inline-block" style="text-overflow: ellipsis; overflow: hidden; height: 1.4em; white-space: nowrap;">
                                {{listing.neighbourhood}}
                            </div>
                            <span class="tooltiptext" style="background-color: #BFACD3; color: #451F6A;">
                                <h6 class="formatted-address" style="color: #451F6A;">{{listing.formatted_address}}</h6>
                            </span>
                        </h2>
                        <h2 class="d-flex justify-content-center card-title fw-bold text-center mb-3 neighbourhood" v-else-if="listing.smu_to_from == 'to'" style="color: #d8c7a3">
                            <i class="bi bi-geo-alt-fill"></i>
                            <div class="d-inline-block" style="text-overflow: ellipsis; overflow: hidden; height: 1.4em; white-space: nowrap;">
                                {{listing.neighbourhood}}
                            </div>
                            <span class="tooltiptext" style="background-color: #d8c7a3; color: #8A6F42;">
                                <h6 class="formatted-address" style="color: #8A6F42;">{{listing.formatted_address}}</h6>
                            </span>
                        </h2>

                        <div class="d-flex my-2">

                            <h1 class="me-auto">\${{listing.cost}}</h1>

                            <h1>{{listing.max_capacity - listing.users_offered.length+ 1}}<i class="bi bi-person-fill"></i></h1>

                        </div>
                    </div>
                </div>
            </div>
        </div>
      
    
    
    
    
    `,

    methods: {
        // get_cost(users_offered){
        //     for(var user of users_offered){
        //         if(user != ""){
        //             if(user[0] == localStorage.getItem("username_x")){
        //                 return user[1]
        //             }

        //         }
        //         // let details = users_offered[user]
        //         // if(details[0] == localStorage.getItem("username_x")){
        //         //     return details[1]
        //         // }
        //     }
        // },
        text_transform(text){
            let first_letter = text.charAt(0)
            first_letter = first_letter.toUpperCase()
            let remaining_letters = text.slice(1)
            let formatted = first_letter + remaining_letters
            formatted += " SMU"
            return formatted
        },
        formatAMPM(date){

            let hours = Number(date.split(":")[0]);
            let minutes = Number(date.split(":")[1]);
            let ampm = hours >= 12 ? 'pm' : 'am';
            hours = hours % 12;
            hours = hours ? hours : 12; // the hour '0' should be '12'
            minutes = minutes < 10 ? '0'+minutes : minutes;
            return hours + ':' + minutes + ' ' + ampm;

        },
        format_date(date){
            date = date.split("-")
            let day = new Date(date[0], date[1]-1, date[2]).toDateString().split(" ")
            return [day[0],`${day[1]} ${day[2]} ${day[3]}`]
        },
        get_user_name(username){
            return this.users[username].name
        },
        get_url(username){
            return this.users[username].profile_url
        },
        change_direction(){
            this.to_from = this.to_from === "to" ? "from" : "to";
            this.check_and_populate()
        },
        redirect(id){
            window.location.href='../rides/ride_details/rides_indiv_rider.html?rideid=' + id
        },
        // check_and_populate(){
        //     if (this.to_from === "to"){
        //         console.log("to")
        //         this.display_listings = this.list.filter(listing => listing.smu_to_from === "to")
        //     } else {
        //         console.log("from")
        //         this.display_listings = this.list.filter(listing => listing.smu_to_from === "from")
        //     }
        // },
        get_user_gender(username){
            return this.users[username]['userprofile']['gender']
        }
    },
    mounted() {
        // this.check_and_populate();
        this.display_listings = this.list
    }
})

listings.mount('#myTabContent')