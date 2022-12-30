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
    update,
    onValue,
} from "https://www.gstatic.com/firebasejs/9.4.0/firebase-database.js";

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
function GetProfilePicUrl(username) {
    // console.log(username);
    const db = getDatabase();

    const data = ref(db, "users/" + username);
    onValue(data, (snapshot) => {
        var profile = snapshot.val();
        console.log(profile);
        var profileurl = profile.profile_url;
        localStorage.setItem("profile_url", profileurl);
    });
}

export { GetProfilePicUrl, UploadProcess };
