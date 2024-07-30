import { createApp } from 'vue'
import "@/styles/index.scss";
import "@/assets/fonts/iconfont.css"
import ElementPlus from 'element-plus'
import globalComponents from "@/components";
import 'element-plus/dist/index.css'
import App from './App.vue'
import router from './router'
import pinia from './stores'
const app = createApp(App)

app.use(pinia)
app.use(router)
app.use(ElementPlus)
app.use(globalComponents)
app.mount('#app')
