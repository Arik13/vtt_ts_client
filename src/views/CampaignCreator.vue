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

<script lang="ts">
import Vue from "vue"

export default Vue.extend({
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
            const form = this.$refs.form as HTMLFormElement;
            if (form.validate()) {
                this.submitForm();
            }
        },
        reset() {
            const form = this.$refs.form as HTMLFormElement;
            form.reset();
        },
        resetValidation() {
            const form = this.$refs.form as HTMLFormElement;
            form.resetValidation();
        },
    },
});
</script>