import {createApp} from 'vue'
import App from './App.vue'
import router from './router'
import store from "./store/store"
import {VueCookieNext} from 'vue-cookie-next'

import '../public/layout/styles.css';

const app = createApp(App);
app.use(router);
app.use(store);
app.use(VueCookieNext);

// set default config
VueCookieNext.config({expire: '7d'})

// set global cookie
VueCookieNext.setCookie('theme', 'default')
VueCookieNext.setCookie('hover-time', {expire: '1s'})


app.mount('#app');