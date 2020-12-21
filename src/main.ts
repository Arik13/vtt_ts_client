import Vue from 'vue';
import App from './App.vue';
import router from './router';
// import store from '@/Stores/vuex/vuex';
import vuetify from './plugins/vuetify';

Vue.config.productionTip = false
Vue.config.errorHandler = (err: any, vm: any, info: any) => {
    console.log(err, vm, info);
}

/*
    This is the root Vue object. Vue objects form a tree, each containing the html, javascript (state and logic) and css for rendering a component.
    This root level object is where global configuration of Vue's behaviour is done. The App vue object referenced in the render function, is the first
    'actual' component.
*/
new Vue({
    // The router handles changes to the URL usually by rendering new components
    router: router,

    // The store is a global object accessible to each Vue object, which has a shared state and methods
    // store: store,

    // Vuetify is a component library, which provides a lot of standard UI widgets, written using vuejs
    vuetify: vuetify,

    // The render function renders the App Vue object, the top level component
    render: createElement => createElement(App)
}).$mount('#app');
