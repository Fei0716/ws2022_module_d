const template = `
    <Transition name="game-item" appear>
        <article class="game-container">
                 <div class="d-flex justify-content-between">
                    <router-link :to="{name:'game' ,params:{game: game.slug}}" class="title" :aria-label="'Click To Play '+game.title " >{{game.title}}<span class="author">by {{game.author}}</span></router-link>
                    <div class="score">#scores submitted:{{game.scoreCount}}</div>
                 </div>
                 <div class="d-flex gap-2">
                    <template v-if="game.thumbnail">
                        <img :src="'http://localhost/ws2022/module_c_solution/game/'+game.slug+'/thumbnail.png'" :alt="game.title">
                    </template>
                    <template v-else>
                        <img src="asset/images/default_game.jpg" :alt="game.title">
                    </template>
                    <p class="description">{{game.description}}</p>
                </div>
        </article>        
    </Transition>
`;

export default {
    template,
    props: ['game'],
}