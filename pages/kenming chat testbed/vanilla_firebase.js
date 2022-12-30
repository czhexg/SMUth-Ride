import { find_chat } from "../../index.js";
import { getDatabase, ref, set, onValue, remove } from "https://www.gstatic.com/firebasejs/9.4.0/firebase-database.js";

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
  firebase.initializeApp(firebaseConfig);

//   console.log(document.getElementsByClassName("chatbox"))

//   let all_chats = document.getElementsByClassName("chatbox")[0]

//   console.log(document.getElementsByTagName("div"))

//   for(var chat in document.getElementsByTagName("div")){
//     console.log(document.getElementsByTagName("div")[chat])

//   }

console.log(document.getElementById("Candice;JohnTan"))
  

  function populate_chat(chatid){
    const username = localStorage.getItem("username_x")
    let chat_string = chatid.id
    // console.log(chat)
    let usernames = chat_string.split(";")

    // document.getElementById("message-form").addEventListener("submit", sendMessage);
    // localStorage.setItem("send_chatid", chatid)

    const db = firebase.database(); 
    const fetchChat = db.ref(`messages/${chat_string}`); 
    // console.log(chatid)

    // fetchChat.on("child_added", function (snapshot) {
    //     const messages = snapshot.val();
    //     if (messages.dummy != 0) { 
    //     const message = `<li class=${
    //         username === messages.username ? "sent" : "receive"
    //     }><span><p>${messages.username}: ${messages.message}</p></span></li>`;
    //     // append the message on the page
    //     document.getElementById("messages").innerHTML += message;
    //     }
    // });
    
    }