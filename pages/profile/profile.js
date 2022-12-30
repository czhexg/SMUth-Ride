import {
    getDatabase,
    ref,
    set,
    onValue,
    update,
} from "https://www.gstatic.com/firebasejs/9.4.0/firebase-database.js";

import { UploadProcess } from "./profile_mod_2.js";

const url = window.location.href;

let username = "";
if (url.includes("profile_edit.html")) {
    username = localStorage.getItem("username_x");
    let username_elem = document.createElement("input");
    username_elem.setAttribute("type", "hidden");
    username_elem.setAttribute("name", "user");
    username_elem.setAttribute("value", username);
    document.getElementById("profile_form").appendChild(username_elem);
} else {
    let queryString = window.location.search;
    let urlParams = new URLSearchParams(queryString);
    username = urlParams.get("user");
    if (username != localStorage.getItem("username_x")) {
        document.getElementById("edit-profile").innerHTML = "";
    }
}

Vue.createApp({
    data() {
        return {
            displayname: "Tan Ah Gao",
            profile_url:
                "https://firebasestorage.googleapis.com/v0/b/wad2-smuth-ride.appspot.com/o/Users%2FFrame%2031.png?alt=media&token=6fe4afa6-2c7d-4a44-b5a6-706a33ac17ca",
            degree: "Accountancy",
            yearOfStudy: "Year 2",
            age: "20",
            gender: "Male",
            mbti: "INTP",
            bio: "lorem ipsum",
            ccas: ["Ellipsis", ".Hack"],
            linkedinLink: "https://www.linkedin.com/in/",
            facebookLink: "https://www.facebook.com/",
            instagramLink: "https://www.instagram.com/",
            linkedinLinkInput: "",
            facebookLinkInput: "",
            instagramLinkInput: "",
            selectedFile: null,

            ccaInput: "",

            majorList: [
                "Business",
                "Accountancy",
                "Economics",
                "Social Science",
                "Information Systems",
                "Computer Science",
                "Computing & Law",
                "Sofware Engineering",
                "Law",
                "CIS",
            ],
            yearOfStudyList: [
                "Year 1",
                "Year 2",
                "Year 3",
                "Year 4",
                "Year 5",
                "Alumni",
            ],
            genderList: ["Male", "Female"],
            mbtiList: [
                "INTJ",
                "INTP",
                "ENTJ",
                "ENTP",
                "INFJ",
                "INFP",
                "ENFJ",
                "ENFP",
                "ISTJ",
                "ISFJ",
                "ESTJ",
                "ESFJ",
                "ISTP",
                "ISFP",
                "ESTP",
                "ESFP",
                "Not declared",
            ],
            picture_link: "",
            username: "",
        };
    },
    computed: {
        showSocials() {
            if (
                this.linkedinLinkInput !== "" ||
                this.facebookLinkInput !== "" ||
                this.instagramLinkInput !== ""
            ) {
                return true;
            } else {
                return false;
            }
        },
        fullFacebookLink() {
            return this.facebookLink + this.facebookLinkInput;
        },
        fullInstagramLink() {
            return this.instagramLink + this.instagramLinkInput;
        },
        fullLinkedinLink() {
            return this.linkedinLink + this.linkedinLinkInput;
        },
    },
    methods: {
        create_new_cca() {
            if (this.ccaInput !== "" && !this.ccas.includes(this.ccaInput)) {
                this.ccas.pop();
                this.ccas.push(this.ccaInput);
                this.ccas.push("");
                this.ccaInput = "";
            }
        },
        ccaInputModel(event) {
            this.ccaInput = event.target.value;
        },
        remove_cca(cca) {
            let index = this.ccas.indexOf(cca);
            if (index !== -1) {
                this.ccas.splice(index, 1);
            }
        },
        auto_grow() {
            element = this.$refs.bio;
            element.style.height = "5px";
            element.style.height = element.scrollHeight + "px";
        },
        update_user_database() {
            var inputs = document.getElementsByClassName("target-input");
            var cca_options = document.getElementsByClassName("cca_options");
            var displayname = inputs.displayname.value;
            var age = String(inputs.age.value);
            var bio = inputs.bio.value;
            var degree = inputs.degree.value;
            var facebook = inputs.facebook.value;
            var instagram = inputs.instagram.value;
            var linkedin = inputs.linkedin.value;
            var mbti = inputs.mbti.value;
            var gender = inputs.gender.value;
            var year = inputs.year.value;

            var cca = [];
            for (var cca_op of cca_options) {
                if (cca_op.value != "") {
                    cca.push(cca_op.value);
                }
            }
            cca.push("")

            // if (cca.length == 0) {
            //     cca = [""];
            // }

            const db = getDatabase();
            set(ref(db, `users/${username}/userprofile`), {
                degree: degree,
                year: year,
                gender: gender,
                mbti: mbti,
                age: age,
                bio: bio,
                cca: cca,
                linkedin: linkedin,
                facebook: facebook,
                instagram: instagram,
            });
            const updates = {};
            updates[`users/${username}/name`] = displayname;
            return update(ref(db), updates);
        },
        uploadImage(event) {
            let files = [];
            let reader = new FileReader();

            files = event.target.files;
            reader.readAsDataURL(files[0]);

            reader.onload = function () {
                this.profile_url = reader.result;
            };
            UploadProcess(files);
        },

        find_user_profile(username) {
            const db = getDatabase();
            const userprof = ref(db, `users/${username}/userprofile`);
            onValue(userprof, (snapshot) => {
                const data = snapshot.val();
                this.age = data.age;
                this.bio = data.bio;
                this.ccas = data.cca;
                // if (this.ccas.length != 0) {
                //     console.log(this.ccas)
                //     this.ccas = Object.values(this.ccas);
                //     console.log(this.ccas);
                //     this.ccas.push("");
                //     console.log(this.ccas);
                // } else {
                //     console.log(this.ccas)
                //     this.ccas = [""];
                // }

                if (this.ccas.length == 0) {
                    console.log(this.ccas)
                    this.ccas = [""];
                }
                console.log(this.ccas);
                this.degree = data.degree;
                this.facebookLinkInput = data.facebook;
                this.instagramLinkInput = data.instagram;
                this.linkedinLinkInput = data.linkedin;
                this.gender = data.gender;
                this.mbti = data.mbti;
                this.yearOfStudy = data.year;
            });
        },

        find_name_from_username(username) {
            const db = getDatabase();
            const userprof = ref(db, `users/${username}/name`);
            onValue(userprof, (snapshot) => {
                const data = snapshot.val();
                this.displayname = data;
            });
        },

        GetProfilePicUrl(username) {
            const db = getDatabase();

            const data = ref(db, "users/" + username);
            onValue(data, (snapshot) => {
                var profile = snapshot.val();
                var profileurl = profile.profile_url;
                this.profile_url = profileurl;
            });
        },
    },
    created() {
        const url = window.location.href;

        if (url.includes("profile_edit.html")) {
            this.username = localStorage.getItem("username_x");
        } else {
            let queryString = window.location.search;
            let urlParams = new URLSearchParams(queryString);
            this.username = urlParams.get("user");
        }

        // these 3 functions are asynchronous. MUST CHANGE TO SYNCHRONOUS
        this.find_user_profile(this.username);
        this.find_name_from_username(this.username);
        this.GetProfilePicUrl(this.username);

        let db_profile_url = this.profile_url;
        if (db_profile_url != "undefined") {
            this.profile_url = db_profile_url;
        }
    },
    // mounted() {
    // },
}).mount("#profileVue");
