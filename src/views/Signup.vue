<template>
    <v-container >
        <v-card dark>
            <v-card-title>
                Signup
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
                        :rules="usernameRules"
                        v-model="username"
                        label="Username"
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
                    <v-btn @click="signup">
                        Signup
                    </v-btn>
                </v-form>
            </v-card-text>
        </v-card>
    </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import { ACTION, ACTION_ARG } from '@/Stores/vuex/actions';

// TODO: Create password and username validation
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
            username: "test",
            usernameRules: [],
        }
    },
    methods: {
        // validate() {
        //     const form = this.$refs.form as HTMLFormElement;
        //     if (form.validate()) {
        //         this.signup();
        //     }
        // },
        // reset() {
        //     const form = this.$refs.form as HTMLFormElement;
        //     form.reset()
        // },
        // resetValidation() {
        //     const form = this.$refs.form as HTMLFormElement;
        //     form.resetValidation()
        // },
        signup() {
            const payload: ACTION_ARG.ACCESS_RESOURCE = {
                method: "POST",
                route: "/users",
                data: {
                    email: this.email,
                    password: this.password,
                    username: this.username,
                },
                callback: () => {
                    this.$router.push({ path: 'login' })
                }
            }
            this.$store.dispatch(ACTION.ACCESS_RESOURCE, payload);
        },
    },
});
</script>