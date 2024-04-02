const template = `
    <section aria-label="Home Section" class="container">
           <h1>Gallery of Games</h1>
           <div class="d-flex justify-content-between align-items-center mt-2 mb-4">
                <div class="h2">
                    {{totalGames}} Games Available
                </div>
               <ul class="nav nav-pills">
                   <li class="nav-item"><button class="nav-link sort-by" :class="{active: sort== 'popular'}" @click="updateSorting('popular' ,$event)">Popularity</button></li>
                   <li class="nav-item"><button class="nav-link sort-by " :class="{active: sort== 'uploaddate'}" @click="updateSorting('uploaddate' ,$event)">Recently Updated</button></li>
                   <li class="nav-item"><button class="nav-link sort-by " :class="{active: sort== 'title'}" @click="updateSorting('title' ,$event)">Alphabetically</button></li>

               </ul>
               <ul class="nav nav-pills ">
                  <li class="nav-item"><button class="nav-link  sort-dir" :class="{active: order== 'asc'}" @click="updateOrder('asc' ,$event)" aria-label="Ascending Order">ASC</button></li>
                   <li class="nav-item"><button class="nav-link sort-dir" :class="{active: order== 'desc'}" @click="updateOrder('desc' ,$event)" aria-label="Descending Order">DESC</button></li>
                </ul>
           </div>

           <game  v-for="game in games" :game="game" :key="game.title" ></game>
           <div v-if="isLoading" class="text-center my-5">
               <div class="spinner-border" role="status">
                    <span class="visually-hidden">Loading...</span>
                </div>
           </div>
    </section>
`;


const {reactive,ref ,onMounted ,onUnmounted} = Vue;
import game from '../components/game.js';
export default{
    components:{
        game,
    },
    setup(){
        const page = ref(0);
        const games = reactive([]);
        const gamesCounter = ref(0);
        const totalGames = ref(0);
        const size = ref(0);
        const sort = ref(localStorage.getItem('sortBy')) || ref('popular');
        const order = ref(localStorage.getItem('sortDir')) || ref('asc') ;
        const refreshList = ref(false);//flag to specify whether to refresh the list

        const scrollTop = ref(0);
        const scrollHeight = ref(0);
        const clientHeight = ref(0);
        const isAtBottom = ref(false);
        const isLoading = ref(false);
        async function getGames(){
            try{
                isLoading.value = true;
                // check whether reach the last game of the list and restart the list to create infinite list
                if(gamesCounter.value >= totalGames.value){
                    gamesCounter.value = 0;
                    page.value = 0;
                }
                let response = await fetch(`http://localhost/ws2022/module_c_solution/api/v1/games?page=${page.value}&sortBy=${sort.value}&sortDir=${order.value}`);
                let data = await response.json();
                if(refreshList.value){
                    games.splice(0);
                }
                data.content.forEach(function(game){
                    games.push(game);
                })
                gamesCounter.value += data.content.length;
                refreshList.value = false;
                totalGames.value = data.totalElements;
                size.value = data.size;
            }
            catch (e) {
                console.log(e);
            }
            finally{
                isLoading.value = false;
            }
        }

        function updateSorting(sortBy , e){
            sort.value = sortBy;
            localStorage.setItem('sortBy' , sortBy);
            refreshList.value = true;
            // remove active state from previous element
            const element  =  document.querySelector('.sort-by.nav-link.active');
            element.classList.remove('active');
            // add active state to the clicked element
            e.target.classList.add('active');
            getGames();
        }
        function updateOrder(orderBy , e){
            order.value = orderBy;
            localStorage.setItem('sortDir' , orderBy);

            refreshList.value = true;
            // remove active state from previous element
            const element  =  document.querySelector('.sort-dir.nav-link.active');
            element.classList.remove('active');
            // add active state to the clicked element
            e.target.classList.add('active');
            getGames();
        }
        // Define the scroll event handler
        const handleScroll = () => {
            scrollTop.value = document.documentElement.scrollTop;
            scrollHeight.value = document.documentElement.scrollHeight;
            clientHeight.value = document.documentElement.clientHeight;

            // Check if the list is at the bottom
            isAtBottom.value = Math.round(scrollTop.value + clientHeight.value) >= scrollHeight.value;
            if(isAtBottom.value){
                page.value++;
                getGames();
            }
        };

        // Attach the scroll event listener when the component is mounted
        onMounted(() => {
            // scroll to the top during refresh
            document.documentElement.scrollTop = 0;
            window.addEventListener('scroll', handleScroll);
        });

        onUnmounted(()=>{
            window.removeEventListener('scroll',handleScroll);
        })
        getGames();
        return{
            getGames,
            games,
            totalGames,
            sort,
            order,
            updateSorting,
            updateOrder,
            isLoading,
        };
    },
    template,

}