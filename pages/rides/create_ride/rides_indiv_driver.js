   import {writeUserData, write_ride, find_rid} from '../../../index.js'

//    import { main_map_function } from './vanilla_js_rides_indiv_driver.js'
// writeUserData(username, "regine@hello.com", 1)


const form_alerts = Vue.createApp({
    data() {
        return {
            date: ((new Date()).getFullYear()) + '-' + (((new Date()).getMonth()+1).toString()).padStart(2, '0') + '-' + ((new Date()).getDate().toString()).padStart(2, '0'),
            drop_off: "",

            today: new Date().toISOString().split("T")[0],

            time: ((parseInt(new Date().toLocaleTimeString('en-GB').split(":")[0])+1)).toString() + ":" + new Date().toLocaleTimeString('en-GB').split(":")[1],

            time_now: new Date().toLocaleTimeString('en-GB').split(":").slice(0, 2).join(":"),

            location_input: "",
            location_alert: false,
            date_alert: false,
            just_stop: '',
            change_date: false,
            school_input: "",
            formatted_address : "",
            allowable_date: true,
            allowable_time : true,
            testing_time : true,
            cost: "initial"
        }
    },
    methods:{
        // check_time(){
        //     var time = new Date().toLocaleTimeString('en-GB').split(":").slice(0, 2).join(":")

        //     console.log(time)
        //     console.log(this.time)
        //     console.log(this.time < time)
        //     if (this.time < time){
        //         return true
        //     } return false
        // },

        check_date(){
            if (this.date===""){return false}
            let selected_date = this.date.split("-")
            let selected_year = selected_date[0]
            selected_date = new Date(selected_date)

            const today = new Date()
            let verify_year = today.getFullYear()

            let year = today.getFullYear()
            let month = today.getMonth() + 1
            let day = today.getDate()
            let formatted = [year,month, day]
            let formatted_date = formatted.join("-")
            console.log(formatted_date)
            if(formatted_date == this.date){
                this.allowable_date = false
                if(this.testing_time != true){
                    this.allowable_time = false
                }
                
            }
            else{
                this.allowable_date = true
                this.allowable_time = true
            }
            let res = (selected_date - today >= 1000 * 60 * 60 * 24 * 365) || (selected_date - today <= 1000 * 60 * 60 * 24 * -1) || (selected_year - verify_year < 0)

            // i apologise for the naming convention, just_stop is for disabling the button should the conditions not be fulfilled
            if (res){
                this.just_stop = 'no'
                
            }
            else {
                this.just_stop = ''
                
                
            }
            // if(this.date == )

            return res
        },
        check_drop_off(){
            if (this.drop_off===""){return true}
            return false;
        },
        checking_time(date,time_hour,time_minute, time_ampm){
            console.log('===CHECKINGGGGGG THE TIME===')
            var time = new Date().toLocaleTimeString('en-GB').split(":").slice(0, 2).join(":")
            let now_date = new Date()
            let now_month = now_date.getMonth() + 1
            let now_day = now_date.getDate()
            let now_year = now_date.getFullYear()
            // console.log(now_day)
            // console.log(now_month)
            // console.log(time)
            // console.log(this.verified_time)

            let selected_date = date.split("-")
            let selected_month = selected_date[1]
            let selected_year = selected_date[0]
            let selected_day = selected_date[2]

            // if(this.allowable_date && !(now_month == selected_month && now_day == selected_day && now_year == selected_year)){
            //     this.correct_time = true
            // }
            if(now_month == selected_month && now_day == selected_day && now_year == selected_year){
                console.log(time)
                // check if hour is less 
                if(time_ampm == "pm" && parseInt(time_hour) != 12){
                    var hour = parseInt(time_hour)
                    hour += 12
                    
                    // console.log(this.time_hour)
                }
                else if(time_ampm == "am" && parseInt(time_hour) == 12){
                    var hour = parseInt(time_hour)
                    hour = 0
                }
                else{
                    var hour = parseInt(time_hour)
                    
                }

                let time_now = new Date().toLocaleTimeString('en-GB')
                time_now = time_now.split(":")
                let hour_now = Number(time_now[0])
                let minute_now = Number(time_now[1])
                console.log(hour)
                console.log(hour_now)
                if(hour < hour_now){
                    this.allowable_time = false
                    this.testing_time = false
                }
                else if(hour == hour_now){
                    let minute = parseInt(time_minute)
                    console.log(minute)
                    if(minute < minute_now){
                        this.allowable_time = false
                        this.testing_time = false
                    }
                    else{
                        this.allowable_time = true
                        this.testing_time = true
                    }
                }
                else{
                    this.allowable_time = true
                    this.testing_time = true
                }

                
            }
            else{
                this.allowable_time = true
            }
        }
        
    //     // addHoursToDate(date, hours) {
    //     //     return new Date(new Date(date).setHours(date.getHours() + hours));
    //     //   }
    // },
    },
       
    watch: {
        school_input(val,oldVal) {

        },
        location_input: {
            handler(value, oldValue) {
                this.location_alert = value === "" && oldValue !== "";
            },
            deep: true
        },

        date: {
            handler(new_date, old_date) {
                this.change_date = new_date === "";
            },
            deep: true
        }
    },

    created()  {
        // main_map_function()
    },
    computed:{
       
    }
});

