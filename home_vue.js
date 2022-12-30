const app = Vue.createApp({ 
    data() { 
      return { 
        loggedin: false,
      }
    }, 
    
    methods: { 
      check_login() { 
        console.log(localStorage.getItem("username_x"))
        if (localStorage.getItem("username_x")) { 
          this.loggedin = true 
        }
      }
    },
  
    created() { 
      this.check_login()
      console.log("OEFeiwojfoie")
    }
  })
  
  app.mount("#app")