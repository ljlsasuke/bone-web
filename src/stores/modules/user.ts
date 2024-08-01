import { defineStore } from 'pinia'
import { login } from '@/api/user';
import type { loginReqDataType, loginResDataType } from '@/api/user/type';

const useUserStore = defineStore("user", {
    state: (): loginResDataType => ({
        refresh: "",
        access: localStorage.getItem("access") ?? "",
        user: localStorage.getItem("user") ?? "",
        is_superuser: false
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
                localStorage.setItem("user", data.user);
            }
            else
                return Promise.reject(res.message);
        },
        async userLogout() {

        }
    }
})

export default useUserStore;