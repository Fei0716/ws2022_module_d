const template= `
        <section aria-label="Manage Game Section">
            <h1 class="title mb-2">Manage Game</h1>
            <Transition name="alert" >
                <div class="alert alert-success" v-show="updateSuccessful">
                    Update Successful
                </div>            
            </Transition>


            <article class="game-container">
                 <div class="mb-3 form-floating text-black w-25">
                    <input type="text" id="title" class="form-control" placeholder="Title of the Game" v-model="game.title">
                    <label for="title">Title</label>
                 </div>
                 
                 <div class="d-flex gap-2">
                    <template v-if="game.thumbnail">
                        <img :src="'http://localhost/ws2022/module_c_solution/game/'+game.slug+'/thumbnail.png'" alt="game.title">
                    </template>
                    <template v-else>
                        <img src="asset/images/default_game.jpg" alt="game.title">
                    </template>
                    <textarea class="form-control" v-model="game.description"></textarea>
                </div>
                    <button class="btn btn-primary mt-2 ms-auto d-block shadow-sm" @click="updateGameInfo" >Update Game Info</button>
                
            </article>
            <div class="mb-5">
                <button class="btn btn-primary me-4 shadow-sm" data-bs-toggle="modal" data-bs-target="#modal-upload">Upload New Version</button>
                <button class="btn btn-danger shadow-sm" @click="deleteGame">Delete Game</button>
            </div>
        </section>  
        
        <div class="modal fade" id="modal-upload" tabindex="-1">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content">
                    <div class="modal-header">
                        <button class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <Transition name="alert" >
                            <div class="alert alert-danger" v-show="error">
                                {{error}}
                            </div>
                        </Transition>
                        <label for="zipfile" class="text-black mb-2">Upload a new zipfile</label>
                        <input accept=".zip" type="file" name="zipfile" id="zipfile" @change="uploadFile" class="form-control mb-1">
                        
                        <button class="btn btn-primary d-block mt-2 mb-2" @click="createNewVersion">Submit</button>
                        
                    </div>
                    
                </div>
            </div>
        </div>
    `;

const {reactive,ref,computed ,onMounted ,onUnmounted} = Vue;
const {useRoute,useRouter} = VueRouter;

export default{
    template,
    setup(){
        // reactive variables declarations
        const game = reactive({});
        const user = auth.user;
        const router = useRouter();
        const route = useRoute();
        const slug = route.params.game;
        const updateSuccessful = ref(false);
        const file = ref(null);
        const error = ref(null);
        async function getGame(){
            try{
                let response = await fetch(`http://localhost/ws2022/module_c_solution/api/v1/games/${slug}`);
                let data = await response.json();
                Object.assign(game, data);
            }catch (e) {
                console.log(e);
            }
        }

        async function updateGameInfo(){
            try{
                const response = await fetch(`http://localhost/ws2022/module_c_solution/api/v1/games/${slug}` ,{
                    method: 'PUT',
                    headers:{
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                        'Authorization': `Bearer ${user.token}`,
                    },
                    body:JSON.stringify({
                        'title': game.title,
                        'description': game.description,
                    })

                });
                updateSuccessful.value = true;
                setTimeout(() => {
                    updateSuccessful.value = false;
                }, 5000);

            }catch (e) {
                console.log(e);
            }
        }
        async function deleteGame(){
            if(confirm("Do you want to delete this game???")){
                try{
                    const response = await fetch(`http://localhost/ws2022/module_c_solution/api/v1/games/${slug}` ,{
                        method: 'DELETE',
                        headers:{
                            'Content-Type': 'application/json',
                            'Accept': 'application/json',
                            'Authorization': `Bearer ${user.token}`,
                        },
                    });
                    router.push({name: 'user_profile' , params: {user:user.username}});
                }catch (e) {
                    console.log(e);
                }

            }
        }
        getGame();
        function uploadGame(){
            document.getElementById('modal-upload').style.display = 'block';
        }
        function closeModal(){
            document.getElementById('modal-upload').style.display = 'none';
        }
        function uploadFile(e){
            file.value = e.target.files[0];

        }
        async function createNewVersion(){
            if(!file.value ){
                error.value = "Please upload a zipfile";
                setTimeout( ()=>{
                    error.value = false;
                }, 5000);
                return;
            }
            try{
                const formData = new FormData();
                formData.append('zipfile', file.value);
                formData.append('token', user.token);

                const response = await fetch(`http://localhost/ws2022/module_c_solution/api/v1/games/${slug}/upload` ,{
                    method: 'POST',
                    headers:{
                        // No need to set Content-Type header for FormData
                        'Accept': 'application/json',
                        'Authorization': `Bearer ${user.token}`,
                    },
                    body: formData, // Use FormData as the body
                });

                alert('New Version Uploaded');
                router.push({name: 'user_profile' , params: {user:user.username}});
            }catch (e) {
                console.log(e);
            }
        }

        return{
            game,
            deleteGame,
            updateGameInfo,
            uploadGame,
            updateSuccessful,
            closeModal,
            file,
            createNewVersion,
            uploadFile,
            error,
        }
    }
}