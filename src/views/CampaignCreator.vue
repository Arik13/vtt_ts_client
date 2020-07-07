<template>
    <v-card dark>
        <v-card-title>
            Create Campaign
        </v-card-title>
        <v-card-text>
            <v-form
                ref="form"
                v-model="valid"
                :lazy-validation="true"
                >
                <v-text-field
                    :rules="campaignNameRules"
                    v-model="campaignName"
                    label="Campaign Name"
                    required
                    />
                <v-btn @click="submitForm">
                    Create
                </v-btn>
            </v-form>
        </v-card-text>
    </v-card>
</template>
<script>
export default {
    data() {
        return {
            valid: true,
            campaignName: "Campaign Numero Uno",
            campaignNameRules: [],
        }
    },
    methods: {
        submitForm() {
            const payload = {
                method: "POST",
                route: "campaigns",
                data: {
                    name: this.campaignName,
                    userID: this.$store.state.userID,
                },
                callback: () => {
                    this.$router.push({ path: 'campaigneditor' })
                }
            };
            this.$store.dispatch('accessResource', payload);
        },
        validate() {
            if (this.$refs.form.validate()) {
                this.submitForm();
            }
        },
        reset() {
            this.$refs.form.reset()
        },
        resetValidation() {
            this.$refs.form.resetValidation()
        },
    },
}
</script>