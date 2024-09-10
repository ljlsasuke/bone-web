import axios from 'axios';
import useUserStore from '@/stores/modules/user';
import { ElMessage } from 'element-plus';
const request = axios.create({
    baseURL: import.meta.env.VITE_APP_BASE_API,
    timeout: 5000
});

request.interceptors.request.use((config) => {
    // TODO: add token to header
    let { access } = useUserStore();
    if (access) {
        config.headers.Authorization = `Bearer ${access}`;
    }
    return config;
}, error => Promise.reject(error));

request.interceptors.response.use(response => response.data,
    error => {
        const status = error.response?.status;

        let errorMessage: string = "";
        switch (status) {
            // case 401:
            //     errorMessage = "token过期";
            //     break;
            case 500:
                errorMessage = "服务器内部错误"
                break;
            default:
                errorMessage = "请求发生错误"
        }
        ElMessage({
            type: "error",
            message: errorMessage,
        });
        return Promise.reject(error)
    });

export default request;