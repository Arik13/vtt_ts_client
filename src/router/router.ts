/*
    The router handles URl changes by designating components to be rendered for every route.
*/

import Vue from 'vue'
import VueRouter, {RouteConfig} from 'vue-router'
// import Store from "@/Stores/vuex/vuex";
import CampaignEditor from "@/views/CampaignEditor.vue";
// import CampaignSelector from "@/views/CampaignCreator.vue";
import CampaignSelector from "@/views/CampaignSelector.vue";
import Home from "@/views/Home.vue";
import Test from "@/views/Test/Test.vue";
import Login from "@/views/Login.vue";
import Logout from "@/views/Logout.vue";
import Signup from "@/views/Signup.vue";
import LoadingScreen from "@/views/LoadingScreen.vue";
import ComponentEditor from "@/views/ComponentEditor.vue";
import ScriptEditor from "@/views/ScriptEditor.vue";
import DynamicViewBinder from "@/views/Binder.vue";
import { userStore, AuthData } from '@/Stores/UserStore';

Vue.use(VueRouter);

export enum ROUTE {
    HOME = "/",
    TEST = "/test",
    LOGIN = "/login",
    LOGOUT = "/logout",
    SIGNUP = "/signup",
    CAMPAIGN_EDITOR = "/campaigneditor",
    // CAMPAIGN_CREATOR = "/campaigncreator",
    CAMPAIGN_SELECTOR = "/campaignselector",
    LOADING_SCREEN = "/loading",
    COMPONENT_EDITOR = "/componenteditor",
    SCRIPT_EDITOR = "/scripteditor",
    DYNAMIC_VIEW_BINDER = "/dynamicviewbinder",
}

const routes: Array<RouteConfig> = [
    {path: ROUTE.HOME, components: {default: Home}, meta: {title: "Home"}},
    {path: ROUTE.TEST, components: {default: Test}, meta: {title: "Test"}},
    {path: ROUTE.LOGIN, components: {default: Login}, meta: {title: "Login"}},
    {path: ROUTE.LOGOUT, components: {default: Logout}, meta: {title: "Logout"}},
    {path: ROUTE.SIGNUP, components: {default: Signup}, meta: {title: "Signup"}},
    {path: ROUTE.CAMPAIGN_EDITOR, components: {default: CampaignEditor}, meta: {title: "Campaign Editor"}},
    {path: `${ROUTE.CAMPAIGN_EDITOR}/:ID`, components: {default: CampaignEditor}, meta: {title: "Campaign Editor"}},
    // {path: ROUTE.CAMPAIGN_CREATOR, components: {default: CampaignCreator}, meta: {title: "Campaign Creator"}},
    {path: ROUTE.CAMPAIGN_SELECTOR, components: {default: CampaignSelector}, meta: {title: "Campaign Selector"}},
    {path: `${ROUTE.LOADING_SCREEN}/:ID`, components: {default: LoadingScreen}, meta: {title: "Loading"}},
    {path: ROUTE.COMPONENT_EDITOR, components: {default: ComponentEditor}, meta: {title: "Component Editor"}},
    {path: ROUTE.SCRIPT_EDITOR, components: {default: ScriptEditor}, meta: {title: "Script Editor"}},
    {path: ROUTE.DYNAMIC_VIEW_BINDER, components: {default: DynamicViewBinder}, meta: {title: "Dynamic View Binder"}},
];

const router = new VueRouter({
    routes,
    mode: 'history',
    base: process.env.BASE_URL,
})

// If the user is trying to go to a route other than login, logout or signup, and they are not logged in, redirect them to login
router.beforeEach(async (to, from, next) => {
    if (
        to.meta.title != "Login" &&
        to.meta.title != "Signup" &&
        to.meta.title != "Logout" &&
        to.meta.title != "Test" &&
        !userStore.isLoggedIn
    ) {
        router.push({ path: ROUTE.LOGIN });
    }
    else next();
})

export default router;
