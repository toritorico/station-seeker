import { createApp } from 'vue'
import { createPinia } from 'pinia'
import './assets/colors.css'
import './style.css'
import App from './App.vue'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.mount('#app')
