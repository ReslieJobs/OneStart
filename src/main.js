import { createApp } from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import axios from 'axios'
// import VueResource from 'vue-resource'
import VueCookies from 'vue-cookies'

const app = createApp(App)
app.use(router)
app.use(VueCookies)
// app.use(VueResource)
app.mount('#app')
app.config.globalProperties.$axios = axios