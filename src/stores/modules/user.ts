import { defineStore } from 'pinia'
import { login, getNewToken } from '@/api/user';
import type { loginReqDataType, loginResDataType } from '@/api/user/type';

interface StateType extends loginResDataType {
    refreshTimer: number | NodeJS.Timeout;
}
const useUserStore = defineStore("user", {
    state: (): StateType => ({
        refresh: localStorage.getItem("refresh") ?? "",
        access: localStorage.getItem("access") ?? "",
        user: localStorage.getItem("user") ?? "",
        is_superuser: Boolean(localStorage.getItem("is_superuser")) ?? false,
        refreshTimer: Number(localStorage.getItem("refreshTimer")) ?? 0
    }),
    actions: {
        async userLogin(data: loginReqDataType) {
            let res = await login(data);
            if (res.code == 200) {
                const data = res.data as loginResDataType;//code=200data一定存在
                this.refresh = data.refresh;
                this.access = data.access;
                this.user = data.user;
                this.is_superuser = data.is_superuser
                localStorage.setItem("access", data.access);
                localStorage.setItem("refresh", data.refresh);
                localStorage.setItem("user", data.user);
                localStorage.setItem("is_superuser", String(data.is_superuser));
                this.toRefreshToken();
            }
            else
                return Promise.reject(res.message);
        },
        async userLogout() {
            clearInterval(this.refreshTimer);
            this.$reset();
            localStorage.clear();
        },

        $reset() {
            this.refresh = ""
            this.access = ""
            this.user = ""
            this.is_superuser = false
            this.refreshTimer = 0
        },

        async toRefreshToken() {//登录成功之后开始设定token刷新规则,暂时设置为两分钟刷新一次
            console.log("设置token刷新规则");
            if (this.refreshTimer) clearInterval(this.refreshTimer);
            this.refreshTimer = setInterval(async () => {
                let { access } = await getNewToken(this.refresh);
                console.log("进行一次token刷新");
                if (access) {
                    this.access = access;
                    localStorage.setItem("access", access);
                }
                else alert("token刷新失败");
            }, 1000 * 60 * 1);//1分钟刷新一次
            localStorage.setItem("refreshTimer", String(this.refreshTimer));
        },
        restoreRefreshTimer() {
            if (this.access && this.refresh) {
                console.log("恢复了refreshtoken定时器");
                this.toRefreshToken();
            } else {
                console.log("没有数据但是执行了恢复函数");
            }
        }
    }
})

export default useUserStore;