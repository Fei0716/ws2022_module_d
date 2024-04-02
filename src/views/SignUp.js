const template = `
    <section aria-label="Sign Up Form" class="w-75 mx-auto color-dark-blue">
        <div class="card py-2">
            <div class="card-head text-center  d-flex justify-content-center">
                <h1 class="text-black">Register</h1>
            </div>
            <div class="card-body">
                <form action="#" @submit.prevent="signUp" class="w-75 mx-auto">
                    <div class="form-floating mb-2">
                        <input type="text" name="username" id="username"  placeholder="username" class="form-control" v-model="form.username">
                        <label for="username">Username</label>
                    </div>
                    <Transition name="alert" >
                        <div v-show="username_error" class="alert alert-danger">
                            {{username_error}}
                        </div>
                    </Transition>    
                    <div class="form-floating mb-2">
                        <input type="password" name="password" id="password" placeholder="password" class="form-control" v-model="form.password" >
                        <label for="password">Password</label>
                        
                    </div>
                    <Transition name="alert" >
                        <div v-show="password_error" class="alert alert-danger">
                            {{password_error}}
                        </div>
                    </Transition>
                    <div class="d-flex justify-content-center gap-2">
                        <button type="submit" class="btn btn-primary">Sign Up</button>
                        <button type="reset" class="btn btn-outline-dark">Cancel</button>
                    </div>                
                </form>

            </div>
        </div>
    </section>
`
const {ref,reactive}  = Vue;
const {useRouter}  = VueRouter;

export default{
    template,
    setup(){
        const form = reactive({
            password : null,
            username: null,
        })
        const password_error = ref(false);
        const username_error = ref(false);
        const router = useRouter();
        async function signUp(){
            try{
                const response = await fetch('http://localhost/ws2022/module_c_solution/api/v1/auth/signup' ,{
                    method: 'POST',
                    headers:{
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                    },
                    body:JSON.stringify({
                            'password' : form.password,
                            'username' : form.username,
                        })
                });
                const data = await response.json();
                password_error.value = null;
                username_error.value = null;
                // if there are violations
                if(data.violations){
                    for(const violation in data.violations){
                        switch(violation){
                            case 'username':
                                username_error.value = data.violations[violation].message;
                                break;
                            case 'password':
                                password_error.value = data.violations[violation].message;
                                break;
                        }
                    }
                }else{
                    auth.setAuth(data.token, form.username);
                    router.push({name: 'home'});
                }

            }catch (e) {
                console.log(e);
            }
            finally{
                setTimeout(()=>{
                    username_error.value = false;
                    password_error.value = false;
                },5000);
            }

        }

        return{
            form,
            signUp,
            username_error,
            password_error,
        }
    }

}