<template>
    <v-container >
        <v-card dark>
            <v-card-title>
                Login
            </v-card-title>
            <v-card-text>
                <v-form
                    ref="form"
                    v-model="valid"
                    :lazy-validation="true"
                >
                    <v-text-field
                        :rules="emailRules"
                        v-model="email"
                        label="E-mail"
                        required
                    />
                    <v-text-field
                        :rules="passwordRules"
                        v-model="password"
                        label="Password"
                        type="password"
                        required
                        autocomplete="off"
                    />
                    <v-btn @click="submitForm">
                        Login
                    </v-btn>
                    <!-- <v-btn @click="test">test</v-btn> -->
                </v-form>
            </v-card-text>
        </v-card>
        <!-- <location-viewer :state="state"></location-viewer> -->
    </v-container>
</template>

<script lang="ts">
import Vue from 'vue'
import dispatcher from "@/Dispatcher/Dispatcher"

export default Vue.extend({
    data() {
        return {
            valid: true,
            email: "test@test.com",
            emailRules: [
                (v: string) => !!v || 'E-mail is required',
                (v: string) => /.+@.+\..+/.test(v) || 'E-mail must be valid',
                (v: string) => (v.length >= 6) || 'E-mail must be 6 or more characters',
            ],
            password: "testing",
            passwordRules: [],
            form: this.$refs.form as HTMLFormElement,
            state: {
                mapImageSrc: "",
                location: {
                    name: "Name",
                    model: {
                        ranks: 5,
                        files: 5,
                        tileWidth: 5,
                        tileLength: 5,
                    }
                }
            },
        }
    },
    methods: {
        async submitForm() {
            const result = await dispatcher.login(this.email, this.password, (success: boolean) => {
                if (success) {
                    // this.$store.state.isLoggedIn = true;
                    this.$router.push({ path: 'campaignselector' })
                }
            });
        },
        validate() {
            if (this.form.validate()) {
                this.submitForm();
            }
        },
        reset() {
            this.form.reset()
        },
        resetValidation() {
            this.form.resetValidation()
        },
    },
})
</script>