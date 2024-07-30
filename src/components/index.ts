import Icon from "./Icon.vue"
import TopNav from "./TopNav.vue"
const AllGlobalComponent: any = { Icon, TopNav };

export default {
    install(app: any) {
        Object.entries(AllGlobalComponent).forEach(([key, value]) => {
            app.component(key, value);
        })
    }
}