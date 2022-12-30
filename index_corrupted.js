// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.4.0/firebase-app.js";
import {
    getDatabase,
    ref,
    set,
    onValue,
    update,
} from "https://www.gstatic.com/firebasejs/9.4.0/firebase-database.js";
import {
    getAuth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
} from "https://www.gstatic.com/firebasejs/9.4.0/firebase-auth.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyCCVjpCi9lziMF130jj2UtJGiPc0MamUkY",
    authDomain: "wad2-smuth-ride.firebaseapp.com",
    projectId: "wad2-smuth-ride",
    storageBucket: "wad2-smuth-ride.appspot.com",
    messagingSenderId: "738000465812",
    appId: "1:738000465812:web:9d74b4f15684ed2a83a981",
    measurementId: "G-E7M5LHMTL8",
    databaseURL:
        "https://wad2-smuth-ride-default-rtdb.asia-southeast1.firebasedatabase.app/",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase();

export function retrieve_rides_list() {
    const db = getDatabase();
    const rides = ref(db, `rides/`);
    onValue(rides, (snapshot) => {
        return snapshot.val();
    });
}

export function writeUserData(username, name, email) {
  const db = getDatabase();
  const users = ref(db, `users`)
  onValue(users, (snapshot) => {
    const data = snapshot.val();
    var uid = 0
    for (var i of Object.values(data)) { 
      if (i.userid > uid) { 
        uid = i.userid
      }
    }
    localStorage.setItem("userid", uid)
  });
  var str_uid = String(parseInt(localStorage.getItem("userid")) + 1)
  var latest_uid = "0".repeat(3-str_uid.length) + str_uid 
  set(ref(db, `users/${username}`), {
      userid: latest_uid,
      name: name,
      email: email,
      profile_url: 'https://firebasestorage.googleapis.com/v0/b/wad2-smuth-ride.appspot.com/o/Users%2FFrame%2031.png?alt=media&token=d957f524-3239-4a6f-b587-5bef84342a37',
  });
  set(ref(db, `users/${username}/userprofile`), {
    degree: "Bachelor",
    year: "Year X",
    status: "It's Complicated",
    location_user: "Singapore", 
    mbti: "ABCD",
    age: 0,
    bio: "I have no bio", 
    price: 0,
    comfort: 0,
    convenience: 0, 
    speed: 0, 
    cca: ["SMUSA"],
    linkedin: "",
    facebook: "",
    instagram: "",
  }) 
}


export async function write_ride(smu_location,smu_to_from,username,rideid,user_address,cost,max_capacity,date,time,users_offered,area) {
  const db = getDatabase();

  await set(ref(db, `rides/${rideid}`), {
    ride_id: rideid,
    smu_location: smu_location,
    smu_to_from: smu_to_from,
    driver_username: username,
    user_address: user_address,
    cost: cost,
    area: area,
    max_capacity: max_capacity,
    date: date,
    time: time,
    users_offered: users_offered
  });
   return true
}

export function find_rid() { 
  const db = getDatabase();
  const rides = ref(db, `rides/`)
  onValue(rides, (snapshot) => {
    const data = snapshot.val();
    var rid = Object.keys(data).length
    localStorage.setItem("rideid", rid)
  });
}

export function create_chat(uid1, uid2) { 
  const db = getDatabase();
  let thing  = `${uid1};${uid2}`
  set(ref(db, `messages/${thing}/0`), {
    message :"Hello",
    username : uid2
  })
}

export function create_user(email, password) { 
  const auth = getAuth();
  createUserWithEmailAndPassword(auth, email, password)
  .then((userCredential) => {
      // Signed in 
      const user = userCredential.user;
      // ...
  })
  .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log(errorCode, errorMessage)
      // ..
  });
};

