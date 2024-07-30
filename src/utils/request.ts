import axios from 'axios';
import useUserStore from '@/stores/modules/user';
const request = axios.create({
    baseURL: import.meta.env.VITE_APP_BASE_API,
    timeout: 5000
});

request.interceptors.request.use((config) => {
    // TODO: add token to header
    let { token } = useUserStore();
    if (token) {
        config.headers.token = token;
    }
    return config;
}, error => Promise.reject(error));

request.interceptors.response.use(response => response.data,
    error => {
        const status = error.response?.status;

        return Promise.reject(error)
    });

export default request;