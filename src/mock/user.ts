import type { MockMethod } from "vite-plugin-mock";
import type { loginReqDataType, loginResType } from "@/api/user/type"
export default [
    {
        url: "/mock/user/login",
        method: "post",
        response: ({ body }: { body: loginReqDataType }): loginResType => {
            const { username, password } = body;
            if (username === "admin" && password === "123456") {
                return {
                    code: 200,
                    message: "登录成功",
                    data: {
                        access: "admin-token",
                        refresh: "admin-ref",
                        is_superuser: true,
                        user: "admin-mock"
                    }
                }
            }
            //目前来说好像并不打算做帐号体系，而且也没有什么特殊的用户信息或权限，所以userInfo的东西很少
            //所以暂时不打算再写一个用来获取用户信息的接口,而是直接
            else
                return {
                    code: 500,
                    message: "用户名或密码错误mock"
                }
        }
    }
] as MockMethod[]; // MockMethod[]