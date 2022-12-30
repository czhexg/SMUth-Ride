import { writeUserData, signin_user } from "../../index.js";
import {
    getDatabase,
    ref,
    set,
    onValue,
} from "https://www.gstatic.com/firebasejs/9.4.0/firebase-database.js";
import {
    getAuth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
} from "https://www.gstatic.com/firebasejs/9.4.0/firebase-auth.js";

var firebaseConfig = {
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

const sign_in_btn = document.querySelector("#sign-in-btn");
const register_btn = document.querySelector("#register-btn");
const container = document.querySelector(".container");

register_btn.addEventListener("click", () => {
    container.classList.add("register-mode");
});

sign_in_btn.addEventListener("click", () => {
    container.classList.remove("register-mode");
});

// document.getElementById('login').addEventListener('submit', login_user)

const login_check = Vue.createApp({
    data() {
        return {
            username: "",
            email: "",
            password: "",
            success: true,
        };
    },

    methods: {
        async login_user() {
            console.log("ewfjnueiowfioe");
            var inputs = document.getElementsByTagName("input");
            this.username = inputs.useroremail.value; //name of the input in the HTML form is useroremail, but for now we leave it as username only
            this.password = inputs.password.value;

            await this.find_email_from_username();
            await this.sleep(0.1 * 1000);
            await this.signin_user();
        },

        async find_email_from_username() {
            var username = this.username;
            const db = getDatabase();
            const users = ref(db, `users/${username}`);
            onValue(users, (snapshot) => {
                const data = snapshot.val();
                try {
                    this.email = data.email;
                } catch (error) {
                    this.success = false;
                }
            });
        },

        async signin_user() {
            const auth = getAuth();
            signInWithEmailAndPassword(auth, this.email, this.password)
                .then((userCredential) => {
                    // Signed in
                    const user = userCredential.user;
                    console.log(user);
                    console.log("user login success");
                    localStorage.clear();
                    localStorage.setItem("username_x", this.username);
                    localStorage.setItem("alert", "logged in");
                    window.location.href = "../../index.html";

                    // ...
                })
                .catch((error) => {
                    const errorCode = error.code;
                    const errorMessage = error.message;
                    console.log(errorCode, errorMessage);
                    this.success = false;
                });
        },

        sleep(ms) {
            return new Promise((resolve) => setTimeout(resolve, ms));
        },
    },
});

login_check.mount("#login");

const login_toggle_password = document.querySelector(".login-toggle-password");

login_toggle_password.addEventListener("click", () => {
    login_toggle_password.classList.toggle("fa-eye-slash");
    var input = document.querySelector("#login-pwd-field");
    if (input.getAttribute("type") == "password") {
        input.setAttribute("type", "text");
    } else {
        input.setAttribute("type", "password");
    }
});

const registration_check = Vue.createApp({
    data() {
        return {
            username: "",
            display_name: "",
            email: "",
            password: "",
            cfmpassword: "",
            degree: "",
            year: "",
            age: "",
            gender: "",
            errorMessages: {
                username: [],
                email: [],
                password: [],
                cfmpassword: [],
                display_name: [],
                age: [],
                register: [],
            },
            all_usernames: [],
            errorCheck: false ,
            all_emails: [],
        };
    },
    methods: {


        check_username() {
            this.errorMessages.username = [];
            if (this.username.includes(";") | this.username.includes(",")) {
                this.errorMessages.username.push(
                    "Username cannot contain ; or ,"
                );
            }
        },
        check_email() {
            this.errorMessages.email = [];
            if (!this.email.includes("smu.edu.sg")) {
                this.errorMessages.email.push(
                    "Please register with a SMU email"
                );
            }
        },
        check_password_match() {
            this.errorMessages.cfmpassword = [];
            if (this.password != this.cfmpassword) {
                this.errorMessages.cfmpassword.push("Passwords do not match");
            }
        },
        check_same_name() {
            if (
                this.all_usernames.includes(this.username) &&
                this.errorMessages.username.includes(
                    "Username already exists"
                ) === false
            ) {
                this.errorMessages.username.push("Username already exists");
            } else {
                this.errorMessages.username = [];
            }
        },
        check_password() {
            this.errorMessages.password = [];
            if (this.password.length < 8) {
                this.errorMessages.password.push(
                    "Password must be at least 8 characters long"
                );
            } else {
                this.errorMessages.password = [];
            }
        },
        check_empty() {
            if (
                this.username == "" ||
                this.email == "" ||
                this.password == "" ||
                this.cfmpassword == "" ||
                this.display_name == "" ||
                this.degree == "" ||
                this.year == "" ||
                this.age == "" ||
                this.gender == "") {
                if (this.errorMessages.register.includes("Please fill in all fields") === false) {
                    this.errorMessages.register.push("Please fill in all fields");
                }
            } else{
                this.errorMessages.register = [];
            }
        },

        async check_similar_username_email() {

            for (let i = 0; i < this.all_usernames.length; i++) {

                if ( this.all_usernames[i] == this.username.toLowerCase()) {
                    if (this.errorMessages.username.includes("Username already exists") === false) {
                        this.errorMessages.username.push("Username already exists");
                    }
                    return
                }
            }
            if (this.errorMessages.username.includes("Username already exists") === true) {
                this.errorMessages.username.pop();
            }

        },

        async register_user() {

            this.check_empty();
            await this.check_similar_username_email();
            var valid = true;
            for (let checks of Object.values(this.errorMessages)) {
                if (checks.length > 0) {
                    valid = false;

                }
            }
            if (valid) {
                await this.create_user(this.email,this.password);
                await this.sleep(0.3 * 1000);
                await this.writeUserData(
                    this.username,
                    this.display_name,
                    this.email,
                    this.degree,
                    this.year,
                    this.age,
                    this.gender
                );
                await this.sleep(0.6 * 1000);
                localStorage.clear();
                localStorage.setItem("username_x", this.username);
                localStorage.setItem("alert", "logged in");
                console.log("wiufhewuf");
                window.location.href = "../../index.html";
            }
            if (valid == false) {
                this.errorCheck = true;
            }
        },

        async get_all_usernames() {
            const db = getDatabase();
            const users = ref(db, `users`);
            onValue(users, (snapshot) => {
                const data = snapshot.val();

                this.all_usernames = Object.keys(data);
                for (let i = 0; i < this.all_usernames.length; i++) {
                   this.all_usernames[i] = this.all_usernames[i].toLowerCase();
                }

                for (let hehe of Object.values(data)) {
                    this.all_emails.push(hehe.email);
                }
                //   localStorage.setItem("all_usernames", Object.keys(data))
            });
        },



        async create_user(email, password) {
            console.log("create userwereewfw");
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
                    if (errorCode == "auth/email-already-in-use") {
                        this.errorMessages.email.push("Email already in use");
                    } else if (errorCode == "auth/invalid-email") {
                        this.errorMessages.email.push("Invalid email");
                    }
                    // ..
                });
        },

        async writeUserData(username, name, email, degree, year, age, gender) {
            const db = getDatabase();
            set(ref(db, `users/${username}`), {
                name: name,
                email: email,
                profile_url:
                    "https://firebasestorage.googleapis.com/v0/b/wad2-smuth-ride.appspot.com/o/Users%2FFrame%2031.png?alt=media&token=6fe4afa6-2c7d-4a44-b5a6-706a33ac17ca",
            });
            set(ref(db, `users/${username}/userprofile`), {
                degree: degree,
                year: year,
                gender: gender,
                location_user: "Singapore",
                mbti: "Not declared",
                age: age,
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
        },

        eyeicon_toggle(fieldclass, fieldtoggleid) {
            var fieldclass = document.querySelector(fieldclass);
            fieldclass.classList.toggle("fa-eye-slash");
            var input = document.querySelector(fieldtoggleid);
            if (input.getAttribute("type") == "password") {
                input.setAttribute("type", "text");
            } else {
                input.setAttribute("type", "password");
            }
        },

        sleep(ms) {
            return new Promise((resolve) => setTimeout(resolve, ms));
        },
    },

    mounted() {
        this.get_all_usernames();
    },

    watch: {
        age(newValue, oldValue) {
            console.log( newValue);
            if (newValue < 16) {
                console.log("under 16");
                if (this.errorMessages.age.includes("You must be 16 or older") === false) {
                    this.errorMessages.age.push("You must be 16 or older");
                }
            }

            if(newValue >= 16) {

                console.log("over 16");
                this.errorMessages.age = [];
            }
        },
        username(newValue, oldValue) {

            if (oldValue == "" || oldValue != newValue) {
                this.check_username();
            }
        },
        email(newValue, oldValue) {
            if (oldValue == "" || newValue != "") {
                this.check_email();
            }
        },
        password(newValue, oldValue) {
            if (oldValue == "" || newValue != "") {
                this.check_password();
                this.check_password_match();
            }
        },
        cfmpassword(newValue, oldValue) {
            if ((oldValue == "" || newValue != "") ) {

                this.check_password_match();
            }

        },

    },
});

registration_check.mount("#registration");
