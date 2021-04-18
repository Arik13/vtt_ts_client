<template>
<v-container>
    <v-card>
        <v-card-text>
            <div>
                <stripe-checkout
                    ref="checkoutRef"
                    mode="subscription"
                    :pk="publishableKey"
                    :line-items="lineItems"
                    :success-url="successURL"
                    :cancel-url="cancelURL"
                    @loading="v => loading = v"
                />
                <button @click="submit">Subscribe!</button>
            </div>
        </v-card-text>
    </v-card>
</v-container>
</template>

<script lang="ts">
import Vue from 'vue';
import { StripeCheckout } from '@vue-stripe/vue-stripe';

export default Vue.extend({
    data: () => ({
        publishableKey: "pk_test_51ITgINHu95aODBv7XlxdVikuQzxZguK1jhoqad4olFxIi189OSHP24KnbwvqNRgqAHVMcShYJ74uUfqFMZI7ES8m00bOuJIOPW",
        loading: false,
        lineItems: [
            {
                price: 'price_1ITgZbHu95aODBv7AOXdgJ91', // The id of the recurring price you created in your Stripe dashboard
                quantity: 1,
            },
        ],
        successURL: 'http://localhost:8080',
        cancelURL: 'http://localhost:8080',
        authCardNum: "4000 0027 6000 3184",
        noAuthCardNum: "4242 4242 4242 4242",
    }),
    components: {
        StripeCheckout,
    },
    methods: {
        submit () {
            // You will be redirected to Stripe's secure checkout page
            let checkoutRef = this.$refs.checkoutRef as any;
            checkoutRef.redirectToCheckout();
        }
    }
})
</script>