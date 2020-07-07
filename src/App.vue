<template>
    <v-app dark>
        <v-navigation-drawer permanent app dark></v-navigation-drawer>
        <v-app-bar app dark>
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
        </v-app-bar>
        <v-main>
            <v-card tile color="dark grey" height="100%" >
                <router-view />
            </v-card>
        </v-main>
    </v-app>
</template>

<script lang="ts">
import Vue from 'vue';

interface NavItem {
    title: string;
    icon: string;
    route: string;
    show: boolean;
}

export default Vue.extend({
    name: 'App',
    data: () => ({
    }),
    mounted() {
        this.$store.state.authToken = localStorage.getItem("authToken");
        this.$store.state.userID = localStorage.getItem("userID");
        this.$store.state.campaignObject = localStorage.getItem("campaignObject");
    },
    computed: {
        isLoggedIn(): boolean {
            return (this.$store.state.authToken);
        },
        navItems(): NavItem[] {
            return [
                { title: "Log In", icon: "how_to_reg", route: "/login", show: !this.isLoggedIn},
                { title: "Signup", icon: "how_to_reg", route: "/signup", show: !this.isLoggedIn},
                { title: "Log Out", icon: "exit_to_app", route: "/logout", show: this.isLoggedIn},
                { title: "Creator", icon: "exit_to_app", route: "/campaigncreator", show: this.isLoggedIn},
                { title: "Editor", icon: "exit_to_app", route: "/campaigneditor", show: this.isLoggedIn},
                { title: "Selector", icon: "exit_to_app", route: "/campaignselector", show: this.isLoggedIn},
            ];
        }
    },
});
</script>