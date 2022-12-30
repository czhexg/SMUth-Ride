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
  
  const db = firebase.database(); 
  // const username = prompt("Enter username")
  const username = localStorage.getItem("username_x")
  console.log(username)
  var chat_other_user = 'joleneusername' // hardcode1010
  
  var chatid = `${username};${chat_other_user}`
  console.log(chatid)

  find_chat2(chatid)

  // document.getElementById("message-form").addEventListener("submit", sendMessage);

  // document.getElementById("confirmOffer").addEventListener("click",write_offer)

  function write_offer(){
      
  }

  function find_chat2(chatid) { 
    const database = getDatabase(); 
    const chats = ref(database, `messages/${chatid}`)
    onValue(chats, (snapshot) => { 
      if (!snapshot.exists()) { 
        set(ref(database, `messages/${chatid}/0`), {
          dummy: 0
        })
      }
    })
  }

  function find_mid(chatid) { 
    const database = getDatabase(); 
    const chats = ref(database, `messages/${chatid}`)
    onValue(chats, (snapshot) => { 
      if (!snapshot.exists()) { 
        set(ref(database, `messages/${chatid}/0`), {
          dummy: 0
        })
      }
      const data = snapshot.val();
      var mid = 0
      for (var i of data) { 
        mid += 1 
      }
      localStorage.setItem("new_mid", mid)
    })
  }

  function sendMessage(e) {
      e.preventDefault();
    
      // get values to be submitted
      const timestamp = Date.now();
      const messageInput = document.getElementById("message-input");
      const message = messageInput.value;
    
      // clear the input box
      messageInput.value = "";
    
      //auto scroll to bottom
      document
        .getElementById("messages")
        .scrollIntoView({ behavior: "smooth", block: "end", inline: "nearest" });
    
      // create db collection and send in the data
      // need to get your username plus your partner username
      find_mid(chatid)
      var new_mid = parseInt(localStorage.getItem("new_mid"))  
      if (new_mid == 0) {
        new_mid = 1 
      }
      localStorage.removeItem("new_mid")
      db.ref(`messages/${chatid}/${new_mid}`).set({
        // probably want to have a from and to so that we can identify...if from == username then we display as you sent it. Otherwise, we display as you receiving it
        username,
        message,
      });
    }
  
  // const fetchChat = db.ref(`messages/${chatid}`); 
  // console.log(chatid)

  
  // fetchChat.on("child_added", function (snapshot) {
  //     const messages = snapshot.val();
  //     if (messages.dummy != 0) { 
  //       const message = `<li class=${
  //         username === messages.username ? "sent" : "receive"
  //       }><span><p>${messages.username}: ${messages.message}</p></span></li>`;
  //       // append the message on the page
  //       document.getElementById("messages").innerHTML += message;
  //     }
  //   });



  find_chat(username)
  


    // CHECK IF THE MESSAGE IS SENT BY THIS USER THEN YOU POPULATE IT AS HIS SIDE, ELSE YOU POPULATE AS THE OTHER SIDE 


  function send_offer(){
    // query select the driver, and query select the ride

    
  }


