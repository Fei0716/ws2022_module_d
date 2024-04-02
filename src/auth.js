const {reactive} = Vue;

// for user authentication
const auth = reactive({
    user :{
        username : localStorage.getItem('username')|| null,
        token: localStorage.getItem('token')||null,
    },
    isAuth(){
        const {username,token} = this.user;
        return username && token;
    },
    setAuth(token,username){
        this.user.token = token;
        this.user.username = username;
        localStorage.setItem('username' , this.user.username);
        localStorage.setItem('token' , this.user.token);
    },
    removeAuth(){
        localStorage.removeItem('username');
        localStorage.removeItem('token');
        this.user.token = null;
        this.user.username = null;
    }
})