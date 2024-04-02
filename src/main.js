import Header from "./components/header.js";
import Footer from "./components/footer.js";

const {createApp}  = Vue;
const {createRouter,createWebHashHistory} = VueRouter;
// import router views
import SignUp from "./views/SignUp.js";
import Home from "./views/Home.js";
import SignOut from './views/SignOut.js';
import SignIn from './views/SignIn.js';
import GameScore from './views/GameScore.js';
import UserProfile from './views/UserProfile.js';
import ManageGame from './views/ManageGame.js';

const App = createApp({
    // declare global components
    components : {
        'app-header' : Header,
        'app-footer' : Footer,
    }

})
// configure the vue-router
const routes = [
    {
        path: '/',
        name: 'home',
        component: Home,
        meta: {
            title: 'WorldSkills Games'
        }
    },
    {
        path: '/sign_up',
        name: 'sign_up',
        component: SignUp,
        meta: {
            title: 'Sign Up'
        }
    },
    {
        path: '/sign_out',
        name: 'sign_out',
        component: SignOut,
        meta: {
            title: 'Sign Out'
        }
    },
    {
        path: '/sign_in',
        name: 'sign_in',
        component: SignIn,
        meta: {
            title: 'Sign In'
        }
    },
    {
        path: '/:game',
        name: 'game',
        component: GameScore,
        meta: {
            title: 'Game'
        }
    },
    {
        path: '/user/:user',
        name: 'user_profile',
        component: UserProfile,
        meta: {
            title: 'User Profile'
        }
    },
    {
        path: '/:game/manage',
        name: 'manage_game',
        component: ManageGame,
        meta: {
            title: 'Manage Game'
        }
    },
    {
       path: '/:catchAll(.*)',
       redirect: '/',
    }
];
const router = createRouter({
    history: createWebHashHistory(),
    routes,
});
// add guard to make sure authenticated user redirected back to home page when they try to go to signin or signup page
router.beforeEach( async (to,from,next) =>{
    // if user if login
    if(!!auth.isAuth()){
        if((to.name === "sign_up" || to.name === "sign_in")){
            document.title += 'WorldSkills Games';
            next({name: 'home'});
        }else if(to.name === 'manage_game'){
            // check for whether the user is the author of the game
            const gameSlug = to.params.game;
            const isAuthor = await checkUserAuthor(gameSlug);
            isAuthor ? next() : next({name:'game' , params:{game: gameSlug}});
        }
    //     user that are not login
    }else{
        if(to.name === "user_profile" || to.name === 'manage_game'){
            alert('Please login/register first');
            next({name: 'sign_in'});
        }
    }

    document.title = to.meta.title;
    next();
});

async function checkUserAuthor(gameSlug){
    try{
        let response = await fetch(`http://localhost/ws2022/module_c_solution/api/v1/games/${gameSlug}`);
        let data = await response.json();
        return data.author === auth.user.username;
    }catch (e) {
        console.log(e);
    }
}
App.use(router).mount('#app');

