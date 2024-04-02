const template= `
        <section aria-label="User Profile Section">
            <h1 class="title mb-2">{{userDetails.username}}</h1>
            <article v-show="hasAuthoredGames" aria-label="User's Authored Games" class="mb-5">
                   <h2>Authored Games</h2>
                    <UserGame v-for="game in userDetails.authoredGames" :key="game.title" :game="game">
                    </UserGame>
            </article>
            
            <article aria-label="User's Highscores" class="mb-5">
                   <h2 class="mb-2">Highscores per Game</h2>
                   <table class="table table-striped text-white w-50 mx-auto bg-dark-blue">
                        <tr>
                            <th>Game</th>
                            <th>Score</th>
                        </tr>
                        <tr v-for="score in userDetails.highscores" :key="score.timestamp">
                            <td class="me-5 game-link"> <router-link :to="{name:'game' , params:{game: score.game.slug}}">{{score.game.title}}</router-link></td>
                            <td>{{score.score}}</td>
                        </tr>
                    </table>
            </article>
        </section>  
    `;

const {reactive,ref,computed ,onMounted ,onUnmounted} = Vue;
const {useRoute} = VueRouter;
import UserGame from '../components/user_game.js';

export default{
    template,
    components:{
        UserGame,
    },
    setup(){
        const user  = reactive(auth.user);
        const route = useRoute();
        const paramUsername = route.params.user;
        const userDetails = reactive({});
        const hasAuthoredGames = computed(()=>{
            if(userDetails.authoredGames){
                return userDetails.authoredGames.length > 0;
            }
            return false;
        });
        async function getUserDetails(){
            try{
                let response = await fetch(`http://localhost/ws2022/module_c_solution/api/v1/users/${paramUsername}` , {
                    method: 'GET',
                    headers:{
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                        'Authorization' : `Bearer ${user.token}`,
                    },
                });
                let data = await response.json();
                Object.assign(userDetails,data);

            }catch (e) {
                console.log(e);
            }
        }

        getUserDetails();
        return{
            //method
            // properties
            user,
            hasAuthoredGames,
            userDetails,
        }
    }
}