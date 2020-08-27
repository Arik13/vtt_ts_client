<template>
    <div>Logout</div>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
    mounted() {
        this.$store.dispatch("logout", {
            callback: () => {
                this.$router.push("/login");
            }
        });
    }
});
</script>

<style>

</style>