form_alerts.component('time-input', { 
    data() { 
        return { 
            time_hour: '',
            time_minute: '',
            time_ampm: '',
            verified_time: '',
            correct_time : true,
            hours: 12,
            hour_24 : ""
        }
    },
    props : ["date","allowable_date", "allowable_time"],
    emits : ['checking_time'],

    template: ` <div class='time-input'> 
                <select
                    name="time_hour"
                    id="time_hour"
                    class="dropdowns dropdown-time"
                    
                    v-model='time_hour'
                    @change='check_time()'
                    @change="$emit('checking_time',date,time_hour,time_minute,time_ampm)"
                >
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                    <option value="6">6</option>
                    <option value="7">7</option>
                    <option value="8">8</option>
                    <option value="9">9</option>
                    <option value="10">10</option>
                    <option value="11">11</option>
                    <option value="12">12</option>
                </select>
                :
                <select
                    name="time_minute"
                    id="time_min"
                    class="dropdowns dropdown-time"
                    
                    v-model='time_minute'
                    @change='check_time()'
                    @change="$emit('checking_time',date,time_hour,time_minute,time_ampm)"
                >
                    <option value='00'>00</option>
                    <option value='05'>05</option>
                    <option value='10'>10</option>
                    <option value='15'>15</option>
                    <option value='20'>20</option>
                    <option value='25'>25</option>
                    <option value='30'>30</option>
                    <option value='35'>35</option>
                    <option value='40'>40</option>
                    <option value='45'>45</option>
                    <option value='50'>50</option>
                    <option value='55'>55</option>
                </select>
                &nbsp;
                <select
                    name="time_ampm"
                    id="time_ampm"
                    class="dropdowns dropdown-time"
                    
                    v-model='time_ampm'
                    @change='check_time()'
                    @change="$emit('checking_time',date,time_hour,time_minute,time_ampm)"
                >
                    <option value="am">AM</option>
                    <option value="pm">PM</option>
                </select>
                    <span
                        class="wrong_time text-danger w-75"
                        role="alert"
                        
                        v-show="correct_time == false && allowable_date == false">
                        <br>You can't time travel! Please choose a later timing *
                </span>
                </div>`,

    methods: { 
        get_hour() { 
            var today = new Date()
            var now_hour = today.getHours()
            // console.log(now_hour)
            var next_hour = now_hour + 1
            var selected = ""
            var to_return = ""

            if (next_hour > 12) { 
                next_hour -= 12
            }
            for (var i of Array(12).keys()) { 
                if (i+1 == next_hour) { 
                    selected = "selected"
                }
                to_return += `<option value="${i+1}" ${selected}>${i+1}</option>`
                selected = ""
            }
            this.time_hour = next_hour
            // return to_return
        },

        get_minute() { 
            var today = new Date()
            var now_minute = today.getMinutes()
            var difference = now_minute % 5
            var next_min = (now_minute - difference)

            if ((next_min === 0) || (next_min === 5)){
                this.time_minute = '0' + next_min.toString()
            }
            else {
                this.time_minute = next_min.toString()
            }

            var to_return = ''
            var selected = ''
            let min_list = ['00','05','10','15','20','25','30','35','40','45','50','55']
            for (var i of Array(12).keys()) { 
                if (min_list[i] === next_min) {
                    console.log(min_list[i])
                    console.log(next_min) 
                    selected = "selected"
                }
                to_return += `<option value="${min_list[i]}" ${selected}>${min_list[i]}</option>`
                selected = ""
            }
            // return to_return
        },

        get_ampm() {
            var today = new Date()
            var now_hour = today.getHours()

            var next_hour = now_hour + 1
            console.log(next_hour)
            var selected = ""
            var to_return = ""
            var ampm = 'am'

            if (next_hour > 11) { 
                ampm = 'pm'
            }
             
            // for (var i of ['am', 'pm']) { 
            //     if (i == ampm) { 
            //         selected = "selected"
            //     }
            //     to_return += `<option value="${i}" ${selected}>${i.toUpperCase()}</option>`
            //     selected = ""
            // }
            console.log(ampm)
            this.time_ampm = ampm
            // return to_return
        },

        // this needs to be fixed
        async check_time(){
            console.log('===CHECKING THE TIME===')
            var time = new Date().toLocaleTimeString('en-GB').split(":").slice(0, 2).join(":")
            let now_date = new Date()
            let now_month = now_date.getMonth() + 1
            let now_day = now_date.getDate()
            let now_year = now_date.getFullYear()
            // console.log(now_day)
            // console.log(now_month)
            // console.log(time)
            // console.log(this.verified_time)

            let selected_date = this.date.split("-")
            let selected_month = selected_date[1]
            let selected_year = selected_date[0]
            let selected_day = selected_date[2]

           if(now_month == selected_month && now_day == selected_day && now_year == selected_year){
                console.log(time)
                
                // check if hour is less 
                if(this.time_ampm == "pm" && parseInt(this.time_hour) != 12){
                    var hour = parseInt(this.time_hour)
                    hour += 12
                    // this.hour_24 = hour
                    // console.log(this.time_hour)
                }
                else if(this.time_ampm == "am" && parseInt(this.time_hour) == 12){
                    var hour = parseInt(this.time_hour)
                    hour = 0
                }
                else{
                    var hour = parseInt(this.time_hour)
                    // this.hour_24 = hour
                }

                let time_now = new Date().toLocaleTimeString('en-GB')
                time_now = time_now.split(":")
                let hour_now = Number(time_now[0])
                let minute_now = Number(time_now[1])
                console.log(hour)
                console.log(hour_now)
                if(hour < hour_now){
                    this.correct_time = false
                }
                else if(hour == hour_now){
                    let minute = parseInt(this.time_minute)
                    console.log(minute)
                    if(minute < minute_now){
                        this.correct_time = false
                    }
                    else{
                        this.correct_time = true
                        // this.allowable_time = "yes"
                    }
                }
                else{
                    this.correct_time = true
                    // this.allowable_time = "yes"
                }

                
            }
            // else{
            //     this.correct_time = true
            // }
            // console.log(selected_month)

            // var selected_hour = parseInt(this.time_hour.value)

            // if (this.time_ampm.value == 'pm'){
            //     selected_hour = selected_hour + 12
            //     selected_hour.toString
            // }
            // else {
            //     selected_hour = '0' + selected_hour.toString()
            // }

            // var selected_time = selected_hour + ':' + this.time_minute.value + this.time_ampm.value
            // console.log(selected_time)
            // console.log(selected_time < time)
            
            // if (selected_time < time){
            //     this.verified_time = 'nope'
            //     return document.querySelector('.wrong_time').removeAttribute('hidden')
            // }
            // else {
            //     this.verified_time = ''
            //     return document.querySelector('.wrong_time').setAttribute('hidden', true)
            // }
        },
    },
    created(){
        this.get_hour()
        this.get_minute()
        this.get_ampm()
    }
})

