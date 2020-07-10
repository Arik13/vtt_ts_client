import Vue from 'vue'
import VueRouter, {RouteConfig} from 'vue-router'
import Store from "../store/index";
import CampaignEditor from '../views/CampaignEditor.vue';
import CampaignCreator from '../views/CampaignCreator.vue';
import CampaignSelector from '../views/CampaignSelector.vue';
import Home from '../views/Home.vue';
import Login from '../views/Login.vue';
import Logout from '../views/Logout.vue';
import Signup from '../views/Signup.vue';

Vue.use(VueRouter)

const routes: Array<RouteConfig> = [
    {path: "/", components: {default: Home}, meta: {title: "Home"},},
    {path: "/login", components: {default: Login}, meta: {title: "Login"}},
    {path: "/logout", components: {default: Logout}, meta: {title: "Logout"}},
    {path: "/signup", components: {default: Signup}, meta: {title: "Signup"}},
    {path: "/campaigneditor", components: {default: CampaignEditor}, meta: {title: "Campaign Editor"}},
    {path: "/campaigneditor/:ID", components: {default: CampaignEditor}, meta: {title: "Campaign Editor"}},
    {path: "/campaigncreator", components: {default: CampaignCreator}, meta: {title: "Campaign Creator"}},
    {path: "/campaignselector", components: {default: CampaignSelector}, meta: {title: "Campaign Selector"}},
];

const router = new VueRouter({
    routes,
    mode: 'history',
    base: process.env.BASE_URL,
})

router.beforeEach((to, from, next) => {
    if (to.meta.title != "Login" && to.meta.title != "Signup" && to.meta.title != "Logout" && !Store.state.authToken) {
        router.push({ path: '/login' });
    }
    else next();
})

export default router;
