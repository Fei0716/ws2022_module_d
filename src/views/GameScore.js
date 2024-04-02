    const template= `
        <section aria-label="Game Score Section">
            <h1 class="title mb-2">{{game.title}}</h1>
            <div class="mb-5 game-frame">
                   <iframe :src="'http://localhost/ws2022/module_c_solution/game/' + slug+ '/index.html'" ></iframe>
            </div>
            <div class="row mb-4">
                <article aria-label="Highscore Leaderboard" class="col-6">
                       <h2>Top 10 Leaderboard</h2>
                       <ul class="list-group">
                           <li v-for="(score,index) in scores" :key="score.username" class="list-group-item d-flex justify-content-center" :class="{'text-highlight': score.username == user.username}">
                                <div class="me-auto">{{++index}}</div>
                                <router-link :to="{name:'user_profile' , params:{user : score.username}}" >{{score.username}}</router-link>
                                <div class="ms-auto">{{score.score}}</div>                                
                            </li>
                           <div v-if="userNotInTopTen" class="mt-2 h5 w-50 ms-auto d-flex justify-content-between me-3 user-score">
                                <router-link :to="{name:'user_profile' , params:{user : user.username}}">{{user.username}}</router-link> <span>{{userScore}}</span>
                            </div>
                       </ul>
                       

                </article>     
                <div class="col-6">
                       <h2>Description</h2>
                        <p>{{game.description}}</p>
                </div>       
            </div>

        </section>  
    `;

    const {reactive,ref,computed ,onMounted ,onUnmounted} = Vue;
    const {useRoute,useRouter} = VueRouter;
    export default{
        template,
        setup(){
            const route = useRoute();
            const router = useRouter();
            const slug = route.params.game;
            const game = reactive({});
            const scores =  reactive({});
            const user = auth.user;
            const userScore = ref(null);
            let interval;
            const userNotInTopTen = computed(() => {
                return userScore.value != null;
            });
            async function getGame(){
                try{
                    let response = await fetch(`http://localhost/ws2022/module_c_solution/api/v1/games/${slug}`);
                    let data = await response.json();
                    Object.assign(game, data);
                }catch (e) {
                    console.log(e);
                }
            }

            async function getScores(){
                try{
                    let response = await fetch(`http://localhost/ws2022/module_c_solution/api/v1/games/${slug}/scores`);
                    let data = await response.json();
                    let highScores = [];
                    // get top ten
                    for(let i = 0; i < data.scores.length; i++){
                        // only push top ten to highscore
                        if(i < 10){
                            highScores.push(data.scores[i]);
                        }else{
                        //     above than ten check for the current logged in user's score
                            if(data.scores[i].username == user.username){
                                userScore.value = data.scores[i].score;
                                break;
                            }
                        }

                    }
                    Object.assign(scores, highScores);
                    // check for user score whether exists outside of top ten
                }catch (e) {
                    console.log(e);
                }
            }
            getGame();
            getScores();

            async function postScore(score){
                try{
                    let response = await fetch(`http://localhost/ws2022/module_c_solution/api/v1/games/${slug}/scores` , {
                        method: 'POST',
                        headers:{
                            'Content-Type': 'application/json',
                            'Accept': 'application/json',
                            'Authorization' : `Bearer ${user.token}`,
                        },
                        body:JSON.stringify({
                            'score' : score,
                        })
                    });
                    let data = await response.json();
                    getScores();

                }catch (e) {
                    console.log(e);
                }
            }
            function handleGameEnd(e){
                if(!!auth.isAuth()){
                    if(confirm('Do you want to save the score??')){
                        let score = e.data.score;
                        postScore(score);
                    }
                }else{
                    alert('Please register/login first to save your score');
                    router.push({name: 'sign_in'});
                }

            }
            // polling server
            onMounted(() =>{
                interval = setInterval(()=>{
                    getScores()
                }, 5000);

                window.addEventListener('message' , handleGameEnd);
            })

            onUnmounted(()=>{
                window.removeEventListener('message',handleGameEnd);
                clearInterval(interval);

            })
            return{
                //method
                getGame,
                getScores,

                // properties
                game,
                slug,
                scores,
                user,
                userScore,
                userNotInTopTen,
            }
        }
    }