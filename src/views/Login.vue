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
        }
    },
    methods: {
        submitForm() {
            const payload = {
                data: {
                    email: this.email,
                    password: this.password,
                },
                reroute: () => {
                    this.$router.push({ path: 'campaignselector' })
                }
            };
            this.$store.dispatch('login', payload);
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