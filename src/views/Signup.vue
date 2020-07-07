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

<script>
export default {
    data() {
        return {
            valid: true,
            email: "test@test.com",
            emailRules: [
                v => !!v || 'E-mail is required',
                v => /.+@.+\..+/.test(v) || 'E-mail must be valid',
                v => (v.length >= 6) || 'E-mail must be 6 or more characters',
            ],
            password: "testing",
            passwordRules: [],
            username: "test",
            usernameRules: [],
        }
    },
    methods: {
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
        signup() {
            this.$store.dispatch("accessResource", {
                method: "POST",
                route: "/users",
                data:
                    {
                        email: this.email,
                        password: this.password,
                        username: this.username,
                    },
                callback: () => {
                    this.$router.push({ path: 'login' })
                }
            })
                .then(() => {
                    //this.$refs.form.reset();
                });
        },
    },
}
</script>