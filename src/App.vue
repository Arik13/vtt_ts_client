<template>
    <v-app dark>
        <!-- <head>
        <title>Checkout</title>
        <script src="https://js.stripe.com/v3/"></script>
        </head>
        <body>
        <button id="checkout">Subscribe</button>
        </body> -->
        <!-- Navigation drawer on the left -->
        <v-navigation-drawer app dark v-model="drawer">

        </v-navigation-drawer>

        <!-- App bar, on the top, contains important links -->
        <v-app-bar app dark>
            <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
            <router-link
                v-for="navItem in navItems"
                :key="navItem.title"
                :to="navItem.route"
                style="text-decoration: none;"
            >
                <template v-if="navItem.show">
                    <v-btn v-if="$vuetify.breakpoint.name != 'xs'" text>{{navItem.title}}</v-btn>
                    <v-btn v-else icon><v-icon>{{navItem.icon}}</v-icon></v-btn>
                </template>
            </router-link>
            <v-spacer />
            <v-btn icon>
                <v-icon>
                    mdi-cog
                </v-icon>
            </v-btn>
            <v-btn icon>
                <v-avatar size="30">
                    <img :src="avatarURL" :alt="'Profile'">
                </v-avatar>
            </v-btn>
        </v-app-bar>

        <!-- The main body of the app, the component rendered here is controlled by the router, depending on the current url -->
        <v-main>
            <v-card tile color="dark grey" height="100%" >
                <router-view />
            </v-card>
        </v-main>
        <dialog-manager />
    </v-app>
</template>

<script lang="ts">
/*
    This is the root component, responsible for rendering and managing the app bar and the nav drawer,
    as well as the main router view which will render the content of the app, depending on the current URL.
*/

import {StripeCheckout} from "@vue-stripe/vue-stripe";
import "@/Stores/MouseController";
import Vue from 'vue';
import {ROUTE} from "./router/router";
import DialogManager from "@/views/Dialogs/DialogManager.vue";
import { CLIENT_EVENT, eventBus } from "./Stores/EventBus";

interface NavItem {
    title: string;
    icon: string;
    route: string;
    show: boolean;
}

export default Vue.extend({
    name: 'App',    // Do not remove
    data: () => ({
        avatarURL: "https://st2.depositphotos.com/1104517/11967/v/950/depositphotos_119675554-stock-illustration-male-avatar-profile-picture-vector.jpg",
        // Controls if the nav drawer is open or not
        drawer: false,
        isLoggedIn: false,
        isCampaignInitialized: false,
    }),
    components: {
        "dialog-manager": DialogManager,
        StripeCheckout,
    },
    computed: {
        navItems(): NavItem[] {
            return [
                { title: "Log In", icon: "how_to_reg", route: ROUTE.LOGIN, show: !this.isLoggedIn},
                { title: "Signup", icon: "how_to_reg", route: ROUTE.SIGNUP, show: !this.isLoggedIn},
                { title: "Log Out", icon: "exit_to_app", route: ROUTE.LOGOUT, show: this.isLoggedIn},
                { title: "Selector", icon: "exit_to_app", route: ROUTE.CAMPAIGN_SELECTOR, show: this.isLoggedIn},
                // { title: "Selector", icon: "exit_to_app", route: ROUTE.CAMPAIGN_SELECTOR, show: (this.isLoggedIn)},
                { title: "Campaign", icon: "exit_to_app", route: ROUTE.CAMPAIGN_EDITOR, show: (this.isLoggedIn && this.isCampaignInitialized)},
                { title: "Forms", icon: "exit_to_app", route: ROUTE.FORM_CREATOR, show: (this.isLoggedIn && this.isCampaignInitialized)},
                { title: "Scripts", icon: "exit_to_app", route: ROUTE.SCRIPT_EDITOR, show: (this.isLoggedIn && this.isCampaignInitialized)},
                { title: "Binder", icon: "exit_to_app", route: ROUTE.DYNAMIC_VIEW_BINDER, show: (this.isLoggedIn && this.isCampaignInitialized)},
            ];
        }
    },
    destroyed() {
        localStorage.removeItem("campaignID");
    },
    // Retrieves user token and id for auto login
    mounted() {
        eventBus.registerHandler(CLIENT_EVENT.INIT_NEW_CAMPAIGN, () => this.isCampaignInitialized = true);
        eventBus.registerHandler(CLIENT_EVENT.CAMPAIGN_DELETED, () => this.isCampaignInitialized = false);
        eventBus.registerHandler(CLIENT_EVENT.LOGGED_IN, () => this.isLoggedIn = true);
        eventBus.registerHandler(CLIENT_EVENT.LOGGED_OUT, () => this.isLoggedIn = false);
        // setTimeout(() => {
        //     mouseEventProxy.enableLeftClick();
        // }, 1000);

        // window.addEventListener('click',(event) => {
        //     console.log('clicked', event);
        // });
    },
});
</script>