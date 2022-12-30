import {
    find_name_from_username,
    find_user_profile,
    write_user_profile,
} from "../../index.js";

// firebase storage
import {
    getStorage,
    ref as sRef,
    uploadBytesResumable,
    getDownloadURL,
} from "https://www.gstatic.com/firebasejs/9.4.0/firebase-storage.js";

// database
import {
    getDatabase,
    ref,
    set,
    child,
    get,
    update,
    remove,
    onValue,
} from "https://www.gstatic.com/firebasejs/9.4.0/firebase-database.js";

// var username = localStorage.getItem("username_x");

const url = window.location.href;

if (url.includes("profile_edit.html")) {
    var username = localStorage.getItem("username_x");
    let username_elem = document.createElement("input");
    username_elem.setAttribute("type", "hidden");
    username_elem.setAttribute("name", "user");
    username_elem.setAttribute("value", username);
    document.getElementById("profile_form").appendChild(username_elem);
} else {
    let queryString = window.location.search;
    let urlParams = new URLSearchParams(queryString);
    var username = urlParams.get("user");
    GetProfilePicUrl(username);
    if (username != localStorage.getItem("username_x")) {
        document.getElementById("edit-profile").innerHTML = "";
    }
}

// console.log(username, "oiewfjewo");
find_user_profile(username);
find_name_from_username(username);

let elem = document.getElementById("profile_form");
if (elem) {
    elem.addEventListener("submit", update_user_database);
}

function update_user_database() {
    var inputs = document.getElementsByClassName("target-input");
    var cca_options = document.getElementsByClassName("cca_options");
    // console.log(inputs);
    // console.log(cca_options);

    var displayname = inputs.displayname.value;
    var age = String(inputs.age.value);
    var bio = inputs.bio.value;
    // var price = inputs.prefPrice.value;
    // var speed = inputs.prefSpeed.value;
    // var comfort = inputs.prefComfort.value;
    // var convenience = inputs.prefConvenience.value;
    var degree = inputs.degree.value;
    var facebook = inputs.facebook.value;
    var instagram = inputs.instagram.value;
    var linkedin = inputs.linkedin.value;
    // var location_user = inputs.location_user.value;
    var mbti = inputs.mbti.value;
    var gender = inputs.gender.value;
    var year = inputs.year.value;

    var cca = [];
    for (var cca_op of cca_options) {
        if (cca_op.value != "") {
            cca.push(cca_op.value);
        }
    }

    if (cca.length == 0) {
        cca = [""];
    }

    write_user_profile(
        username,
        displayname,
        age,
        bio,
        cca,
        // price,
        // speed,
        // comfort,
        // convenience,
        degree,
        facebook,
        instagram,
        linkedin,
        // location_user,
        mbti,
        gender,
        year
    );

    // function uploadImage(e){
    //     console.log("hello")
    //     const storage = getStorage()
    //     const storageReference = storageReference(storage, 'public/myfile')
    //     uploadTask.value = uploadBytesResumable(storageReference, e.target.files[0]);
    //     // uploadTask.value.on{
    //     //     "state_changed"
    //     // }

    //     console.log(uploadTask)
    // }

    // document.getElementById("upload").addEventListener("click",uploadImage)
}

let imgInput = document.getElementById("imageInput");
if (imgInput) {
    imgInput.addEventListener("change", uploadImage);
}
GetProfilePicUrl(username);

function uploadImage(event) {
    let files = [];
    let reader = new FileReader();

    files = event.target.files;
    reader.readAsDataURL(files[0]);

    let myimg = document.getElementById("profile-picture");
    reader.onload = function () {
        myimg.src = reader.result;
    };
    UploadProcess(files);
}

function UploadProcess(files) {
    var ImgToUpload = files[0];

    var ImgName = files[0].name;

    const metadata = {
        contenType: ImgToUpload.type,
    };
    const storage = getStorage();
    const storageRef = sRef(storage, "Users/" + ImgName);

    const UploadTask = uploadBytesResumable(storageRef, ImgToUpload, metadata);

    UploadTask.on(
        "state-changed",
        (snapshot) => {
            var progress =
                (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log(progress);
        },
        (error) => {
            alert("error: img not uploaded");
        },
        () => {
            getDownloadURL(UploadTask.snapshot.ref).then((downloadURL) => {
                // console.log(downloadURL)
                toDatabase(downloadURL, ImgName);
            });
        }
    );
}

// save pictures to database

function toDatabase(url, ImgName) {
    const db = getDatabase();
    console.log(url);
    const username = localStorage.getItem("username_x");
    const updates = {};
    updates[`users/${username}/profile_url`] = url;
    return update(ref(db), updates);
}

// getting the image
// MIGHT NEED TO MOVE THIS FUNCTION OUT OF THIS JS FILE
function GetProfilePicUrl(username) {
    console.log(username);
    const db = getDatabase();

    const data = ref(db, "users/" + username);
    onValue(data, (snapshot) => {
        var profile = snapshot.val();
        console.log(profile);
        var profileurl = profile.profile_url;
        localStorage.setItem("profile_url", profileurl);
        // SHOULD NOT BE RETURNING
        // return snapshot.val().profile_url
        // document.getElementById("profile-picture").setAttribute("src", profileurl);
    });

    // get(child(db, `users/${username}`)).then((snapshot)=>{
    //     if(snapshot.exists()){
    //         console.log(snapshot.val().profile_url)
    //         return snapshot.val().profile_url
    //     }
    // })
}

// function ValidateName(filename) {
//     var regex = /[\.#$\[\]]/;
//     return !regex.test(filename);
// }

function GetFileName(file) {
    let temp = file.name.split(".");
    let filename = temp.slice(0, -1).join(".");
    return filename;
}