form_alerts.mount('#form_alerts')

document.getElementById('rides').addEventListener('click',event => {
    event.preventDefault()
    write_ride_local()
    sleep(0.25 * 1000)
    localStorage.setItem('ridecreated', 'yes')
    window.location.href = "./../rides_list/rides_listing.html"

    
})

find_rid()
async function write_ride_local() {
    console.log('=== START ===')
    
    var username = localStorage.getItem("username_x")

    var rideid = parseInt(localStorage.getItem("rideid")) + 1

    var inputs = document.getElementsByTagName('input')
    
    var user_address = inputs.location_field.value

    var smu_location = document.getElementById("smulocation").options[document.getElementById("smulocation").selectedIndex].text;
    var cost = parseFloat(inputs.cost.value)
    var max_capacity = parseInt(inputs.capacity.value)
    var date = inputs.date.value
    var users_offered = [""]
    var area = document.getElementById("hidden_formatted_address").value
    var neighbourhood = document.getElementById("hidden_neighbourhood").value 
    var time_hour = document.getElementById("time_hour").value 
    var time_min = document.getElementById("time_min").value
    var time_ampm = document.getElementById("time_ampm").value

    if (time_ampm == "pm" && parseInt(time_hour) != 12) { 
        time_hour = parseInt(time_hour) + 12 
    }
    else if(time_ampm == "am" && parseInt(time_hour) == 12){
        time_hour = "0"
    }

    if(String(time_hour).length == 2){
        var time = String(time_hour) + ":" + time_min
    }
    else{
        var time = "0" + String(time_hour) + ":" + time_min
    }
    

    let check = await write_ride(smu_location,smu_position,username,rideid,user_address,cost,max_capacity,date,time,users_offered,area,neighbourhood)
    console.log(check)
    if (check){
        console.log("success")
        // document.getElementById("backdrop").style.display = "block"
        // document.getElementById("exampleModal").style.display = "block"
        // document.getElementById("exampleModal").classList.add("show")
    }
    // window.location.href = "./../rides_list/rides_list.html"

}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
