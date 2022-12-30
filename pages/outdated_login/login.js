import {writeUserData, create_user, signin_user} from '../../index.js'
import { getDatabase, ref, set, onValue } from "https://www.gstatic.com/firebasejs/9.4.0/firebase-database.js";

var firebaseConfig = {
    apiKey: "AIzaSyCCVjpCi9lziMF130jj2UtJGiPc0MamUkY",
    authDomain: "wad2-smuth-ride.firebaseapp.com",
    projectId: "wad2-smuth-ride",
    storageBucket: "wad2-smuth-ride.appspot.com",
    messagingSenderId: "738000465812",
    appId: "1:738000465812:web:9d74b4f15684ed2a83a981",
    measurementId: "G-E7M5LHMTL8",
    databaseURL: "https://wad2-smuth-ride-default-rtdb.asia-southeast1.firebasedatabase.app/"
  };


document.getElementById('registration').addEventListener('submit', register_user)
document.getElementById('login').addEventListener('submit', login_user)

function register_user() { 
    var inputs = document.getElementsByTagName('input')
    var name = inputs.name.value
    var username = inputs.username.value
    var email = inputs.email.value
    var password = inputs.pw.value
    var cfmpassword = inputs.cfmpassword.value
    
    var valid = true 
    if (!email.includes('smu.edu.sg')) { 
        alert("You must have a valid SMU email address to register on SMUth Ride.")
        valid = false 
    }

    if (password != cfmpassword) { 
        alert("The passwords do not match! Please try again.")
        valid = false 
    }

    if (valid) { 
        create_user(email, password)
        writeUserData(username, name, email)
        localStorage.clear()
        localStorage.setItem("username_x", username)
    }
}

function find_email_from_username(username) { 
  const db = getDatabase(); 
  const users = ref(db, `users/${username}`)
  onValue(users, (snapshot) => { 
    const data = snapshot.val();
    var email = data.email 
    localStorage.setItem("email", email)
  })
}

// function login_user() { 
//     var inputs = document.getElementsByTagName('input')
//     var useroremail = inputs.useroremail.value 
//     var password = inputs.password.value

//     if (!useroremail.includes("@")) { 
//         find_email_from_username(useroremail)
//         var email = localStorage.getItem("email")
//     }
//     else { 
//         var email = useroremail
//     }

//     signin_user(email, password)
// }

function login_user() { 
    var inputs = document.getElementsByTagName('input')
    var username = inputs.useroremail.value //name of the input in the HTML form is useroremail, but for now we leave it as username only
    var password = inputs.password.value

    find_email_from_username(username)
    var email = localStorage.getItem("email")

    signin_user(email, password)
    localStorage.clear()
    localStorage.setItem("username_x", username)
}