export function signin_user(email, password) { 
  const auth = getAuth();
  signInWithEmailAndPassword(auth, email, password)
  .then((userCredential) => {
    // Signed in 
    const user = userCredential.user;
    localStorage.setItem("username", user)
    console.log(user)
    // ...
  })
  .catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
    console.log(errorCode, errorMessage)
  });
}

export function find_chat(username){
  const db = getDatabase()
  const reference = ref(db, 'messages')
// Attach an asynchronous callback to read the data at our posts reference
  onValue(reference, (snapshot) => {
    const data = snapshot.val();
    var values = Object.entries(data)

    for(var entry of values){
      let chatid = entry[0]
      console.log(chatid)
    if(chatid.includes(username)){     
      find_last_chat_message(chatid)
      let message = localStorage.getItem("latest_message")
      // console.log(message)
      var chatusers = chatid.split(";")
      for (var users of chatusers) { 
        if (users != username) { 
          var other_username = users
        }
        localStorage.setItem("userid", uid);
    });
    var str_uid = String(parseInt(localStorage.getItem("userid")) + 1);
    var latest_uid = "0".repeat(3 - str_uid.length) + str_uid;
    set(ref(db, `users/${username}`), {
        userid: latest_uid,
        name: name,
        email: email,
    });
    set(ref(db, `users/${username}/userprofile`), {
        degree: "Bachelor",
        year: "Year X",
        status: "It's Complicated",
        location_user: "Singapore",
        mbti: "ABCD",
        age: 0,
        bio: "I have no bio",
        price: 0,
        comfort: 0,
        convenience: 0,
        speed: 0,
        cca: [""],
        linkedin: "",
        facebook: "",
        instagram: "",
    });
}

export function write_ride(
    smu_location,
    smu_to_from,
    username,
    rideid,
    user_address,
    cost,
    max_capacity,
    date,
    time,
    users_offered,
    area
) {
    const db = getDatabase();
    set(ref(db, `rides/${rideid}`), {
        ride_id: rideid,
        smu_location: smu_location,
        smu_to_from: smu_to_from,
        driver_username: username,
        user_address: user_address,
        cost: cost,
        area: area,
        max_capacity: max_capacity,
        // frequency,
        date: date,
        time: time,
        users_offered: users_offered,
    });
}

export function find_rid() {
    const db = getDatabase();
    const rides = ref(db, `rides/`);
    onValue(rides, (snapshot) => {
        const data = snapshot.val();
        var rid = 0;
        for (var i of Object.keys(data)) {
            rid = i;
        }
        localStorage.setItem("rideid", rid);
    });
}

export function create_chat(uid1, uid2) {
    const db = getDatabase();
    let thing = `${uid1};${uid2}`;
    set(ref(db, `messages/${thing}/0`), {
        message: "Hello",
        username: uid2,
    });
}

export function create_user(email, password) {
    const auth = getAuth();
    createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            // Signed in
            const user = userCredential.user;
            // ...
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.log(errorCode, errorMessage);
            // ..
        });
}

export function signin_user(email, password) {
    const auth = getAuth();
    signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            // Signed in
            const user = userCredential.user;
            localStorage.setItem("username", user);
            console.log(user);
            // ...
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.log(errorCode, errorMessage);
        });
}

export function find_chat(username) {
    const db = getDatabase();
    const reference = ref(db, "messages");
    // Attach an asynchronous callback to read the data at our posts reference
    onValue(reference, (snapshot) => {
        const data = snapshot.val();
        var values = Object.entries(data);

        for (var entry of values) {
            let chatid = entry[0];
            console.log(chatid);
            if (chatid.includes(username)) {
                find_last_chat_message(chatid);
                let message = localStorage.getItem("latest_message");
                // console.log(message)
                var chatusers = chatid.split(";");
                for (var users of chatusers) {
                    if (users != username) {
                        var other_username = users;
                    }
                }
                console.log(other_username);
                find_name_from_username(other_username);
                let other_user = localStorage.getItem("displayname");
                localStorage.removeItem("displayname");
                // NO PROFILE PAGE
                print_user(message, other_user, other_username, chatid);
                localStorage.removeItem("latest_message");
                localStorage.removeItem("other_user_name");
                const mychats = document.getElementsByClassName("chatbox");
                console.log(mychats);
                for (var mychat of mychats) {
                    console.log(mychat);
                    mychat.addEventListener("click", populate_chat2);
                }
            }
        }
    });
}

