<template>
    <div>Logout</div>
</template>

<script lang="ts">
import Vue from "vue";
import dispatcher from '@/Dispatcher/Dispatcher';

export default Vue.extend({
    mounted() {
        dispatcher.logout();
        // this.$store.state.isLoggedIn = false;
        this.$router.push("/login");
    }
});
</script>

<style>

</style>