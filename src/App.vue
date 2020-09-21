<template>
    <v-app dark>
        <!-- Navigation drawer on the left -->
        <v-navigation-drawer app dark v-model="drawer"></v-navigation-drawer>

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
    </v-app>
</template>

<script lang="ts">
/*
    This is the root component, responsible for rendering and managing the app bar and the nav drawer,
    as well as the main router view which will render the content of the app, depending on the current URL.
*/

import Vue from 'vue';
import {campaignStore} from "@/Stores/CampaignStore";

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
        drawer: false
    }),
    computed: {
        isLoggedIn(): boolean {
            return this.$store.state.isLoggedIn;
            // return (this.$store.state.authToken);
        },
        navItems(): NavItem[] {
            return [
                { title: "Log In", icon: "how_to_reg", route: "/login", show: !this.isLoggedIn},
                { title: "Signup", icon: "how_to_reg", route: "/signup", show: !this.isLoggedIn},
                { title: "Log Out", icon: "exit_to_app", route: "/logout", show: this.isLoggedIn},
                { title: "Creator", icon: "exit_to_app", route: "/campaigncreator", show: this.isLoggedIn},
                { title: "Editor", icon: "exit_to_app", route: "/campaigneditor", show: (this.isLoggedIn && (!!campaignStore))},
                { title: "Selector", icon: "exit_to_app", route: "/campaignselector", show: this.isLoggedIn},
            ];
        }
    },
    destroyed() {
        localStorage.removeItem("campaignID");
    },
    // Retrieves user token and id for auto login
    mounted() {

        this.$store.state.authToken = localStorage.getItem("authToken");
        this.$store.state.userID = localStorage.getItem("userID");
        this.$store.state.campaignID = localStorage.getItem("campaignID");
    },
});
</script>