export function populate_chat2() {
    const username = localStorage.getItem("username_x");
    let chatid = this.id;
    let usernames = chatid.split(";");

    document
        .getElementById("message-form")
        .addEventListener("submit", sendMessage);
    localStorage.setItem("send_chatid", chatid);

    const db = firebase.database();
    const fetchChat = db.ref(`messages/${chatid}`);
    console.log(chatid);

    fetchChat.on("child_added", function (snapshot) {
        const messages = snapshot.val();
        if (messages.dummy != 0) {
            const message = `<li class=${
                username === messages.username ? "sent" : "receive"
            }><span><p>${messages.username}: ${
                messages.message
            }</p></span></li>`;
            // append the message on the page
            document.getElementById("messages").innerHTML += message;
        }
    });
}

export function find_mid(chatid) {
    const database = getDatabase();
    const chats = ref(database, `messages/${chatid}`);
    onValue(chats, (snapshot) => {
        if (!snapshot.exists()) {
            set(ref(database, `messages/${chatid}/0`), {
                dummy: 0,
            });
        }
        const data = snapshot.val();
        var mid = 0;
        for (var i of data) {
            mid += 1;
        }
        localStorage.setItem("new_mid", mid);
    });
}

export function sendMessage(e) {
    e.preventDefault();
    var chatid = localStorage.getItem("send_chatid");
    const db = firebase.database();
    var username = localStorage.getItem("username_x");

    // get values to be submitted
    const timestamp = Date.now();
    const messageInput = document.getElementById("message-input");
    const message = messageInput.value;

    // clear the input box
    messageInput.value = "";

    //auto scroll to bottom
    document
        .getElementById("messages")
        .scrollIntoView({
            behavior: "smooth",
            block: "end",
            inline: "nearest",
        });

    // create db collection and send in the data
    // need to get your username plus your partner username
    find_mid(chatid);
    var new_mid = parseInt(localStorage.getItem("new_mid"));
    if (new_mid == 0) {
        new_mid = 1;
    }
    localStorage.removeItem("new_mid");
    db.ref(`messages/${chatid}/${new_mid}`).set({
        // probably want to have a from and to so that we can identify...if from == username then we display as you sent it. Otherwise, we display as you receiving it
        username,
        message,
    });
}

export function populate_chat() {
    const username = localStorage.getItem("username_x");

    // console.log(thing.id)
    // I NEED TO GET THE USERNAME PAIR BEFORE I CAN READ THE DATABASE

    let chatid = this.id;
    // chat_usernames = "ber7;joleneusername" // hardcode1010
    let usernames = chatid.split(";");

    //READ THE DATABASE GET THE CHATROOM
    const database = getDatabase();
    const chats = ref(database, `messages`);

    onValue(chats, (snapshot) => {
        let chatrooms = snapshot.val();
        console.log(chatrooms);
        for (var chatroom in chatrooms) {
            if (
                chatroom.includes(usernames[0]) &&
                chatroom.includes(usernames[1])
            ) {
                console.log(chatroom);
                let messages = chatrooms[chatroom];
                for (var message of messages) {
                    // START POPULATING THE CRAP
                    console.log(message);
                }
            }
        }
    });
}

//NEED TO UPDATE WITH VUE FOR DYNAMIC RETREIVAL
export function find_last_chat_message(paired_usernames) {
    const db = getDatabase();
    const reference = ref(db, "messages");
    onValue(reference, (snapshot) => {
        const data = snapshot.val();
        // paired_id = '001_002'
        for (var id in data) {
            if (id == paired_usernames) {
                let messages = data[id];
                let last_message = messages[messages.length - 1];
                localStorage.setItem("latest_message", last_message.message);
            }
        }
    });
}

