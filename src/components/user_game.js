
const template = `
    <article class="game-container">
        <div class="d-flex justify-content-between">
            <router-link :to="{name:'game', params:{game: game.slug}}" class="title">{{game.title}}</router-link>
            <div class="score">#scores submitted:{{game.scoreCount}}</div>
        </div>
             
        <div class="d-flex gap-2">
            <template v-if="game.thumbnail">
                <img :src="'http://localhost/ws2022/module_c_solution/game/' + game.slug + '/thumbnail.png'" alt="game.title">
            </template>
            <template v-else>
                <img src="asset/images/default_game.jpg" alt="game.title">
            </template>
            <div class="w-100 position-relative">
                <p class="description">{{game.description}}</p>
                <button class="btn btn-primary position-absolute bottom-0 end-0 bg-dark-blue" :class="{ hide: !isUser }">
                    <router-link class="text-decoration-none text-white" :to="{name:'manage_game', params:{game:game.slug}}">Manage</router-link>
                </button>
            </div>
        </div>
    </article>
`;

const { ref }  = Vue; // Import ref from Vue 3
export default {
    template,
    props: ['game'],
    setup(props) {
        const isUser = ref(false); // Initialize isUser as a ref with default value false

        // Fetch user data
        const fetchUserData = async () => {
            try {
                const response = await fetch(`http://localhost/ws2022/module_c_solution/api/v1/games/${props.game.slug}`);
                const data = await response.json();

                isUser.value = data.author === auth.user.username;
            } catch (e) {
                console.log(e);
                isUser.value = false;
            }
        };

        // Call fetchUserData when component is created
        fetchUserData();

        return {
            isUser // Return isUser ref
        };
    }
};