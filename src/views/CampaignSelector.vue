<template>
    <v-card dark>
        <v-list v-if="loggedIn">
            <template v-for="campaign in campaigns">
                <v-list-item
                    :key="campaign.ID"
                >
                    <v-btn @click="editInCampaignEditor(campaign.ID)">
                        {{campaign.name}}
                    </v-btn>
                </v-list-item>
            </template>
        </v-list>
    </v-card>
</template>

<script>
export default {
    data: () => ({
        campaigns: null,
    }),
    computed: {
        loggedIn() {
            if (!this.$store.state.userID) return false;
            const payload = {
                method: "GET",
                route: `users/${this.$store.state.userID}/campaigns`,
                callback: (result) => {
                    this.campaigns = result;
                }
            };
            this.$store.dispatch("accessResource", payload);
            return true;
        }
    },
    methods: {
        editInCampaignEditor(ID) {
            this.$router.push({ path: `campaigneditor/${ID}` })
        }
    }
}
</script>