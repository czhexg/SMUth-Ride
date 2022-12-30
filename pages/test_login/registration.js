import {writeUserData, create_user} from '../../index.js'

document.getElementById('registration').addEventListener('submit', register_user)
function register_user() { 
    var inputs = document.getElementsByTagName('input')
    var name = inputs.name.value
    var username = inputs.username.value
    var email = inputs.email.value
    var password = inputs.password.value
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
    }
}