export function print_user(message, other_user, other_username, chatid) {
    // var username = "joleneusername" // hardcoded for now
    var username = localStorage.getItem("username_x");
    var all_chatrooms = document.getElementsByClassName("chatbox");
    var exist = false;
    for (var cr of all_chatrooms) {
        if (cr.id == chatid) {
            exist = true;
        }
    }
    if (exist) {
        let html_string = `<div id="photo"></div>
      <div style="margin-left: 20px;align-self: start;width: 70%;"> 
        <b>${other_user}</b>
        <div style="text-overflow: ellipsis; display: block; width:50%;white-space: nowrap; width: 100%; overflow: hidden;">
          ${message}
        </div>
      </div>`;
        document.getElementById(chatid).innerHTML = html_string;
    } else {
        let html_string = `<div id="${username};${other_username}" class="chatbox" style="padding:10px; display: flex;">
        <div id="photo"></div>
        <div style="margin-left: 20px;align-self: start;width: 70%;"> 
          <b>${other_user}</b>
          <div style="text-overflow: ellipsis; display: block; width:50%;white-space: nowrap; width: 100%; overflow: hidden;">
            ${message}
          </div>
        </div>
    </div>`;
        document.getElementById("chatroom").innerHTML += html_string;
    }
}

export function find_user_profile(username) {
    const db = getDatabase();
    const userprof = ref(db, `users/${username}/userprofile`);
    onValue(userprof, (snapshot) => {
        const data = snapshot.val();
        var k = "";
        var v = "";
        for ([k, v] of Object.entries(data)) {
            localStorage.setItem(k, v);
        }
    });
}

export function find_name_from_username(username) {
    const db = getDatabase();
    const userprof = ref(db, `users/${username}/name`);
    onValue(userprof, (snapshot) => {
        const data = snapshot.val();
        localStorage.setItem("displayname", data);
    });
}

export function write_user_profile(
    username,
    displayname,
    age,
    bio,
    cca,
    comfort,
    convenience,
    degree,
    facebook,
    instagram,
    linkedin,
    location_user,
    mbti,
    price,
    speed,
    rs_status,
    year
) {
    const db = getDatabase();
    set(ref(db, `users/${username}/userprofile`), {
        degree: degree,
        year: year,
        status: rs_status,
        location_user: location_user,
        mbti: mbti,
        age: age,
        bio: bio,
        price: price,
        comfort: comfort,
        convenience: convenience,
        speed: speed,
        cca: cca,
        linkedin: linkedin,
        facebook: facebook,
        instagram: instagram,
    });
    const updates = {};
    updates[`users/${username}/name`] = displayname;
    return update(ref(db), updates);
}
export function get_ride_details(rideid) { 
  const db = getDatabase();
  const rides = ref(db, `rides/${rideid}`)
  onValue(rides, (snapshot) => {
    const data = snapshot.val();
    var k = "";
    var v = "";
    for ([k, v] of Object.entries(data)) {

      localStorage.setItem(k, v)
    }
  });
}

export function formatAMPM(date) {
    let hours = Number(date.split(":")[0]);
    let minutes = Number(date.split(":")[1]);
    let ampm = hours >= 12 ? "pm" : "am";
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? "0" + minutes : minutes;
    return hours + ":" + minutes + " " + ampm;
}

export function format_date(date) {
    date = date.split("-");
    let day = new Date(date[0], date[1], date[2]).toDateString().split(" ");
    return [day[0], `${day[2]} ${day[1]} ${day[3]}`];
}

export function get_all_usernames() {
    const db = getDatabase();
    const users = ref(db, `users`);
    onValue(users, (snapshot) => {
        const data = snapshot.val();
        localStorage.setItem("all_usernames", Object.keys(data));
    });
}