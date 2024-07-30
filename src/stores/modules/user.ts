import { defineStore } from 'pinia'
import { login } from '@/api/user';
import type { loginReqDataType, loginResDataType } from '@/api/user/type';

const useUserStore = defineStore("user", {
    state: (): loginResDataType => ({
        token: "",
        userInfo: {
            username: ""
        }
    }),
    actions: {
        async userLogin(data: loginReqDataType) {
            let res = await login(data);
            if (res.code == 200) {
                const data = res.data as loginResDataType;//code=200data一定存在
                this.token = data.token;
                this.userInfo = data.userInfo;
            }
            else
                return Promise.reject(res.message as string);
        },
        async userLogout() {
            this.token = "";
            this.userInfo = {
                username: ""
            }
        }
    }
})

export default useUserStore;