const template = `
    <header class="navbar bg-dark-blue text-white">
        <nav class="container d-flex justify-content-between" role="navigation">
           <router-link :to="{name: 'home'}" class="navbar-brand text-white">WorldSkills - Games</router-link>  
                 <ul class="navbar-nav flex-row gap-3" role="menubar">
                    <template v-if="isLoggedIn">
                        <li class="nav-item my-auto" role="menuitem"><router-link class="text-decoration-none text-white" :to="{name:'user_profile', params:{user:user.username}}" >{{user.username}}</router-link></li>
                        <li class="nav-item" role="menuitem">
                            <button class="btn btn-primary" @click="signOut" >Sign out</button>
                        </li>                    
                    </template>

                    
                    <template v-else>
                        <li class="nav-item" role="menuitem">
                              <router-link :to="{name: 'sign_up'}" class="btn btn-primary" >Register</router-link>                  
                        </li>
                        <li class="nav-item" role="menuitem">
                            <router-link :to="{name: 'sign_in'}" class="btn btn-info" >Sign In</router-link>  
                        </li>                    
                    </template>

                 </ul>  
        </div>
    </header>
`;

const {reactive,computed} = Vue;
const {useRouter} = VueRouter;
export default {
    template,
    setup(){
        const router = useRouter();
        const user = reactive(auth.user);
        // to detect whether user is logged in
        const isLoggedIn = computed( () => !!auth.isAuth());
        async function signOut(){
            try{
                const response = await fetch('http://localhost/ws2022/module_c_solution/api/v1/auth/signout' ,{
                    method: 'POST',
                    headers:{
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                        'Authorization' : `Bearer ${user.token}`,
                    },
                });

                auth.removeAuth();
                router.push({name: 'sign_out'});
            }catch (e) {
                console.log(e);
            }

        }
        return{
            isLoggedIn,
            user,
            signOut,
        }
    },

}
