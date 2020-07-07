<template>
    <div>Logout</div>
</template>

<script>
export default {
    mounted() {
        this.$store.dispatch("logout", {
            reroute: () => {
                this.$router.push("/login");
            }
        });
    }
}
</script>

<style>

</style>